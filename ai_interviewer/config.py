import os
from typing import Optional

# ================================
# Redis Configuration (Local)
# ================================
REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT_STR = os.getenv("REDIS_PORT", "6379")
REDIS_PORT = int(REDIS_PORT_STR) if REDIS_PORT_STR and REDIS_PORT_STR.strip() else 6379
REDIS_DB = int(os.getenv("REDIS_DB", "0"))
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", "")

# ================================
# AI API Keys
# ================================
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
CEREBRAS_API_KEY = os.getenv("CEREBRAS_API_KEY", "")

MAX_QUESTIONS = 15
MAX_CONSECUTIVE_PROBES = 3  

# ================================
# Backend Service URL
# ================================
BACKEND_URL = os.getenv("BACKEND_URL", "http://backend:8000")

GROQ_FAST_MODEL = os.getenv("GROQ_FAST_MODEL", "llama-3.3-70b-versatile")
GROQ_QUALITY_MODEL = os.getenv("GROQ_QUALITY_MODEL", "llama-3.3-70b-versatile")
ANALYSIS_MODEL = GROQ_QUALITY_MODEL

# ================================
# Redis Connection String
# ================================
def get_redis_url() -> str:
    """Generate Redis connection URL"""
    if REDIS_PASSWORD:
        return f"redis://:{REDIS_PASSWORD}@{REDIS_HOST}:{REDIS_PORT}/{REDIS_DB}"
    return f"redis://{REDIS_HOST}:{REDIS_PORT}/{REDIS_DB}"

# ================================
# Configuration Validation
# ================================
def validate_config() -> None:
    """Validate required configuration - with warnings instead of errors"""
    warnings = []
    
    if not GROQ_API_KEY and not CEREBRAS_API_KEY:
        warnings.append("⚠️ Warning: Neither GROQ_API_KEY nor CEREBRAS_API_KEY is set")
    
    if not REDIS_HOST:
        warnings.append("⚠️ Warning: REDIS_HOST is not set, using default 'redis'")
    
    if not BACKEND_URL:
        warnings.append("⚠️ Warning: BACKEND_URL is not set, using default 'http://backend:8000'")
    
    if warnings:
        for warning in warnings:
            print(warning)

# ================================
# API Configuration
# ================================
class AIConfig:
    """AI Service Configuration"""
    
    # Redis
    redis_host: str = REDIS_HOST
    redis_port: int = REDIS_PORT
    redis_db: int = REDIS_DB
    redis_password: Optional[str] = REDIS_PASSWORD if REDIS_PASSWORD else None
    redis_url: str = get_redis_url()
    
    # AI Providers
    groq_api_key: Optional[str] = GROQ_API_KEY if GROQ_API_KEY else None
    cerebras_api_key: Optional[str] = CEREBRAS_API_KEY if CEREBRAS_API_KEY else None
    
    # Backend
    backend_url: str = BACKEND_URL
    
    # Service
    service_name: str = "ai_interviewer"
    version: str = "1.0.0"
    
    @classmethod
    def get_active_ai_provider(cls) -> str:
        """Return the active AI provider"""
        if cls.groq_api_key:
            return "groq"
        elif cls.cerebras_api_key:
            return "cerebras"
        return "none"

# Validate on import (warnings only)
validate_config()

# Export config instance
config = AIConfig()