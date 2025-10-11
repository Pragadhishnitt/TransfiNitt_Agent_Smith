from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from typing import List, Dict
import config
from models.schemas import InterviewTemplate, InterviewState

class InterviewerAgent:
    """Fast question generation using Groq"""
    
    def __init__(self):
        self.llm = ChatGroq(
            model=config.INTERVIEWER_MODEL,
            temperature=config.QUESTION_TEMPERATURE,
            api_key=config.GROQ_API_KEY,
            max_tokens=config.QUESTION_MAX_TOKENS,
            timeout=config.LLM_TIMEOUT
        )

    def get_first_question(self, template: InterviewTemplate) -> str:
        """Gets first question from template"""
        return template.starter_questions[0]

    async def generate_next_question(self, state: InterviewState, key_insights: List[str]) -> str:
        """Fast next question generation"""
        
        is_near_end = state.current_question_count >= (state.max_questions - 1)
        
        if is_near_end:
            # Template-based closing question (no LLM)
            return f"Is there anything else you'd like to share about {state.research_topic}?"
        
        # Minimal context for speed
        recent_history = state.conversation_history[-4:]  # Last 2 exchanges only
        context = "\n".join([
            f"{'Q' if msg['role']=='assistant' else 'A'}: {msg['content']}" 
            for msg in recent_history
        ])
        
        # Minimal prompt for speed
        prompt = ChatPromptTemplate.from_messages([
            ("system", f"Topic: {state.research_topic}. Generate ONE natural follow-up question (under 20 words)."),
            ("user", f"{context}\n\nNext question:")
        ])
        
        try:
            result = await (prompt | self.llm).ainvoke({})
            return result.content.strip()
        except Exception as e:
            # Fallback to generic question
            return f"Can you tell me more about your experience with {state.research_topic}?"

    def is_interview_complete(self, state: InterviewState) -> bool:
        """Check if interview is complete"""
        return state.current_question_count >= state.max_questions

# Singleton instance
interviewer_agent = InterviewerAgent()
