from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from contextlib import asynccontextmanager
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
# LIFESPAN MANAGEMENT
# ========================================================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles application startup and shutdown.
    Seeds default templates on startup.
    """
    print("🚀 AI Interviewer API starting up...")
    
    # Seed default templates
    for template_id, template in TEMPLATE_REGISTRY.items():
        try:
            existing = await db_client.get_template(template_id)
            if not existing:
                await db_client.save_template(template)
                print(f"✅ Seeded template: {template.research_topic}")
            else:
                print(f"⏭️  Template '{template_id}' already exists")
        except Exception as e:
            print(f"⚠️  Error seeding template '{template_id}': {e}")
    
    print("✅ Server ready!")
    yield
    print("👋 Shutting down...")

# ========================================================================
# FASTAPI APP INITIALIZATION
# ========================================================================
app = FastAPI(
    title="AI Market Research Agent API",
    description="An intelligent API for conducting automated, in-depth market research interviews using LangGraph.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========================================================================
# REQUEST/RESPONSE MODELS
# ========================================================================

class StartInterviewRequest(BaseModel):
    template_id: str

class StartInterviewResponse(BaseModel):
    session_id: str
    question: str
    question_number: int
    max_questions: int
    research_topic: str

class ChatRequest(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    session_id: str
    question: Optional[str] = None
    is_probe: bool = False
    is_complete: bool = False
    summary: Optional[dict] = None
    message: Optional[str] = None

# ========================================================================
# API ENDPOINTS
# ========================================================================

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)

@app.get("/", tags=["Health"])
async def root():
    """Health check endpoint."""
    return {
        "status": "running",
        "service": "AI Market Research Agent API",
        "version": "1.0.0"
    }

# ------------------------------------------------------------------------
# INTERVIEW ENDPOINTS (For Respondents)
# ------------------------------------------------------------------------

@app.post("/interview/start", response_model=StartInterviewResponse, tags=["Interview"])
async def start_interview(
    request: StartInterviewRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Starts a new interview session for an authenticated user.
    Returns the first question.
    """
    # Get template
    template = await db_client.get_template(request.template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Interview template not found")
    
    # Create new session
    session_id = str(uuid.uuid4())
    respondent_id = str(current_user.id)
    
    # Initialize state
    initial_state = InterviewState(
        session_id=session_id,
        respondent_id=respondent_id,
        template_id=request.template_id,
        research_topic=template.research_topic,
        max_questions=template.max_questions,
        conversation_history=[],
        current_question_count=1,
        is_complete=False,
        probe_count=0
    )
    
    # Get first question from template
    first_question = template.starter_questions[0]
    initial_state.conversation_history.append({
        "role": "assistant",
        "content": first_question
    })
    
    # Save to database and Redis
    await db_client.save_interview_session(initial_state)
    redis_client.save_conversation_context(session_id, initial_state)
    
    return StartInterviewResponse(
        session_id=session_id,
        question=first_question,
        question_number=1,
        max_questions=template.max_questions,
        research_topic=template.research_topic
    )

@app.post("/interview/chat", response_model=ChatResponse, tags=["Interview"])
async def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Processes a user's response and returns the next question or summary.
    This endpoint routes through the LangGraph workflow.
    """
    # Get session from Redis
    context = redis_client.get_conversation_context(request.session_id)
    if not context:
        raise HTTPException(status_code=404, detail="Interview session not found or expired")
    
    # Verify user owns this session
    if context.respondent_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Access denied to this interview session")
    
    # Prepare graph input state
    graph_input: InterviewGraphState = {
        "session_id": context.session_id,
        "respondent_id": context.respondent_id,
        "template_id": context.template_id,
        "research_topic": context.research_topic,
        "conversation_history": context.conversation_history,
        "user_response": request.message,
        "current_question": None,
        "analyzed_response": None,
        "deep_analysis": None,
        "is_probe": False,
        "is_complete": False,
        "probe_count": context.probe_count,
        "question_count": context.current_question_count,
        "max_questions": context.max_questions,
        "summary": None
    }
    
    # Run through LangGraph workflow
    try:
        final_state = await interview_workflow.ainvoke(graph_input)
    except Exception as e:
        print(f"Error in workflow: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing response: {str(e)}")
    
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
        probe_count=final_state.get("probe_count", context.probe_count)
    )
    
    redis_client.save_conversation_context(request.session_id, updated_state)
    
    # Update database
    await db_client.update_interview_session(
        request.session_id,
        updated_state.model_dump()
    )
    
    # Prepare response
    response = ChatResponse(
        session_id=request.session_id,
        question=final_state.get("current_question"),
        is_probe=final_state.get("is_probe", False),
        is_complete=final_state.get("is_complete", False),
        summary=final_state.get("summary")
    )
    
    # Add completion message if done
    if response.is_complete:
        response.message = "Interview completed! Thank you for your time and insights."
    
    return response

@app.get("/interview/{session_id}/status", tags=["Interview"])
async def get_interview_status(
    session_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Gets the current status of an interview session.
    """
    context = redis_client.get_conversation_context(session_id)
    if not context:
        # Try database if not in Redis
        context = await db_client.get_interview_session(session_id)
        if not context:
            raise HTTPException(status_code=404, detail="Interview session not found")
    
    if context.respondent_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    return {
        "session_id": session_id,
        "is_complete": context.is_complete,
        "current_question": context.current_question_count,
        "max_questions": context.max_questions,
        "progress": (context.current_question_count / context.max_questions) * 100
    }

@app.get("/interview/{session_id}/summary", tags=["Interview"])
async def get_interview_summary(
    session_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves the final summary for a completed interview.
    """
    # Check session ownership
    session = await db_client.get_interview_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found")
    
    if session.respondent_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="Access denied")
    
    if not session.is_complete:
        raise HTTPException(status_code=400, detail="Interview not yet completed")
    
    # Get summary
    summary = await db_client.get_summary(session_id)
    if not summary:
        raise HTTPException(status_code=404, detail="Summary not found")
    
    return summary.model_dump()

# ------------------------------------------------------------------------
# RESEARCHER ENDPOINTS (Protected)
# ------------------------------------------------------------------------

@app.get("/researcher/templates", response_model=List[InterviewTemplate], tags=["Researcher"])
async def list_templates(current_user: User = Depends(get_current_researcher)):
    """
    Lists all available interview templates.
    Requires researcher role.
    """
    templates = await db_client.get_all_templates()
    return templates

@app.post("/researcher/templates", response_model=InterviewTemplate, tags=["Researcher"])
async def create_template(
    template: InterviewTemplate,
    current_user: User = Depends(get_current_researcher)
):
    """
    Creates a new interview template.
    Requires researcher role.
    """
    # Set creator
    template.created_by = str(current_user.id)
    
    # Generate ID if not provided
    if not template.template_id:
        template.template_id = str(uuid.uuid4())
    
    # Save to database
    try:
        await db_client.save_template(template)
        return template
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create template: {str(e)}")

@app.get("/researcher/dashboard", tags=["Researcher"])
async def get_dashboard_analytics(current_user: User = Depends(get_current_researcher)):
    """
    Gets aggregate analytics for the researcher's dashboard.
    Requires researcher role.
    """
    try:
        analytics = await db_client.get_researcher_analytics(str(current_user.id))
        return {
            "researcher_id": str(current_user.id),
            "analytics": analytics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get analytics: {str(e)}")

@app.get("/researcher/interviews", tags=["Researcher"])
async def list_all_interviews(
    current_user: User = Depends(get_current_researcher),
    limit: int = 100,
    template_id: Optional[str] = None
):
    """
    Lists all interviews, optionally filtered by template.
    Requires researcher role.
    """
    # For now, just return all interviews
    # In production, you'd want to filter by templates owned by this researcher
    interviews = await db_client.get_all_interviews_for_user(str(current_user.id), limit)
    return {"interviews": interviews}

@app.get("/researcher/interview/{session_id}/details", tags=["Researcher"])
async def get_interview_details(
    session_id: str,
    current_user: User = Depends(get_current_researcher)
):
    """
    Gets detailed information about a specific interview.
    Requires researcher role.
    """
    # Get session
    session = await db_client.get_interview_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    # Get analyzed responses
    responses = await db_client.get_analyzed_responses(session_id)
    
    # Get summary if complete
    summary = None
    if session.is_complete:
        summary = await db_client.get_summary(session_id)
    
    return {
        "session": session.model_dump(),
        "analyzed_responses": [r.model_dump() for r in responses],
        "summary": summary.model_dump() if summary else None
    }

# ------------------------------------------------------------------------
# ADMIN/DEBUG ENDPOINTS (Remove in production!)
# ------------------------------------------------------------------------

@app.get("/debug/templates", tags=["Debug"])
async def debug_list_templates():
    """Debug: List all templates without auth."""
    templates = await db_client.get_all_templates()
    return {"templates": [t.model_dump() for t in templates]}

@app.get("/debug/sessions", tags=["Debug"])
async def debug_list_sessions():
    """Debug: List recent sessions without auth."""
    # This is dangerous in production! Remove or secure properly.
    return {"message": "Not implemented for security"}

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