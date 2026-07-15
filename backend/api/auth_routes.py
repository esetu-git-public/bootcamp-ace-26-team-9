from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db

from schemas.user_schema import (
    UserRegister,
    UserLogin
)

from services.auth_service import AuthService
from auth.oauth2 import get_current_user

router = APIRouter()


# ==========================================================
# Authentication APIs
# ==========================================================

@router.post("/register", tags=["Authentication"])
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    new_user = AuthService.register(
        db=db,
        name=user.name,
        email=user.email,
        password=user.password
    )

    if new_user is None:

        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    return {
        "message": "User registered successfully",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role
        }
    }


@router.post("/login", tags=["Authentication"])
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    login_result = AuthService.login(
        db=db,
        email=user.email,
        password=user.password
    )

    if login_result is None:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "message": "Login successful",
        "access_token": login_result["access_token"],
        "token_type": login_result["token_type"],
        "user": {
            "id": login_result["user"].id,
            "name": login_result["user"].name,
            "email": login_result["user"].email,
            "role": login_result["user"].role
        }
    }


@router.get("/me", tags=["Authentication"])
def get_me(
    current_user=Depends(get_current_user)
):

    return {
        "message": "Authenticated User",
        "user": current_user
    }