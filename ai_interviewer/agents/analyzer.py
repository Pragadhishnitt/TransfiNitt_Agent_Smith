from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List, Optional
import re
import json

from models.schemas import AnalyzedResponse, ResponseQuality, SentimentType
import config

# --- Pydantic model for structured LLM output ---
class DeepAnalysis(BaseModel):
    key_insights: List[str] = Field(description="List of 1-2 key insights")
    emotional_tone: str = Field(description="Primary emotional tone")
    needs_follow_up: bool = Field(description="True if shallow/vague")
    suggested_follow_up_topic: str = Field(description="Topic to probe or 'None'")

class ResponseAnalyzer:
    """Ultra-fast response analyzer using Groq"""
    
    def __init__(self):
        # GROQ - Ultra-fast inference
        self.fast_llm = ChatGroq(
            model=config.ANALYSIS_MODEL,
            temperature=config.ANALYSIS_TEMPERATURE,
            api_key=config.GROQ_API_KEY,
            max_tokens=config.ANALYSIS_MAX_TOKENS,
            timeout=config.LLM_TIMEOUT
        )

    def _rule_based_quality_check(self, response_text: str) -> Optional[ResponseQuality]:
        """
        Lightning-fast rule-based quality check.
        
        UPDATED: More intelligent detection - doesn't flag valid short responses.
        """
        text = response_text.strip().lower()
        word_count = len(response_text.split())
        
        # Rule 1: ONLY 1-2 words = SHALLOW
        # Changed from <= 3 to <= 2
        if word_count <= 2:
            return ResponseQuality.SHALLOW
        
        # Rule 2: EXACT MATCH common shallow responses
        # This catches single-word answers like "yes", "no", "good"
        common_shallow = {
            'yes', 'no', 'yeah', 'nah', 'sure', 'okay', 'ok', 
            'good', 'bad', 'fine', 'nice', 'great', 'cool',
            'maybe', 'idk', 'dunno', 'whatever', 'nope', 'yep'
        }
        
        if text in common_shallow:
            return ResponseQuality.SHALLOW
        
        # Rule 3: EXACT MATCH two-word shallow responses
        two_word_shallow = {
            'yes please', 'no thanks', 'sounds good', 'not really',
            'i guess', 'kind of', 'sort of', 'not sure'
        }
        
        if text in two_word_shallow:
            return ResponseQuality.SHALLOW
        
        # Rule 4: "It is [adjective]" pattern (3-4 words)
        if word_count <= 4:
            if re.match(r'^it (is|was) \w+$', text):
                return ResponseQuality.SHALLOW
            
            # "I like it" / "I hate it" patterns
            if re.match(r'^i (like|love|hate|dislike) (it|that|this)$', text):
                return ResponseQuality.SHALLOW
        
        # Rule 5: Check for vague patterns ONLY if short (< 8 words)
        # Don't flag longer responses just because they have "maybe"
        if word_count < 8:
            # Multiple vague indicators in a short response
            vague_count = 0
            vague_words = ['maybe', 'perhaps', 'i guess', 'not sure', 
                          'whatever', 'kind of', 'sort of', 'idk', 'dunno']
            
            for vague in vague_words:
                if vague in text:
                    vague_count += 1
            
            # If 2+ vague words in a short response, it's VAGUE
            if vague_count >= 2:
                return ResponseQuality.VAGUE
        
        # NEW Rule 6: Check if response has SUBSTANCE
        # If 5+ words AND contains action/description words, it's likely GOOD
        if word_count >= 5:
            # Check for content indicators (verbs, adjectives, specific nouns)
            substance_indicators = [
                # Action verbs
                'drink', 'need', 'use', 'make', 'get', 'have', 'take', 
                'feel', 'think', 'like', 'love', 'hate', 'want', 'enjoy',
                'provides', 'gives', 'helps', 'makes', 'causes',
                
                # Descriptive words
                'every', 'daily', 'morning', 'afternoon', 'evening', 
                'always', 'usually', 'often', 'sometimes', 'never',
                'boost', 'energy', 'focus', 'alert', 'awake',
                
                # Specific details
                'cup', 'mug', 'espresso', 'latte', 'black', 'milk', 'sugar',
                'work', 'home', 'office', 'kitchen', 'coffee shop'
            ]
            
            has_substance = any(indicator in text for indicator in substance_indicators)
            
            if has_substance:
                # Has substance words + 5+ words = Likely GOOD
                return None  # Let it pass to LLM or return GOOD
        
        return None  # Let LLM decide for ambiguous cases

    async def analyze(self, response_text: str) -> AnalyzedResponse:
        """
        Ultra-fast analysis with rule-based shortcuts.
        
        UPDATED: Better handling of valid short responses.
        """
        word_count = len(response_text.split())
        
        # STEP 1: Rule-based quality check (instant)
        rule_quality = self._rule_based_quality_check(response_text)
        
        if rule_quality:
            # Skip LLM for obvious cases, use fast sentiment heuristic
            sentiment = self._fast_sentiment_heuristic(response_text)
            
            print(f"  ⚡ Rule-based: {rule_quality.value.upper()}")
            
            return AnalyzedResponse(
                response_text=response_text,
                sentiment=sentiment,
                quality=rule_quality,
                word_count=word_count,
                key_insights=[]
            )
        
        # STEP 2: Fast LLM analysis for ambiguous cases
        print(f"  🤖 Using LLM for quality check...")
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", """Analyze response quality. Return JSON: {"sentiment":"positive|negative|neutral","quality":"shallow|vague|good"}

Quality rules:
- "shallow": No specific details, just states a fact without explanation
  Examples: "yes", "no", "it's good", "I like it"
  
- "vague": Uncertain or non-committal without specifics
  Examples: "maybe", "I guess so", "kind of"
  
- "good": Has specific details, explanations, or substance (even if short!)
  Examples: "Coffee gives me energy", "I drink it every morning", "It helps me focus"

IMPORTANT: 5+ words with substance = GOOD, even if brief!"""),
            ("user", f"Response: {response_text}")
        ])
        
        try:
            result = await (prompt | self.fast_llm).ainvoke({})
            content = result.content.strip()
            
            # Extract JSON
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group())
                sentiment = SentimentType(data.get("sentiment", "neutral"))
                quality = ResponseQuality(data.get("quality", "good"))
            else:
                raise ValueError("No JSON found")
                
        except Exception as e:
            print(f"  ⚠️ LLM analysis failed: {e}")
            # Fallback to heuristics
            sentiment = self._fast_sentiment_heuristic(response_text)
            # If 5+ words, assume GOOD; otherwise SHALLOW
            quality = ResponseQuality.GOOD if word_count >= 5 else ResponseQuality.SHALLOW

        return AnalyzedResponse(
            response_text=response_text,
            sentiment=sentiment,
            quality=quality,
            word_count=word_count,
            key_insights=[]
        )

    def _fast_sentiment_heuristic(self, text: str) -> SentimentType:
        """Ultra-fast sentiment detection using keyword matching"""
        text_lower = text.lower()
        
        # Positive keywords
        positive_words = ['love', 'great', 'good', 'excellent', 'amazing', 'wonderful', 
                         'enjoy', 'happy', 'like', 'best', 'fantastic', 'perfect',
                         'boost', 'energy', 'helps', 'better', 'improve']
        
        # Negative keywords
        negative_words = ['hate', 'bad', 'terrible', 'awful', 'horrible', 'worst',
                         'dislike', 'annoying', 'frustrating', 'boring', 'poor',
                         'jittery', 'anxious', 'crash', 'tired']
        
        pos_count = sum(1 for word in positive_words if word in text_lower)
        neg_count = sum(1 for word in negative_words if word in text_lower)
        
        if pos_count > neg_count:
            return SentimentType.POSITIVE
        elif neg_count > pos_count:
            return SentimentType.NEGATIVE
        else:
            return SentimentType.NEUTRAL

    async def deep_analyze(self, response_text: str, conversation_context: str = "") -> DeepAnalysis:
        """
        Fast deep analysis - ONLY for good quality responses
        Skipped for shallow/vague (handled by workflow)
        """
        word_count = len(response_text.split())
        
        # Quick heuristic for very short responses
        if word_count < 6:
            return DeepAnalysis(
                key_insights=[],
                emotional_tone="brief",
                needs_follow_up=True,
                suggested_follow_up_topic="details"
            )
        
        # Fast LLM call with minimal prompt
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Extract 1-2 key insights. Return JSON: {\"key_insights\":[...],\"emotional_tone\":\"...\",\"needs_follow_up\":true|false,\"suggested_follow_up_topic\":\"...\"}"),
            ("user", f"Response: {response_text}")
        ])
        
        try:
            result = await (prompt | self.fast_llm).ainvoke({})
            content = result.content.strip()
            
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group())
                return DeepAnalysis(**data)
            else:
                raise ValueError("No JSON found")
                
        except Exception as e:
            # Fast fallback
            return DeepAnalysis(
                key_insights=[],
                emotional_tone="neutral",
                needs_follow_up=word_count < 15,
                suggested_follow_up_topic="more details"
            )

    def should_probe(self, analyzed_response: AnalyzedResponse) -> bool:
        """
        DEPRECATED: This logic is now in workflow.py
        Kept for backwards compatibility.
        """
        return analyzed_response.quality in [ResponseQuality.SHALLOW, ResponseQuality.VAGUE]

# Singleton instance
analyzer = ResponseAnalyzer()
