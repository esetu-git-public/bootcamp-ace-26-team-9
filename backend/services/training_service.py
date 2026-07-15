"""
Training Service wrapper for triggering ML training pipeline.
Delegates directly to ml.train.train_pipeline to avoid duplicate code.
"""

from ml.train import train_pipeline


class TrainingService:

    @staticmethod
    def train():
        best_model, metadata = train_pipeline()
        return {
            "status": "Training Completed Successfully",
            "best_model": metadata.get("best_model_name"),
            "accuracy": metadata.get("evaluation_metrics", {}).get(metadata.get("best_model_name"), {}).get("accuracy"),
            "all_models": metadata.get("evaluation_metrics", {})
        }