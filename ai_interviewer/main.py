from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from contextlib import asynccontextmanager
from datetime import datetime
import uuid
from fastapi.responses import Response
import config
from models.schemas import InterviewTemplate, InterviewState, InterviewSummary
from storage.db_client import db_client
from storage.redis_client import redis_client
from templates.template_schemas import TEMPLATE_REGISTRY
from auth.supabase_auth import User
from graph.workflow import interview_workflow, InterviewGraphState

# ========================================================================
# 🔓 AUTH CONFIGURATION - SET TO False TO DISABLE
# ========================================================================
ENABLE_AUTH = False  # ← Change this to True to enable authentication

# ========================================================================
# MOCK USER FOR TESTING (Used when ENABLE_AUTH = False)
# ========================================================================
async def get_mock_user() -> User:
    """Returns a mock user when auth is disabled"""
    mock_payload = {
        "sub": "mock-user-123",
        "email": "test@example.com", 
        "role": "researcher",
        "user_metadata": {"role": "researcher"},
        "app_metadata": {},
        "aud": "authenticated",
        "exp": 9999999999,
        "iat": 1234567890
    }
    return User(mock_payload)

# ========================================================================
# CONDITIONAL AUTH DEPENDENCIES
# ========================================================================
def get_user_dependency():
    """Returns auth dependency based on ENABLE_AUTH setting"""
    if ENABLE_AUTH:
        from auth.supabase_auth import get_current_user
        return Depends(get_current_user)
    else:
        return Depends(get_mock_user)

def get_researcher_dependency():
    """Returns researcher auth dependency based on ENABLE_AUTH setting"""
    if ENABLE_AUTH:
        from auth.supabase_auth import get_current_researcher
        return Depends(get_current_researcher)
    else:
        return Depends(get_mock_user)

# ========================================================================
# HELPER FUNCTION FOR UUID CONVERSION
# ========================================================================
def ensure_valid_uuid(user_id: str) -> str:
    """
    Ensures the user ID is a valid UUID format.
    If not, generates a deterministic UUID v5 from the user ID.
    """
    try:
        uuid.UUID(user_id)
        return user_id
    except ValueError:
        namespace = uuid.UUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8')
        return str(uuid.uuid5(namespace, user_id))

# ========================================================================
# LIFESPAN MANAGEMENT
# ========================================================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handles application startup and shutdown."""
    print("🚀 AI Interviewer Agent API starting up...")
    
    if ENABLE_AUTH:
        print("🔒 Authentication: ENABLED")
    else:
        print("🔓 Authentication: DISABLED (using mock user)")
    
    # Seed default templates
    for template_id, template in TEMPLATE_REGISTRY.items():
        try:
            existing = await db_client.get_template(template_id)
            if not existing:
                template_dict = template.model_dump() if hasattr(template, 'model_dump') else template
                await db_client.save_template(template_dict)
                print(f"✅ Seeded template: {template_dict.get('research_topic', template_id)}")
            else:
                print(f"⭐️ Template '{template_id}' already exists")
        except Exception as e:
            print(f"⚠️ Error seeding template '{template_id}': {e}")
    
    print("✅ Server ready!")
    yield
    print("👋 Shutting down...")

# ========================================================================
# FASTAPI APP INITIALIZATION
# ========================================================================
app = FastAPI(
    title="AI Interview Agent Service",
    description="Intelligent interview agent with voice support",
    version="2.0.0",
    lifespan=lifespan
)

# CORS middleware
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

class StartInterviewRequest(BaseModel):
    session_id: Optional[str] = None
    template_id: Optional[str] = None
    starter_questions: Optional[List[str]] = None

class StartInterviewResponse(BaseModel):
    success: bool
    session_id: str
    template_id: str
    first_question: str
    audio_url: Optional[str] = None

class ChatRequest(BaseModel):
    session_id: str
    message: str
    audio_base64: Optional[str] = None

class ProgressInfo(BaseModel):
    current: int
    total: int

class ChatResponse(BaseModel):
    success: bool
    next_question: Optional[str] = None
    audio_url: Optional[str] = None
    is_probe: bool = False
    sentiment: str = "neutral"
    progress: ProgressInfo
    is_complete: bool = False

class TranscriptMessage(BaseModel):
    role: str
    message: str
    timestamp: str

class EndInterviewRequest(BaseModel):
    session_id: str

class EndInterviewResponse(BaseModel):
    success: bool
    transcript: List[TranscriptMessage]
    summary: str
    sentiment_score: float
    key_themes: List[str]
    total_duration_seconds: int

class HealthResponse(BaseModel):
    status: str
    openai_connected: bool
    redis_connected: bool
    auth_enabled: bool

class TemplateListResponse(BaseModel):
    success: bool
    templates: List[Dict[str, Any]]

# ========================================================================
# AGENT SERVICE ENDPOINTS
# ========================================================================

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)

@app.get("/agent/health", response_model=HealthResponse, tags=["Agent"])
async def health_check():
    """Health check endpoint."""
    redis_ok = False
    try:
        redis_client.client.ping()
        redis_ok = True
    except Exception:
        pass
    
    openai_ok = bool(config.CEREBRAS_API_KEY)
    
    return HealthResponse(
        status="ok" if (redis_ok and openai_ok) else "degraded",
        openai_connected=openai_ok,
        redis_connected=redis_ok,
        auth_enabled=ENABLE_AUTH
    )

@app.get("/agent/templates", response_model=TemplateListResponse, tags=["Agent"])
async def list_available_templates(current_user: User = get_user_dependency()):
    """List all available templates."""
    try:
        templates = await db_client.get_all_templates()
        return TemplateListResponse(success=True, templates=templates)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch templates: {str(e)}")

@app.post("/agent/start", response_model=StartInterviewResponse, tags=["Agent"])
async def start_interview(
    request: StartInterviewRequest,
    current_user: User = get_user_dependency()
):
    """Starts a new interview session."""
    try:
        session_id = request.session_id or str(uuid.uuid4())
        print(f"📋 Session ID: {session_id}")
        
        if request.template_id:
            template_id = request.template_id
        else:
            all_templates = await db_client.get_all_templates()
            if not all_templates:
                raise HTTPException(status_code=500, detail="No templates available")
            template_id = all_templates[0]["template_id"]
        
        template = await db_client.get_template(template_id)
        if not template:
            raise HTTPException(status_code=404, detail=f"Template '{template_id}' not found")
        
        respondent_id = ensure_valid_uuid(str(current_user.id))
        
        starter_questions = request.starter_questions or template["starter_questions"]
        if not starter_questions:
            raise HTTPException(status_code=400, detail="No starter questions available")
        
        initial_state = InterviewState(
            session_id=session_id,
            respondent_id=respondent_id,
            template_id=template_id,
            research_topic=template["research_topic"],
            max_questions=template["max_questions"],
            conversation_history=[],
            current_question_count=1,
            is_complete=False,
            probe_count=0
        )
        
        first_question = starter_questions[0]
        
        initial_state.conversation_history.append({
            "role": "assistant",
            "content": first_question
        })
        
        await db_client.save_interview_session(initial_state)
        redis_client.save_conversation_context(session_id, initial_state)
        
        print(f"✅ Interview started: {session_id}")
        
        return StartInterviewResponse(
            success=True,
            session_id=session_id,
            template_id=template_id,
            first_question=first_question,
            audio_url=None
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error starting interview: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to start interview: {str(e)}")

@app.post("/agent/chat", response_model=ChatResponse, tags=["Agent"])
async def chat(
    request: ChatRequest,
    current_user: User = get_user_dependency()
):
    """Main interview loop."""
    try:
        context = redis_client.get_conversation_context(request.session_id)
        if not context:
            raise HTTPException(status_code=404, detail="Session not found")
        
        user_uuid = ensure_valid_uuid(str(current_user.id))
        if context.respondent_id != user_uuid:
            raise HTTPException(status_code=403, detail="Access denied")
        
        user_message = request.message
        
        graph_input: InterviewGraphState = {
            "session_id": context.session_id,
            "respondent_id": context.respondent_id,
            "template_id": context.template_id,
            "research_topic": context.research_topic,
            "conversation_history": context.conversation_history,
            "user_response": user_message,
            "current_question": None,
            "analyzed_response": None,
            "deep_analysis": None,
            "is_probe": False,
            "is_complete": False,
            "should_terminate_early": False,
            "termination_reason": None,
            "probe_count": context.probe_count,
            "question_count": context.current_question_count,
            "total_exchanges": len(context.conversation_history),
            "max_questions": context.max_questions,
            "summary": None
        }
        
        final_state = await interview_workflow.ainvoke(graph_input)
        
        sentiment = "neutral"
        if final_state.get("analyzed_response"):
            analyzed = final_state["analyzed_response"]
            if hasattr(analyzed, 'sentiment'):
                sentiment = analyzed.sentiment.value
            elif isinstance(analyzed, dict):
                sentiment = analyzed.get("sentiment", "neutral")
        
        updated_state = InterviewState(
            session_id=context.session_id,
            respondent_id=context.respondent_id,
            template_id=context.template_id,
            research_topic=context.research_topic,
            conversation_history=final_state.get("conversation_history", context.conversation_history),
            current_question_count=final_state.get("question_count", context.current_question_count),
            max_questions=context.max_questions,
            is_complete=final_state.get("is_complete", False),
            probe_count=final_state.get("probe_count", context.probe_count),
            should_terminate_early=final_state.get("should_terminate_early", False),
            termination_reason=final_state.get("termination_reason")
        )
        
        redis_client.save_conversation_context(request.session_id, updated_state)
        
        await db_client.update_interview_session(
            request.session_id,
            updated_state.model_dump()
        )
        
        is_complete = final_state.get("is_complete", False)
        
        return ChatResponse(
            success=True,
            next_question=final_state.get("current_question"),
            audio_url=None,
            is_probe=final_state.get("is_probe", False),
            sentiment=sentiment,
            progress=ProgressInfo(
                current=updated_state.current_question_count,
                total=updated_state.max_questions
            ),
            is_complete=is_complete
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in chat: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error processing response: {str(e)}")

@app.post("/agent/end", response_model=EndInterviewResponse, tags=["Agent"])
async def end_interview(
    request: EndInterviewRequest,
    current_user: User = get_user_dependency()
):
    """Ends the interview and returns transcript and summary."""
    try:
        session = await db_client.get_interview_session(request.session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Interview session not found")
        
        user_uuid = ensure_valid_uuid(str(current_user.id))
        if session.get("respondent_id") != user_uuid:
            raise HTTPException(status_code=403, detail="Access denied")
        
        summary_data = await db_client.get_summary(request.session_id)
        
        if not summary_data:
            context = redis_client.get_conversation_context(request.session_id)
            if not context:
                context = InterviewState(**session)
            
            analyzed_responses = await db_client.get_analyzed_responses(request.session_id)
            
            from agents.summary import summary_agent
            summary_obj = await summary_agent.generate_summary(
                context,
                analyzed_responses,
                early_termination=session.get("should_terminate_early", False),
                termination_reason=session.get("termination_reason")
            )
            
            await db_client.save_summary(summary_obj)
            summary_data = summary_obj.model_dump()
        
        conversation_history = session.get("conversation_history", [])
        transcript = []
        
        created_at = session.get("created_at")
        if isinstance(created_at, str):
            start_time = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
        else:
            start_time = datetime.now()
        
        current_time = start_time
        
        for msg in conversation_history:
            role = "agent" if msg["role"] == "assistant" else "user"
            transcript.append(TranscriptMessage(
                role=role,
                message=msg["content"],
                timestamp=current_time.isoformat()
            ))
            from datetime import timedelta
            current_time = current_time + timedelta(seconds=15)
        
        total_duration = (current_time - start_time).total_seconds()
        
        sentiment_dist = summary_data.get("sentiment_distribution", {})
        positive = sentiment_dist.get("positive", 0)
        neutral = sentiment_dist.get("neutral", 0)
        negative = sentiment_dist.get("negative", 0)
        total_sentiments = positive + neutral + negative
        
        if total_sentiments > 0:
            sentiment_score = (positive * 1.0 + neutral * 0.5 + negative * 0.0) / total_sentiments
        else:
            sentiment_score = 0.5
        
        key_themes = summary_data.get("key_insights", [])[:10]
        
        await db_client.update_interview_status(request.session_id, "completed")
        redis_client.delete_session(request.session_id)
        
        return EndInterviewResponse(
            success=True,
            transcript=transcript,
            summary=summary_data.get("conversation_summary", "No summary available"),
            sentiment_score=round(sentiment_score, 2),
            key_themes=key_themes,
            total_duration_seconds=int(total_duration)
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error ending interview: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to end interview: {str(e)}")

# ========================================================================
# RESEARCHER ENDPOINTS
# ========================================================================

@app.get("/researcher/templates", tags=["Researcher"])
async def list_templates(current_user: User = get_researcher_dependency()):
    """Lists all available interview templates."""
    templates = await db_client.get_all_templates()
    return {"success": True, "templates": templates}

@app.post("/researcher/templates", tags=["Researcher"])
async def create_template(
    template: InterviewTemplate,
    current_user: User = get_researcher_dependency()
):
    """Creates a new interview template."""
    template.created_by = ensure_valid_uuid(str(current_user.id))
    
    if not template.template_id:
        template.template_id = str(uuid.uuid4())
    
    try:
        template_dict = template.model_dump() if hasattr(template, 'model_dump') else template
        await db_client.save_template(template_dict)
        return {"success": True, "template": template_dict}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create template: {str(e)}")

@app.get("/researcher/dashboard", tags=["Researcher"])
async def get_dashboard_analytics(current_user: User = get_researcher_dependency()):
    """Gets aggregate analytics."""
    try:
        user_uuid = ensure_valid_uuid(str(current_user.id))
        analytics = await db_client.get_researcher_analytics(user_uuid)
        termination_stats = await db_client.get_termination_stats()
        
        return {
            "success": True,
            "researcher_id": user_uuid,
            "analytics": analytics,
            "termination_stats": termination_stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get analytics: {str(e)}")

@app.get("/researcher/interviews", tags=["Researcher"])
async def list_all_interviews(
    current_user: User = get_researcher_dependency(),
    limit: int = 100
):
    """Lists all interviews."""
    user_uuid = ensure_valid_uuid(str(current_user.id))
    interviews = await db_client.get_all_interviews_for_user(user_uuid, limit)
    return {"success": True, "interviews": interviews}

@app.get("/researcher/interview/{session_id}/details", tags=["Researcher"])
async def get_interview_details(
    session_id: str,
    current_user: User = get_researcher_dependency()
):
    """Gets detailed information about a specific interview."""
    session = await db_client.get_interview_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    responses = await db_client.get_analyzed_responses(session_id)
    
    summary = None
    if session.get("is_complete"):
        summary = await db_client.get_summary(session_id)
    
    return {
        "success": True,
        "session": session,
        "analyzed_responses": responses,
        "summary": summary
    }

# ========================================================================
# DEBUG ENDPOINTS
# ========================================================================

@app.get("/debug/templates", tags=["Debug"])
async def debug_list_templates():
    """Debug: List all templates without auth."""
    templates = await db_client.get_all_templates()
    return {"success": True, "templates": templates}

@app.get("/debug/session/{session_id}", tags=["Debug"])
async def debug_get_session(session_id: str):
    """Debug: Get session info without auth."""
    session = await db_client.get_interview_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"success": True, "session": session}

# ========================================================================
# APPLICATION ENTRY POINT
# ========================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8001,
        log_level="info"
    )
