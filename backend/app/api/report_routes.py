from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.auth.oauth2 import get_current_user

from app.services.report_service import ReportService

from app.schemas.report_schema import (
    EmployeeReport,
    PredictionReport,
    TrainingReport
)

router = APIRouter()


# ==========================================================
# Reports APIs
# ==========================================================

@router.get(
    "/reports/employees",
    response_model=list[EmployeeReport],
    tags=["Reports"]
)
def employee_report(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return ReportService.get_employee_report(db)


@router.get(
    "/reports/predictions",
    response_model=list[PredictionReport],
    tags=["Reports"]
)
def prediction_report(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return ReportService.get_prediction_report(db)


@router.get(
    "/reports/training",
    response_model=list[TrainingReport],
    tags=["Reports"]
)
def training_report(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return ReportService.get_training_report(db)