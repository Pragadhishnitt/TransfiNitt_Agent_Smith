import config
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from typing import Optional, Dict, Any

# ========================================================================
# USER MODEL
# ========================================================================
class User:
    """
    User model representing an authenticated user.
    Built from JWT payload for efficiency (no API calls).
    """
    def __init__(self, payload: Dict[str, Any]):
        self.id: str = payload.get("id")
        self.email: Optional[str] = payload.get("email")
        self.role: Optional[str] = payload.get("role")
        self._raw_payload = payload
    
    def __repr__(self):
        return f"User(id={self.id}, email={self.email}, role={self.role})"
    
    def has_role(self, role: str) -> bool:
        """Check if user has a specific role."""
        return self.role == role
    
    def get_claim(self, claim_name: str, default=None):
        """Get a custom claim from the JWT payload."""
        return self._raw_payload.get(claim_name, default)

# ========================================================================
# CONFIGURATION
# ========================================================================
JWT_SECRET = config.JWT_SECRET
JWT_ALGORITHM = "HS256"

# ========================================================================
# SECURITY SCHEME
# ========================================================================
bearer_scheme = HTTPBearer()

# ========================================================================
# JWT VALIDATION
# ========================================================================

def decode_jwt(token: str) -> Dict[str, Any]:
    """
    Decodes and validates JWT token locally.
    
    Args:
        token: The JWT token string
        
    Returns:
        Dict containing the decoded payload
        
    Raises:
        JWTError: If token is invalid or expired
    """
    if not JWT_SECRET:
        raise ValueError("JWT_SECRET is not configured")
    
    payload = jwt.decode(
        token,
        JWT_SECRET,
        algorithms=[JWT_ALGORITHM],
        options={"verify_exp": True}
    )
    
    return payload

# ========================================================================
# AUTHENTICATION DEPENDENCIES
# ========================================================================

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
) -> User:
    """
    FastAPI dependency that validates JWT token and returns the user.
    Uses local JWT validation for better performance.
    
    Args:
        credentials: The HTTP Authorization credentials
        
    Returns:
        User object constructed from JWT claims
        
    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        payload = decode_jwt(credentials.credentials)
        return User(payload)
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_researcher(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency that ensures the current user is a researcher.
    
    Args:
        current_user: The authenticated user
        
    Returns:
        User object if user is a researcher
        
    Raises:
        HTTPException: If user is not a researcher
    """
    if not current_user.has_role("researcher"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Researcher role required"
        )
    return current_user