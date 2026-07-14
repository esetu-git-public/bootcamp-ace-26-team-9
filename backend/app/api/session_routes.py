from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.crud import CRUDService
from app.auth.oauth2 import get_current_user
from app.schemas.session_schema import UserSessionCreate, UserSessionResponse

router = APIRouter()


@router.post("/sessions", response_model=UserSessionResponse, tags=["Sessions"])
def create_session(
    session_data: UserSessionCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User ID not found in token"
        )
    
    # Check if session already exists
    existing = CRUDService.get_session(db, session_data.session_token)
    if existing:
        return existing
        
    return CRUDService.create_session(
        db=db,
        user_id=user_id,
        session_token=session_data.session_token
    )


@router.post("/sessions/deactivate", response_model=UserSessionResponse, tags=["Sessions"])
def deactivate_session(
    session_data: UserSessionCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    session_record = CRUDService.deactivate_session(db, session_data.session_token)
    if not session_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    return session_record


@router.post("/sessions/activity", response_model=UserSessionResponse, tags=["Sessions"])
def update_activity(
    session_data: UserSessionCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    session_record = CRUDService.update_session_activity(db, session_data.session_token)
    if not session_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    return session_record
