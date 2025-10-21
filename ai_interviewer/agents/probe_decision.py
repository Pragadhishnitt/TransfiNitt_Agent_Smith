"""
Probe Decision Agent - Intelligently decides if probing is TRULY needed
Only probes when response is IRRELEVANT/OFF-TOPIC, not just short
"""

from typing import Dict
from groq import Groq
import config

class ProbeDecisionAgent:
    """Makes intelligent decisions about when to probe"""
    
    def __init__(self):
        self.groq_client = Groq(api_key=config.GROQ_API_KEY)
    
    async def should_probe(
        self,
        question_asked: str,
        user_response: str,
        research_topic: str,
        response_quality: str
    ) -> Dict[str, any]:
        """
        Intelligently decide if we TRULY need to probe.
        
        Returns:
            {
                "should_probe": bool,
                "reason": str,
                "probe_type": str  # "irrelevant" or "none"
            }
        """
        
        # If response is already excellent, never probe
        if response_quality == "excellent":
            return {
                "should_probe": False,
                "reason": "Response is excellent quality",
                "probe_type": "none"
            }
        
        # Check if response is TRULY irrelevant/off-topic
        is_irrelevant = await self._check_relevance(
            question_asked,
            user_response,
            research_topic
        )
        
        if is_irrelevant:
            return {
                "should_probe": True,
                "reason": "Response is completely off-topic/irrelevant",
                "probe_type": "irrelevant"
            }
        
        # Response is on-topic but might be short/shallow
        # That's OK - we don't need to probe for every short answer
        return {
            "should_probe": False,
            "reason": f"Response is on-topic (quality: {response_quality})",
            "probe_type": "none"
        }
    
    async def _check_relevance(
        self,
        question: str,
        response: str,
        topic: str
    ) -> bool:
        """
        Check if response is ACTUALLY relevant to the question.
        Returns True if IRRELEVANT (needs probe)
        """
        
        prompt = f"""You are a relevance checker. Determine if the user's response is RELEVANT or IRRELEVANT to the question.

Research Topic: {topic}
Question Asked: {question}
User Response: {response}

A response is IRRELEVANT if:
- They talk about a completely different topic (e.g., asked about chess, they talk about cooking)
- They give a random unrelated answer (e.g., asked about product features, they talk about the weather)
- They completely ignore the question

A response is RELEVANT even if:
- It's short (e.g., "yes", "no", "good", "bad")
- It's vague (e.g., "it's okay", "not sure")
- It's shallow but still answers the question

Examples:

Q: "Tell me about your experience with our mobile app"
A: "I like it" → RELEVANT (short but on-topic)
A: "It's good" → RELEVANT (vague but on-topic)
A: "I went to the store yesterday" → IRRELEVANT (random topic)
A: "I love pizza" → IRRELEVANT (unrelated)

Q: "What features do you use most?"
A: "The search feature" → RELEVANT (on-topic)
A: "Not sure" → RELEVANT (vague but still engaging with question)
A: "My cat is sleeping" → IRRELEVANT (random topic)

Q: "How often do you use the app?"
A: "Daily" → RELEVANT (short but perfect answer)
A: "Sometimes" → RELEVANT (vague but answers question)
A: "I like dancing" → IRRELEVANT (unrelated)

Now analyze:
Question: {question}
Response: {response}

Respond with ONLY ONE WORD: "RELEVANT" or "IRRELEVANT"
"""
        
        try:
            response = self.groq_client.chat.completions.create(
                model=config.GROQ_FAST_MODEL,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=10,
                temperature=0.1
            )
            
            result = response.choices[0].message.content.strip().upper()
            
            # Return True if IRRELEVANT (needs probe)
            is_irrelevant = "IRRELEVANT" in result
            
            if is_irrelevant:
                print(f"   🚨 IRRELEVANT RESPONSE DETECTED")
            else:
                print(f"   ✅ Response is RELEVANT (no probe needed)")
            
            return is_irrelevant
        
        except Exception as e:
            print(f"⚠️ Relevance check error: {e}")
            # Default to RELEVANT (don't probe on error)
            return False

# Singleton instance
probe_decision_agent = ProbeDecisionAgent()