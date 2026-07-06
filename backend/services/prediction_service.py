import os
import json
import joblib
import pandas as pd
import numpy as np

# Define paths to model artifacts
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
ML_DIR = os.path.join(BACKEND_DIR, "..", "..", "ml_model")
MODEL_PATH = os.path.join(ML_DIR, "model.pkl")
SCALER_PATH = os.path.join(ML_DIR, "scaler.pkl")
ENCODER_PATH = os.path.join(ML_DIR, "encoder.pkl")
METADATA_PATH = os.path.join(ML_DIR, "model_metadata.json")

class PredictionService:
    def __init__(self):
        self.model = None
        self.preprocessor = None
        self.target_encoder = None
        self.metadata = None
        self.load_artifacts()

    def load_artifacts(self):
        """
        Loads ML model artifacts into memory.
        """
        try:
            if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH) and os.path.exists(ENCODER_PATH):
                self.model = joblib.load(MODEL_PATH)
                self.preprocessor = joblib.load(SCALER_PATH)
                self.target_encoder = joblib.load(ENCODER_PATH)
                if os.path.exists(METADATA_PATH):
                    with open(METADATA_PATH, "r") as f:
                        self.metadata = json.load(f)
                print("[SUCCESS] ML Model artifacts successfully loaded into PredictionService.")
            else:
                print("[WARNING] Model artifacts not found yet. Run train_model.py first.")
        except Exception as e:
            print(f"[ERROR] Error loading model artifacts: {str(e)}")

    def is_ready(self):
        return self.model is not None and self.preprocessor is not None

    def _generate_retention_suggestion(self, data, risk_level, probability):
        """
        Generates tailored HR retention suggestions based on specific risk factors.
        """
        if risk_level == "Low":
            return "Employee demonstrates strong retention stability. Continue current engagement strategies and regular performance recognition."
            
        suggestions = []
        
        # Check specific risk drivers
        if str(data.get("OverTime", "")).lower() == "yes":
            suggestions.append("review workload distribution and offer flexible scheduling to mitigate overtime burnout")
        if int(data.get("JobSatisfaction", 3)) <= 2:
            suggestions.append("schedule a 1-on-1 career aspirations check-in to identify role frustrations")
        if int(data.get("WorkLifeBalance", 3)) <= 2:
            suggestions.append("explore hybrid work options or mental health & wellness initiatives")
        if int(data.get("EnvironmentSatisfaction", 3)) <= 2:
            suggestions.append("assess team ergonomics, tools, and immediate managerial relationship")
        if float(data.get("MonthlyIncome", 5000)) < 4000:
            suggestions.append("evaluate current compensation against market benchmarks for potential salary adjustment or bonus incentives")
        if int(data.get("DistanceFromHome", 5)) > 15:
            suggestions.append("discuss remote work flexibility or commuter benefits")
        if int(data.get("YearsAtCompany", 5)) <= 2:
            suggestions.append("enhance mentorship pairing and clear onboarding milestone reviews")
            
        if not suggestions:
            suggestions.append("conduct a comprehensive stay interview to understand employee motivations and career growth desires")
            
        formatted_suggestions = "; ".join(suggestions).capitalize() + "."
        if risk_level == "High":
            return f"CRITICAL INTERVENTION REQUIRED: {formatted_suggestions}"
        else:
            return f"PROACTIVE MONITORING RECOMMENDED: {formatted_suggestions}"

    def predict(self, input_data):
        """
        Performs attrition inference on employee data.
        """
        if not self.is_ready():
            self.load_artifacts()
            if not self.is_ready():
                raise RuntimeError("ML Model is not loaded or trained yet.")

        # Expected numeric and categorical fields
        numeric_fields = ["Age", "MonthlyIncome", "YearsAtCompany", "DistanceFromHome", 
                          "JobSatisfaction", "WorkLifeBalance", "Education", 
                          "EnvironmentSatisfaction", "RelationshipSatisfaction"]
        categorical_fields = ["Gender", "Department", "JobRole", "OverTime", "BusinessTravel"]

        # Build a single-row DataFrame with correct types
        row_dict = {}
        for field in numeric_fields:
            val = input_data.get(field, 0)
            row_dict[field] = [float(val) if field == "MonthlyIncome" else int(val)]
            
        for field in categorical_fields:
            val = input_data.get(field, "")
            row_dict[field] = [str(val)]
            
        df = pd.DataFrame(row_dict)
        
        # Preprocess features using the fit ColumnTransformer
        X_processed = self.preprocessor.transform(df)
        
        # Predict
        pred_class_idx = self.model.predict(X_processed)[0]
        
        if hasattr(self.model, "predict_proba"):
            probs = self.model.predict_proba(X_processed)[0]
            # Class 1 is 'Yes' (Leave), Class 0 is 'No' (Stay)
            # Find which index corresponds to 'Yes'
            classes = list(self.target_encoder.classes_)
            yes_idx = classes.index("Yes") if "Yes" in classes else 1
            prob_leave = probs[yes_idx]
            confidence = max(probs)
        else:
            prob_leave = 1.0 if pred_class_idx == 1 else 0.0
            confidence = 1.0

        prediction_label = "Leave" if prob_leave >= 0.5 else "Stay"
        probability_pct = round(prob_leave * 100, 1)
        
        if probability_pct >= 65.0:
            risk_level = "High"
        elif probability_pct >= 35.0:
            risk_level = "Medium"
        else:
            risk_level = "Low"
            
        retention_suggestion = self._generate_retention_suggestion(input_data, risk_level, probability_pct)
        
        return {
            "prediction": prediction_label,
            "probability": probability_pct,
            "risk_level": risk_level,
            "retention_suggestion": retention_suggestion,
            "confidence_score": round(float(confidence), 2),
            "model_used": self.metadata.get("best_model_name", "AI Classifier") if self.metadata else "AI Classifier"
        }

# Singleton instance
prediction_service = PredictionService()
