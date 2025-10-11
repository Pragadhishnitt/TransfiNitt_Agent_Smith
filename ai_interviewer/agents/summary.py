from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from models.schemas import InterviewSummary, SentimentType, InterviewState
from typing import List, Dict, Optional
from collections import Counter
import config

class SummaryAgent:
    """Generates final interview summary and insights"""
    
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model=config.COMPLEX_LLM_MODEL,
            temperature=0.5,
            google_api_key=config.GEMINI_API_KEY,
            convert_system_message_to_human=True
        )
    
    async def generate_summary(
        self,
        interview_state: InterviewState,
        all_analyzed_responses: List[Dict],  # CHANGED: Now accepts dicts
        early_termination: bool = False,
        termination_reason: Optional[str] = None
    ) -> InterviewSummary:
        """
        Generate comprehensive interview summary.
        NOW HANDLES EARLY TERMINATION and dict responses from database.
        
        Args:
            interview_state: Current interview state
            all_analyzed_responses: All analyzed responses from the interview (as dicts)
            early_termination: Whether interview was terminated early
            termination_reason: Reason for early termination
        """
        
        # Extract sentiment distribution (handle dict format)
        sentiments = []
        for r in all_analyzed_responses:
            # Handle both dict and object formats
            if isinstance(r, dict):
                sentiment = r.get("sentiment", "neutral")
            else:
                sentiment = r.sentiment.value if hasattr(r.sentiment, 'value') else r.sentiment
            sentiments.append(sentiment)
        
        sentiment_distribution = dict(Counter(sentiments))
        
        # Extract all key insights (handle dict format)
        all_insights = []
        for r in all_analyzed_responses:
            # Handle both dict and object formats
            if isinstance(r, dict):
                insights = r.get("key_insights", [])
            else:
                insights = r.key_insights
            
            if insights:
                all_insights.extend(insights)
        
        unique_insights = list(set(all_insights))[:10]
        
        # Generate narrative summary with early termination context
        summary_text = await self._generate_narrative_summary(
            interview_state.research_topic,
            interview_state.conversation_history,
            unique_insights,
            early_termination,
            termination_reason
        )
        
        # NEW: Add termination metadata
        summary_metadata = {
            "early_termination": early_termination,
            "termination_reason": termination_reason,
            "questions_asked": interview_state.current_question_count,
            "max_questions": interview_state.max_questions,
            "completion_percentage": (interview_state.current_question_count / interview_state.max_questions) * 100
        }
        
        return InterviewSummary(
            session_id=interview_state.session_id,
            respondent_id=interview_state.respondent_id,
            template_id=interview_state.template_id,
            research_topic=interview_state.research_topic,
            total_questions=interview_state.current_question_count,
            key_insights=unique_insights,
            sentiment_distribution=sentiment_distribution,
            conversation_summary=summary_text,
            metadata=summary_metadata
        )
    
    async def _generate_narrative_summary(
        self,
        research_topic: str,
        conversation_history: List[Dict[str, str]],
        key_insights: List[str],
        early_termination: bool,
        termination_reason: Optional[str]
    ) -> str:
        """
        Generate a narrative summary of the interview.
        UPDATED to handle early termination context.
        """
        
        # Format conversation
        conversation_text = self._format_conversation(conversation_history)
        
        # NEW: Different prompts for early termination vs. complete
        if early_termination:
            system_prompt = f"""You are analyzing a research interview about: {research_topic}

**IMPORTANT**: This interview was TERMINATED EARLY by the participant.
Termination reason: {termination_reason or 'User requested to stop'}

Create a summary that:
1. Acknowledges the early termination professionally and empathetically
2. Summarizes what insights WERE gathered before termination (2-3 sentences)
3. Notes any patterns or themes that emerged
4. Comments on the participant's engagement level and why they may have stopped
5. Provides recommendations for improving future interviews

Be professional, empathetic, and objective. Do not judge the participant.
Write 3-4 paragraphs."""

        else:
            system_prompt = f"""You are analyzing a completed research interview about: {research_topic}

Create a comprehensive summary that includes:
1. Overview of the participant's perspective (2-3 sentences)
2. Main themes and patterns that emerged
3. Notable quotes or insights (paraphrased)
4. Recommendations for researchers

Be professional, objective, and insightful. Write in paragraph form (4-5 paragraphs)."""
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("user", f"""Conversation:
{conversation_text}

Key insights identified: {", ".join(key_insights) if key_insights else "Limited insights due to early termination"}

Generate summary:""")
        ])
        
        chain = prompt | self.llm
        result = await chain.ainvoke({})
        
        return result.content.strip()
    
    def _format_conversation(self, history: List[Dict[str, str]]) -> str:
        """Format full conversation for analysis"""
        formatted = []
        for msg in history:
            role = "Interviewer" if msg["role"] == "assistant" else "Participant"
            formatted.append(f"{role}: {msg['content']}")
        return "\n".join(formatted)
    
    async def generate_dashboard_insights(
        self,
        all_summaries: List[Dict]  # CHANGED: Now accepts dicts
    ) -> Dict:
        """
        Generate aggregate insights across multiple interviews.
        UPDATED to track early terminations and handle dict format.
        """
        total_interviews = len(all_summaries)
        
        if total_interviews == 0:
            return {
                "total_interviews": 0,
                "message": "No interviews yet"
            }
        
        # NEW: Track early terminations (handle dict format)
        early_terminations = sum(
            1 for s in all_summaries 
            if isinstance(s, dict) and s.get("metadata", {}).get("early_termination", False)
        )
        
        completed_interviews = total_interviews - early_terminations
        
        # Aggregate sentiment (handle dict format)
        total_sentiment = Counter()
        for summary in all_summaries:
            if isinstance(summary, dict):
                sentiment_dist = summary.get("sentiment_distribution", {})
            else:
                sentiment_dist = summary.sentiment_distribution
            total_sentiment.update(sentiment_dist)
        
        # Collect all insights (handle dict format)
        all_insights = []
        for summary in all_summaries:
            if isinstance(summary, dict):
                insights = summary.get("key_insights", [])
            else:
                insights = summary.key_insights
            all_insights.extend(insights)
        
        common_themes = Counter(all_insights).most_common(10)
        
        # Average interview length (only completed)
        completed_summaries = [
            s for s in all_summaries 
            if not (
                isinstance(s, dict) and 
                s.get("metadata", {}).get("early_termination", False)
            )
        ]
        
        avg_questions = 0
        if completed_summaries:
            total_questions = sum(
                s.get("total_questions", 0) if isinstance(s, dict) else s.total_questions
                for s in completed_summaries
            )
            avg_questions = total_questions / len(completed_summaries)
        
        # NEW: Early termination insights
        termination_reasons = []
        if early_terminations > 0:
            for s in all_summaries:
                if isinstance(s, dict):
                    metadata = s.get("metadata", {})
                    if metadata.get("early_termination"):
                        reason = metadata.get("termination_reason", "unknown")
                        termination_reasons.append(reason)
        
        termination_reason_counts = dict(Counter(termination_reasons))
        
        return {
            "total_interviews": total_interviews,
            "completed_interviews": completed_interviews,
            "early_terminations": early_terminations,
            "completion_rate": (completed_interviews / total_interviews * 100) if total_interviews > 0 else 0,
            "avg_questions_per_interview": round(avg_questions, 1),
            "sentiment_distribution": dict(total_sentiment),
            "common_themes": [{"theme": theme, "count": count} for theme, count in common_themes],
            "termination_reasons": termination_reason_counts,
            "summaries": all_summaries  # Already dicts, no need to convert
        }

# Singleton instance
summary_agent = SummaryAgent()