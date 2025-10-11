from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from templates.question_templates import get_probe_question, get_follow_up
from models.schemas import AnalyzedResponse, ResponseQuality
import config
import random

class ProbeAgent:
    """Generates probing questions for shallow/vague responses"""
    
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model=config.COMPLEX_LLM_MODEL,
            temperature=0.8,  # Slightly higher for more varied probes
            google_api_key=config.GEMINI_API_KEY,
            convert_system_message_to_human=True
        )
    
    async def generate_probe_question(
        self,
        original_question: str,
        user_response: str,
        topic: str,
        research_topic: str,
        conversation_history: list
    ) -> str:
        """
        Generate a probing question based on the user's shallow/vague response.
        
        Args:
            original_question: The question that was just asked
            user_response: The user's shallow/vague response
            topic: Suggested topic to probe about (from deep analysis)
            research_topic: Overall research topic
            conversation_history: Full conversation so far
        """
        
        # STRATEGY 1: For VERY short responses (1-4 words), use template-based probes
        word_count = len(user_response.split())
        if word_count <= 4:
            templates = [
                "Could you tell me more about that?",
                "That's interesting! Can you elaborate a bit?",
                f"What specifically about {topic if topic != 'None' else 'that'} stands out to you?",
                "Can you give me a specific example?",
                "Help me understand - what does that look like for you?",
            ]
            return random.choice(templates)
        
        # STRATEGY 2: For vague responses, use AI to generate contextual probe
        # Get recent context (last 2 exchanges)
        recent_context = []
        for msg in conversation_history[-4:]:
            role = "You" if msg["role"] == "assistant" else "User"
            recent_context.append(f"{role}: {msg['content']}")
        context_str = "\n".join(recent_context)
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", f"""You are conducting a research interview about: {research_topic}

The user just gave a vague or shallow response. Your job is to generate ONE follow-up question that:
1. Is warm, friendly, and encouraging (not interrogating)
2. Gently asks for more specific details or examples
3. References what they just said to show you're listening
4. Feels natural and conversational
5. Helps them elaborate without feeling pressured

IMPORTANT: 
- Keep it to ONE short question (under 20 words)
- Don't use phrases like "Could you elaborate?" or "Tell me more" - be more creative
- Ask about specifics: examples, feelings, experiences, or details
- Make it feel like genuine curiosity, not an interview

Examples of GOOD probe questions:
- "What does that typically look like for you?"
- "Can you walk me through a recent time that happened?"
- "What's one thing about that you wish was different?"
- "How does that compare to your experience before?"
- "What made you feel that way?"

Examples of BAD probe questions (don't do these):
- "Could you elaborate on that?"
- "Tell me more."
- "Can you provide more details?"

Return ONLY the question, no explanation."""),
            ("user", f"""Recent conversation:
{context_str}

Their last response was: "{user_response}"

{f'They mentioned: {topic}' if topic != 'None' else ''}

Generate ONE natural follow-up question:""")
        ])
        
        chain = prompt | self.llm
        result = await chain.ainvoke({})
        
        probe_q = result.content.strip()
        
        # Remove quotes if the LLM added them
        probe_q = probe_q.strip('"').strip("'")
        
        # Ensure it ends with a question mark
        if not probe_q.endswith('?'):
            probe_q += '?'
        
        return probe_q
    
    def should_stop_probing(self, probe_count: int, max_probes: int = 2) -> bool:
        """
        Determine if we should stop probing and move on.
        Avoid annoying the user with too many follow-ups.
        """
        return probe_count >= max_probes

# Singleton instance
probe_agent = ProbeAgent()