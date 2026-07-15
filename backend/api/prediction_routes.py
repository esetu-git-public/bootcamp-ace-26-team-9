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

from database.database import get_db
from database.crud import CRUDService

from schemas.prediction_schema import EmployeeData, WhatIfRequest

from services.prediction_service import PredictionService
from services.batch_prediction_service import BatchPredictionService
from services.metrics_service import MetricsService

from auth.oauth2 import get_current_user, get_current_user_optional

router = APIRouter()


# ==========================================================
# Prediction APIs
# ==========================================================

@router.post("/predict", tags=["Prediction"])
def predict(
    employee: EmployeeData,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_optional)
):

    input_df = pd.DataFrame([employee.model_dump()])

    result = PredictionService.predict(input_df)

    CRUDService.save_prediction(
        db=db,
        employee_id="EMP001",
        prediction=result["prediction"],
        probability=result["probability"],
        model_name=result.get(
            "model_name",
            "Ensemble Classifier"
        )
    )

    return result


@router.post("/predict/what-if", tags=["Prediction"])
def what_if_simulation(
    request: WhatIfRequest,
    current_user=Depends(get_current_user_optional)
):
    base_dict = request.employee.model_dump()
    result = PredictionService.simulate_what_if(base_dict, request.modifications)
    return result


# ==========================================================
# Batch Prediction APIs

# ==========================================================

@router.post("/predict/csv", tags=["Batch Prediction"])
def batch_prediction(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user_optional)
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