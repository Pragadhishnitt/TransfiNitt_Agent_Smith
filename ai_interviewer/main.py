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
    title="AI Interview Agent Service",
    description="Simple interview agent that receives template data from backend",
    version="1.0.0"
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

class HealthResponse(BaseModel):
    status: str
    groq_connected: bool
    redis_connected: bool

# ========================================================================
# HELPER FUNCTIONS
# ========================================================================

def analyze_sentiment(text: str) -> str:
    """Simple sentiment analysis"""
    positive_words = ["good", "great", "excellent", "love", "enjoy", "amazing", "wonderful", "fantastic"]
    negative_words = ["bad", "terrible", "hate", "awful", "disappointed", "frustrated", "angry"]
    
    text_lower = text.lower()
    positive_count = sum(1 for word in positive_words if word in text_lower)
    negative_count = sum(1 for word in negative_words if word in text_lower)
    
    if positive_count > negative_count:
        return "positive"
    elif negative_count > positive_count:
        return "negative"
    else:
        return "neutral"

def is_vague_response(text: str) -> bool:
    """Check if response is vague and needs probing"""
    vague_words = ["okay", "fine", "sometimes", "maybe", "not sure", "i guess", "probably", "kinda", "sort of"]
    return any(word in text.lower() for word in vague_words)

def generate_question_with_groq(conversation_history: List[Dict], is_probe: bool = False) -> str:
    """Generate next question using Groq"""
    system_prompt = """You are a friendly market researcher conducting an interview.
    Guidelines:
    - Ask open-ended questions
    - Be conversational and warm
    - If the user gave a vague answer, ask them to elaborate with a specific example
    - Keep questions concise (1-2 sentences)
    - Ask follow-up questions based on their responses
    """
    
    if is_probe:
        system_prompt += "\nThe user gave a vague answer. Ask them to elaborate with a specific example."
    
    messages = [{"role": "system", "content": system_prompt}]
    
    # Add conversation history
    for msg in conversation_history[-10:]:  # Last 10 messages for context
        role = "assistant" if msg["role"] == "agent" else "user"
        messages.append({"role": role, "content": msg["message"]})
    
    try:
        response = groq_client.chat.completions.create(
            model=config.GROQ_FAST_MODEL,
            messages=messages,
            max_tokens=80,
            temperature=0.3
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Groq error: {e}")
        return "Could you tell me more about that?"

def generate_summary_with_groq(conversation_history: List[Dict]) -> tuple[str, List[str]]:
    """Generate summary and key themes using Groq"""
    user_responses = " ".join([msg["message"] for msg in conversation_history if msg["role"] == "user"])
    
    summary_prompt = f"""Summarize this interview in 2-3 sentences:
    {user_responses}
    """
    
    themes_prompt = f"""Extract 3-5 key themes from this interview:
    {user_responses}
    
    Return as JSON array: ["theme1", "theme2", "theme3"]
    """
    
    try:
        # Generate summary
        summary_response = groq_client.chat.completions.create(
            model=config.GROQ_QUALITY_MODEL,
            messages=[{"role": "user", "content": summary_prompt}],
            max_tokens=150,
            temperature=0.2
        )
        summary = summary_response.choices[0].message.content.strip()
        
        # Generate themes
        themes_response = groq_client.chat.completions.create(
            model=config.GROQ_QUALITY_MODEL,
            messages=[{"role": "user", "content": themes_prompt}],
            max_tokens=100,
            temperature=0.1
        )
        themes_text = themes_response.choices[0].message.content.strip()
        
        # Parse themes
        try:
            key_themes = json.loads(themes_text)
        except:
            # Fallback if JSON parsing fails
            key_themes = ["user preferences", "daily habits", "product usage"]
        
        return summary, key_themes
    
    except Exception as e:
        print(f"Summary generation error: {e}")
        return "Interview completed successfully.", ["general feedback", "user experience"]

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
    """Start a new interview session."""
    try:
        session_id = request.session_id
        
        # 1. Initialize conversation in Redis
        conversation = []
        redis_client.set(
            f"session:{session_id}:conversation",
            json.dumps(conversation),
            ex=86400  # 24 hour expiry
        )
        
        # 2. Set metadata
        metadata = {
            "current_question": 1,
            "total_questions": 15,
            "started_at": datetime.now().isoformat(),
            "template_id": request.template_id
        }
        redis_client.set(
            f"session:{session_id}:metadata",
            json.dumps(metadata),
            ex=86400
        )
        
        # 3. Create first question
        first_question = f"Hi! Let's talk about your habits. {request.starter_questions[0]}"
        
        # 4. Save first message to conversation
        conversation.append({
            "role": "agent",
            "message": first_question,
            "timestamp": datetime.now().isoformat()
        })
        
        redis_client.set(
            f"session:{session_id}:conversation",
            json.dumps(conversation)
        )
        
        return StartResponse(
            success=True,
            first_question=first_question,
            audio_url=None
        )
    
    except Exception as e:
        print(f"Error starting interview: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to start interview: {str(e)}")

@app.post("/agent/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Main interview chat endpoint."""
    try:
        session_id = request.session_id
        user_message = request.message
        
        # 1. Retrieve conversation history from Redis
        conversation_json = redis_client.get(f"session:{session_id}:conversation")
        if not conversation_json:
            raise HTTPException(status_code=404, detail="Session not found")
        
        conversation = json.loads(conversation_json)
        
        metadata_json = redis_client.get(f"session:{session_id}:metadata")
        if not metadata_json:
            raise HTTPException(status_code=404, detail="Session metadata not found")
        
        metadata = json.loads(metadata_json)
        
        # 2. Add user's message to conversation
        conversation.append({
            "role": "user",
            "message": user_message,
            "timestamp": datetime.now().isoformat()
        })
        
        # 3. Analyze sentiment and check if probing is needed
        sentiment = analyze_sentiment(user_message)
        is_vague = is_vague_response(user_message)
        
        # 4. Generate next question
        next_question = generate_question_with_groq(conversation, is_vague)
        
        # 5. Add AI's question to conversation
        conversation.append({
            "role": "agent",
            "message": next_question,
            "timestamp": datetime.now().isoformat(),
            "sentiment": sentiment,
            "is_probe": is_vague
        })
        
        # 6. Update metadata
        metadata['current_question'] += 1
        
        # 7. Check if interview should end (15 questions reached)
        is_complete = metadata['current_question'] >= metadata['total_questions']
        
        # 8. Save back to Redis
        redis_client.set(
            f"session:{session_id}:conversation",
            json.dumps(conversation),
            ex=86400
        )
        
        redis_client.set(
            f"session:{session_id}:metadata",
            json.dumps(metadata),
            ex=86400
        )
        
        return ChatResponse(
            success=True,
            next_question=next_question,
            is_probe=is_vague,
            sentiment=sentiment,
            progress=ProgressInfo(
                current=metadata['current_question'],
                total=metadata['total_questions']
            ),
            is_complete=is_complete
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in chat: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing response: {str(e)}")

@app.post("/agent/end", response_model=EndResponse)
async def end_interview(request: EndRequest):
    """End the interview and return transcript and summary."""
    try:
        session_id = request.session_id
        
        # 1. Get full conversation from Redis
        conversation_json = redis_client.get(f"session:{session_id}:conversation")
        if not conversation_json:
            raise HTTPException(status_code=404, detail="Session not found")
        
        conversation = json.loads(conversation_json)
        
        metadata_json = redis_client.get(f"session:{session_id}:metadata")
        if not metadata_json:
            raise HTTPException(status_code=404, detail="Session metadata not found")
        
        metadata = json.loads(metadata_json)
        
        # 2. Calculate overall sentiment
        sentiments = [msg.get('sentiment', 'neutral') for msg in conversation if msg['role'] == 'user']
        sentiment_scores = {
            'positive': 0.8,
            'neutral': 0.5,
            'negative': 0.2
        }
        avg_sentiment = sum(sentiment_scores.get(s, 0.5) for s in sentiments) / len(sentiments) if sentiments else 0.5
        
        # 3. Generate summary and key themes
        summary, key_themes = generate_summary_with_groq(conversation)
        
        # 4. Calculate duration
        start_time = datetime.fromisoformat(metadata['started_at'])
        duration_seconds = int((datetime.now() - start_time).total_seconds())
        
        # 5. Create transcript
        transcript = []
        for msg in conversation:
            transcript.append(TranscriptMessage(
                role=msg["role"],
                message=msg["message"],
                timestamp=msg["timestamp"]
            ))
        
        # 6. Clean up Redis (optional - can let it expire)
        redis_client.delete(f"session:{session_id}:conversation")
        redis_client.delete(f"session:{session_id}:metadata")
        
        return EndResponse(
            success=True,
            transcript=transcript,
            summary=summary,
            sentiment_score=round(avg_sentiment, 2),
            key_themes=key_themes,
            total_duration_seconds=duration_seconds
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error ending interview: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to end interview: {str(e)}")

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