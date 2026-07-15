"""
Metrics Service to retrieve ML model evaluation metrics and benchmark data.
"""

import json
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
METADATA_FILE = ROOT_DIR / "ml" / "model_metadata.json"


class MetricsService:

    @staticmethod
    def get_metrics():
        if not METADATA_FILE.exists():
            return {
                "status": "Model has not been trained yet."
            }

        with open(METADATA_FILE, "r", encoding="utf-8") as file:
            metrics = json.load(file)

        return metrics