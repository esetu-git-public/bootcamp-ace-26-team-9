"""
Feature Engineering Service for separating dataset features and targets.
"""


class FeatureEngineeringService:

    @staticmethod
    def prepare_features(df):
        # Target variable
        y = df["Attrition"] if "Attrition" in df.columns else None

        # Feature variables
        X = df.drop(columns=["Attrition"]) if "Attrition" in df.columns else df

        return X, y