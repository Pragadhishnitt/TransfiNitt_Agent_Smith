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
from auth.supabase_auth import get_current_user, get_current_researcher, User
from graph.workflow import interview_workflow, InterviewGraphState

# ========================================================================
# HELPER FUNCTION FOR UUID CONVERSION
# ========================================================================
def ensure_valid_uuid(user_id: str) -> str:
    """
    Ensures the user ID is a valid UUID format.
    If not, generates a deterministic UUID v5 from the user ID.
    """
    try:
        # Try to parse as UUID - if successful, return as-is
        uuid.UUID(user_id)
        return user_id
    except ValueError:
        # Not a valid UUID - create deterministic UUID from user ID
        import hashlib
        namespace = uuid.UUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8')  # DNS namespace
        return str(uuid.uuid5(namespace, user_id))

# ========================================================================
# LIFESPAN MANAGEMENT
# ========================================================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handles application startup and shutdown."""
    print("🚀 AI Interviewer Agent API starting up...")
    
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
# REQUEST/RESPONSE MODELS - UPDATED FOR AUTO-GENERATION
# ========================================================================

class StartInterviewRequest(BaseModel):
    """
    UPDATED: session_id and template_id are now optional.
    If not provided, they will be auto-generated.
    """
    session_id: Optional[str] = None  # Auto-generated if not provided
    template_id: Optional[str] = None  # Auto-selected if not provided
    starter_questions: Optional[List[str]] = None

class StartInterviewResponse(BaseModel):
    success: bool
    session_id: str  # Always returned so client knows the session ID
    template_id: str  # Always returned so client knows which template was used
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
    sentiment: str = "neutral"  # "positive" | "neutral" | "negative"
    progress: ProgressInfo
    is_complete: bool = False

class TranscriptMessage(BaseModel):
    role: str  # "agent" | "user"
    message: str
    timestamp: str

class EndInterviewRequest(BaseModel):
    session_id: str

class EndInterviewResponse(BaseModel):
    success: bool
    transcript: List[TranscriptMessage]
    summary: str
    sentiment_score: float  # 0.00 to 1.00
    key_themes: List[str]
    total_duration_seconds: int

class HealthResponse(BaseModel):
    status: str
    openai_connected: bool
    redis_connected: bool

class TemplateListResponse(BaseModel):
    """Response for listing available templates"""
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
    
    # Check Redis connection
    redis_ok = False
    try:
        redis_client.client.ping()
        redis_ok = True
    except Exception:
        pass
    
    # Check OpenAI/Gemini (we're using Gemini)
    openai_ok = bool(config.GEMINI_API_KEY)
    
    return HealthResponse(
        status="ok" if (redis_ok and openai_ok) else "degraded",
        openai_connected=openai_ok,
        redis_connected=redis_ok
    )

@app.get("/agent/templates", response_model=TemplateListResponse, tags=["Agent"])
async def list_available_templates(current_user: User = Depends(get_current_user)):
    """
    NEW ENDPOINT: List all available templates for interview.
    Client can use this to show template options to the user.
    """
    try:
        templates = await db_client.get_all_templates()
        return TemplateListResponse(
            success=True,
            templates=templates
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch templates: {str(e)}")

@app.post("/agent/start", response_model=StartInterviewResponse, tags=["Agent"])
async def start_interview(
    request: StartInterviewRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Starts a new interview session.
    
    UPDATED: Auto-generates session_id and auto-selects template if not provided.
    
    Args:
        session_id: Optional - Auto-generated UUID if not provided
        template_id: Optional - First available template if not provided
        starter_questions: Optional custom starter questions
    
    Returns:
        Session ID, template ID, first question and optional audio URL
    """
    try:
        # AUTO-GENERATE SESSION ID if not provided
        session_id = request.session_id or str(uuid.uuid4())
        print(f"📋 Session ID: {session_id} {'(auto-generated)' if not request.session_id else '(provided)'}")
        
        # AUTO-SELECT TEMPLATE if not provided
        if request.template_id:
            template_id = request.template_id
            print(f"📝 Using provided template: {template_id}")
        else:
            # Get first available template
            all_templates = await db_client.get_all_templates()
            if not all_templates:
                raise HTTPException(
                    status_code=500, 
                    detail="No templates available. Please contact administrator."
                )
            template_id = all_templates[0]["template_id"]
            print(f"📝 Auto-selected template: {template_id} ({all_templates[0].get('research_topic', 'Unknown')})")
        
        # Get template
        template = await db_client.get_template(template_id)
        if not template:
            raise HTTPException(status_code=404, detail=f"Template '{template_id}' not found")
        
        # FIX: Ensure respondent_id is a valid UUID
        respondent_id = ensure_valid_uuid(str(current_user.id))
        
        # Use custom starter questions if provided, otherwise use template
        starter_questions = request.starter_questions or template["starter_questions"]
        if not starter_questions:
            raise HTTPException(status_code=400, detail="No starter questions available")
        
        # Initialize state
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
        
        # Get first question
        first_question = starter_questions[0]
        
        # Add to conversation history
        initial_state.conversation_history.append({
            "role": "assistant",
            "content": first_question
        })
        
        # Save to database and Redis
        await db_client.save_interview_session(initial_state)
        redis_client.save_conversation_context(session_id, initial_state)
        
        print(f"✅ Interview started successfully!")
        print(f"   - Session: {session_id}")
        print(f"   - Template: {template_id}")
        print(f"   - Topic: {template['research_topic']}")
        print(f"   - First Question: {first_question[:80]}...")
        
        return StartInterviewResponse(
            success=True,
            session_id=session_id,  # Return so client knows the session ID
            template_id=template_id,  # Return so client knows which template
            first_question=first_question,
            audio_url=None  # TODO: Implement TTS if needed
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
    current_user: User = Depends(get_current_user)
):
    """
    Main interview loop - processes user message and returns next question.
    
    Args:
        session_id: Session identifier
        message: User's text response
        audio_base64: Optional voice input (base64 encoded)
    
    Returns:
        Next question, sentiment, progress, and completion status
    """
    try:
        # Get session from Redis
        context = redis_client.get_conversation_context(request.session_id)
        if not context:
            raise HTTPException(
                status_code=404, 
                detail="Interview session not found or expired"
            )
        
        # Verify user owns this session
        user_uuid = ensure_valid_uuid(str(current_user.id))
        if context.respondent_id != user_uuid:
            raise HTTPException(
                status_code=403, 
                detail="Access denied to this interview session"
            )
        
        # TODO: If audio_base64 provided, transcribe it to text
        # For now, we use the text message directly
        user_message = request.message
        
        # Prepare graph input state
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
            "max_questions": context.max_questions,
            "summary": None
        }
        
        # Run through LangGraph workflow
        final_state = await interview_workflow.ainvoke(graph_input)
        
        # Extract sentiment from analyzed response
        sentiment = "neutral"
        if final_state.get("analyzed_response"):
            analyzed = final_state["analyzed_response"]
            if hasattr(analyzed, 'sentiment'):
                sentiment = analyzed.sentiment.value
            elif isinstance(analyzed, dict):
                sentiment = analyzed.get("sentiment", "neutral")
        
        # Update Redis with new state
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
        
        # Update database
        await db_client.update_interview_session(
            request.session_id,
            updated_state.model_dump()
        )
        
        # Prepare response
        is_complete = final_state.get("is_complete", False)
        
        return ChatResponse(
            success=True,
            next_question=final_state.get("current_question"),
            audio_url=None,  # TODO: Implement TTS if needed
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
    current_user: User = Depends(get_current_user)
):
    """
    Ends the interview and returns transcript and summary.
    
    Args:
        session_id: Session identifier
    
    Returns:
        Full transcript, summary, sentiment score, and key themes
    """
    try:
        # Get session from database
        session = await db_client.get_interview_session(request.session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Interview session not found")
        
        # Verify user owns this session
        user_uuid = ensure_valid_uuid(str(current_user.id))
        if session.get("respondent_id") != user_uuid:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Get summary (generate if not exists and interview is complete)
        summary_data = await db_client.get_summary(request.session_id)
        
        if not summary_data:
            # If no summary exists, generate one now
            context = redis_client.get_conversation_context(request.session_id)
            if not context:
                # Reconstruct from database
                context = InterviewState(**session)
            
            # Get analyzed responses
            analyzed_responses = await db_client.get_analyzed_responses(request.session_id)
            
            # Generate summary
            from agents.summary import summary_agent
            summary_obj = await summary_agent.generate_summary(
                context,
                analyzed_responses,
                early_termination=session.get("should_terminate_early", False),
                termination_reason=session.get("termination_reason")
            )
            
            # Save summary
            await db_client.save_summary(summary_obj)
            summary_data = summary_obj.model_dump()
        
        # Build transcript from conversation history
        conversation_history = session.get("conversation_history", [])
        transcript = []
        
        # Calculate start time (approximate)
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
            # Increment time by ~15 seconds per message (rough estimate)
            from datetime import timedelta
            current_time = current_time + timedelta(seconds=15)
        
        # Calculate total duration
        total_duration = (current_time - start_time).total_seconds()
        
        # Calculate sentiment score (0.0 to 1.0)
        sentiment_dist = summary_data.get("sentiment_distribution", {})
        positive = sentiment_dist.get("positive", 0)
        neutral = sentiment_dist.get("neutral", 0)
        negative = sentiment_dist.get("negative", 0)
        total_sentiments = positive + neutral + negative
        
        if total_sentiments > 0:
            # Weighted score: positive=1.0, neutral=0.5, negative=0.0
            sentiment_score = (positive * 1.0 + neutral * 0.5 + negative * 0.0) / total_sentiments
        else:
            sentiment_score = 0.5  # Default neutral
        
        # Extract key themes from insights
        key_themes = summary_data.get("key_insights", [])[:10]  # Top 10
        
        # Mark interview as complete
        await db_client.update_interview_status(request.session_id, "completed")
        
        # Clean up Redis
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
# RESEARCHER ENDPOINTS (LEGACY - Keep for dashboard)
# ========================================================================

@app.get("/researcher/templates", tags=["Researcher"])
async def list_templates(current_user: User = Depends(get_current_researcher)):
    """Lists all available interview templates."""
    templates = await db_client.get_all_templates()
    return {"success": True, "templates": templates}

@app.post("/researcher/templates", tags=["Researcher"])
async def create_template(
    template: InterviewTemplate,
    current_user: User = Depends(get_current_researcher)
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
async def get_dashboard_analytics(current_user: User = Depends(get_current_researcher)):
    """Gets aggregate analytics for the researcher's dashboard."""
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
    current_user: User = Depends(get_current_researcher),
    limit: int = 100
):
    """Lists all interviews."""
    user_uuid = ensure_valid_uuid(str(current_user.id))
    interviews = await db_client.get_all_interviews_for_user(user_uuid, limit)
    return {"success": True, "interviews": interviews}

@app.get("/researcher/interview/{session_id}/details", tags=["Researcher"])
async def get_interview_details(
    session_id: str,
    current_user: User = Depends(get_current_researcher)
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
        port=8000,
        log_level="info"
    )