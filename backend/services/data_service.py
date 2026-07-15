"""
Data Service for loading and inspecting the canonical IBM HR Employee Attrition dataset.
"""

import pandas as pd
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
DATASET_PATH = ROOT_DIR / "dataset" / "WA_Fn-UseC_-HR-Employee-Attrition.csv"


class DataService:

    @staticmethod
    def load_dataset():
        """
        Load Employee Attrition Dataset
        """
        if not DATASET_PATH.exists():
            raise FileNotFoundError(
                f"Dataset not found at canonical location: {DATASET_PATH.resolve()}"
            )

        df = pd.read_csv(
            DATASET_PATH,
            sep=None,
            engine="python"
        )
        df.columns = df.columns.str.strip()
        return df

    @staticmethod
    def get_dataset_info():
        df = DataService.load_dataset()
        return {
            "rows": int(df.shape[0]),
            "columns": int(df.shape[1]),
            "column_names": list(df.columns)
        }

    @staticmethod
    def get_missing_values():
        df = DataService.load_dataset()
        return df.isnull().sum().to_dict()

    @staticmethod
    def get_duplicates():
        df = DataService.load_dataset()
        return {
            "duplicates": int(df.duplicated().sum())
        }

    @staticmethod
    def get_data_types():
        df = DataService.load_dataset()
        return {
            column: str(dtype)
            for column, dtype in df.dtypes.items()
        }

    @staticmethod
    def get_target_distribution():
        df = DataService.load_dataset()
        if "Attrition" not in df.columns:
            return {
                "error": "Target column 'Attrition' not found.",
                "available_columns": list(df.columns)
            }
        return df["Attrition"].value_counts().to_dict()

    @staticmethod
    def get_numerical_columns():
        df = DataService.load_dataset()
        return list(
            df.select_dtypes(
                include=["int64", "float64"]
            ).columns
        )

    @staticmethod
    def get_categorical_columns():
        df = DataService.load_dataset()
        return list(
            df.select_dtypes(
                include=["object"]
            ).columns
        )

    @staticmethod
    def get_summary_statistics():
        df = DataService.load_dataset()
        return df.describe(include="all").fillna("").to_dict()