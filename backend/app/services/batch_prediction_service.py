import joblib
import pandas as pd
from pathlib import Path

ARTIFACT_PATH = Path("app/artifacts")


class BatchPredictionService:

    @staticmethod
    def predict_csv(file_path: str):

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
            X = df.drop(columns=["Employee_ID"])
        else:
            employee_ids = None
            X = df

        predictions = model.predict(X)

        probabilities = model.predict_proba(X)

        confidence = [
            round(max(prob) * 100, 2)
            for prob in probabilities
        ]

        result = df.copy()

        if employee_ids is not None:
            result["Employee_ID"] = employee_ids

        result["Prediction"] = predictions
        result["Confidence"] = confidence

        output_path = Path("app/artifacts/predictions.csv")

        result.to_csv(
            output_path,
            index=False
        )

        return {
            "status": "Success",
            "total_records": len(result),
            "output_file": str(output_path),
            "predictions": result.to_dict(orient="records")
        }