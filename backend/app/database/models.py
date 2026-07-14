from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from datetime import datetime

from app.database.database import Base


class PredictionHistory(Base):

    __tablename__ = "prediction_history"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(String, nullable=False)

    prediction = Column(String, nullable=False)

    probability = Column(Float, nullable=False)

    model_name = Column(String, nullable=False)

    user_id = Column(String, index=True, nullable=True)

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


# ==========================
# User Session Table
# ==========================

class UserSession(Base):

    __tablename__ = "user_sessions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(String, index=True, nullable=False)

    session_token = Column(String, unique=True, index=True, nullable=False)

    login_time = Column(
        DateTime,
        default=datetime.utcnow
    )

    last_activity = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    is_active = Column(
        Boolean,
        default=True
    )


    # ==========================
# Employee Table
# ==========================

class Employee(Base):

    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(String, unique=True, nullable=False)

    age = Column(Integer, nullable=False)

    gender = Column(String, nullable=False)

    marital_status = Column(String, nullable=False)

    department = Column(String, nullable=False)

    job_role = Column(String, nullable=False)

    job_level = Column(Integer, nullable=False)

    monthly_income = Column(Float, nullable=False)

    hourly_rate = Column(Float, nullable=False)

    years_at_company = Column(Integer, nullable=False)

    years_in_current_role = Column(Integer, nullable=False)

    years_since_last_promotion = Column(Integer, nullable=False)

    work_life_balance = Column(String, nullable=False)

    job_satisfaction = Column(String, nullable=False)

    performance_rating = Column(String, nullable=False)

    training_hours_last_year = Column(Integer, nullable=False)

    overtime = Column(String, nullable=False)

    project_count = Column(Integer, nullable=False)

    average_hours_worked_per_week = Column(Float, nullable=False)

    absenteeism = Column(Integer, nullable=False)

    work_environment_satisfaction = Column(String, nullable=False)

    relationship_with_manager = Column(String, nullable=False)

    job_involvement = Column(String, nullable=False)

    distance_from_home = Column(Float, nullable=False)

    number_of_companies_worked = Column(Integer, nullable=False)

    attrition = Column(String, nullable=False)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )