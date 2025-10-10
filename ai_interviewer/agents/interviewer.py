from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from typing import List, Dict

import config
from models.schemas import InterviewTemplate, InterviewState

class InterviewerAgent:
    """
    The main agent responsible for generating the primary interview questions,
    managing the conversation flow, and deciding when to conclude the interview.
    """
    def __init__(self):
        # Question generation is a core complex task that requires understanding
        # the full context of the conversation.
        self.llm = ChatGoogleGenerativeAI(
            model=config.COMPLEX_LLM_MODEL,
            temperature=config.LLM_TEMPERATURE,
            google_api_key=config.GEMINI_API_KEY,
            convert_system_message_to_human=True
        )

    def get_first_question(self, template: InterviewTemplate) -> str:
        """Gets the first question from the interview template."""
        return template.starter_questions[0]

    async def generate_next_question(self, state: InterviewState, key_insights: List[str]) -> str:
        """
        Generates the next logical question based on the conversation so far.
        """
        is_near_end = state.current_question_count >= (state.max_questions - 1)
        if is_near_end:
            return await self._generate_closing_question(state.research_topic, key_insights)

        prompt = ChatPromptTemplate.from_messages([
            ("system", f"""You are a skilled and friendly market researcher conducting an interview about: {state.research_topic}.
            Your goal is to have a natural, flowing conversation. Based on the history, ask the next logical, open-ended question.
            - Build naturally on what the user has just said.
            - Be conversational and engaging, not robotic.
            - Do NOT repeat questions that have already been asked.
            - Ask ONE question at a time.
            
            Key insights discovered so far: {", ".join(key_insights) if key_insights else "None yet"}
            
            Return ONLY the next question and nothing else."""),
            ("user", self._format_conversation_history(state.conversation_history))
        ])

        chain = prompt | self.llm
        result = await chain.ainvoke({})
        return result.content.strip()

    async def _generate_closing_question(self, research_topic: str, key_insights: List[str]) -> str:
        """Generates a final, open-ended question to conclude the interview."""
        prompt = ChatPromptTemplate.from_messages([
            ("system", f"""You are concluding a research interview about: {research_topic}.
            Generate ONE final, open-ended question that gives the user a chance to share any important thoughts they haven't mentioned yet.
            Example: "Is there anything else you feel is important to mention about {research_topic}?"
            Return ONLY the final question."""),
            ("user", f"Here are the key insights from our conversation: {', '.join(key_insights)}")
        ])

        chain = prompt | self.llm
        result = await chain.ainvoke({})
        return result.content.strip()

    def _format_conversation_history(self, history: List[Dict[str, str]]) -> str:
        """Formats the conversation history for the LLM prompt."""
        formatted = []
        for msg in history[-6:]:
            role = "Interviewer" if msg["role"] == "assistant" else "User"
            formatted.append(f"{role}: {msg['content']}")
        return "\n".join(formatted)

    def is_interview_complete(self, state: InterviewState) -> bool:
        """Checks if the interview has reached its maximum question count."""
        return state.current_question_count >= state.max_questions

# Singleton instance
interviewer_agent = InterviewerAgent()

