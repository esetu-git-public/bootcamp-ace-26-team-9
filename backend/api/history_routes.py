from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from database.database import get_db
from database.crud import CRUDService

from auth.oauth2 import get_current_user

router = APIRouter()


# ==========================================================
# Prediction History APIs
# ==========================================================

@router.get("/predictions", tags=["Prediction History"])
def get_predictions(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return CRUDService.get_predictions(db)


@router.get("/predictions/{prediction_id}", tags=["Prediction History"])
def get_prediction(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    prediction = CRUDService.get_prediction_by_id(
        db,
        prediction_id
    )

    if prediction is None:

        raise HTTPException(
            status_code=404,
            detail="Prediction not found"
        )

    return prediction


@router.delete("/predictions/{prediction_id}", tags=["Prediction History"])
def delete_prediction(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    prediction = CRUDService.delete_prediction(
        db,
        prediction_id
    )

    if prediction is None:

        raise HTTPException(
            status_code=404,
            detail="Prediction not found"
        )

    return {
        "message": "Prediction deleted successfully"
    }