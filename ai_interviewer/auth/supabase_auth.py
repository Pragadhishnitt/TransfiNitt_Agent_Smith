import config
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from typing import Optional, Dict, Any
from datetime import datetime

# ========================================================================
# USER MODEL
# ========================================================================
class User:
    """
    Custom User model representing an authenticated Supabase user.
    Built from JWT payload for efficiency (no API calls).
    """
    def __init__(self, payload: Dict[str, Any]):
        # Standard JWT claims
        self.id: str = payload.get("sub")  # User ID from 'sub' claim
        self.email: Optional[str] = payload.get("email")
        self.role: Optional[str] = payload.get("role")
        
        # Supabase-specific claims
        self.user_metadata: Dict[str, Any] = payload.get("user_metadata", {})
        self.app_metadata: Dict[str, Any] = payload.get("app_metadata", {})
        
        # Token metadata
        self.aud: Optional[str] = payload.get("aud")
        self.exp: Optional[int] = payload.get("exp")
        self.iat: Optional[int] = payload.get("iat")
        
        # Full payload for custom claims
        self._raw_payload = payload
    
    def __repr__(self):
        return f"User(id={self.id}, email={self.email}, role={self.role})"
    
    def has_role(self, role: str) -> bool:
        """Check if user has a specific role."""
        return self.user_metadata.get("role") == role
    
    def get_claim(self, claim_name: str, default=None):
        """Get a custom claim from the JWT payload."""
        return self._raw_payload.get(claim_name, default)

# ========================================================================
# CONFIGURATION
# ========================================================================
JWT_SECRET = config.SUPABASE_JWT_SECRET
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
    Decodes and validates a Supabase JWT token locally.
    
    Args:
        token: The JWT token string
        
    Returns:
        Dict containing the decoded payload
        
    Raises:
        JWTError: If token is invalid or expired
    """
    if not JWT_SECRET:
        raise ValueError("SUPABASE_JWT_SECRET is not configured")
    
    payload = jwt.decode(
        token,
        JWT_SECRET,
        algorithms=[JWT_ALGORITHM],
        options={
            "verify_aud": False,  # Supabase doesn't always set 'aud'
            "verify_exp": True,   # Do verify expiration
        }
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
    
    This uses LOCAL JWT validation (no API calls) for better performance.
    
    Args:
        credentials: The Bearer token from the Authorization header
        
    Returns:
        User object with user information from JWT claims
        
    Raises:
        HTTPException: If authentication fails
    """
    if not JWT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="JWT authentication not configured"
        )
    
    token = credentials.credentials
    
    try:
        # Decode and validate the JWT locally
        payload = decode_jwt(token)
        
        # Check for required claims
        if not payload.get("sub"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token missing user ID (sub claim)",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create and return User object
        return User(payload)
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_researcher(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency that ensures the authenticated user has researcher role.
    
    Role can be stored in either:
    - user_metadata.role
    - app_metadata.role
    - Direct 'role' claim
    
    Args:
        current_user: The authenticated user from get_current_user
        
    Returns:
        User object if they have researcher role
        
    Raises:
        HTTPException: If user doesn't have researcher privileges
    """
    # Check multiple locations for role
    user_role = (
        current_user.user_metadata.get("role") or
        current_user.app_metadata.get("role") or
        current_user.role
    )
    
    if user_role != "researcher":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User does not have the required researcher privileges",
        )
    
    return current_user

# ========================================================================
# OPTIONAL AUTHENTICATION
# ========================================================================

async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme)
) -> Optional[User]:
    """
    Optional authentication - returns User if authenticated, None otherwise.
    Useful for endpoints that work for both authenticated and anonymous users.
    
    Example:
        @app.get("/public-or-private")
        async def endpoint(user: Optional[User] = Depends(get_optional_user)):
            if user:
                return {"message": f"Welcome {user.email}"}
            return {"message": "Welcome guest"}
    """
    if not credentials:
        return None
    
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None

# ========================================================================
# ROLE-BASED DEPENDENCIES
# ========================================================================

async def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """
    Dependency that ensures the user has admin role.
    
    Example:
        @app.delete("/admin/dangerous")
        async def dangerous(admin: User = Depends(require_admin)):
            # Only admins can access
            pass
    """
    user_role = (
        current_user.user_metadata.get("role") or
        current_user.app_metadata.get("role") or
        current_user.role
    )
    
    if user_role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required",
        )
    
    return current_user

def require_role(required_role: str):
    """
    Factory function that creates a dependency for any custom role.
    
    Example:
        @app.get("/moderator-only")
        async def endpoint(user: User = Depends(require_role("moderator"))):
            pass
    """
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        user_role = (
            current_user.user_metadata.get("role") or
            current_user.app_metadata.get("role") or
            current_user.role
        )
        
        if user_role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires '{required_role}' role",
            )
        
        return current_user
    
    return role_checker

# ========================================================================
# UTILITY FUNCTIONS
# ========================================================================

def get_user_id_from_token(token: str) -> Optional[str]:
    """
    Extracts user ID from token without full validation.
    Useful for logging/debugging.
    
    Returns None if token is invalid.
    """
    try:
        payload = decode_jwt(token)
        return payload.get("sub")
    except Exception:
        return None

def is_token_expired(token: str) -> bool:
    """
    Checks if a token is expired without raising an exception.
    """
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
            options={"verify_exp": False}  # Don't raise on expiration
        )
        exp = payload.get("exp")
        if not exp:
            return False
        return datetime.utcnow().timestamp() > exp
    except Exception:
        return True

# ========================================================================
# INITIALIZATION
# ========================================================================

print("✅ JWT-based authentication initialized")
if not JWT_SECRET:
    print("⚠️  WARNING: SUPABASE_JWT_SECRET not configured! Authentication will fail.")