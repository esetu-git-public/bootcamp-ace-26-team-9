import joblib
from pathlib import Path

ARTIFACT_PATH = Path("app/artifacts")


class PredictionService:

    @staticmethod
    def load_model():

        model = joblib.load(
            ARTIFACT_PATH / "model.pkl"
        )

        return model

    @staticmethod
    def predict(employee_data):

        model = PredictionService.load_model()

        prediction = model.predict(employee_data)

        probability = model.predict_proba(employee_data)

        return {

            "prediction": prediction[0],

            "probability": round(
                max(probability[0]) * 100,
                2
            )

        }