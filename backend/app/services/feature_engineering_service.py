import joblib
from pathlib import Path

ARTIFACT_PATH = Path("app/artifacts")


class FeatureEngineeringService:

    @staticmethod
    def prepare_features(df):

        # Target variable
        y = df["Attrition"]

        # Feature variables
        X = df.drop(columns=["Attrition"])

        # Save feature names
        ARTIFACT_PATH.mkdir(exist_ok=True)

        joblib.dump(
            list(X.columns),
            ARTIFACT_PATH / "feature_columns.pkl"
        )

        return X, y