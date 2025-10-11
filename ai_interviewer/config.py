import os
from dotenv import load_dotenv

load_dotenv()

# ========================================================================
# REDIS CONFIGURATION
# ========================================================================
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = int(os.getenv("REDIS_DB", 0))
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", None)

# ========================================================================
# GROQ CONFIGURATION
# ========================================================================
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_FAST_MODEL = "llama-3.1-8b-instant"  # Fast inference for questions
GROQ_QUALITY_MODEL = "llama-3.3-70b-versatile"  # Higher quality for summaries

# ========================================================================
# VALIDATION
# ========================================================================
def validate_config():
    """Validates that all required configuration is present."""
    errors = []
    
    if not GROQ_API_KEY:
        errors.append("GROQ_API_KEY is not set (REQUIRED for LLM inference)")
    
    if errors:
        print("⚠️  Configuration errors:")
        for error in errors:
            print(f"   - {error}")
        return False
    
    print("✅ Configuration validated successfully")
    print(f"🚀 Using Groq {GROQ_FAST_MODEL} for fast inference")
    return True

# Run validation on import
validate_config()