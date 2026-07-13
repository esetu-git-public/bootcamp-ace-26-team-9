import unittest
from unittest.mock import patch, MagicMock
import pandas as pd
from fastapi.testclient import TestClient

# Ensure backend/app can be found when running from backend directory or project root
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from app.main import app
from app.services.prediction_service import PredictionService
from app.auth.oauth2 import get_current_user
from app.database.database import get_db

# Dummy mock user
mock_user = {"sub": "admin@company.com", "role": "HR"}

# Sample data for testing
sample_employee_dict = {
    "Age": 30,
    "Gender": "Male",
    "Marital_Status": "Single",
    "Department": "IT",
    "Job_Role": "Developer",
    "Job_Level": 2,
    "Monthly_Income": 5000.0,
    "Hourly_Rate": 40.0,
    "Years_at_Company": 5,
    "Years_in_Current_Role": 3,
    "Years_Since_Last_Promotion": 1,
    "Work_Life_Balance": 3,
    "Job_Satisfaction": 4,
    "Performance_Rating": 3,
    "Training_Hours_Last_Year": 20,
    "Overtime": "Yes",
    "Project_Count": 4,
    "Average_Hours_Worked_Per_Week": 40,
    "Absenteeism": 2,
    "Work_Environment_Satisfaction": 3,
    "Relationship_with_Manager": 3,
    "Job_Involvement": 3,
    "Distance_From_Home": 10,
    "Number_of_Companies_Worked": 2
}


class TestPredictionService(unittest.TestCase):

    @patch("app.services.prediction_service.PredictionService.load_model")
    @patch("app.services.prediction_service.Path.exists")
    def test_predict_returns_correct_keys_and_values(self, mock_exists, mock_load_model):
        # Arrange
        mock_exists.return_value = True
        
        # Mock ML Model pipeline predict & predict_proba
        mock_pipeline = MagicMock()
        mock_pipeline.predict.return_value = ["Yes"]
        mock_pipeline.predict_proba.return_value = [[0.15, 0.85]]
        mock_load_model.return_value = mock_pipeline
        
        input_df = pd.DataFrame([sample_employee_dict])
        
        # Mock loading metrics for model name
        with patch("builtins.open", unittest.mock.mock_open(read_data='{"best_model": "Gradient Boosting", "accuracy": 0.82}')):
            # Act
            result = PredictionService.predict(input_df)
            
            # Assert
            self.assertIn("prediction", result)
            self.assertIn("confidence", result)
            self.assertIn("model_name", result)
            self.assertEqual(result["prediction"], "Yes")
            self.assertEqual(result["confidence"], 85.0)
            self.assertEqual(result["model_name"], "Gradient Boosting")


class TestPredictionRoutes(unittest.TestCase):

    def setUp(self):
        # Override the dependency for authenticated user
        app.dependency_overrides[get_current_user] = lambda: mock_user
        self.client = TestClient(app)

    def tearDown(self):
        # Clean overrides
        app.dependency_overrides.clear()

    @patch("app.api.prediction_routes.PredictionService.predict")
    @patch("app.api.prediction_routes.CRUDService.save_prediction")
    def test_predict_endpoint_success(self, mock_save_prediction, mock_predict):
        # Arrange
        mock_predict.return_value = {
            "prediction": "No",
            "confidence": 92.5,
            "model_name": "Gradient Boosting"
        }
        
        # Act
        response = self.client.post("/predict", json=sample_employee_dict)
        
        # Assert
        self.assertEqual(response.status_code, 200)
        resp_data = response.json()
        self.assertEqual(resp_data["prediction"], "No")
        self.assertEqual(resp_data["confidence"], 92.5)
        self.assertEqual(resp_data["model_name"], "Gradient Boosting")
        
        # Verify db save was called
        mock_save_prediction.assert_called_once()

    def test_predict_endpoint_unauthorized(self):
        # Arrange - remove authentication override
        del app.dependency_overrides[get_current_user]
        
        # Act
        response = self.client.post("/predict", json=sample_employee_dict)
        
        # Assert
        self.assertEqual(response.status_code, 401)
