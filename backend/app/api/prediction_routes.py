from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends
)

from sqlalchemy.orm import Session

import pandas as pd
import shutil
from pathlib import Path

from app.database.database import get_db
from app.database.crud import CRUDService

from app.schemas.prediction_schema import EmployeeData

from app.services.prediction_service import PredictionService
from app.services.batch_prediction_service import BatchPredictionService
from app.services.metrics_service import MetricsService

from app.auth.oauth2 import get_current_user

router = APIRouter()


# ==========================================================
# Prediction APIs
# ==========================================================

@router.post("/predict", tags=["Prediction"])
def predict(
    employee: EmployeeData,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    input_df = pd.DataFrame([employee.model_dump()])

    result = PredictionService.predict(input_df)

    CRUDService.save_prediction(
        db=db,
        employee_id="EMP001",
        prediction=result["prediction"],
        probability=result["confidence"],
        model_name=result.get(
            "model_name",
            "Random Forest"
        )
    )

    return result


# ==========================================================
# Batch Prediction APIs
# ==========================================================

@router.post("/predict/csv", tags=["Batch Prediction"])
def batch_prediction(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):

    upload_folder = Path("uploads")

    upload_folder.mkdir(exist_ok=True)

    file_path = upload_folder / file.filename

    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(file.file, buffer)

    result = BatchPredictionService.predict_csv(
        str(file_path)
    )

    return result


# ==========================================================
# Model Metrics APIs
# ==========================================================

@router.get("/model/metrics", tags=["Model"])
def model_metrics():

    return MetricsService.get_metrics()