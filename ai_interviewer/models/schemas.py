from pydantic import BaseModel
from typing import List, Optional, Dict
from enum import Enum
from datetime import datetime

# ========================================================================
# ENUMS
# ========================================================================

class ResponseQuality(str, Enum):
    EXCELLENT = "excellent"
    GOOD = "good"
    SHALLOW = "shallow"
    VAGUE = "vague"

class Sentiment(str, Enum):
    POSITIVE = "positive"
    NEUTRAL = "neutral"
    NEGATIVE = "negative"

# ========================================================================
# ANALYZED RESPONSE MODEL
# ========================================================================

class AnalyzedResponse(BaseModel):
    """Fast analysis result from analyzer agent"""
    session_id: str
    respondent_id: str
    user_response: str
    
    quality: ResponseQuality
    sentiment: Sentiment
    word_count: int
    key_insights: List[str] = []
    
    timestamp: datetime = None
    
    def __init__(self, **data):
        if 'timestamp' not in data or data['timestamp'] is None:
            data['timestamp'] = datetime.now()
        super().__init__(**data)

# ========================================================================
# DEEP ANALYSIS (from analyzer agent)
# ========================================================================

class DeepAnalysis(BaseModel):
    """Deep analysis result - only for relevant responses"""
    key_insights: List[str]
    emotional_tone: str
    needs_follow_up: bool
    suggested_follow_up_topic: str

# ========================================================================
# PROBE DECISION MODEL (NEW)
# ========================================================================

class ProbeDecision(BaseModel):
    """Result from intelligent probe decision agent"""
    should_probe: bool
    reason: str
    probe_type: str  # "irrelevant" or "none"

# ========================================================================
# INTERVIEW STATE
# ========================================================================

class InterviewState(BaseModel):
    """Complete interview session state"""
    session_id: str
    respondent_id: str
    template_id: str
    research_topic: str
    
    conversation_history: List[Dict[str, str]] = []
    
    current_question_count: int = 0
    max_questions: int = 15
    
    is_complete: bool = False
    should_terminate_early: bool = False
    termination_reason: Optional[str] = None

# ========================================================================
# SUMMARY MODEL
# ========================================================================

class InterviewSummary(BaseModel):
    """Final interview summary"""
    session_id: str
    template_id: str
    
    summary: str
    key_themes: List[str]
    
    average_sentiment_score: float
    total_insights_count: int
    
    questions_asked: int
    total_exchanges: int
    
    terminated_early: bool = False
    termination_reason: Optional[str] = None
    
    generated_at: datetime = None
    
    def __init__(self, **data):
        if 'generated_at' not in data or data['generated_at'] is None:
            data['generated_at'] = datetime.now()
        super().__init__(**data)