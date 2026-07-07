from sqlalchemy.orm import Session

from app.database.models import (
    PredictionHistory,
    TrainingHistory
)


class CRUDService:

    @staticmethod
    def save_prediction(
        db: Session,
        employee_id: str,
        prediction: str,
        probability: float,
        model_name: str
    ):

        prediction_record = PredictionHistory(
            employee_id=employee_id,
            prediction=prediction,
            probability=probability,
            model_name=model_name
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
    def get_predictions(db: Session):

        return db.query(PredictionHistory).all()

    @staticmethod
    def get_prediction_by_id(
        db: Session,
        prediction_id: int
    ):

        return (
            db.query(PredictionHistory)
            .filter(PredictionHistory.id == prediction_id)
            .first()
        )

    @staticmethod
    def delete_prediction(
        db: Session,
        prediction_id: int
    ):

        prediction = (
            db.query(PredictionHistory)
            .filter(PredictionHistory.id == prediction_id)
            .first()
        )

        if prediction:
            db.delete(prediction)
            db.commit()

        return prediction