from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

import pandas as pd
import shutil
from pathlib import Path

from app.schemas.prediction_schema import EmployeeData

from app.services.data_service import DataService
from app.services.preprocessing_service import PreprocessingService
from app.services.feature_engineering_service import FeatureEngineeringService
from app.services.training_service import TrainingService
from app.services.prediction_service import PredictionService
from app.services.batch_prediction_service import BatchPredictionService
from app.services.metrics_service import MetricsService

from app.database.database import get_db
from app.database.curd import CRUDService
from fastapi import HTTPException
from app.auth.auth import get_current_user

router = APIRouter()


# ===========================
# General APIs
# ===========================

@router.get("/", tags=["General"])
def home():
    return {
        "message": "Employee Attrition Prediction API",
        "status": "Running"
    }


@router.get("/health", tags=["General"])
def health():
    return {
        "status": "Healthy"
    }


# ===========================
# Dataset APIs
# ===========================

@router.get("/dataset/info", tags=["Dataset"])
def dataset_info(current_user: dict = Depends(get_current_user)):
    return DataService.get_dataset_info()


@router.get("/dataset/missing-values", tags=["Dataset"])
def missing_values(current_user: dict = Depends(get_current_user)):
    return DataService.get_missing_values()


@router.get("/dataset/duplicates", tags=["Dataset"])
def duplicates(current_user: dict = Depends(get_current_user)):
    return DataService.get_duplicates()


@router.get("/dataset/data-types", tags=["Dataset"])
def data_types(current_user: dict = Depends(get_current_user)):
    return DataService.get_data_types()


@router.get("/dataset/target-distribution", tags=["Dataset"])
def target_distribution(current_user: dict = Depends(get_current_user)):
    return DataService.get_target_distribution()


@router.get("/dataset/numerical-columns", tags=["Dataset"])
def numerical_columns(current_user: dict = Depends(get_current_user)):
    return DataService.get_numerical_columns()


@router.get("/dataset/categorical-columns", tags=["Dataset"])
def categorical_columns(current_user: dict = Depends(get_current_user)):
    return DataService.get_categorical_columns()


@router.get("/dataset/summary", tags=["Dataset"])
def summary(current_user: dict = Depends(get_current_user)):
    return DataService.get_summary_statistics()


@router.get("/dataset/preprocess", tags=["Dataset"])
def preprocess(current_user: dict = Depends(get_current_user)):

    df = DataService.load_dataset()

    processed_df, _ = PreprocessingService.preprocess(df)

    return {
        "rows": processed_df.shape[0],
        "columns": processed_df.shape[1],
        "message": "Dataset Preprocessed Successfully"
    }


@router.get("/dataset/features", tags=["Dataset"])
def get_features(current_user: dict = Depends(get_current_user)):

    df = DataService.load_dataset()

    processed_df, _ = PreprocessingService.preprocess(df)

    X, y = FeatureEngineeringService.prepare_features(processed_df)

    return {
        "feature_count": len(X.columns),
        "target_column": "Attrition",
        "features": list(X.columns)
    }


# ===========================
# Training APIs
# ===========================

@router.post("/train", tags=["Training"])
def train_model(current_user: dict = Depends(get_current_user)):
    return TrainingService.train()


# ===========================
# Prediction APIs
# ===========================

@router.post("/predict", tags=["Prediction"])
def predict(
    employee: EmployeeData,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    input_df = pd.DataFrame([employee.model_dump()])

    result = PredictionService.predict(input_df)

    CRUDService.save_prediction(
        db=db,
        employee_id="EMP001",
        prediction=result["prediction"],
        probability=result["confidence"],
        model_name=result.get("model_name", "Random Forest")
    )

    return result


# ===========================
# Batch Prediction APIs
# ===========================

@router.post("/predict/csv", tags=["Batch Prediction"])
def batch_prediction(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):

    upload_folder = Path("uploads")
    upload_folder.mkdir(exist_ok=True)

    file_path = upload_folder / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = BatchPredictionService.predict_csv(str(file_path))

    return result


# ===========================
# Model APIs
# ===========================

@router.get("/model/metrics", tags=["Model"])
def model_metrics(current_user: dict = Depends(get_current_user)):
    return MetricsService.get_metrics()
@router.get("/predictions", tags=["Prediction History"])
def get_predictions(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return CRUDService.get_predictions(db)
@router.get("/predictions/{prediction_id}", tags=["Prediction History"])
def get_prediction(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
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
    current_user: dict = Depends(get_current_user)
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