from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from typing import Dict, List

import config
from templates.question_templates import get_probe_question

class ProbeAgent:
    """
    Generates targeted, contextual follow-up questions when a user's
    response is identified as shallow or vague by the ResponseAnalyzer.
    """
    def __init__(self):
        # Probing requires nuanced, context-aware question generation,
        # making the complex model the right choice.
        self.llm = ChatGoogleGenerativeAI(
            model=config.COMPLEX_LLM_MODEL,
            temperature=config.LLM_TEMPERATURE,
            google_api_key=config.GEMINI_API_KEY,
            convert_system_message_to_human=True
        )

    async def generate_probe_question(
        self,
        topic: str,
        research_topic: str,
        conversation_history: List[Dict[str, str]]
    ) -> str:
        """
        Generates a friendly, open-ended probe question to encourage more detail.
        """
        # For simple probes where a topic is identified, use a template for speed.
        if topic and topic.lower() != 'none':
            return get_probe_question(keyword=topic)

        # For more complex situations, use the LLM to generate a contextual probe.
        prompt = ChatPromptTemplate.from_messages([
            ("system", f"""You are a friendly market researcher conducting an interview about: {research_topic}.
            The user just gave a brief or vague answer. Your task is to ask a single, gentle, open-ended follow-up question to encourage them to elaborate.
            Do not be demanding. Phrase it as if you are curious.
            
            Examples:
            - "Could you tell me a little more about that?"
            - "That sounds interesting. Can you give me a specific example of what you mean?"
            - "How did that come about?"
            
            Based on the conversation, ask a natural-sounding follow-up question. Return ONLY the question."""),
            ("user", self._format_conversation_history(conversation_history))
        ])

        chain = prompt | self.llm
        result = await chain.ainvoke({})
        return result.content.strip()

    def _format_conversation_history(self, history: List[Dict[str, str]]) -> str:
        """Formats the last few turns of conversation for the LLM prompt."""
        formatted = ["Here is the recent conversation flow:"]
        # Get the last 2 exchanges (4 messages)
        for msg in history[-4:]:
            role = "You (The Interviewer)" if msg["role"] == "assistant" else "Respondent"
            formatted.append(f"{role}: {msg['content']}")
        return "\n".join(formatted)

# Singleton instance for use across the application
probe_agent = ProbeAgent()

