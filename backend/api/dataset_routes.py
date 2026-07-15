from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database.database import get_db
from auth.oauth2 import get_current_user
from services.data_service import DataService
from services.preprocessing_service import PreprocessingService
from services.feature_engineering_service import FeatureEngineeringService
from services.dataset_service import DatasetService

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


# ==========================================================
# Private User Datasets APIs
# ==========================================================

@router.get("/datasets", tags=["User Datasets"])
def list_datasets(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Retrieve all dataset reports uploaded by the current authenticated user.
    """
    user_id = current_user.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User identity not found in token"
        )
    return DatasetService.get_user_datasets(db=db, user_id=user_id)


@router.get("/datasets/{dataset_id}", tags=["User Datasets"])
def get_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Retrieve the full predictions list for a specific dataset report belonging to the current user.
    """
    user_id = current_user.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User identity not found in token"
        )
    
    dataset = DatasetService.get_user_dataset_by_id(db=db, dataset_id=dataset_id, user_id=user_id)
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset report not found or access denied"
        )
        
    predictions = DatasetService.load_predictions_from_file(dataset.filepath)
        
    return {
        "id": dataset.id,
        "filename": dataset.filename,
        "created_at": dataset.created_at,
        "predictions": predictions
    }


@router.delete("/datasets/{dataset_id}", tags=["User Datasets"])
def delete_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a specific dataset report belonging to the current user.
    """
    user_id = current_user.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User identity not found in token"
        )
        
    success = DatasetService.delete_user_dataset(db=db, dataset_id=dataset_id, user_id=user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset report not found or access denied"
        )
        
    return {"status": "Success", "message": "Dataset report deleted successfully"}
