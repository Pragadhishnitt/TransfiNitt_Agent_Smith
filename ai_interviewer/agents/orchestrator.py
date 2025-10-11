import uuid
from typing import Dict, List

from models.schemas import InterviewState, UserResponse, InterviewTemplate, AnalyzedResponse
from storage.redis_client import redis_client
from storage.db_client import db_client
from .interviewer import interviewer_agent
from .analyzer import analyzer, DeepAnalysis
from .probe import probe_agent
from .summary import summary_agent

class OrchestratorAgent:
    """
    The central coordinator for the entire interview process. It manages the state,
    routes tasks to the appropriate specialist agent (Analyzer, Probe, Interviewer, Summary),
    and persists data to Redis and Supabase.
    """
    def __init__(self):
        self.redis = redis_client
        self.db = db_client
        self.max_probes_per_question = 2

    async def start_interview(self, template_id: str, respondent_id: str) -> Dict:
        """
        Starts a new interview session for a given user.
        """
        template_data = await self.db.get_template(template_id)
        if not template_data:
            raise ValueError(f"Template {template_id} not found")
        template = InterviewTemplate(**template_data)

        session_id = str(uuid.uuid4())
        state = InterviewState(
            session_id=session_id,
            respondent_id=respondent_id,
            template_id=template_id,
            research_topic=template.research_topic,
            max_questions=template.max_questions,
        )

        first_question = interviewer_agent.get_first_question(template)
        state.conversation_history.append({"role": "assistant", "content": first_question})
        state.current_question_count = 1
        
        # Persist initial state
        self.redis.save_conversation_context(session_id, state)
        await self.db.save_interview(state)

        return {
            "session_id": session_id,
            "question": first_question,
            "question_number": state.current_question_count,
            "max_questions": state.max_questions
        }

    async def process_response(self, user_response: UserResponse) -> Dict:
        """
        The main orchestration logic for handling a user's response.
        """
        session_id = user_response.session_id
        state = self.redis.get_conversation_context(session_id)
        if not state:
            raise ValueError(f"Session {session_id} not found or has expired.")

        # 1. Update history with user's message
        state.conversation_history.append({"role": "user", "content": user_response.message})

        # 2. Perform initial analysis of the response
        analyzed_response = await analyzer.analyze(user_response.message)
        
        # 3. Decide to probe or proceed
        should_probe = analyzer.should_probe(analyzed_response) and state.probe_count < self.max_probes_per_question

        if should_probe:
            return await self._handle_probing(state, analyzed_response)
        else:
            # If the response is good, perform a deep analysis to extract insights
            deep_analysis = await analyzer.deep_analyze(user_response.message, state.research_topic)
            analyzed_response.key_insights.extend(deep_analysis.key_insights)
            
            # Persist the fully analyzed response
            await self.db.save_analyzed_response(analyzed_response, session_id, state.respondent_id)
            
            return await self._handle_next_question(state)

    async def _handle_probing(self, state: InterviewState, analyzed: AnalyzedResponse) -> Dict:
        """Generates and returns a probe question."""
        # A deep analysis is still useful to guide the probe
        deep_analysis = await analyzer.deep_analyze(analyzed.response_text, state.research_topic)
        
        probe_question = await probe_agent.generate_probe_question(
            topic=deep_analysis.suggested_follow_up_topic,
            research_topic=state.research_topic,
            conversation_history=state.conversation_history
        )
        
        state.probe_count += 1
        state.conversation_history.append({"role": "assistant", "content": probe_question})
        self.redis.save_conversation_context(state.session_id, state)

        # Save the initial (shallow/vague) analysis to the DB
        await self.db.save_analyzed_response(analyzed, state.session_id, state.respondent_id)

        return {
            "session_id": state.session_id,
            "question": probe_question,
            "question_number": state.current_question_count,
            "max_questions": state.max_questions,
            "is_probe": True
        }

    async def _handle_next_question(self, state: InterviewState) -> Dict:
        """Generates and returns the next main interview question."""
        state.probe_count = 0 # Reset probe count for the new topic

        if interviewer_agent.is_interview_complete(state):
            return await self._complete_interview(state)

        # Collect all insights gathered so far for better context
        all_insights = await self.db.get_all_insights_for_session(state.session_id)

        next_question = await interviewer_agent.generate_next_question(state, all_insights)
        
        state.current_question_count += 1
        state.conversation_history.append({"role": "assistant", "content": next_question})
        self.redis.save_conversation_context(state.session_id, state)

        return {
            "session_id": state.session_id,
            "question": next_question,
            "question_number": state.current_question_count,
            "max_questions": state.max_questions,
            "is_probe": False
        }

    async def _complete_interview(self, state: InterviewState) -> Dict:
        """Finalizes the interview and generates the summary."""
        state.is_complete = True
        
        all_analyzed_responses = await self.db.get_analyzed_responses(state.session_id)
        
        summary = await summary_agent.generate_summary(state, all_analyzed_responses)
        
        await self.db.save_summary(summary)
        await self.db.update_interview_status(state.session_id, "completed")
        self.redis.delete_session(state.session_id) # Clean up Redis

        return {
            "session_id": state.session_id,
            "is_complete": True,
            "summary": summary.model_dump(),
            "message": "Interview completed. Thank you for your time!"
        }

# Singleton instance
orchestrator = OrchestratorAgent()
