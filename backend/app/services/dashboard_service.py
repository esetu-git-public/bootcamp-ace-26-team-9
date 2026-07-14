from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.models import (
    Employee,
    PredictionHistory
)


class DashboardService:

    @staticmethod
    def get_dashboard_stats(db: Session, user_id: str = None):

        total_employees = db.query(Employee).count()

        active_employees = (
            db.query(Employee)
            .filter(Employee.attrition == "No")
            .count()
        )

        attrition_count = (
            db.query(Employee)
            .filter(Employee.attrition == "Yes")
            .count()
        )

        query = db.query(PredictionHistory)
        if user_id:
            query = query.filter(PredictionHistory.user_id == user_id)
        prediction_count = query.count()

        return {
            "total_employees": total_employees,
            "active_employees": active_employees,
            "attrition_count": attrition_count,
            "prediction_count": prediction_count
        }

    @staticmethod
    def department_chart(db: Session):

        result = (
            db.query(
                Employee.department,
                func.count(Employee.id)
            )
            .group_by(Employee.department)
            .all()
        )

        return [
            {
                "department": department,
                "count": count
            }
            for department, count in result
        ]

    @staticmethod
    def gender_chart(db: Session):

        result = (
            db.query(
                Employee.gender,
                func.count(Employee.id)
            )
            .group_by(Employee.gender)
            .all()
        )

        return [
            {
                "gender": gender,
                "count": count
            }
            for gender, count in result
        ]

    @staticmethod
    def attrition_chart(db: Session):

        result = (
            db.query(
                Employee.attrition,
                func.count(Employee.id)
            )
            .group_by(Employee.attrition)
            .all()
        )

        return [
            {
                "attrition": attrition,
                "count": count
            }
            for attrition, count in result
        ]

    @staticmethod
    def recent_predictions(db: Session, user_id: str = None):

        query = db.query(PredictionHistory)
        if user_id:
            query = query.filter(PredictionHistory.user_id == user_id)
        return (
            query.order_by(
                PredictionHistory.created_at.desc()
            )
            .limit(10)
            .all()
        )