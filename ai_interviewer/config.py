import os
from dotenv import load_dotenv

load_dotenv()

# ========================================================================
# SUPABASE CONFIGURATION
# ========================================================================
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  # Anon/public key for client operations

# JWT Secret for token validation (IMPORTANT!)
# This is found in: Supabase Dashboard → Settings → API → JWT Secret
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
# LLM CONFIGURATION
# ========================================================================
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
COMPLEX_LLM_MODEL = "gemini-2.5-flash"
SIMPLE_LLM_MODEL = "gemini-2.5-flash" 
LLM_TEMPERATURE = 0.7

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
    if not GEMINI_API_KEY:
        errors.append("GEMINI_API_KEY is not set")
    
    if errors:
        print("⚠️  Configuration errors:")
        for error in errors:
            print(f"   - {error}")
        return False
    
    print("✅ Configuration validated successfully")
    return True

# Run validation on import
validate_config()