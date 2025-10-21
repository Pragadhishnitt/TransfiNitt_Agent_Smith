"""
Probe Agent - Generates redirect probes for irrelevant responses
SIMPLIFIED: Only handles redirects, no deviation detection (handled by probe_decision agent)
"""

from typing import Dict
from groq import Groq
import config

class ProbeAgent:
    """Generates redirect probes for off-topic responses"""
    
    def __init__(self):
        self.groq_client = Groq(api_key=config.GROQ_API_KEY)
    
    async def generate_redirect_probe(
        self,
        original_question: str,
        user_response: str,
        research_topic: str
    ) -> str:
        """
        Generate a friendly redirect back to the original question.
        Called ONLY when response is confirmed irrelevant by probe_decision agent.
        """
        
        prompt = f"""The user gave an IRRELEVANT/OFF-TOPIC response. Generate a FRIENDLY redirect.

Research Topic: {research_topic}
Question Asked: {original_question}
User's Off-Topic Response: {user_response}

Your task:
1. Briefly acknowledge what they said (1 short sentence)
2. Gently redirect back to the original question
3. Make it conversational and warm

Examples:

Q: "Tell me about your experience with our app"
A: "I like pizza" 
Redirect: "Ha, pizza is great! But I'd love to hear about your experience with our app - what's your overall impression?"

Q: "What features do you use most?"
A: "My cat is sleeping"
Redirect: "Aww, cute! Now, back to the app - which features do you find yourself using most often?"

Q: "How often do you use the product?"
A: "I went dancing yesterday"
Redirect: "That sounds fun! Let's get back to the product though - how often would you say you use it?"

Keep it:
- Warm and friendly (not scolding)
- Brief (1-2 sentences MAX)
- Natural and conversational
- Firm but kind about returning to topic

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
            return f"That's interesting! Let's get back to my question though: {original_question}"

# Singleton instance
probe_agent = ProbeAgent()