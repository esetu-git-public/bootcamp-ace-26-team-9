"""
Professional Data Preprocessing Pipeline for Employee Attrition Prediction System.
Handles data loading, cleaning, imputation of missing values, categorical encoding, and scaling.
"""

import os
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer

NUMERIC_FEATURES = [
    "Age", "MonthlyIncome", "YearsAtCompany", "DistanceFromHome",
    "JobSatisfaction", "WorkLifeBalance", "Education",
    "EnvironmentSatisfaction", "RelationshipSatisfaction"
]

CATEGORICAL_FEATURES = [
    "Gender", "Department", "JobRole", "OverTime", "BusinessTravel"
]

CORE_FEATURES = NUMERIC_FEATURES + CATEGORICAL_FEATURES


def load_dataset(file_path: str) -> pd.DataFrame:
    """Load dataset from CSV file."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Dataset file not found at path: {file_path}")
    df = pd.read_csv(file_path)
    return df


def clean_and_prepare_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Cleans raw dataset:
    1. Imputes missing values (median for numeric, mode for categorical).
    2. Drops zero-variance or identifier columns if present.
    3. Retains clean features for modeling.
    """
    df = df.copy()

    # Handle missing values
    for col in df.columns:
        if df[col].isnull().sum() > 0:
            if df[col].dtype in ['int64', 'float64']:
                df[col].fillna(df[col].median(), inplace=True)
            else:
                df[col].fillna(df[col].mode()[0], inplace=True)

    # Drop zero-variance or identifier columns
    cols_to_drop = ["EmployeeCount", "EmployeeNumber", "Over18", "StandardHours"]
    drops = [c for c in cols_to_drop if c in df.columns]
    if drops:
        df.drop(columns=drops, inplace=True)

    return df


def build_preprocessor() -> ColumnTransformer:
    """
    Constructs a robust sklearn ColumnTransformer pipeline for scaling and encoding.
    """
    scaler = StandardScaler()
    encoder = OneHotEncoder(handle_unknown="ignore", sparse_output=False)

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", scaler, NUMERIC_FEATURES),
            ("cat", encoder, CATEGORICAL_FEATURES)
        ]
    )
    return preprocessor


def encode_target(series: pd.Series) -> tuple[np.ndarray, LabelEncoder]:
    """Encodes binary target Attrition ('Yes' -> 1, 'No' -> 0)."""
    le = LabelEncoder()
    y = le.fit_transform(series)
    return y, le
