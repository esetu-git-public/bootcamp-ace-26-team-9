import json
from pathlib import Path


ARTIFACT_PATH = Path("app/artifacts")


class MetricsService:

    @staticmethod
    def get_metrics():

        metrics_file = ARTIFACT_PATH / "model_metrics.json"

        if not metrics_file.exists():
            return {
                "status": "Model has not been trained yet."
            }

        with open(metrics_file, "r") as file:
            metrics = json.load(file)

        return metrics