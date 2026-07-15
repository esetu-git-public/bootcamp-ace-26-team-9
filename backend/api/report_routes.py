from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
import io
import pandas as pd

from database.database import get_db
from auth.oauth2 import get_current_user, get_current_user_optional

from services.report_service import ReportService
from services.data_service import DataService

from schemas.report_schema import (
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
    current_user=Depends(get_current_user_optional)
):

    return ReportService.get_employee_report(db)


@router.get(
    "/reports/predictions",
    response_model=list[PredictionReport],
    tags=["Reports"]
)
def prediction_report(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_optional)
):

    return ReportService.get_prediction_report(db)


@router.get(
    "/reports/training",
    response_model=list[TrainingReport],
    tags=["Reports"]
)
def training_report(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_optional)
):

    return ReportService.get_training_report(db)


@router.get(
    "/reports/export/csv",
    tags=["Reports"]
)
def export_csv_report(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_optional)
):
    df = DataService.load_dataset()
    buffer = io.StringIO()
    df.to_csv(buffer, index=False)
    content = buffer.getvalue()
    return Response(
        content=content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=hr_retention_intelligence_report.csv"}
    )