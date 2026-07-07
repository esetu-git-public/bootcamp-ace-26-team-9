from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime

from app.database.database import Base


class PredictionHistory(Base):

    __tablename__ = "prediction_history"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(String, nullable=False)

    prediction = Column(String, nullable=False)

    probability = Column(Float, nullable=False)

    model_name = Column(String, nullable=False)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


class TrainingHistory(Base):

    __tablename__ = "training_history"

    id = Column(Integer, primary_key=True, index=True)

    model_name = Column(String, nullable=False)

    accuracy = Column(Float)

    precision = Column(Float)

    recall = Column(Float)

    f1_score = Column(Float)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )