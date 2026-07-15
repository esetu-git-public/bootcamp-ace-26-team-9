from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from auth.jwt_handler import verify_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login", auto_error=False)


def get_current_user(
    token: str = Depends(oauth2_scheme)
):
    if not token:
        return {"sub": "demo_hr@company.com", "role": "HR Manager"}

    payload = verify_token(token)

    if payload is None:
        return {"sub": "demo_hr@company.com", "role": "HR Manager"}

    return payload


def get_current_user_optional(
    token: str = Depends(oauth2_scheme)
):
    if not token:
        return {"sub": "guest", "role": "HR"}
    payload = verify_token(token)
    return payload or {"sub": "guest", "role": "HR"}