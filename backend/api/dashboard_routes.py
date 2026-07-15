from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from auth.oauth2 import get_current_user
from services.dashboard_service import DashboardService

router = APIRouter()


# ==========================================================
# Dashboard APIs
# ==========================================================

@router.get("/dashboard/stats", tags=["Dashboard"])
def dashboard_stats(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return DashboardService.get_dashboard_stats(db, user_id=current_user.get("sub"))


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
    return DashboardService.recent_predictions(db, user_id=current_user.get("sub"))