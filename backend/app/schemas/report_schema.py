from pydantic import BaseModel
from datetime import datetime


# ==========================
# Employee Report
# ==========================

class EmployeeReport(BaseModel):

    id: int
    employee_id: str
    age: int
    gender: str
    department: str
    job_role: str
    monthly_income: float
    overtime: str
    attrition: str
    created_at: datetime

    class Config:
        from_attributes = True


# ==========================
# Prediction Report
# ==========================

class PredictionReport(BaseModel):

    id: int
    employee_id: str
    prediction: str
    probability: float
    model_name: str
    created_at: datetime

    class Config:
        from_attributes = True


# ==========================
# Training Report
# ==========================

class TrainingReport(BaseModel):

    id: int
    model_name: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    created_at: datetime

    class Config:
        from_attributes = True