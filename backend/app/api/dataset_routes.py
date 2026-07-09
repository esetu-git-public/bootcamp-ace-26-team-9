from fastapi import APIRouter

from app.services.data_service import DataService
from app.services.preprocessing_service import PreprocessingService
from app.services.feature_engineering_service import FeatureEngineeringService

router = APIRouter()


# ==========================================================
# Dataset APIs
# ==========================================================

@router.get("/dataset/info", tags=["Dataset"])
def dataset_info():
    return DataService.get_dataset_info()


@router.get("/dataset/missing-values", tags=["Dataset"])
def missing_values():
    return DataService.get_missing_values()


@router.get("/dataset/duplicates", tags=["Dataset"])
def duplicates():
    return DataService.get_duplicates()


@router.get("/dataset/data-types", tags=["Dataset"])
def data_types():
    return DataService.get_data_types()


@router.get("/dataset/target-distribution", tags=["Dataset"])
def target_distribution():
    return DataService.get_target_distribution()


@router.get("/dataset/numerical-columns", tags=["Dataset"])
def numerical_columns():
    return DataService.get_numerical_columns()


@router.get("/dataset/categorical-columns", tags=["Dataset"])
def categorical_columns():
    return DataService.get_categorical_columns()


@router.get("/dataset/summary", tags=["Dataset"])
def summary():
    return DataService.get_summary_statistics()


@router.get("/dataset/preprocess", tags=["Dataset"])
def preprocess():

    df = DataService.load_dataset()

    processed_df, _ = PreprocessingService.preprocess(df)

    return {
        "rows": processed_df.shape[0],
        "columns": processed_df.shape[1],
        "message": "Dataset Preprocessed Successfully"
    }


@router.get("/dataset/features", tags=["Dataset"])
def get_features():

    df = DataService.load_dataset()

    processed_df, _ = PreprocessingService.preprocess(df)

    X, y = FeatureEngineeringService.prepare_features(processed_df)

    return {
        "feature_count": len(X.columns),
        "target_column": "Attrition",
        "features": list(X.columns)
    }