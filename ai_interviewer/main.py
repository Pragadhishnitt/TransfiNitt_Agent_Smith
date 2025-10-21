from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import json
import redis
from groq import Groq
import config

# ========================================================================
# IMPORT LANGGRAPH WORKFLOW
# ========================================================================
from graph.workflow import interview_workflow, InterviewGraphState
from models.schemas import InterviewState
from storage.db_client import db_client

# ========================================================================
# REDIS CLIENT SETUP
# ========================================================================
redis_client = redis.Redis(
    host=config.REDIS_HOST,
    port=config.REDIS_PORT,
    db=config.REDIS_DB,
    password=config.REDIS_PASSWORD,
    decode_responses=True
)

# ========================================================================
# GROQ CLIENT SETUP
# ========================================================================
groq_client = Groq(api_key=config.GROQ_API_KEY)

# ========================================================================
# FASTAPI APP INITIALIZATION
# ========================================================================
app = FastAPI(
    title="AI Interview Agent Service with LangGraph",
    description="Interview agent using LangGraph workflow",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========================================================================
# REQUEST/RESPONSE MODELS
# ========================================================================

class StartRequest(BaseModel):
    session_id: str
    template_id: str
    starter_questions: List[str]

class StartResponse(BaseModel):
    success: bool
    first_question: str
    audio_url: Optional[str] = None

class ChatRequest(BaseModel):
    session_id: str
    message: str

class ProgressInfo(BaseModel):
    current: int
    total: int

class ChatResponse(BaseModel):
    success: bool
    next_question: Optional[str] = None
    is_probe: bool = False
    sentiment: str = "neutral"
    progress: ProgressInfo
    is_complete: bool = False
    terminated_early: bool = False
    termination_reason: Optional[str] = None

class EndRequest(BaseModel):
    session_id: str

class TranscriptMessage(BaseModel):
    role: str
    message: str
    timestamp: str

class EndResponse(BaseModel):
    success: bool
    transcript: List[TranscriptMessage]
    summary: str
    sentiment_score: float
    key_themes: List[str]
    total_duration_seconds: int
    terminated_early: bool = False
    termination_reason: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    groq_connected: bool
    redis_connected: bool

# ========================================================================
# HELPER FUNCTIONS
# ========================================================================

def get_state_from_redis(session_id: str) -> Optional[Dict]:
    """Retrieve LangGraph state from Redis"""
    state_json = redis_client.get(f"langgraph_state:{session_id}")
    if state_json:
        return json.loads(state_json)
    return None

def save_state_to_redis(session_id: str, state: Dict):
    """Save LangGraph state to Redis"""
    redis_client.set(
        f"langgraph_state:{session_id}",
        json.dumps(state, default=str),
        ex=86400  # 24 hour expiry
    )

def analyze_sentiment(text: str) -> str:
    """Simple sentiment analysis"""
    positive_words = ["good", "great", "excellent", "love", "enjoy", "amazing"]
    negative_words = ["bad", "terrible", "hate", "awful", "disappointed", "frustrated"]
    
    text_lower = text.lower()
    positive_count = sum(1 for word in positive_words if word in text_lower)
    negative_count = sum(1 for word in negative_words if word in text_lower)
    
    if positive_count > negative_count:
        return "positive"
    elif negative_count > positive_count:
        return "negative"
    return "neutral"

def score_sentiment(text: str) -> float:
    """Numeric sentiment score between 0.0 and 1.0"""
    positive_words = ["good", "great", "excellent", "love", "enjoy", "amazing"]
    negative_words = ["bad", "terrible", "hate", "awful", "disappointed", "frustrated"]

    text_lower = text.lower()
    pos = sum(1 for w in positive_words if w in text_lower)
    neg = sum(1 for w in negative_words if w in text_lower)

    total = pos + neg
    if total > 0:
        score = 0.1 + 0.8 * (pos / total)
        return round(max(0.0, min(1.0, score)), 2)

    return 0.5

# ========================================================================
# ENDPOINTS
# ========================================================================

@app.get("/agent/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    redis_ok = False
    try:
        redis_client.ping()
        redis_ok = True
    except Exception:
        pass
    
    groq_ok = bool(config.GROQ_API_KEY)
    
    return HealthResponse(
        status="ok" if (redis_ok and groq_ok) else "degraded",
        groq_connected=groq_ok,
        redis_connected=redis_ok
    )

@app.post("/agent/start", response_model=StartResponse)
async def start_interview(request: StartRequest):
    """Start a new interview session using LangGraph."""
    try:
        session_id = request.session_id
        template_id = request.template_id
        
        print(f"\n{'='*60}")
        print(f"🚀 STARTING INTERVIEW: {session_id}")
        print(f"   Template: {template_id}")
        
        # Get research topic from starter questions
        research_topic = request.starter_questions[0] if request.starter_questions else "your experiences"
        
        # Initialize LangGraph state
        initial_state: InterviewGraphState = {
            "session_id": session_id,
            "respondent_id": session_id,  # Using session_id as respondent_id for now
            "template_id": template_id,
            "research_topic": research_topic,
            "conversation_history": [],
            "user_response": "",
            "current_question": None,
            "analyzed_response": None,
            "deep_analysis": None,
            "is_probe": False,
            "is_complete": False,
            "should_terminate_early": False,
            "termination_reason": None,
            "probe_count": 0,
            "question_count": 0,
            "total_exchanges": 0,
            "max_questions": 15,
            "waiting_for_clarification": False,
            "accumulated_insights": [],
            "summary": None
        }
        
        # Create first question
        first_question = f"Hi! I'm really excited to learn about your experiences. {research_topic}"
        
        # Add to conversation history
        initial_state["conversation_history"].append({
            "role": "assistant",
            "content": first_question
        })
        initial_state["current_question"] = first_question
        initial_state["question_count"] = 1
        
        # Save state to Redis
        save_state_to_redis(session_id, initial_state)
        
        # Initialize in database
        await db_client.initialize_session(session_id, template_id, research_topic)
        
        print(f"✅ Interview initialized with LangGraph")
        print(f"   First question: {first_question[:50]}...")
        print(f"{'='*60}\n")
        
        return StartResponse(
            success=True,
            first_question=first_question,
            audio_url=None
        )
    
    except Exception as e:
        print(f"❌ Error starting interview: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to start interview: {str(e)}")

@app.post("/agent/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Process user message using LangGraph workflow.
    This is where the magic happens!
    """
    try:
        session_id = request.session_id
        user_message = request.message
        
        print(f"\n{'='*60}")
        print(f"💬 USER: {user_message[:100]}...")
        
        # Retrieve current state from Redis
        state = get_state_from_redis(session_id)
        if not state:
            raise HTTPException(status_code=404, detail="Session not found")
        
        print(f"📊 Current state: Q{state['question_count']}/{state['max_questions']}, Probes: {state['probe_count']}")
        
        # Update state with user response
        state["user_response"] = user_message
        
        # ========================================================================
        # 🎯 RUN LANGGRAPH WORKFLOW
        # ========================================================================
        print(f"🔄 Running LangGraph workflow...")
        
        # Invoke the workflow
        result = await interview_workflow.ainvoke(state)
        
        print(f"✅ Workflow completed")
        print(f"   Complete: {result.get('is_complete', False)}")
        print(f"   Early termination: {result.get('should_terminate_early', False)}")
        
        # ========================================================================
        # Extract results from workflow
        # ========================================================================
        
        next_question = result.get("current_question")
        is_probe = result.get("is_probe", False)
        is_complete = result.get("is_complete", False)
        terminated_early = result.get("should_terminate_early", False)
        termination_reason = result.get("termination_reason")
        
        # Get sentiment from analyzed response
        analyzed = result.get("analyzed_response")
        sentiment = analyzed.sentiment.value if analyzed else "neutral"
        
        # Progress info
        progress = ProgressInfo(
            current=result["question_count"],
            total=result["max_questions"]
        )
        
        print(f"🤖 AGENT: {next_question[:100] if next_question else 'COMPLETE'}...")
        
        # Save updated state to Redis
        save_state_to_redis(session_id, result)
        
        print(f"{'='*60}\n")
        
        return ChatResponse(
            success=True,
            next_question=next_question,
            is_probe=is_probe,
            sentiment=sentiment,
            progress=progress,
            is_complete=is_complete,
            terminated_early=terminated_early,
            termination_reason=termination_reason
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error in chat: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error processing response: {str(e)}")

@app.post("/agent/end", response_model=EndResponse)
async def end_interview(request: EndRequest):
    """End the interview and return transcript and summary."""
    try:
        session_id = request.session_id
        
        print(f"\n{'='*60}")
        print(f"🏁 ENDING INTERVIEW: {session_id}")
        
        # Retrieve final state
        state = get_state_from_redis(session_id)
        if not state:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # If not complete, run workflow one more time to generate summary
        if not state.get("is_complete"):
            print(f"⚡ Generating final summary...")
            state["is_complete"] = True
            result = await interview_workflow.ainvoke(state)
            state = result
        
        # Extract summary from state
        summary_data = state.get("summary", {})
        
        # Build transcript from conversation history
        transcript = []
        for msg in state["conversation_history"]:
            transcript.append(TranscriptMessage(
                role=msg["role"],
                message=msg["content"],
                timestamp=datetime.now().isoformat()
            ))
        
        # Calculate duration (approximate)
        duration_seconds = len(transcript) * 30  # Rough estimate
        
        # Extract data from summary
        if isinstance(summary_data, dict):
            summary_text = summary_data.get("summary", "Interview completed successfully.")
            sentiment_score = summary_data.get("average_sentiment_score", 0.5)
            key_themes = summary_data.get("key_themes", [])
        else:
            summary_text = "Interview completed successfully."
            sentiment_score = 0.5
            key_themes = []
        
        terminated_early = state.get("should_terminate_early", False)
        termination_reason = state.get("termination_reason")
        
        if terminated_early:
            summary_text = f"[Interview terminated early: {termination_reason}] {summary_text}"
        
        print(f" ✅ Interview ended")
        print(f"   Questions: {state['question_count']}/{state['max_questions']}")
        print(f"   Early termination: {terminated_early}")
        print(f"{'='*60}\n")
        
        # Clean up Redis
        redis_client.delete(f"langgraph_state:{session_id}")
        
        return EndResponse(
            success=True,
            transcript=transcript,
            summary=summary_text,
            sentiment_score=sentiment_score,
            key_themes=key_themes,
            total_duration_seconds=duration_seconds,
            terminated_early=terminated_early,
            termination_reason=termination_reason
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error ending interview: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to end interview: {str(e)}")

# ========================================================================
# APPLICATION ENTRY POINT
# ========================================================================

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting FastAPI with LangGraph Integration")
    print("📊 Workflow: analyze → deep_analysis → [probe OR next_question]")
    print("⚡ Max probes: 1 per question")
    print("🔄 Deviation detection: Enabled")
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8001,
        log_level="info"
    )