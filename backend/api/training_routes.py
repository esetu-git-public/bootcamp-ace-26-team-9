from fastapi import APIRouter, Depends

from auth.oauth2 import get_current_user
from services.training_service import TrainingService

router = APIRouter()


# ==========================================================
# Training APIs
# ==========================================================

@router.post("/train", tags=["Training"])
def train_model(
    current_user=Depends(get_current_user)
):
    return TrainingService.train()