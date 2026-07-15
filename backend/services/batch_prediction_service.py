"""
Batch Prediction Service for evaluating CSV datasets.
Uses production ml.predict AttritionPredictor.
"""

import pandas as pd
from pathlib import Path
from services.prediction_service import get_predictor, normalize_employee_data


class BatchPredictionService:

    @staticmethod
    def predict_csv(file_path: str) -> dict:
        predictor = get_predictor()

        df = pd.read_csv(
            file_path,
            sep=None,
            engine="python"
        )
        df.columns = df.columns.str.strip()

        predictions = []
        probabilities = []
        risk_levels = []

        for _, row in df.iterrows():
            row_dict = row.to_dict()
            norm = normalize_employee_data(row_dict)
            res = predictor.predict_employee(norm)
            predictions.append(res["prediction"])
            probabilities.append(res["probability"])
            risk_levels.append(res["risk_level"])

        result = df.copy()
        result["Prediction"] = predictions
        result["Probability"] = probabilities
        result["Confidence"] = probabilities
        result["Risk_Level"] = risk_levels

        output_dir = Path("predictions_output")
        output_dir.mkdir(exist_ok=True)
        output_path = output_dir / "batch_predictions.csv"

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