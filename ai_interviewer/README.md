# AI Interviewer Agent Service

A simplified FastAPI service that provides intelligent interview capabilities. The backend calls this service with template data and starter questions, and the agent handles the conversation flow.

## Features

- **Simple API**: Just 3 endpoints - start, chat, end
- **Fast Inference**: Uses Groq for ultra-fast LLM responses
- **Redis Storage**: Lightweight conversation storage
- **No Authentication**: Backend handles auth, agent focuses on conversation
- **Sentiment Analysis**: Basic sentiment tracking
- **Automatic Probing**: Detects vague responses and asks follow-ups

## API Endpoints

### POST `/agent/start`
Start a new interview session.

**Request:**
```json
{
  "session_id": "abc-123",
  "template_id": "template-xyz", 
  "starter_questions": ["How often do you drink coffee?", "What time do you prefer?"]
}
```

**Response:**
```json
{
  "success": true,
  "first_question": "Hi! Let's talk about your habits. How often do you drink coffee?",
  "audio_url": null
}
```

### POST `/agent/chat`
Continue the interview conversation.

**Request:**
```json
{
  "session_id": "abc-123",
  "message": "I drink coffee every morning with breakfast"
}
```

**Response:**
```json
{
  "success": true,
  "next_question": "That's interesting! What do you typically have with your coffee?",
  "is_probe": false,
  "sentiment": "positive",
  "progress": {"current": 2, "total": 15},
  "is_complete": false
}
```

### POST `/agent/end`
End the interview and get summary.

**Request:**
```json
{
  "session_id": "abc-123"
}
```

**Response:**
```json
{
  "success": true,
  "transcript": [...],
  "summary": "User is a daily coffee drinker...",
  "sentiment_score": 0.75,
  "key_themes": ["morning routine", "convenience"],
  "total_duration_seconds": 420
}
```

### GET `/agent/health`
Health check endpoint.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set environment variables:
```bash
export GROQ_API_KEY="your-groq-api-key"
export REDIS_HOST="localhost"  # optional
export REDIS_PORT="6379"       # optional
```

3. Start Redis (if not running):
```bash
redis-server
```

4. Run the service:
```bash
python main.py
```

Or use the convenient startup script:
```bash
./start_agent.sh
```

The service will start on `http://localhost:8001`

## Testing

Run the test script to verify everything works:
```bash
python test_api.py
```

## Architecture

The agent service is intentionally simple:

1. **Backend calls `/agent/start`** with session_id, template_id, and starter_questions
2. **Agent stores conversation in Redis** and returns first question
3. **Backend calls `/agent/chat`** with user messages
4. **Agent generates next questions** using Groq, handles probing, tracks sentiment
5. **Backend calls `/agent/end`** when interview is complete
6. **Agent returns full transcript, summary, and analysis**

No complex orchestration, no backend communication, no authentication - just pure conversation intelligence.
