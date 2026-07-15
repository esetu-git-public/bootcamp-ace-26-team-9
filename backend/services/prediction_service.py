"""
Service layer for Employee Attrition Predictions.
Integrates with ml.predict AttritionPredictor to provide production-ready intelligence.
Handles field normalization between Pydantic API schemas and ML model features.
"""

import os
import pandas as pd
from ml.predict import AttritionPredictor

_predictor_instance = None


def get_predictor():
    global _predictor_instance
    if _predictor_instance is None:
        _predictor_instance = AttritionPredictor()
    return _predictor_instance


def normalize_employee_data(data_dict: dict) -> dict:
    """Map any schema variations to canonical ML feature names."""
    mapping = {
        "Monthly_Income": "MonthlyIncome",
        "Years_at_Company": "YearsAtCompany",
        "Overtime": "OverTime",
        "Job_Role": "JobRole",
        "Work_Life_Balance": "WorkLifeBalance",
        "Job_Satisfaction": "JobSatisfaction",
        "Distance_From_Home": "DistanceFromHome",
        "Work_Environment_Satisfaction": "EnvironmentSatisfaction",
        "Relationship_with_Manager": "RelationshipSatisfaction",
    }
    normalized = dict(data_dict)
    for k, v in mapping.items():
        if k in normalized and mapping[k] not in normalized:
            normalized[mapping[k]] = normalized[k]

    # Provide default values for required model features if missing
    defaults = {
        "Age": 35,
        "Gender": "Male",
        "Department": "Research & Development",
        "JobRole": "Laboratory Technician",
        "OverTime": "No",
        "MonthlyIncome": 5000,
        "YearsAtCompany": 5,
        "DistanceFromHome": 5,
        "JobSatisfaction": 3,
        "WorkLifeBalance": 3,
        "Education": 3,
        "EnvironmentSatisfaction": 3,
        "RelationshipSatisfaction": 3,
        "BusinessTravel": "Travel_Rarely"
    }
    for feat, default_val in defaults.items():
        if feat not in normalized or normalized[feat] == "" or normalized[feat] is None:
            normalized[feat] = default_val

    return normalized


class PredictionService:
    @staticmethod
    def predict(employee_data) -> dict:
        """
        Runs prediction on an employee dict or single-row DataFrame.
        Returns full intelligence payload.
        """
        predictor = get_predictor()
        if isinstance(employee_data, pd.DataFrame):
            row_dict = employee_data.iloc[0].to_dict()
            norm_dict = normalize_employee_data(row_dict)
            res = predictor.predict_employee(norm_dict)
        elif isinstance(employee_data, dict):
            norm_dict = normalize_employee_data(employee_data)
            res = predictor.predict_employee(norm_dict)
        return res

    @staticmethod
    def simulate_what_if(employee_data: dict, modifications: dict) -> dict:
        """
        Simulates What-If retention scenarios by applying modifications to base employee data
        and computing instantaneous risk delta.
        """
        original_res = PredictionService.predict(employee_data)

        simulated_data = dict(employee_data)
        simulated_data.update(modifications)
        simulated_res = PredictionService.predict(simulated_data)

        prob_delta = round(simulated_res["probability"] - original_res["probability"], 2)
        score_delta = simulated_res["risk_score"] - original_res["risk_score"]

        direction = "decreased" if prob_delta < 0 else "increased"
        summary = (
            f"What-If simulation {direction} Attrition Probability by {abs(prob_delta)}% "
            f"(from {original_res['probability']}% [{original_res['risk_level']}] to "
            f"{simulated_res['probability']}% [{simulated_res['risk_level']}])."
        )

        return {
            "original": original_res,
            "simulated": simulated_res,
            "probability_change": prob_delta,
            "risk_score_change": score_delta,
            "summary": summary
        }