from sqlalchemy.orm import Session

from database.models import (
    Employee,
    PredictionHistory,
    TrainingHistory
)


class ReportService:

    # ==========================
    # Employee Report
    # ==========================

    @staticmethod
    def get_employee_report(db: Session):

        return db.query(Employee).all()

    # ==========================
    # Prediction Report
    # ==========================

    @staticmethod
    def get_prediction_report(db: Session):

        return db.query(PredictionHistory).all()

    # ==========================
    # Training Report
    # ==========================

    @staticmethod
    def get_training_report(db: Session):

        return db.query(TrainingHistory).all()