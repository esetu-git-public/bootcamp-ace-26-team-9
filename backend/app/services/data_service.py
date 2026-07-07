import pandas as pd
from pathlib import Path

# Dataset Path
DATASET_PATH = Path("data/employee_attrition.csv")


class DataService:

    @staticmethod
    def load_dataset():
        """
        Load Employee Attrition Dataset
        """

        # Check if dataset exists
        if not DATASET_PATH.exists():
            raise FileNotFoundError(
                f"Dataset not found: {DATASET_PATH.resolve()}"
            )

        # Automatically detect separator (comma/tab)
        df = pd.read_csv(
            DATASET_PATH,
            sep=None,
            engine="python"
        )

        # Remove extra spaces from column names
        df.columns = df.columns.str.strip()

        # Debug information
        print("\n========== DATASET DEBUG ==========")
        print("Dataset Path :", DATASET_PATH.resolve())
        print("Rows         :", df.shape[0])
        print("Columns      :", df.shape[1])
        print("Column Names :", df.columns.tolist())
        print("===================================\n")

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