"""
Professional Training Script for Employee Attrition Prediction System.
Trains 5 distinct ML models, compares metrics, selects best model automatically, and saves artifacts.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import json
import joblib
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from xgboost import XGBClassifier

from ml.preprocessing import (
    load_dataset,
    clean_and_prepare_data,
    build_preprocessor,
    encode_target,
    CORE_FEATURES,
    NUMERIC_FEATURES,
    CATEGORICAL_FEATURES
)
from ml.evaluation import (
    evaluate_model,
    save_confusion_matrix_plot,
    save_feature_importance_plot,
    print_comparison_table
)

ML_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(ML_DIR, "..", "dataset", "WA_Fn-UseC_-HR-Employee-Attrition.csv")
MODEL_PATH = os.path.join(ML_DIR, "model.pkl")
SCALER_PATH = os.path.join(ML_DIR, "scaler.pkl")
ENCODER_PATH = os.path.join(ML_DIR, "encoder.pkl")
METADATA_PATH = os.path.join(ML_DIR, "model_metadata.json")
CONFUSION_MATRIX_PATH = os.path.join(ML_DIR, "confusion_matrix.png")
FEATURE_IMPORTANCE_PATH = os.path.join(ML_DIR, "feature_importance.png")


def train_pipeline(data_path: str = DATASET_PATH):
    print("==============================================================================")
    print(" STARTING ML PIPELINE: DATA LOADING, PREPROCESSING & MODEL TRAINING")
    print("==============================================================================\n")

    raw_df = load_dataset(data_path)
    df = clean_and_prepare_data(raw_df)

    # Prepare features and target
    y, target_encoder = encode_target(df["Attrition"])
    X = df[CORE_FEATURES]

    # Stratified Train/Test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"[INFO] Split dataset -> Train: {len(X_train)} rows | Test: {len(X_test)} rows.")

    # Build and fit Preprocessor
    preprocessor = build_preprocessor()
    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)

    # Get encoded feature names
    cat_encoder = preprocessor.named_transformers_["cat"]
    encoded_cat_names = list(cat_encoder.get_feature_names_out(CATEGORICAL_FEATURES))
    all_feature_names = list(NUMERIC_FEATURES) + encoded_cat_names

    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, class_weight="balanced", random_state=42),
        "Decision Tree": DecisionTreeClassifier(max_depth=6, class_weight="balanced", random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=200, max_depth=10, class_weight="balanced", random_state=42),
        "XGBoost": XGBClassifier(n_estimators=200, max_depth=5, learning_rate=0.08, scale_pos_weight=4, random_state=42, eval_metric="logloss"),
        "Gradient Boosting": GradientBoostingClassifier(n_estimators=200, max_depth=5, learning_rate=0.08, random_state=42)
    }

    results = []
    best_name = None
    best_model = None
    best_score = -1.0
    best_pred = None

    print("\n[INFO] Training and Evaluating 5 Algorithms...")
    for name, model in models.items():
        model.fit(X_train_processed, y_train)
        metrics = evaluate_model(model, X_test_processed, y_test, name)
        
        # Scoring function balancing F1-Score and ROC-AUC
        score = (metrics["f1_score"] * 0.55) + (metrics["roc_auc"] * 0.45)
        
        summary = {
            "model": name,
            "accuracy": metrics["accuracy"],
            "precision": metrics["precision"],
            "recall": metrics["recall"],
            "f1_score": metrics["f1_score"],
            "roc_auc": metrics["roc_auc"],
            "combined_score": round(score, 4)
        }
        results.append(summary)

        if score > best_score:
            best_score = score
            best_name = name
            best_model = model
            best_pred = metrics["y_pred"]

    print_comparison_table(results)
    print(f"[WINNER] Best Model: ** {best_name} ** (Combined Score: {best_score:.4f})")

    # Generate Evaluation Charts
    save_confusion_matrix_plot(y_test, best_pred, best_name, CONFUSION_MATRIX_PATH)
    save_feature_importance_plot(best_model, all_feature_names, FEATURE_IMPORTANCE_PATH)

    # Serialize Best Model and Artifacts
    joblib.dump(best_model, MODEL_PATH)
    joblib.dump(preprocessor, SCALER_PATH)
    joblib.dump(target_encoder, ENCODER_PATH)

    metadata = {
        "best_model_name": best_name,
        "best_combined_score": best_score,
        "feature_names": all_feature_names,
        "numeric_features": NUMERIC_FEATURES,
        "categorical_features": CATEGORICAL_FEATURES,
        "target_classes": list(target_encoder.classes_),
        "evaluation_metrics": results
    }

    with open(METADATA_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print(f"\n[SUCCESS] Serialized Best Model -> {MODEL_PATH}")
    print(f"[SUCCESS] Serialized Preprocessor -> {SCALER_PATH}")
    print(f"[SUCCESS] Serialized Metadata     -> {METADATA_PATH}")
    return best_model, metadata


if __name__ == "__main__":
    train_pipeline()
