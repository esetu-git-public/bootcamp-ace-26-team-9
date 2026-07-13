import joblib
import pandas as pd
from pathlib import Path

ARTIFACT_PATH = Path("app/artifacts")


class BatchPredictionService:

    @staticmethod
    def predict_csv(file_path: str):
        from app.services.prediction_service import PredictionService

        model = joblib.load(
            ARTIFACT_PATH / "model.pkl"
        )

        df = pd.read_csv(
            file_path,
            sep=None,
            engine="python"
        )

        df.columns = df.columns.str.strip()

        if "Employee_ID" in df.columns:
            employee_ids = df["Employee_ID"]
        else:
            employee_ids = None

        # Drop columns that are not features for the model
        cols_to_drop = ["Employee_ID", "Attrition"]
        existing_drops = [col for col in cols_to_drop if col in df.columns]
        X = df.drop(columns=existing_drops)

        predictions = model.predict(X)

        probabilities = model.predict_proba(X)

        classes = list(model.classes_)
        if "Yes" in classes:
            yes_idx = classes.index("Yes")
        elif 1 in classes:
            yes_idx = classes.index(1)
        else:
            yes_idx = 1

        attrition_probs = probabilities[:, yes_idx]

        predictions_list = []
        for idx, row in df.iterrows():
            risk_pct = round(float(attrition_probs[idx]) * 100, 2)
            risk_lvl = "High" if risk_pct >= 70 else "Medium" if risk_pct >= 30 else "Low"
            
            row_dict = row.to_dict()
            row_factors, row_recs = PredictionService.get_explainability_and_recommendations(row_dict)
            
            record = row_dict.copy()
            if employee_ids is not None:
                record["Employee_ID"] = str(employee_ids.iloc[idx])
            else:
                record["Employee_ID"] = f"EMP{1000 + idx}"
                
            record["Prediction"] = str(predictions[idx])
            record["Confidence"] = risk_pct
            record["Risk_Percentage"] = risk_pct
            record["Risk_Level"] = risk_lvl
            record["Factors"] = row_factors
            record["Recommendations"] = row_recs
            predictions_list.append(record)

        # Re-save predicted dataframe to predictions.csv
        result = df.copy()
        if employee_ids is not None:
            result["Employee_ID"] = employee_ids
        result["Prediction"] = predictions
        result["Confidence"] = [round(float(p) * 100, 2) for p in attrition_probs]
        result["Risk_Percentage"] = result["Confidence"]
        result["Risk_Level"] = ["High" if p >= 70 else "Medium" if p >= 30 else "Low" for p in result["Confidence"]]

        output_path = Path("app/artifacts/predictions.csv")
        result.to_csv(
            output_path,
            index=False
        )

        return {
            "status": "Success",
            "total_records": len(result),
            "output_file": str(output_path),
            "predictions": predictions_list
        }