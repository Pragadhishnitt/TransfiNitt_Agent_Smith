from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List

from models.schemas import AnalyzedResponse, ResponseQuality, SentimentType
import config

# --- Pydantic model for structured LLM output ---
# This ensures the LLM's deep analysis provides a predictable, parsable structure.
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
        # Initialize the powerful model for deep, nuanced analysis.
        self.complex_llm = ChatGoogleGenerativeAI(
            model=config.COMPLEX_LLM_MODEL,
            temperature=config.LLM_TEMPERATURE,
            google_api_key=config.GEMINI_API_KEY,
            convert_system_message_to_human=True # Helps with some models
        )
        # Initialize a smaller, faster model for quick, routine analysis.
        self.simple_llm = ChatGoogleGenerativeAI(
            model=config.SIMPLE_LLM_MODEL,
            temperature=config.LLM_TEMPERATURE,
            google_api_key=config.GEMINI_API_KEY,
            convert_system_message_to_human=True
        )

    async def analyze(self, response_text: str) -> AnalyzedResponse:
        """
        Performs a fast, initial analysis of a user's response using the simple LLM.
        This determines basic sentiment and quality to decide if a deeper probe is needed.
        """
        # Define the instruction for the simple LLM
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a response analysis assistant. Analyze the user's text and classify its sentiment and quality.
            Sentiment can be 'positive', 'negative', or 'neutral'.
            Quality can be 'good' if it's detailed and clear, 'shallow' if it's too short, or 'vague' if it lacks specifics.
            Respond with a JSON object with two keys: 'sentiment' and 'quality'."""),
            ("user", f"Analyze this response: {response_text}")
        ])
        
        # Define a simple JSON parser
        parser = JsonOutputParser()
        chain = prompt | self.simple_llm | parser
        
        try:
            analysis_result = await chain.ainvoke({})
            sentiment = SentimentType(analysis_result.get("sentiment", "neutral"))
            quality = ResponseQuality(analysis_result.get("quality", "good"))
        except Exception:
            # Fallback in case the LLM fails or returns malformed JSON
            sentiment = SentimentType.NEUTRAL
            quality = ResponseQuality.GOOD

        word_count = len(response_text.split())

        return AnalyzedResponse(
            response_text=response_text,
            sentiment=sentiment,
            quality=quality,
            word_count=word_count,
            key_insights=[] # Key insights are extracted in the deep analysis phase
        )

    async def deep_analyze(self, response_text: str, conversation_context: str = "") -> DeepAnalysis:
        """
        Uses the complex LLM to perform a deep, nuanced analysis of the response,
        extracting key insights and suggesting follow-up actions in a structured format.
        """
        parser = JsonOutputParser(pydantic_object=DeepAnalysis)

        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert market research analyst. Your task is to deeply analyze a user's response within the context of an ongoing interview.
            Analyze the user's response and provide a structured JSON output with the following fields:
            - key_insights: A list of 2-3 key insights, findings, or important points from the response.
            - emotional_tone: The primary emotional tone conveyed by the user (e.g., enthusiastic, hesitant, frustrated).
            - needs_follow_up: A boolean (true/false) indicating if the response is shallow, vague, or requires further clarification to be useful.
            - suggested_follow_up_topic: If a follow-up is needed, suggest a specific topic or keyword to focus on. If not, this should be 'None'.
            
            {format_instructions}
            """),
            ("user", f"Interview Context: {conversation_context}\n\nUser Response to Analyze: \"{response_text}\"")
        ])
        
        chain = prompt | self.complex_llm | parser
        
        analysis_result = await chain.ainvoke({
            "format_instructions": parser.get_format_instructions()
        })
        
        return DeepAnalysis(**analysis_result)

    def should_probe(self, analyzed_response: AnalyzedResponse) -> bool:
        """
        Determines if the conversation should probe deeper based on the initial analysis.
        """
        return analyzed_response.quality in [ResponseQuality.SHALLOW, ResponseQuality.VAGUE]

# Singleton instance for use across the application
analyzer = ResponseAnalyzer()
