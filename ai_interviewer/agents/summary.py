from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from models.schemas import InterviewSummary, InterviewState
from typing import List, Dict, Optional
from collections import Counter
import config

class SummaryAgent:
    """Fast summary generation using Groq 70B"""
    
    def __init__(self):
        # Use Groq 70B for quality summaries (still fast!)
        self.llm = ChatGroq(
            model=config.SUMMARY_MODEL,
            temperature=config.SUMMARY_TEMPERATURE,
            api_key=config.GROQ_API_KEY,
            max_tokens=config.SUMMARY_MAX_TOKENS,
            timeout=config.LLM_TIMEOUT * 2  # Slightly longer for summaries
        )
    
    async def generate_summary(
        self,
        interview_state: InterviewState,
        all_analyzed_responses: List[Dict],
        early_termination: bool = False,
        termination_reason: Optional[str] = None
    ) -> InterviewSummary:
        """Fast summary generation"""
        
        # Extract sentiment distribution
        sentiments = [r.get("sentiment", "neutral") if isinstance(r, dict) else r.sentiment.value 
                     for r in all_analyzed_responses]
        sentiment_distribution = dict(Counter(sentiments))
        
        # Extract insights
        all_insights = []
        for r in all_analyzed_responses:
            insights = r.get("key_insights", []) if isinstance(r, dict) else r.key_insights
            if insights:
                all_insights.extend(insights)
        
        unique_insights = list(set(all_insights))[:10]
        
        # Generate summary with minimal prompt
        summary_text = await self._generate_narrative_summary(
            interview_state.research_topic,
            interview_state.conversation_history,
            unique_insights,
            early_termination,
            termination_reason
        )
        
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
        """Fast summary generation with minimal prompt"""
        
        # Truncate conversation for speed (last 10 exchanges only)
        recent_history = conversation_history[-20:]  # Last 10 Q&A pairs
        conversation_text = "\n".join([
            f"{'Q' if msg['role']=='assistant' else 'A'}: {msg['content']}"
            for msg in recent_history
        ])
        
        if early_termination:
            system_prompt = f"""Interview about {research_topic} ended early ({termination_reason}).

Write 2 paragraphs:
1. What insights were gathered
2. Why they stopped and recommendations"""
        else:
            system_prompt = f"""Completed interview about {research_topic}.

Write 3 paragraphs:
1. Key findings
2. Participant perspective
3. Recommendations"""
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("user", f"{conversation_text}\n\nInsights: {', '.join(key_insights) if key_insights else 'Limited'}\n\nSummary:")
        ])
        
        try:
            result = await (prompt | self.llm).ainvoke({})
            return result.content.strip()
        except Exception as e:
            # Fast fallback
            return f"Interview {'terminated early' if early_termination else 'completed'} with {len(key_insights)} key insights gathered."

# Singleton instance
summary_agent = SummaryAgent()
