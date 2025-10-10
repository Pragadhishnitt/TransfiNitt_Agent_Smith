// ============================================
// BACKEND APIs FOR DASHBOARD
// Base URL: http://localhost:5173/localhost:5173
// Auth Header Required: Authorization: Bearer <jwt_token>
// ============================================

// AUTHENTICATION
// ============================================

POST /auth/register
Request:
{
  "email": "researcher@example.com",
  "password": "password123",
  "role": "researcher"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "researcher@example.com",
    "role": "researcher"
  }
}

// ============================================

POST /auth/login
Request:
{
  "email": "researcher@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "researcher@example.com",
    "role": "researcher"
  }
}

// ============================================
// TEMPLATES
// ============================================

GET /templates
Query Params: ?limit=50 (optional)

Response:
{
  "success": true,
  "templates": [
    {
      "id": "uuid",
      "title": "Coffee Study",
      "topic": "Coffee consumption habits",
      "starter_questions": [
        "How often do you drink coffee?",
        "What time of day do you prefer coffee?"
      ],
      "created_at": "2025-10-11T10:00:00Z",
      "interview_count": 5
    }
  ]
}

// ============================================

GET /templates/:id

Response:
{
  "success": true,
  "template": {
    "id": "uuid",
    "title": "Coffee Study",
    "topic": "Coffee consumption habits",
    "starter_questions": [...],
    "created_at": "2025-10-11T10:00:00Z",
    "interview_count": 5
  }
}

// ============================================

POST /templates
Request:
{
  "title": "Coffee Study",
  "topic": "Coffee consumption habits",
  "starter_questions": [
    "How often do you drink coffee?",
    "What time of day do you prefer coffee?"
  ]
}

Response:
{
  "success": true,
  "template": {
    "id": "uuid",
    "title": "Coffee Study",
    "topic": "Coffee consumption habits",
    "starter_questions": [...],
    "created_at": "2025-10-11T10:00:00Z"
  },
  "interview_link": "http://localhost:5174/interview/uuid"
}

// ============================================
// SESSIONS (Interviews)
// ============================================

GET /sessions
Query Params: ?status=completed&limit=50 (optional)

Response:
{
  "success": true,
  "sessions": [
    {
      "id": "uuid",
      "template_id": "uuid",
      "template_title": "Coffee Study",
      "respondent": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "status": "completed", // "active" | "completed" | "abandoned"
      "sentiment_score": 0.75,
      "started_at": "2025-10-11T10:00:00Z",
      "completed_at": "2025-10-11T10:05:00Z",
      "duration_seconds": 300
    }
  ]
}

// ============================================

GET /sessions/:id

Response:
{
  "success": true,
  "session": {
    "id": "uuid",
    "template": {
      "id": "uuid",
      "title": "Coffee Study",
      "topic": "Coffee consumption habits"
    },
    "respondent": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "status": "completed",
    "transcript": [
      {
        "role": "agent",
        "message": "How often do you drink coffee?",
        "timestamp": "2025-10-11T10:00:00Z"
      },
      {
        "role": "user",
        "message": "I drink coffee every morning",
        "timestamp": "2025-10-11T10:00:15Z"
      }
    ],
    "summary": "User is a daily coffee drinker who prefers morning consumption...",
    "sentiment_score": 0.75,
    "key_themes": ["morning routine", "convenience", "price sensitivity"],
    "sentiment_breakdown": {
      "positive": 70,
      "neutral": 20,
      "negative": 10
    },
    "started_at": "2025-10-11T10:00:00Z",
    "completed_at": "2025-10-11T10:05:00Z",
    "duration_seconds": 300
  }
}

// ============================================

POST /sessions/start
Request:
{
  "template_id": "uuid",
  "respondent_email": "respondent@example.com" // optional
}

Response:
{
  "success": true,
  "session_id": "uuid",
  "interview_url": "http://localhost:5174/interview/uuid"
}

// ============================================
// RESPONDENTS (Panel Management)
// ============================================

GET /respondents
Query Params: ?limit=50 (optional)

Response:
{
  "success": true,
  "respondents": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "demographics": {
        "age_range": "25-34",
        "location": "New York",
        "occupation": "Software Engineer"
      },
      "participation_count": 5,
      "total_incentives": 25.00,
      "avg_sentiment": 0.8,
      "behavior_tags": ["detailed_responder", "voice_user"]
    }
  ]
}

// ============================================

GET /respondents/:id

Response:
{
  "success": true,
  "respondent": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "demographics": {...},
    "participation_count": 5,
    "total_incentives": 25.00,
    "avg_sentiment": 0.8,
    "behavior_tags": ["detailed_responder"],
    "sessions": [
      {
        "id": "uuid",
        "template_title": "Coffee Study",
        "completed_at": "2025-10-11T10:00:00Z",
        "sentiment_score": 0.75
      }
    ]
  }
}

// ============================================

POST /respondents
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "demographics": {
    "age_range": "25-34",
    "location": "New York",
    "occupation": "Software Engineer"
  }
}

Response:
{
  "success": true,
  "respondent": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "demographics": {...}
  }
}

// ============================================
// INSIGHTS (Analytics Dashboard)
// ============================================

GET /insights/overview
Query Params: ?template_id=uuid (optional, filter by template)

Response:
{
  "success": true,
  "total_interviews": 50,
  "avg_sentiment": 0.75,
  "sentiment_distribution": {
    "positive": 35,
    "neutral": 10,
    "negative": 5
  },
  "top_themes": [
    {
      "theme": "convenience",
      "count": 42,
      "avg_sentiment": 0.8
    },
    {
      "theme": "price sensitivity",
      "count": 38,
      "avg_sentiment": 0.6
    }
  ],
  "completion_rate": 0.85,
  "avg_duration_seconds": 280
}

// ============================================
// SURVEY GENERATION
// ============================================

POST /surveys/generate
Request:
{
  "template_id": "uuid",
  "session_ids": ["uuid1", "uuid2"] // optional, defaults to all sessions for template
}

Response:
{
  "success": true,
  "questions": [
    {
      "type": "scale",
      "question": "On a scale of 1-5, how important is convenience when choosing coffee?",
      "options": [1, 2, 3, 4, 5]
    },
    {
      "type": "multiple_choice",
      "question": "Which type of coffee do you prefer?",
      "options": ["Instant coffee", "Brewed coffee", "Espresso"]
    },
    {
      "type": "yes_no",
      "question": "Do you drink coffee primarily in the morning?"
    }
  ],
  "google_form_url": "https://forms.google.com/..." // optional, if integration built
}

// ============================================
// INCENTIVES
// ============================================

GET /incentives/pending

Response:
{
  "success": true,
  "incentives": [
    {
      "id": "uuid",
      "respondent": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "session_id": "uuid",
      "amount": 5.00,
      "status": "pending"
    }
  ]
}

// ============================================

POST /incentives/:id/pay

Response:
{
  "success": true,
  "incentive": {
    "id": "uuid",
    "status": "paid",
    "paid_at": "2025-10-11T10:00:00Z"
  }
}

























1. GET /interviews/:session_id
   - Called when page loads
   - Gets interview details and validates session
   
2. POST /interviews/:session_id/start
   - Called when user clicks "Start Interview"
   - Returns first question
   
3. POST /interviews/:session_id/message
   - Called every time user sends a response
   - Returns next question OR completion message

// ============================================
// 1. GET INTERVIEW DETAILS
// ============================================
GET http://localhost:8000/api/interviews/abc123-session-id

// Purpose: Load interview info when page opens (before starting)
// No request body needed

Response:
{
  "success": true,
  "session": {
    "id": "abc123-session-id",
    "status": "active",
    "template": {
      "title": "Coffee Consumption Study",
      "description": "Help us understand your coffee drinking habits"
    },
    "estimated_duration_minutes": 10,
    "incentive_amount": 5.00
  }
}

// ============================================
// 2. START INTERVIEW (Get First Question)
// ============================================
POST http://localhost:8000/api/interviews/abc123-session-id/start
Content-Type: application/json

// Purpose: Initialize interview and get Q1 from AI agent

Request Body:
{}


Response:
{
  "success": true,
  "first_question": {
    "text": "Hi! Let's talk about your coffee habits. How often do you drink coffee?",
    "audio_url": "https://storage.example.com/audio/q1.mp3",
    "question_id": "q1"
  },
  "progress": {
    "current": 1,
    "total": 15  // Estimated - may change based on responses
  }
}

// ============================================
// 3. SEND MESSAGE (Answer Question, Get Next Question)
// ============================================

// THIS IS THE MAIN INTERVIEW LOOP
// User answers current question → AI returns next question
// Repeat until is_complete: true

// -------- TEXT MESSAGE EXAMPLE --------
POST http://localhost:8000/api/interviews/abc123-session-id/message
Content-Type: application/json

Request Body:
{
  "message": "I drink coffee every morning",
  "message_type": "text",
  "timestamp": "2025-10-11T14:31:00Z"
}

Response (Next Question):
{
  "success": true,
  "response": {
    "text": "Interesting! What do you typically have with your morning coffee?",
    "audio_url": "https://storage.example.com/audio/q2.mp3",
    "question_id": "q2"
  },
  "is_probe": true,  // true = follow-up question, false = new topic
  "progress": {
    "current": 2,
    "total": 15
  },
  "is_complete": false  // false = continue interview
}


// -------- FINAL RESPONSE (Interview Complete) --------
POST http://localhost:8000/api/interviews/abc123-session-id/message
Content-Type: application/json

Request Body (Last Answer):
{
  "message": "I prefer Starbucks because of their consistency",
  "message_type": "text",
  "timestamp": "2025-10-11T14:45:00Z"
}

Response (Interview Complete):
{
  "success": true,
  "is_complete": true,  // true = interview finished, no more questions
  "summary": "Thank you for sharing your insights about your coffee routine. You drink coffee daily, prefer dark roast with breakfast, and value brand consistency. Your preference for sustainable coffee brands was particularly insightful.",
  "completion_time": "2025-10-11T14:45:00Z",
  "duration_minutes": 12,
  "total_questions": 14,  // Actual number of questions asked
  "incentive": {
    "amount": 5.00,
    "currency": "USD",
    "status": "pending",
    "payment_info": "You will receive $5.00 within 48 hours."
  }
}
















// ============================================
// AGENT SERVICE APIs
// Base URL: http://localhost:8001
// ============================================

// START INTERVIEW
POST /agent/start
Request:
{
  "session_id": "uuid-string",
  "template_id": "uuid-string",
  "starter_questions": [
    "How often do you drink coffee?",
    "What time of day do you prefer coffee?"
  ]
}

Response:
{
  "success": true,
  "first_question": "Hi! Let's talk about your coffee habits. How often do you drink coffee?",
  "audio_url": "https://..." // optional, if TTS enabled
}

// ============================================

// SEND MESSAGE (Main Interview Loop)
POST /agent/chat
Request:
{
  "session_id": "uuid-string",
  "message": "I drink coffee every morning",
  "audio_base64": "..." // optional, if user sent voice
}

Response:
{
  "success": true,
  "next_question": "Interesting! What do you typically have with your morning coffee?",
  "audio_url": "https://...", // optional, TTS audio
  "is_probe": true, // true if follow-up question
  "sentiment": "positive", // "positive" | "neutral" | "negative"
  "progress": {
    "current": 3,
    "total": 15
  },
  "is_complete": false
}

// ============================================

// END INTERVIEW
POST /agent/end
Request:
{
  "session_id": "uuid-string"
}

Response:
{
  "success": true,
  "transcript": [
    {
      "role": "agent",
      "message": "How often do you drink coffee?",
      "timestamp": "2025-10-11T10:00:00Z"
    },
    {
      "role": "user",
      "message": "I drink coffee every morning",
      "timestamp": "2025-10-11T10:00:15Z"
    }
  ],
  "summary": "User is a daily coffee drinker who prefers morning consumption...",
  "sentiment_score": 0.75, // 0.00 to 1.00
  "key_themes": ["morning routine", "convenience", "price sensitivity"],
  "total_duration_seconds": 300
}

// ============================================

// HEALTH CHECK
GET /agent/health

Response:
{
  "status": "ok",
  "openai_connected": true,
  "redis_connected": true
}




