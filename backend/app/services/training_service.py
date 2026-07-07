import json
import joblib

from pathlib import Path

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.impute import SimpleImputer

from sklearn.model_selection import train_test_split

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix
)

from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import (
    RandomForestClassifier,
    GradientBoostingClassifier
)

from app.services.data_service import DataService


ARTIFACT_PATH = Path("app/artifacts")


class TrainingService:

    @staticmethod
    def load_data():
        """
        Load dataset
        """
        return DataService.load_dataset()

    @staticmethod
    def split_features_target(df):
        """
        Split Features and Target
        """

        # Remove Employee_ID because it is not useful for prediction
        X = df.drop(
            columns=[
                "Employee_ID",
                "Attrition"
            ]
        )

        y = df["Attrition"]

        return X, y

    @staticmethod
    def create_preprocessor(X):
        """
        Create preprocessing pipeline
        """

        categorical_columns = X.select_dtypes(
            include=["object"]
        ).columns.tolist()

        numerical_columns = X.select_dtypes(
            exclude=["object"]
        ).columns.tolist()

        numeric_transformer = Pipeline(
            steps=[
                (
                    "imputer",
                    SimpleImputer(strategy="median")
                )
            ]
        )

        categorical_transformer = Pipeline(
            steps=[
                (
                    "imputer",
                    SimpleImputer(strategy="most_frequent")
                ),
                (
                    "encoder",
                    OneHotEncoder(handle_unknown="ignore")
                )
            ]
        )

        preprocessor = ColumnTransformer(
            transformers=[
                (
                    "num",
                    numeric_transformer,
                    numerical_columns
                ),
                (
                    "cat",
                    categorical_transformer,
                    categorical_columns
                )
            ]
        )

        return preprocessor

    @staticmethod
    def get_models():

        return {

            "Logistic Regression":
                LogisticRegression(
                    max_iter=1000,
                    random_state=42
                ),

            "Decision Tree":
                DecisionTreeClassifier(
                    random_state=42
                ),

            "Random Forest":
                RandomForestClassifier(
                    random_state=42
                ),

            "Gradient Boosting":
                GradientBoostingClassifier(
                    random_state=42
                )

        }

    @staticmethod
    def train():

        # Load dataset
        df = TrainingService.load_data()

        # Split Features & Target
        X, y = TrainingService.split_features_target(df)

        # Create preprocessing
        preprocessor = TrainingService.create_preprocessor(X)

        # Split Data
        X_train, X_test, y_train, y_test = train_test_split(
            X,
            y,
            test_size=0.20,
            random_state=42,
            stratify=y
        )

        models = TrainingService.get_models()

        results = {}

        best_model = None
        best_model_name = ""

        best_accuracy = 0

        # Train all models
        for name, model in models.items():

            pipeline = Pipeline(
                steps=[
                    ("preprocessor", preprocessor),
                    ("classifier", model)
                ]
            )

            pipeline.fit(X_train, y_train)

            predictions = pipeline.predict(X_test)

            accuracy = accuracy_score(
                y_test,
                predictions
            )

            precision = precision_score(
                y_test,
                predictions,
                pos_label="Yes",
                zero_division=0
            )

            recall = recall_score(
                y_test,
                predictions,
                pos_label="Yes",
                zero_division=0
            )

            f1 = f1_score(
                y_test,
                predictions,
                pos_label="Yes",
                zero_division=0
            )

            cm = confusion_matrix(
                y_test,
                predictions
            ).tolist()

            results[name] = {

                "accuracy": round(accuracy, 4),

                "precision": round(precision, 4),

                "recall": round(recall, 4),

                "f1_score": round(f1, 4),

                "confusion_matrix": cm

            }

            if accuracy > best_accuracy:

                best_accuracy = accuracy
                best_model = pipeline
                best_model_name = name

        # Create artifacts folder
        ARTIFACT_PATH.mkdir(
            parents=True,
            exist_ok=True
        )

        # Save Model
        joblib.dump(
            best_model,
            ARTIFACT_PATH / "model.pkl"
        )

        # Save Feature Names
        joblib.dump(
            list(X.columns),
            ARTIFACT_PATH / "feature_columns.pkl"
        )

        # Save Metrics
        metrics = {

            "best_model": best_model_name,

            "accuracy": round(best_accuracy, 4),

            "all_models": results

        }

        with open(
            ARTIFACT_PATH / "model_metrics.json",
            "w"
        ) as file:

            json.dump(
                metrics,
                file,
                indent=4
            )

        return {

            "status": "Training Completed Successfully",

            "best_model": best_model_name,

            "accuracy": round(best_accuracy, 4),

            "all_models": results

        }