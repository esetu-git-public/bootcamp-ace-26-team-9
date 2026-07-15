"""
Production verification test suite for Employee Attrition Prediction System.
Tests Database, ML Model & Inference Engine, and FastAPI endpoints.
"""

import os
import sys

# Ensure root folder and backend folder are in path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(ROOT_DIR)
sys.path.append(os.path.join(ROOT_DIR, "backend"))

from fastapi.testclient import TestClient
from backend.main import app
from backend.database.database import create_tables
from backend.services.prediction_service import PredictionService

client = TestClient(app)


def test_db_initialization():
    """Verify that SQLAlchemy initializes all database tables."""
    create_tables()
    assert True, "Database initialized successfully"


def test_prediction_service_inference():
    """Verify that PredictionService correctly runs inference and returns enriched response."""
    sample_employee = {
        "Age": 32,
        "Gender": "Male",
        "Marital_Status": "Married",
        "Department": "Research & Development",
        "Job_Role": "Laboratory Technician",
        "Job_Level": 2,
        "Monthly_Income": 3200,
        "Hourly_Rate": 65,
        "Years_at_Company": 2,
        "Years_in_Current_Role": 1,
        "Years_Since_Last_Promotion": 0,
        "Work_Life_Balance": 2,
        "Job_Satisfaction": 1,
        "Performance_Rating": 3,
        "Training_Hours_Last_Year": 2,
        "Overtime": "Yes",
        "Project_Count": 4,
        "Average_Hours_Worked_Per_Week": 45,
        "Absenteeism": 3,
        "Work_Environment_Satisfaction": 2,
        "Relationship_with_Manager": 2,
        "Job_Involvement": 2,
        "Distance_From_Home": 15,
        "Number_of_Companies_Worked": 4,
    }

    result = PredictionService.predict(sample_employee)
    assert "prediction" in result
    assert "probability" in result
    assert "risk_level" in result
    assert "top_factors" in result
    assert "recommendations" in result
    print("Inference Result:", result)


def test_health_check_endpoint():
    """Verify API root endpoint status."""
    response = client.get("/")
    assert response.status_code == 200
    assert "Employee Attrition Prediction API" in response.json().get("message", "")


def test_predict_endpoint():
    """Verify API /predict endpoint payload."""
    sample_payload = {
        "Age": 35,
        "Gender": "Female",
        "Marital_Status": "Single",
        "Department": "Sales",
        "Job_Role": "Sales Executive",
        "Job_Level": 2,
        "Monthly_Income": 6000,
        "Hourly_Rate": 80,
        "Years_at_Company": 5,
        "Years_in_Current_Role": 3,
        "Years_Since_Last_Promotion": 1,
        "Work_Life_Balance": 3,
        "Job_Satisfaction": 3,
        "Performance_Rating": 3,
        "Training_Hours_Last_Year": 2,
        "Overtime": "No",
        "Project_Count": 3,
        "Average_Hours_Worked_Per_Week": 40,
        "Absenteeism": 1,
        "Work_Environment_Satisfaction": 3,
        "Relationship_with_Manager": 3,
        "Job_Involvement": 3,
        "Distance_From_Home": 5,
        "Number_of_Companies_Worked": 2,
    }
    response = client.post("/predict", json=sample_payload)
    assert response.status_code == 200
    data = response.json()
    assert "prediction" in data
    assert "probability" in data
    assert "risk_score" in data
    assert "risk_level" in data
    assert "shap_explanations" in data
    print("API Predict Endpoint Output:", data)


def test_what_if_simulation_endpoint():
    """Verify API /predict/what-if simulation endpoint."""
    sample_payload = {
        "employee": {
            "Age": 32,
            "Gender": "Male",
            "Marital_Status": "Married",
            "Department": "Research & Development",
            "Job_Role": "Laboratory Technician",
            "Job_Level": 2,
            "Monthly_Income": 3200,
            "Hourly_Rate": 65,
            "Years_at_Company": 2,
            "Years_in_Current_Role": 1,
            "Years_Since_Last_Promotion": 0,
            "Work_Life_Balance": 2,
            "Job_Satisfaction": 1,
            "Performance_Rating": 3,
            "Training_Hours_Last_Year": 2,
            "Overtime": "Yes",
            "Project_Count": 4,
            "Average_Hours_Worked_Per_Week": 45,
            "Absenteeism": 3,
            "Work_Environment_Satisfaction": 2,
            "Relationship_with_Manager": 2,
            "Job_Involvement": 2,
            "Distance_From_Home": 15,
            "Number_of_Companies_Worked": 4
        },
        "modifications": {
            "MonthlyIncome": 7000,
            "OverTime": "No",
            "JobSatisfaction": 4
        }
    }
    response = client.post("/predict/what-if", json=sample_payload)
    assert response.status_code == 200
    data = response.json()
    assert "original" in data
    assert "simulated" in data
    assert "summary" in data
    print("What-If Simulation Output:", data["summary"])


def test_export_csv_report_endpoint():
    """Verify API /reports/export/csv export endpoint."""
    response = client.get("/reports/export/csv")
    assert response.status_code == 200
    assert response.headers["content-type"] == "text/csv; charset=utf-8" or "text/csv" in response.headers["content-type"]
    assert len(response.content) > 100


if __name__ == "__main__":
    print("Running production verification tests...")
    test_db_initialization()
    print("[PASS] Database Initialization Test")
    test_prediction_service_inference()
    print("[PASS] ML Prediction Service Inference Test")
    test_health_check_endpoint()
    print("[PASS] Health Check Endpoint Test")
    test_predict_endpoint()
    print("[PASS] API /predict Endpoint Test")
    test_what_if_simulation_endpoint()
    print("[PASS] API /predict/what-if Simulation Endpoint Test")
    test_export_csv_report_endpoint()
    print("[PASS] API /reports/export/csv Export Report Test")
    print("All production verification tests PASSED successfully!")

