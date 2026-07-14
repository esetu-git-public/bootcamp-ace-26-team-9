import os
import json
import urllib.request
from functools import lru_cache
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
import jwt
from jwt import PyJWKClient

load_dotenv()

security = HTTPBearer()

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://cwbpenjodiewowjcbfdb.supabase.co")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

# JWKS endpoint where Supabase publishes its ES256 public keys
SUPABASE_JWKS_URL = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"

# PyJWT's JWKS client — caches keys and auto-refreshes when a new kid appears
_jwks_client = PyJWKClient(SUPABASE_JWKS_URL, cache_keys=True)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Verifies the Supabase JWT from the Authorization: Bearer header.

    Supabase now signs user access tokens with ES256 (Elliptic Curve P-256).
    We fetch the public key from Supabase's JWKS endpoint and use it to verify.

    Returns the decoded JWT payload containing:
      - 'sub': Supabase user UUID
      - 'email': user email
      - 'role': user role (e.g. 'authenticated')
    """
    token = credentials.credentials

    try:
        # Get the matching public key from JWKS based on the token's 'kid' header
        signing_key = _jwks_client.get_signing_key_from_jwt(token)

        payload = jwt.decode(
            token,
            signing_key,
            algorithms=["ES256", "RS256", "HS256"],
            options={"verify_aud": False}
        )
        return payload

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        # Fallback: try HS256 with raw secret (for legacy/anon tokens)
        if SUPABASE_JWT_SECRET:
            try:
                payload = jwt.decode(
                    token,
                    SUPABASE_JWT_SECRET,
                    algorithms=["HS256"],
                    options={"verify_aud": False}
                )
                return payload
            except Exception:
                pass

        print(f"DEBUG: JWT Verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )