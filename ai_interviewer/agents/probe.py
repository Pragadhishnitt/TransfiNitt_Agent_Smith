"""
Probe Agent - Generates probe questions and detects topic deviation
"""

from typing import List, Dict, Optional
from groq import Groq
import config

class ProbeAgent:
    """Generates intelligent probe questions with deviation detection"""
    
    def __init__(self):
        self.groq_client = Groq(api_key=config.GROQ_API_KEY)
    
    async def generate_probe_question(
        self,
        original_question: str,
        user_response: str,
        topic: str,
        research_topic: str,
        conversation_history: List[Dict]
    ) -> str:
        """
        Generate a probe question that:
        1. Detects if user deviated from topic
        2. If deviated: acknowledges and redirects back
        3. If vague: asks for specific examples
        """
        
        # Detect deviation
        deviation_detected = await self._detect_deviation(
            original_question,
            user_response,
            research_topic
        )
        
        if deviation_detected:
            print(f"   🔄 DEVIATION DETECTED - Redirecting back to original question")
            return await self._generate_redirect_probe(original_question, user_response)
        else:
            print(f"   ⚡ VAGUE RESPONSE - Asking for specifics")
            return await self._generate_clarification_probe(original_question, user_response, topic)
    
    async def _detect_deviation(
        self,
        original_question: str,
        user_response: str,
        research_topic: str
    ) -> bool:
        """Detect if user went off-topic"""
        
        prompt = f"""You are analyzing if a user's response is ON TOPIC or OFF TOPIC.

Research Topic: {research_topic}
Question Asked: {original_question}
User's Response: {user_response}

Did the user answer the question about the topic, or did they talk about something completely different?

Respond with ONLY: "ON_TOPIC" or "OFF_TOPIC"
"""
        
        try:
            response = self.groq_client.chat.completions.create(
                model=config.GROQ_FAST_MODEL,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=10,
                temperature=0.1
            )
            
            result = response.choices[0].message.content.strip().upper()
            return "OFF_TOPIC" in result
        
        except Exception as e:
            print(f"⚠️ Deviation detection error: {e}")
            return False  # Assume on-topic if error
    
    async def _generate_redirect_probe(
        self,
        original_question: str,
        user_response: str
    ) -> str:
        """Generate a question that redirects back to the original topic"""
        
        prompt = f"""The user went off-topic. Generate a FRIENDLY but FIRM redirect.

Original Question: {original_question}
User's Off-Topic Response: {user_response}

Your task:
1. Briefly acknowledge what they said (1 sentence)
2. Gently redirect back to the original question
3. Rephrase the original question with more specific guidance

Example:
"That's interesting! But let's get back to what I asked about - [rephrase original question with specific examples]"

Keep it warm but assertive. 1-2 sentences MAX.

Generate your redirect:"""
        
        try:
            response = self.groq_client.chat.completions.create(
                model=config.GROQ_FAST_MODEL,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=100,
                temperature=0.4
            )
            
            return response.choices[0].message.content.strip()
        
        except Exception as e:
            print(f"⚠️ Redirect probe error: {e}")
            return f"That's great! Now let's get back to my original question: {original_question}"
    
    async def _generate_clarification_probe(
        self,
        original_question: str,
        user_response: str,
        topic: str
    ) -> str:
        """Generate a probe for vague/shallow responses"""
        
        prompt = f"""The user gave a VAGUE answer. Generate a probe that asks for SPECIFIC EXAMPLES.

Original Question: {original_question}
User's Vague Answer: {user_response}
Topic to probe: {topic}

Your task:
1. Briefly acknowledge their answer
2. Ask for a SPECIFIC EXAMPLE or concrete detail
3. Use phrases like:
   - "Can you walk me through a specific time when..."
   - "Give me a concrete example of..."
   - "Tell me about the last time you..."

Be warm and encouraging. Show genuine curiosity.
Keep it 1-2 sentences MAX.

Generate your probe:"""
        
        try:
            response = self.groq_client.chat.completions.create(
                model=config.GROQ_FAST_MODEL,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=100,
                temperature=0.4
            )
            
            return response.choices[0].message.content.strip()
        
        except Exception as e:
            print(f"⚠️ Clarification probe error: {e}")
            return "Could you give me a specific example of what you mean?"

# Singleton instance
probe_agent = ProbeAgent()