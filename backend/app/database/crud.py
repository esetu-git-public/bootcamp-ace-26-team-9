from sqlalchemy.orm import Session
from datetime import datetime

from app.database.models import (
    PredictionHistory,
    TrainingHistory,
    UserSession
)


class CRUDService:

    @staticmethod
    def save_prediction(
        db: Session,
        employee_id: str,
        prediction: str,
        probability: float,
        model_name: str,
        user_id: str = None
    ):

        prediction_record = PredictionHistory(
            employee_id=employee_id,
            prediction=prediction,
            probability=probability,
            model_name=model_name,
            user_id=user_id
        )

        db.add(prediction_record)
        db.commit()
        db.refresh(prediction_record)

        return prediction_record

    @staticmethod
    def save_training(
        db: Session,
        model_name: str,
        accuracy: float,
        precision: float,
        recall: float,
        f1_score: float
    ):

        training_record = TrainingHistory(
            model_name=model_name,
            accuracy=accuracy,
            precision=precision,
            recall=recall,
            f1_score=f1_score
        )

        db.add(training_record)
        db.commit()
        db.refresh(training_record)

        return training_record

    @staticmethod
    def get_predictions(db: Session, user_id: str = None):
        query = db.query(PredictionHistory)
        if user_id:
            query = query.filter(PredictionHistory.user_id == user_id)
        return query.all()

    @staticmethod
    def get_prediction_by_id(
        db: Session,
        prediction_id: int,
        user_id: str = None
    ):
        query = db.query(PredictionHistory).filter(PredictionHistory.id == prediction_id)
        if user_id:
            query = query.filter(PredictionHistory.user_id == user_id)
        return query.first()

    @staticmethod
    def delete_prediction(
        db: Session,
        prediction_id: int,
        user_id: str = None
    ):
        query = db.query(PredictionHistory).filter(PredictionHistory.id == prediction_id)
        if user_id:
            query = query.filter(PredictionHistory.user_id == user_id)
        prediction = query.first()

        if prediction:
            db.delete(prediction)
            db.commit()

        return prediction

    # ==========================
    # User Session CRUD
    # ==========================

    @staticmethod
    def create_session(db: Session, user_id: str, session_token: str):
        session_record = UserSession(
            user_id=user_id,
            session_token=session_token,
            login_time=datetime.utcnow(),
            last_activity=datetime.utcnow(),
            is_active=True
        )
        db.add(session_record)
        db.commit()
        db.refresh(session_record)
        return session_record

    @staticmethod
    def get_session(db: Session, session_token: str):
        return (
            db.query(UserSession)
            .filter(UserSession.session_token == session_token)
            .first()
        )

    @staticmethod
    def deactivate_session(db: Session, session_token: str):
        session_record = (
            db.query(UserSession)
            .filter(UserSession.session_token == session_token)
            .first()
        )
        if session_record:
            session_record.is_active = False
            db.commit()
            db.refresh(session_record)
        return session_record

    @staticmethod
    def update_session_activity(db: Session, session_token: str):
        session_record = (
            db.query(UserSession)
            .filter(UserSession.session_token == session_token)
            .first()
        )
        if session_record:
            session_record.last_activity = datetime.utcnow()
            db.commit()
            db.refresh(session_record)
        return session_record