import os
from dotenv import load_dotenv

load_dotenv()

# ========================================================================
# SUPABASE CONFIGURATION
# ========================================================================
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

# ========================================================================
# REDIS CONFIGURATION
# ========================================================================
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = int(os.getenv("REDIS_DB", 0))
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", None)
CONVERSATION_TIMEOUT = 3600  # 1 hour session timeout

# ========================================================================
# LLM CONFIGURATION - SPEED OPTIMIZED
# ========================================================================
# GROQ - Ultra-fast inference for real-time tasks
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_FAST_MODEL = "llama-3.1-8b-instant"  # FASTEST - for analysis, probes
GROQ_QUALITY_MODEL = "llama-3.3-70b-versatile"  # Higher quality when needed

# CEREBRAS - Only for complex tasks if needed
CEREBRAS_API_KEY = os.getenv("CEREBRAS_API_KEY")
CEREBRAS_MODEL = "llama3.3-70b"

# Strategy: Use Groq for everything except deep summaries
# Groq's 8B instant model is ~10x faster than Cerebras
USE_MODEL_STRATEGY = "groq_only"  # Options: "groq_only", "mixed"

# Model assignments
ANALYSIS_MODEL = GROQ_FAST_MODEL      # Sentiment/quality analysis
PROBE_MODEL = GROQ_FAST_MODEL         # Probe generation
INTERVIEWER_MODEL = GROQ_FAST_MODEL   # Next question generation
SUMMARY_MODEL = GROQ_QUALITY_MODEL    # Final summary (can use 70B for quality)

# Token limits (keep tight for speed)
ANALYSIS_MAX_TOKENS = 100      # Short JSON response
PROBE_MAX_TOKENS = 50          # Single question
QUESTION_MAX_TOKENS = 80       # Single question
SUMMARY_MAX_TOKENS = 1500      # Detailed summary

# Temperature settings
ANALYSIS_TEMPERATURE = 0.0     # Deterministic
PROBE_TEMPERATURE = 0.1        # Mostly deterministic
QUESTION_TEMPERATURE = 0.3     # Slightly creative
SUMMARY_TEMPERATURE = 0.2      # Balanced

# ========================================================================
# PERFORMANCE OPTIMIZATIONS
# ========================================================================
# Enable streaming for faster perceived response
ENABLE_STREAMING = False  # Set to True if implementing streaming

# Timeout settings (in seconds)
LLM_TIMEOUT = 10  # Fast fail if LLM takes too long

# ========================================================================
# ANALYSIS THRESHOLDS
# ========================================================================
SHALLOW_RESPONSE_MIN_WORDS = 5
VAGUE_RESPONSE_THRESHOLD = 0.3

# ========================================================================
# VALIDATION
# ========================================================================
def validate_config():
    """Validates that all required configuration is present."""
    errors = []
    
    if not SUPABASE_URL:
        errors.append("SUPABASE_URL is not set")
    if not SUPABASE_KEY:
        errors.append("SUPABASE_KEY is not set")
    if not SUPABASE_JWT_SECRET:
        errors.append("SUPABASE_JWT_SECRET is not set (CRITICAL for auth!)")
    if not GROQ_API_KEY:
        errors.append("GROQ_API_KEY is not set (REQUIRED for fast inference)")
    
    if errors:
        print("⚠️  Configuration errors:")
        for error in errors:
            print(f"   - {error}")
        return False
    
    print("✅ Configuration validated successfully")
    print(f"🚀 Speed mode: Using Groq {GROQ_FAST_MODEL} for fast inference")
    return True

# Run validation on import
validate_config()
