from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
import config
from typing import List, Dict, Optional
import random

class ProbeAgent:
    """Ultra-fast probe generation with deviation detection and redirection"""
    
    def __init__(self):
        self.llm = ChatGroq(
            model=config.PROBE_MODEL,
            temperature=config.PROBE_TEMPERATURE,
            api_key=config.GROQ_API_KEY,
            max_tokens=config.PROBE_MAX_TOKENS,
            timeout=config.LLM_TIMEOUT
        )
        
        # INSTANT TEMPLATE PROBES (no LLM needed)
        self.quick_probes = {
            "yes": ["Why is that?", "What makes you say that?"],
            "no": ["Why not?", "What would change your mind?"],
            "good": ["What makes it good?", "Can you give an example?"],
            "bad": ["What makes it bad?", "How could it be better?"],
            "okay": ["What makes it okay?", "What could improve it?"],
            "fine": ["What's fine about it?", "What would make it better?"],
            "maybe": ["What makes you uncertain?", "What would help you decide?"],
            "not really": ["Why do you feel that way?", "Tell me more."],
            "i guess": ["What makes you unsure?", "What do you think?"],
            "kind of": ["In what way?", "Can you be more specific?"],
            "sort of": ["How so?", "What exactly?"],
            "idk": ["Take a guess?", "What's your gut feeling?"],
            "dunno": ["What do you think?", "Any initial thoughts?"],
            "whatever": ["What would you prefer?", "Is something bothering you?"],
        }
        
        # REDIRECTION TEMPLATES
        self.redirect_templates = [
            "That's interesting! But let's get back to {topic} - {original_question}",
            "I appreciate that insight! Now, back to {topic}: {original_question}",
            "Good point! Let me refocus on {topic} - {original_question}",
            "Thanks for sharing! Let's return to {topic}: {original_question}",
        ]
    
    def _get_template_probe(self, user_response: str) -> Optional[str]:
        """INSTANT: Return template probe for common responses"""
        text_lower = user_response.lower().strip()
        
        # Exact match
        if text_lower in self.quick_probes:
            return random.choice(self.quick_probes[text_lower])
        
        # Pattern matching
        words = text_lower.split()
        if len(words) <= 3:
            # "It is good/bad/okay"
            if len(words) == 3 and words[0] == "it" and words[1] in ["is", "was"]:
                return "What specifically about it?"
            
            # "I like/hate it"
            if len(words) == 3 and words[0] == "i" and words[2] == "it":
                return f"What specifically do you {words[1]} about it?"
        
        return None
    
    async def check_deviation(
        self,
        original_question: str,
        user_response: str,
        research_topic: str
    ) -> bool:
        """
        Check if user's response deviates from the original question.
        
        Returns:
            True if response is off-topic/deviated
            False if response is on-topic
        """
        # Quick heuristic checks first
        original_lower = original_question.lower()
        response_lower = user_response.lower()
        
        # Extract key terms from original question
        question_keywords = self._extract_keywords(original_lower)
        
        # Check if ANY keyword appears in response
        has_overlap = any(keyword in response_lower for keyword in question_keywords)
        
        # If response is very short AND has no overlap, likely deviated
        word_count = len(user_response.split())
        if word_count <= 10 and not has_overlap:
            # Quick check: Is response asking about the question itself?
            deviation_indicators = [
                "why", "what", "how", "deviate", "topic", "question",
                "asked", "asking", "instead", "different", "change"
            ]
            if any(indicator in response_lower for indicator in deviation_indicators):
                return True
        
        # For longer responses, use LLM to check relevance
        if word_count > 10:
            return await self._llm_check_deviation(original_question, user_response, research_topic)
        
        return False
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract meaningful keywords from question"""
        # Remove common question words
        stop_words = {
            "tell", "me", "about", "your", "how", "what", "when", "where",
            "why", "do", "does", "did", "is", "are", "was", "were",
            "the", "a", "an", "and", "or", "but", "in", "on", "at"
        }
        
        words = text.split()
        keywords = [
            word.strip('.,!?;:"()[]{}') 
            for word in words 
            if word.lower() not in stop_words and len(word) > 3
        ]
        
        return keywords[:5]  # Top 5 keywords
    
    async def _llm_check_deviation(
        self,
        original_question: str,
        user_response: str,
        research_topic: str
    ) -> bool:
        """Use LLM to check if response is off-topic"""
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Return ONLY 'yes' or 'no'. Is the user's response off-topic or unrelated to the question?"),
            ("user", f"Question: {original_question}\nResponse: {user_response}\n\nIs response off-topic?")
        ])
        
        try:
            result = await (prompt | self.llm).ainvoke({})
            answer = result.content.strip().lower()
            return "yes" in answer
        except:
            return False  # If LLM fails, assume on-topic
    
    async def generate_probe_question(
        self,
        original_question: str,
        user_response: str,
        topic: str,
        research_topic: str,
        conversation_history: List[Dict[str, str]]
    ) -> str:
        """
        Fast probe generation with deviation detection and redirection.
        
        NEW BEHAVIOR:
        1. Check if user deviated from original question
        2. If yes → Acknowledge + Redirect to original question
        3. If no → Generate clarifying probe
        """
        
        # STEP 1: Check for deviation
        is_deviated = await self.check_deviation(original_question, user_response, research_topic)
        
        if is_deviated:
            # User deviated - redirect back to original question
            print(f"  🔄 DEVIATION DETECTED - Redirecting to original question")
            
            redirect = random.choice(self.redirect_templates)
            return redirect.format(
                topic=research_topic,
                original_question=original_question
            )
        
        # STEP 2: No deviation - generate normal probe
        
        # FASTEST: Template probe (no LLM)
        template_probe = self._get_template_probe(user_response)
        if template_probe:
            return template_probe
        
        # FAST: LLM probe (minimal prompt)
        word_count = len(user_response.split())
        
        if word_count <= 10:
            # Short response - use minimal prompt
            prompt = ChatPromptTemplate.from_messages([
                ("system", "Generate ONE short follow-up question (under 12 words). Return ONLY the question."),
                ("user", f"They said: {user_response}\nAsk for specifics:")
            ])
        else:
            # Longer response - use slightly more context
            prompt = ChatPromptTemplate.from_messages([
                ("system", f"Topic: {research_topic}. Generate ONE specific follow-up question (under 15 words)."),
                ("user", f"Q: {original_question}\nA: {user_response}\nFollow-up:")
            ])
        
        try:
            result = await (prompt | self.llm).ainvoke({})
            probe_q = result.content.strip().strip('"').strip("'")
            return probe_q if probe_q.endswith('?') else probe_q + '?'
        except Exception as e:
            # Ultra-fast fallback
            return "Can you tell me more about that?"

# Singleton instance
probe_agent = ProbeAgent()
