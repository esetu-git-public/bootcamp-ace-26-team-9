from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

import pandas as pd
import shutil
from pathlib import Path

from app.database.database import get_db
from app.database.crud import CRUDService

from app.schemas.prediction_schema import EmployeeData
from app.schemas.user_schema import (
    UserRegister,
    UserLogin
)

from app.services.data_service import DataService
from app.services.preprocessing_service import PreprocessingService
from app.services.feature_engineering_service import FeatureEngineeringService
from app.services.training_service import TrainingService
from app.services.prediction_service import PredictionService
from app.services.batch_prediction_service import BatchPredictionService
from app.services.metrics_service import MetricsService
from app.services.auth_service import AuthService

from app.auth.oauth2 import get_current_user
from app.schemas.employee_schema import (
    EmployeeCreate,
    EmployeeUpdate
)

from app.services.employee_service import EmployeeService
from app.services.dashboard_service import DashboardService


router = APIRouter()


# ==========================================================
# General APIs
# ==========================================================

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


# ==========================================================
# Dataset APIs
# ==========================================================

@router.get("/dataset/info", tags=["Dataset"])
def dataset_info():
    return DataService.get_dataset_info()


@router.get("/dataset/missing-values", tags=["Dataset"])
def missing_values():
    return DataService.get_missing_values()


@router.get("/dataset/duplicates", tags=["Dataset"])
def duplicates():
    return DataService.get_duplicates()


@router.get("/dataset/data-types", tags=["Dataset"])
def data_types():
    return DataService.get_data_types()


@router.get("/dataset/target-distribution", tags=["Dataset"])
def target_distribution():
    return DataService.get_target_distribution()


@router.get("/dataset/numerical-columns", tags=["Dataset"])
def numerical_columns():
    return DataService.get_numerical_columns()


@router.get("/dataset/categorical-columns", tags=["Dataset"])
def categorical_columns():
    return DataService.get_categorical_columns()


@router.get("/dataset/summary", tags=["Dataset"])
def summary():
    return DataService.get_summary_statistics()


@router.get("/dataset/preprocess", tags=["Dataset"])
def preprocess():

    df = DataService.load_dataset()

    processed_df, _ = PreprocessingService.preprocess(df)

    return {
        "rows": processed_df.shape[0],
        "columns": processed_df.shape[1],
        "message": "Dataset Preprocessed Successfully"
    }


@router.get("/dataset/features", tags=["Dataset"])
def get_features():

    df = DataService.load_dataset()

    processed_df, _ = PreprocessingService.preprocess(df)

    X, y = FeatureEngineeringService.prepare_features(processed_df)

    return {
        "feature_count": len(X.columns),
        "target_column": "Attrition",
        "features": list(X.columns)
    }


# ==========================================================
# Training APIs
# ==========================================================

@router.post("/train", tags=["Training"])
def train_model(
    current_user=Depends(get_current_user)
):
    return TrainingService.train()


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
# Model APIs
# ==========================================================

@router.get("/model/metrics", tags=["Model"])
def model_metrics():
    return MetricsService.get_metrics()


# ==========================================================
# Prediction History APIs
# ==========================================================

@router.get("/predictions", tags=["Prediction History"])
def get_predictions(
    db: Session = Depends(get_db)
):
    return CRUDService.get_predictions(db)


@router.get("/predictions/{prediction_id}", tags=["Prediction History"])
def get_prediction(
    prediction_id: int,
    db: Session = Depends(get_db)
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

# ==========================================================
# Employee Management APIs
# ==========================================================

@router.post("/employees", tags=["Employees"])
def create_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return EmployeeService.create_employee(
        db,
        employee
    )


@router.get("/employees", tags=["Employees"])
def get_all_employees(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return EmployeeService.get_all_employees(db)


@router.get("/employees/{employee_id}", tags=["Employees"])
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    employee = EmployeeService.get_employee_by_id(
        db,
        employee_id
    )

    if employee is None:

        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    return employee


@router.put("/employees/{employee_id}", tags=["Employees"])
def update_employee(
    employee_id: int,
    employee: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    updated_employee = EmployeeService.update_employee(
        db,
        employee_id,
        employee
    )

    if updated_employee is None:

        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    return updated_employee


@router.delete("/employees/{employee_id}", tags=["Employees"])
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    deleted_employee = EmployeeService.delete_employee(
        db,
        employee_id
    )

    if deleted_employee is None:

        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    return {
        "message": "Employee deleted successfully"
    }


# ==========================================================
# Dashboard APIs
# ==========================================================

@router.get("/dashboard/stats", tags=["Dashboard"])
def dashboard_stats(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return DashboardService.get_dashboard_stats(db)


@router.get("/dashboard/department-chart", tags=["Dashboard"])
def department_chart(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return DashboardService.department_chart(db)


@router.get("/dashboard/gender-chart", tags=["Dashboard"])
def gender_chart(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return DashboardService.gender_chart(db)


@router.get("/dashboard/attrition-chart", tags=["Dashboard"])
def attrition_chart(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return DashboardService.attrition_chart(db)


@router.get("/dashboard/recent-predictions", tags=["Dashboard"])
def recent_predictions(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return DashboardService.recent_predictions(db)