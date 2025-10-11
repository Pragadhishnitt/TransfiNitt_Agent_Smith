from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List, Optional
import re

from models.schemas import AnalyzedResponse, ResponseQuality, SentimentType
import config

# --- Pydantic model for structured LLM output ---
class DeepAnalysis(BaseModel):
    key_insights: List[str] = Field(description="List of 2-3 key insights from the user's response.")
    emotional_tone: str = Field(description="The primary emotional tone of the response (e.g., enthusiastic, hesitant, frustrated).")
    needs_follow_up: bool = Field(description="True if the response is shallow, vague, or requires clarification.")
    suggested_follow_up_topic: str = Field(description="A specific topic or keyword to focus on for a follow-up question. Should be 'None' if no follow-up is needed.")

class ResponseAnalyzer:
    """
    Analyzes user responses using a multi-LLM strategy for sentiment, quality, and insights.
    """
    def __init__(self):
        self.complex_llm = ChatGoogleGenerativeAI(
            model=config.COMPLEX_LLM_MODEL,
            temperature=config.LLM_TEMPERATURE,
            google_api_key=config.GEMINI_API_KEY,
            convert_system_message_to_human=True
        )
        self.simple_llm = ChatGoogleGenerativeAI(
            model=config.SIMPLE_LLM_MODEL,
            temperature=config.LLM_TEMPERATURE,
            google_api_key=config.GEMINI_API_KEY,
            convert_system_message_to_human=True
        )

    def _rule_based_quality_check(self, response_text: str) -> Optional[ResponseQuality]:
        """
        Fast rule-based quality check for obvious shallow/vague responses.
        Returns None if rules are inconclusive and LLM should be used.
        """
        text = response_text.strip().lower()
        word_count = len(response_text.split())
        
        # Rule 1: Very short responses (1-3 words) are SHALLOW
        if word_count <= 3:
            return ResponseQuality.SHALLOW
        
        # Rule 2: Single sentence with less than 6 words is SHALLOW
        sentences = re.split(r'[.!?]+', text)
        non_empty_sentences = [s.strip() for s in sentences if s.strip()]
        if len(non_empty_sentences) == 1 and word_count < 6:
            return ResponseQuality.SHALLOW
        
        # Rule 3: Check for vague indicators
        vague_patterns = [
            r'\bit is (good|bad|okay|fine|nice)\b',  # "it is good"
            r'\b(maybe|perhaps|possibly|probably|kind of|sort of)\b',
            r'\bi guess\b',
            r'\bi think so\b',
            r'\bnot sure\b',
            r'\bwhatever\b',
            r'\bi don\'?t know\b',
        ]
        
        vague_count = sum(1 for pattern in vague_patterns if re.search(pattern, text))
        
        # If response has multiple vague indicators and is short, it's VAGUE
        if vague_count >= 2 and word_count < 15:
            return ResponseQuality.VAGUE
        
        # If response is mostly vague words
        if vague_count >= 1 and word_count < 8:
            return ResponseQuality.VAGUE
        
        # Rule 4: One-word or two-word responses are SHALLOW
        common_shallow_responses = [
            'yes', 'no', 'yeah', 'nah', 'sure', 'okay', 'ok', 
            'good', 'bad', 'fine', 'nice', 'great', 'cool',
            'yes please', 'no thanks', 'sounds good', 'not really',
            'i guess', 'maybe', 'idk', 'dunno'
        ]
        
        if text in common_shallow_responses:
            return ResponseQuality.SHALLOW
        
        # Rule 5: Repetitive responses without substance
        words = response_text.split()
        if len(set(words)) < len(words) * 0.5 and word_count < 10:
            return ResponseQuality.SHALLOW
        
        # No conclusive rule match - let LLM decide
        return None

    async def analyze(self, response_text: str) -> AnalyzedResponse:
        """
        Performs a fast analysis of a user's response using a hybrid rule-based and AI approach.
        """
        word_count = len(response_text.split())
        
        # CRITICAL FIX: Try rule-based check first
        rule_based_quality = self._rule_based_quality_check(response_text)
        
        if rule_based_quality in [ResponseQuality.SHALLOW, ResponseQuality.VAGUE]:
            # For shallow/vague responses, still get sentiment but use rule-based quality
            print(f"  ⚡ Rule-based: Detected {rule_based_quality.value.upper()} response")
            
            sentiment_prompt = ChatPromptTemplate.from_messages([
                ("system", "Classify the sentiment as ONE word: 'positive', 'negative', or 'neutral'."),
                ("user", response_text)
            ])
            sentiment_chain = sentiment_prompt | self.simple_llm
            
            try:
                sentiment_result = await sentiment_chain.ainvoke({})
                sentiment_text = sentiment_result.content.lower().strip()
                # Extract just the sentiment word
                if 'positive' in sentiment_text:
                    sentiment = SentimentType.POSITIVE
                elif 'negative' in sentiment_text:
                    sentiment = SentimentType.NEGATIVE
                else:
                    sentiment = SentimentType.NEUTRAL
            except Exception as e:
                print(f"  ⚠️ Sentiment detection failed: {e}")
                sentiment = SentimentType.NEUTRAL
            
            return AnalyzedResponse(
                response_text=response_text,
                sentiment=sentiment,
                quality=rule_based_quality,
                word_count=word_count,
                key_insights=[]
            )
        
        # --- AI-Based Analysis for Longer/Ambiguous Responses ---
        print(f"  🤖 AI-based: Analyzing response with LLM")
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are analyzing a user's response in a market research interview.

Output ONLY a valid JSON object with exactly two keys: "sentiment" and "quality".

Sentiment rules:
- "positive" if the response expresses satisfaction, happiness, or approval
- "negative" if it expresses dissatisfaction, frustration, or disapproval  
- "neutral" otherwise

Quality rules:
- "shallow" if the response is very short (under 6 words) OR lacks specific details
  Examples: "It's good", "I like it", "Yeah sure", "Not really"
- "vague" if it uses uncertain language OR avoids giving concrete information
  Examples: "Maybe", "I guess so", "Kind of", "Sort of okay"
- "good" if it provides specific details, examples, or substantial information

Examples:
Input: "It is good"
Output: {{"sentiment": "positive", "quality": "shallow"}}

Input: "I guess it's okay"
Output: {{"sentiment": "neutral", "quality": "vague"}}

Input: "I really enjoy using it every morning because it saves me time and the interface is intuitive"
Output: {{"sentiment": "positive", "quality": "good"}}

Now analyze this response and return ONLY the JSON:"""),
            ("user", response_text)
        ])
        
        chain = prompt | self.simple_llm
        
        try:
            result = await chain.ainvoke({})
            content = result.content.strip()
            
            # Extract JSON from response (sometimes LLMs add extra text)
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                content = json_match.group()
            
            # Parse JSON
            import json
            analysis_result = json.loads(content)
            
            sentiment = SentimentType(analysis_result.get("sentiment", "neutral"))
            quality = ResponseQuality(analysis_result.get("quality", "good"))
            
            print(f"  ✅ AI Analysis: sentiment={sentiment.value}, quality={quality.value}")
            
        except Exception as e:
            print(f"  ⚠️ AI Analysis failed: {e}, defaulting to SHALLOW")
            # If AI fails and response is short, assume SHALLOW
            sentiment = SentimentType.NEUTRAL
            quality = ResponseQuality.SHALLOW if word_count < 10 else ResponseQuality.GOOD

        return AnalyzedResponse(
            response_text=response_text,
            sentiment=sentiment,
            quality=quality,
            word_count=word_count,
            key_insights=[]
        )

    async def deep_analyze(self, response_text: str, conversation_context: str = "") -> DeepAnalysis:
        """
        Uses the complex LLM to perform a deep, nuanced analysis of the response.
        """
        parser = JsonOutputParser(pydantic_object=DeepAnalysis)

        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert market research analyst. Deeply analyze the user's response.

Return a JSON object with these fields:
- key_insights: Array of 2-3 specific insights (empty array if response is too shallow)
- emotional_tone: String describing the emotional tone
- needs_follow_up: Boolean - true if response is shallow/vague/unclear
- suggested_follow_up_topic: String with a specific topic to probe, or "None" if not needed

IMPORTANT: Set needs_follow_up to TRUE if:
- Response is less than 6 words
- Response lacks specific details or examples
- Response uses vague language ("maybe", "I guess", "kind of")
- Response is just "It is good", "Yeah", "Not really", etc.

{format_instructions}"""),
            ("user", f"Context: {conversation_context}\n\nUser Response: \"{response_text}\"")
        ])
        
        chain = prompt | self.complex_llm | parser
        
        try:
            analysis_result = await chain.ainvoke({
                "format_instructions": parser.get_format_instructions()
            })
            return DeepAnalysis(**analysis_result)
        except Exception as e:
            print(f"  ⚠️ Deep analysis failed: {e}")
            # Return a default that triggers follow-up for short responses
            word_count = len(response_text.split())
            return DeepAnalysis(
                key_insights=[],
                emotional_tone="uncertain",
                needs_follow_up=word_count < 10,
                suggested_follow_up_topic="details about their response"
            )

    def should_probe(self, analyzed_response: AnalyzedResponse) -> bool:
        """
        Determines if the conversation should probe deeper based on the initial analysis.
        """
        is_shallow_or_vague = analyzed_response.quality in [
            ResponseQuality.SHALLOW, 
            ResponseQuality.VAGUE
        ]
        
        if is_shallow_or_vague:
            print(f"  🎯 PROBE TRIGGERED: Quality is {analyzed_response.quality.value}")
        
        return is_shallow_or_vague

# Singleton instance
analyzer = ResponseAnalyzer()