"""
Analyzer Agent - Fast analysis and deep analysis of user responses
"""

from models.schemas import AnalyzedResponse, ResponseQuality, Sentiment, DeepAnalysis
from groq import Groq
import config
import json

class AnalyzerAgent:
    """Analyzes user responses for quality and sentiment"""
    
    def __init__(self):
        self.groq_client = Groq(api_key=config.GROQ_API_KEY)
    
    async def analyze(self, user_response: str) -> AnalyzedResponse:
        """
        Fast analysis - determines quality and sentiment.
        This is called for EVERY response.
        """
        word_count = len(user_response.split())
        
        # Quick heuristic analysis
        quality = self._assess_quality(user_response, word_count)
        sentiment = self._assess_sentiment(user_response)
        
        # Extract quick insights for shallow responses
        quick_insights = []
        if quality == ResponseQuality.SHALLOW or quality == ResponseQuality.VAGUE:
            # For shallow responses, extract whatever small insight we can
            if word_count > 0:
                quick_insights.append(f"Brief response: {user_response[:50]}")
        
        return AnalyzedResponse(
            session_id="",  # Will be filled by caller
            respondent_id="",  # Will be filled by caller
            user_response=user_response,
            quality=quality,
            sentiment=sentiment,
            word_count=word_count,
            key_insights=quick_insights
        )
    
    def _assess_quality(self, text: str, word_count: int) -> ResponseQuality:
        """Assess response quality"""
        vague_words = ["okay", "fine", "maybe", "not sure", "i guess", "probably", "kinda"]
        
        if word_count <= 3:
            return ResponseQuality.VAGUE
        
        if word_count <= 8:
            return ResponseQuality.SHALLOW
        
        if any(word in text.lower() for word in vague_words):
            return ResponseQuality.SHALLOW
        
        if word_count >= 20:
            return ResponseQuality.EXCELLENT
        
        return ResponseQuality.GOOD
    
    def _assess_sentiment(self, text: str) -> Sentiment:
        """Assess sentiment"""
        positive_words = ["good", "great", "excellent", "love", "enjoy", "amazing", "happy"]
        negative_words = ["bad", "terrible", "hate", "awful", "disappointed", "frustrated"]
        
        text_lower = text.lower()
        pos_count = sum(1 for word in positive_words if word in text_lower)
        neg_count = sum(1 for word in negative_words if word in text_lower)
        
        if pos_count > neg_count:
            return Sentiment.POSITIVE
        elif neg_count > pos_count:
            return Sentiment.NEGATIVE
        return Sentiment.NEUTRAL
    
    async def deep_analyze(self, user_response: str, conversation_context: str) -> DeepAnalysis:
        """
        Deep analysis using Groq LLM - only for GOOD/EXCELLENT responses.
        Extracts insights, emotional tone, and determines if follow-up is needed.
        """
        
        prompt = f"""You are analyzing a market research interview response.

Context (recent conversation):
{conversation_context}

User's response:
{user_response}

Extract:
1. Key insights (2-3 concrete insights about user behavior, preferences, or pain points)
2. Emotional tone (one word: excited, frustrated, satisfied, neutral, etc.)
3. Does this need follow-up? (yes/no - only if something interesting was mentioned but not fully explained)
4. If follow-up needed, suggest a specific topic to probe

Return as JSON:
{{
  "key_insights": ["insight1", "insight2"],
  "emotional_tone": "satisfied",
  "needs_follow_up": false,
  "suggested_follow_up_topic": ""
}}
"""
        
        try:
            response = self.groq_client.chat.completions.create(
                model=config.GROQ_QUALITY_MODEL,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=200,
                temperature=0.3
            )
            
            result_text = response.choices[0].message.content.strip()
            
            # Parse JSON
            result = json.loads(result_text)
            
            return DeepAnalysis(
                key_insights=result.get("key_insights", []),
                emotional_tone=result.get("emotional_tone", "neutral"),
                needs_follow_up=result.get("needs_follow_up", False),
                suggested_follow_up_topic=result.get("suggested_follow_up_topic", "")
            )
        
        except Exception as e:
            print(f"⚠️ Deep analysis error: {e}")
            # Fallback
            return DeepAnalysis(
                key_insights=[],
                emotional_tone="neutral",
                needs_follow_up=False,
                suggested_follow_up_topic=""
            )

# Singleton instance
analyzer = AnalyzerAgent()