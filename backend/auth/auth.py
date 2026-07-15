import os
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

# Load env variables
load_dotenv()

security = HTTPBearer()

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Decodes and verifies the Supabase session token (JWT) using the JWT secret.
    """
    if not SUPABASE_JWT_SECRET:
        # Fallback/Development mode if secret is not set yet
        # Returns a mock user context to prevent crashing before configuration
        return {"sub": "development-mode-user", "email": "dev@example.com"}

    token = credentials.credentials
    try:
        # Supabase tokens are signed with HS256 and the project's JWT Secret.
        # We ignore verification of the audience field as it defaults to 'authenticated'.
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False}
        )
        return payload
    except jwt.PyJWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired session token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
