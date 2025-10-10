from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum

class SentimentType(str, Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"

class ResponseQuality(str, Enum):
    SHALLOW = "shallow"
    VAGUE = "vague"
    GOOD = "good"

class InterviewState(BaseModel):
    session_id: str
    respondent_id: str # The UUID of the user taking the interview
    template_id: str
    research_topic: str
    conversation_history: List[Dict[str, str]] = []
    current_question_count: int = 0
    max_questions: int = 15
    is_complete: bool = False
    probe_count: int = 0

class UserResponse(BaseModel):
    session_id: str
    respondent_id: str
    message: str
    timestamp: datetime = Field(default_factory=datetime.now)

class AnalyzedResponse(BaseModel):
    response_text: str
    sentiment: SentimentType
    quality: ResponseQuality
    word_count: int
    key_insights: List[str] = []

class InterviewTemplate(BaseModel):
    template_id: str
    research_topic: str
    starter_questions: List[str]
    probe_triggers: List[str] = []
    max_questions: int = 15
    user_type: Optional[str] = None
    # FIX: Made this field optional to allow for system-generated templates (None)
    # or user-created templates (which will have a UUID string).
    created_by: Optional[str] = None

class InterviewSummary(BaseModel):
    session_id: str
    respondent_id: str
    template_id: str
    research_topic: str
    total_questions: int
    key_insights: List[str]
    sentiment_distribution: Dict[str, int]
    conversation_summary: str
    created_at: datetime = Field(default_factory=datetime.now)

