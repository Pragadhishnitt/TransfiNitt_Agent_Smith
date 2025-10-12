from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any, Tuple
from datetime import datetime
import json
import redis
from groq import Groq
import config

# ========================================================================
# EARLY TERMINATION DETECTOR
# ========================================================================
class EarlyTerminationDetector:
    """Detects signals that user wants to end the interview"""
    
    EXIT_PHRASES = [
        "end this", "end here", "end now", "just end", "lets end", "let's end",
        "stop this", "stop here", "stop now", "finish this", "finish here",
        "conclude", "wrap up", "wrap this up", "stop the interview", 
        "end the interview", "quit the interview", "exit the interview",
        "i want to stop", "i'd like to stop", "i want to end",
        "can we stop", "can we end", "i'm done", "i am done", "im done",
        "that's all", "thats all", "that is all", "no more questions", "no more",
        "i don't want to continue", "i dont want to continue",
        "don't want to continue", "dont want to continue", "not continuing",
        "this is taking too long", "too long", "taking forever", "no time",
        "don't have time", "dont have time", "i'm tired of this", 
        "im tired of this", "tired of this", "fed up", "enough",
        "that's enough", "thats enough",
    ]
    
    NEGATIVE_EMOTION_PHRASES = [
        "not feeling good", "feeling bad", "feeling uncomfortable",
        "this is uncomfortable", "i'm not comfortable", "im not comfortable",
        "not comfortable", "i feel bad", "i'm feeling bad", "not enjoying this",
        "this is annoying", "this is frustrating", "i'm frustrated",
        "im frustrated", "frustrated", "i don't like this", "i dont like this",
        "dont like this", "this is boring", "i'm bored", "im bored", "bored",
        "waste of time", "wasting my time", "not interested",
    ]
    
    STRONG_NEGATIVE_WORDS = [
        "hate", "awful", "terrible", "horrible", "worst",
        "annoyed", "angry", "upset", "stressed", "anxious"
    ]
    
    DISMISSIVE_RESPONSES = [
        "yeah", "yea", "yep", "ok", "okay", "fine", "whatever",
        "sure", "meh", "nah", "nope"
    ]
    
    def check_exit_intent(self, text: str) -> Tuple[bool, str]:
        """Check if user wants to exit the interview."""
        text_lower = text.lower().strip()
        
        # Check for explicit exit phrases
        for phrase in self.EXIT_PHRASES:
            if phrase in text_lower:
                return True, f"explicit_exit: '{phrase}'"
        
        # Check for "no" + exit words together
        if "no" in text_lower:
            exit_words = ["end", "stop", "finish", "quit", "done", "conclude", "wrap"]
            for word in exit_words:
                if word in text_lower:
                    return True, f"negative_exit: 'no + {word}'"
        
        # Check for negative emotions
        for phrase in self.NEGATIVE_EMOTION_PHRASES:
            if phrase in text_lower:
                return True, f"negative_emotion: '{phrase}'"
        
        # Check for strong negative sentiment
        word_count = 0
        words = text_lower.split()
        for word in self.STRONG_NEGATIVE_WORDS:
            if word in words:
                word_count += 1
        
        if word_count >= 2:
            return True, f"strong_negative_sentiment: {word_count} negative words"
        
        return False, ""
    
    def is_very_short_negative(self, text: str, sentiment: str) -> bool:
        """Check if response is very short AND negative"""
        word_count = len(text.split())
        return word_count <= 2 and sentiment == "negative"
    
    def is_repeated_dismissive(
        self, 
        text: str, 
        conversation_history: List[Dict], 
        threshold: int = 2
    ) -> bool:
        """Check if user has given multiple dismissive responses in a row."""
        text_lower = text.lower().strip()
        
        # Check if current response is dismissive
        current_is_dismissive = (
            any(d in text_lower for d in self.DISMISSIVE_RESPONSES) or 
            len(text.split()) <= 2
        )
        
        if not current_is_dismissive:
            return False
        
        # Count recent consecutive dismissive responses
        dismissive_count = 1  # Current response
        
        # Look at last few user responses
        user_responses = [
            msg["message"] for msg in reversed(conversation_history)
            if msg.get("role") == "user"
        ][1:5]  # Skip current (already counted), check last 4
        
        for response in user_responses:
            response_lower = response.lower().strip()
            is_dismissive = (
                any(d in response_lower for d in self.DISMISSIVE_RESPONSES) or
                len(response.split()) <= 2
            )
            
            if is_dismissive:
                dismissive_count += 1
            else:
                break  # Stop at first non-dismissive
        
        return dismissive_count >= threshold
    
    def should_terminate(
        self, 
        text: str, 
        sentiment: str,
        conversation_history: List[Dict],
        consecutive_probes: int = 0,
        max_probes: int = 2
    ) -> Tuple[bool, str]:
        """
        COMPREHENSIVE termination check that considers multiple signals.
        Returns: (should_terminate, reason)
        
        Args:
            text: Current user response
            sentiment: Sentiment of response (positive/negative/neutral)
            conversation_history: Full conversation history
            consecutive_probes: Number of consecutive probe questions asked
            max_probes: Maximum allowed consecutive probes (default: 2)
        """
        # Check 1: Explicit exit intent (highest priority)
        should_exit, reason = self.check_exit_intent(text)
        if should_exit:
            return True, reason
        
        # Check 2: MAX CONSECUTIVE PROBES REACHED (CRITICAL CHECK)
        if consecutive_probes >= max_probes:
            return True, f"probe_limit_reached: {consecutive_probes} consecutive probes without substantial response"
        
        # Check 3: Very short + negative (strong signal)
        if self.is_very_short_negative(text, sentiment):
            return True, "disengagement: very short negative response"
        
        # Check 4: Repeated dismissive responses
        if self.is_repeated_dismissive(text, conversation_history, threshold=2):
            return True, "disengagement: repeated dismissive responses"
        
        # Check 5: Probe fatigue (many probes + still short/vague)
        if consecutive_probes >= 1 and len(text.split()) <= 3:
            return True, f"probe_fatigue: {consecutive_probes} probes with continued minimal responses"
        
        return False, ""

# Initialize detector
early_termination_detector = EarlyTerminationDetector()

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
    description="Interview agent with early termination detection",
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
# CONFIGURATION
# ========================================================================
MAX_CONSECUTIVE_PROBES = 2  # Terminate after 2 consecutive probes

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

def analyze_sentiment(text: str) -> str:
    """Simple sentiment analysis"""
    positive_words = ["good", "great", "excellent", "love", "enjoy", "amazing", "wonderful", "fantastic", "happy", "excited"]
    negative_words = ["bad", "terrible", "hate", "awful", "disappointed", "frustrated", "angry", "annoyed", "upset"]
    
    text_lower = text.lower()
    positive_count = sum(1 for word in positive_words if word in text_lower)
    negative_count = sum(1 for word in negative_words if word in text_lower)
    
    if positive_count > negative_count:
        return "positive"
    elif negative_count > positive_count:
        return "negative"
    else:
        return "neutral"


def score_sentiment(text: str) -> float:
    """
    Produce a numeric sentiment score between 0.0 and 1.0 for a piece of text.
    This is a lightweight heuristic that complements the categorical label from
    `analyze_sentiment`. It counts positive/negative cue words and returns a
    normalized score. Falls back to 0.5 (neutral) when no cues are found.
    """
    positive_words = ["good", "great", "excellent", "love", "enjoy", "amazing", "wonderful", "fantastic", "happy", "excited"]
    negative_words = ["bad", "terrible", "hate", "awful", "disappointed", "frustrated", "angry", "annoyed", "upset"]

    text_lower = text.lower()
    pos = sum(1 for w in positive_words if w in text_lower)
    neg = sum(1 for w in negative_words if w in text_lower)

    # If we found explicit polarity words, compute a normalized score
    total = pos + neg
    if total > 0:
        # raw fraction of positive words
        frac = pos / total
        # map fraction [0,1] to score range [0.10,0.90] to avoid extreme 0/1
        score = 0.1 + 0.8 * frac
        return round(max(0.0, min(1.0, score)), 2)

    # No explicit polarity words found — try heuristic: punctuation, length
    # Short responses more likely neutral; exclamation shows stronger feeling
    exclamation_boost = 0.1 if '!' in text_lower else 0.0
    word_count = len(text_lower.split())
    if word_count <= 2:
        return 0.5 + exclamation_boost

    # Default neutral
    return round(0.5 + exclamation_boost, 2)

def is_vague_response(text: str) -> bool:
    """Check if response is vague and needs probing"""
    word_count = len(text.split())
    vague_words = ["okay", "fine", "sometimes", "maybe", "not sure", "i guess", "probably", "kinda", "sort of", "idk", "dunno"]
    
    # Very short responses are vague
    if word_count <= 3:
        return True
    
    # Check for vague words
    return any(word in text.lower() for word in vague_words)

def generate_probe_question(conversation_history: List[Dict], original_question: str, deviation_type: Optional[str] = None) -> str:
    """Generate a probe question that redirects to the original topic"""
    
    # Get the last user response
    last_user_response = ""
    for msg in reversed(conversation_history):
        if msg["role"] == "user":
            last_user_response = msg["message"]
            break
    
    if deviation_type == "tangent":
        system_prompt = f"""You are a friendly but FIRM market researcher. The user went on a tangent.

ORIGINAL QUESTION: {original_question}
USER'S TANGENT: {last_user_response}

Your job: Gently acknowledge their tangent, then FIRMLY redirect back to the original question.

RULES:
1. Start with: "That's interesting about [their tangent topic]..."
2. Then say: "But let's get back to what I asked about..."
3. Rephrase the ORIGINAL question with specific examples
4. Be warm but assertive - don't let them avoid the question
5. Add emotion: "I'm really curious to understand..." or "I'd love to hear more specifically about..."

Generate your response:"""
    
    elif deviation_type == "completely_off":
        system_prompt = f"""You are a friendly but FIRM market researcher. The user COMPLETELY changed the topic.

ORIGINAL QUESTION: {original_question}
USER'S OFF-TOPIC RESPONSE: {last_user_response}

Your job: Politely but FIRMLY bring them back to the original question.

RULES:
1. Say: "Haha, I appreciate that, but we're getting off track!"
2. Then: "Let me bring us back to the original question..."
3. Rephrase the ORIGINAL question with MORE specific guidance
4. Be friendly but don't let them escape
5. Add emotion: "I'm genuinely curious..." or "I really want to understand..."

Generate your response:"""
    
    else:
        # Standard vague response probe
        system_prompt = f"""You are a friendly market researcher. The user gave a VAGUE answer.

ORIGINAL QUESTION: {original_question}
USER'S VAGUE ANSWER: {last_user_response}

Your job: Get them to elaborate with SPECIFIC EXAMPLES.

RULES:
1. Acknowledge what they said briefly
2. Ask for a SPECIFIC example or detail
3. Use phrases like: "Can you walk me through a specific time when..." or "Give me a concrete example of..."
4. Be warm and encouraging
5. Keep it 1-2 sentences MAX
6. Show genuine interest with emotion: "I'm really curious..." or "I'd love to hear more about..."

Generate your probe question:"""
    
    messages = [{"role": "system", "content": system_prompt}]
    
    try:
        response = groq_client.chat.completions.create(
            model=config.GROQ_FAST_MODEL,
            messages=messages,
            max_tokens=100,
            temperature=0.4
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Groq probe error: {e}")
        # Fallback based on deviation type
        if deviation_type == "tangent":
            return f"That's interesting, but let's get back to my original question: {original_question}"
        elif deviation_type == "completely_off":
            return f"Haha, we're getting off track! Let me bring us back: {original_question}"
        else:
            return "Could you give me a specific example of what you mean?"

def generate_question_with_groq(conversation_history: List[Dict], research_topic: str) -> str:
    """Generate next main question using Groq with emotion and strong prompts"""
    
    # Extract what's been discussed
    discussed_topics = []
    for msg in conversation_history:
        if msg["role"] == "agent" and not msg.get("is_probe", False):
            discussed_topics.append(msg["message"])
    
    context = "\n".join([f"- {topic}" for topic in discussed_topics[-3:]])  # Last 3 main questions
    
    system_prompt = f"""You are an ENGAGING and CURIOUS market researcher conducting an interview about: {research_topic}

What you've already asked:
{context}

Your job: Generate the NEXT natural follow-up question.

CRITICAL RULES:
1. STAY ON TOPIC - Only ask about {research_topic}
2. If the user mentioned something interesting in their last response, dig deeper into THAT
3. Ask open-ended questions (who, what, when, where, why, how)
4. Be conversational and WARM - show genuine curiosity
5. Keep questions SHORT (1-2 sentences MAX)
6. Add emotional engagement: 
   - "I'm curious..."
   - "I'd love to understand..."
   - "That's fascinating! Tell me more about..."
   - "I'm really interested in..."
7. Ask for SPECIFICS - examples, stories, concrete details
8. Build on what they said - create natural conversation flow
9. NEVER ask generic questions - be specific to their responses

Examples of GOOD questions:
- "That's interesting! Can you walk me through a specific example of when that happened?"
- "I'm curious - what made you choose that approach over others?"
- "Tell me more about how that makes you feel in your daily routine?"

Examples of BAD questions (NEVER use these):
- "How do you feel about that?" (too vague)
- "Can you tell me more?" (lazy)
- "What else?" (unengaging)

Generate ONE natural, engaging follow-up question:"""
    
    # Get recent conversation for context
    recent_messages = []
    for msg in conversation_history[-6:]:
        role = "assistant" if msg["role"] == "agent" else "user"
        recent_messages.append({"role": role, "content": msg["message"]})
    
    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(recent_messages)
    
    try:
        response = groq_client.chat.completions.create(
            model=config.GROQ_FAST_MODEL,
            messages=messages,
            max_tokens=100,
            temperature=0.5
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Groq error: {e}")
        return "Could you tell me more about that experience?"

def generate_summary_with_groq(conversation_history: List[Dict], terminated_early: bool = False) -> Tuple[str, List[str]]:
    """Generate summary and key themes using Groq"""
    user_responses = " ".join([msg["message"] for msg in conversation_history if msg["role"] == "user"])
    
    if terminated_early:
        summary_prompt = f"""This interview was terminated early by the user. 
        Summarize what was discussed in 2-3 sentences:
        {user_responses}
        """
    else:
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

def get_original_question(conversation_history: List[Dict]) -> str:
    """Get the last main (non-probe) question asked"""
    for msg in reversed(conversation_history):
        if msg["role"] == "agent" and not msg.get("is_probe", False):
            return msg["message"]
    
    # Fallback to last agent message
    for msg in reversed(conversation_history):
        if msg["role"] == "agent":
            return msg["message"]
    
    return "the topic we're discussing"

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
            "template_id": request.template_id,
            "research_topic": request.starter_questions[0] if request.starter_questions else "your experiences",
            "probe_count": 0,
            "consecutive_probes": 0
        }
        redis_client.set(
            f"session:{session_id}:metadata",
            json.dumps(metadata),
            ex=86400
        )
        
        # 3. Create first question with emotion
        topic = request.starter_questions[0] if request.starter_questions else "your daily habits"
        first_question = f"Hi! I'm really excited to learn about your experiences. {topic}"
        
        # 4. Save first message to conversation
        conversation.append({
            "role": "agent",
            "message": first_question,
            "timestamp": datetime.now().isoformat(),
            "is_probe": False
        })
        
        redis_client.set(
            f"session:{session_id}:conversation",
            json.dumps(conversation)
        )
        
        print(f"✅ Interview started: {session_id}")
        print(f"   Topic: {metadata['research_topic']}")
        
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
    """Main interview chat endpoint with early termination detection."""
    try:
        session_id = request.session_id
        user_message = request.message
        
        print(f"\n{'='*60}")
        print(f"💬 USER: {user_message[:100]}...")
        
        # 1. Retrieve conversation history from Redis
        conversation_json = redis_client.get(f"session:{session_id}:conversation")
        if not conversation_json:
            raise HTTPException(status_code=404, detail="Session not found")
        
        conversation = json.loads(conversation_json)
        
        metadata_json = redis_client.get(f"session:{session_id}:metadata")
        if not metadata_json:
            raise HTTPException(status_code=404, detail="Session metadata not found")
        
        metadata = json.loads(metadata_json)
        research_topic = metadata.get('research_topic', 'your experiences')
        
        # 2. Analyze sentiment (categorical + numeric) and add user's message
        sentiment = analyze_sentiment(user_message)
        numeric_score = score_sentiment(user_message)
        print(f"📊 Sentiment: {sentiment} (score={numeric_score})")

        conversation.append({
            "role": "user",
            "message": user_message,
            "timestamp": datetime.now().isoformat(),
            "sentiment": sentiment,
            "sentiment_score": numeric_score
        })
        
        # 4. Get current consecutive probe count
        consecutive_probes = metadata.get('consecutive_probes', 0)
        
        # 5. CHECK FOR EARLY TERMINATION (BEFORE generating next question)
        should_terminate, termination_reason = early_termination_detector.should_terminate(
            user_message,
            sentiment,
            conversation,
            consecutive_probes,
            max_probes=MAX_CONSECUTIVE_PROBES
        )
        
        if should_terminate:
            print(f"🛑 EARLY TERMINATION DETECTED: {termination_reason}")
            print(f"   Consecutive probes: {consecutive_probes}/{MAX_CONSECUTIVE_PROBES}")
            print(f"{'='*60}\n")
            
            # Save termination info to metadata
            metadata['terminated_early'] = True
            metadata['termination_reason'] = termination_reason
            metadata['terminated_at'] = datetime.now().isoformat()
            
            # Save conversation and metadata
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
                next_question=None,
                is_probe=False,
                sentiment=sentiment,
                progress=ProgressInfo(
                    current=metadata['current_question'],
                    total=metadata['total_questions']
                ),
                is_complete=True,
                terminated_early=True,
                termination_reason=termination_reason
            )
        
        # 6. Check if response is vague
        is_vague = is_vague_response(user_message)
        if is_vague:
            print(f"⚠️  VAGUE RESPONSE DETECTED (word count: {len(user_message.split())})")
        
        # 7. Check for topic deviation (ALWAYS check, regardless of vagueness)
        original_question = get_original_question(conversation[:-1])  # Exclude current user message
        
        
        # 8. Determine if we need to probe (vague OR deviated)
        needs_probe = is_vague
        
        # 9. Generate next question
        if needs_probe:
            print(f"🔍 PROBE AGENT CALLED")
            if is_vague:
                print(f"   Reason: Vague response")
            
            next_question = generate_probe_question(
                conversation, 
                original_question,
            )
            is_probe_flag = True
            
        else:
            print(f"✅ GOOD RESPONSE - Generating next main question")
            next_question = generate_question_with_groq(conversation, research_topic)
            is_probe_flag = False
        
        print(f"🤖 AGENT: {next_question[:100]}...")
        
        # 10. Add AI's question to conversation
        conversation.append({
            "role": "agent",
            "message": next_question,
            "timestamp": datetime.now().isoformat(),
            "sentiment": sentiment,
            "is_probe": is_probe_flag
        })
        
        # 11. Update metadata based on whether this is a probe or new question
        if is_probe_flag:
            # This is a probe - increment consecutive probe counter
            metadata['consecutive_probes'] = consecutive_probes + 1
            print(f"   📈 Probe count: {metadata['consecutive_probes']}/{MAX_CONSECUTIVE_PROBES}")
        else:
            # This is a new question - advance question counter and reset probes
            metadata['current_question'] += 1
            metadata['consecutive_probes'] = 0  # Reset on new question
            print(f"   📍 Question #{metadata['current_question']}/{metadata['total_questions']}")
        
        print(f"{'='*60}\n")
        
        # 12. Check if interview should end (15 questions reached)
        is_complete = metadata['current_question'] >= metadata['total_questions']
        
        # 13. Save back to Redis
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
            is_probe=is_probe_flag,
            sentiment=sentiment,
            progress=ProgressInfo(
                current=metadata['current_question'],
                total=metadata['total_questions']
            ),
            is_complete=is_complete,
            terminated_early=False
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
        
        # Check if terminated early
        terminated_early = metadata.get('terminated_early', False)
        termination_reason = metadata.get('termination_reason', None)
        
        # 2. Calculate overall sentiment using numeric per-message scores
        user_scores = [float(msg.get('sentiment_score')) for msg in conversation if msg['role'] == 'user' and msg.get('sentiment_score') is not None]
        if user_scores:
            avg_sentiment = round(sum(user_scores) / len(user_scores), 2)
        else:
            # fallback: derive from categorical sentiments if numeric scores missing
            sentiments = [msg.get('sentiment', 'neutral') for msg in conversation if msg['role'] == 'user']
            sentiment_scores = {
                'positive': 0.8,
                'neutral': 0.5,
                'negative': 0.2
            }
            avg_sentiment = round(sum(sentiment_scores.get(s, 0.5) for s in sentiments) / len(sentiments), 2) if sentiments else 0.5

        print(f"DEBUG: per-message scores: {user_scores}")
        print(f"DEBUG: avg_sentiment: {avg_sentiment}")
        
        # 3. Generate summary and key themes
        summary, key_themes = generate_summary_with_groq(conversation, terminated_early)
        
        if terminated_early:
            summary = f"[Interview terminated early: {termination_reason}] {summary}"
        
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
        
        # 6. Clean up Redis
        redis_client.delete(f"session:{session_id}:conversation")
        redis_client.delete(f"session:{session_id}:metadata")
        
        print(f"✅ Interview ended: {session_id}")
        if terminated_early:
            print(f"   Reason: {termination_reason}")
        print(f"   Duration: {duration_seconds}s")
        print(f"   Questions: {metadata['current_question']}/{metadata['total_questions']}")
        
        return EndResponse(
            success=True,
            transcript=transcript,
            summary=summary,
            sentiment_score=round(avg_sentiment, 2),
            key_themes=key_themes,
            total_duration_seconds=duration_seconds,
            terminated_early=terminated_early,
            termination_reason=termination_reason
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