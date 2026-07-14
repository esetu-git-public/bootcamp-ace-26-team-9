from fastapi import APIRouter, Depends
from app.auth.oauth2 import get_current_user

router = APIRouter()


# ==========================================================
# Authentication APIs
# ==========================================================

@router.get("/me", tags=["Authentication"])
def get_me(
    current_user=Depends(get_current_user)
):

    return {
        "message": "Authenticated User",
        "user": current_user
    }