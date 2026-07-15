import os
import json
import joblib
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, classification_report

# Algorithmic Models
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
try:
    from xgboost import XGBClassifier
    XGBOOST_AVAILABLE = True
except ImportError:
    from sklearn.ensemble import GradientBoostingClassifier as XGBClassifier
    XGBOOST_AVAILABLE = False
    print("[WARNING] XGBoost not found. Using sklearn GradientBoostingClassifier as alternative.")

# Define paths
ML_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(ML_DIR, "..", "dataset", "WA_Fn-UseC_-HR-Employee-Attrition.csv")
MODEL_PATH = os.path.join(ML_DIR, "model.pkl")
SCALER_PATH = os.path.join(ML_DIR, "scaler.pkl")
ENCODER_PATH = os.path.join(ML_DIR, "encoder.pkl")
METADATA_PATH = os.path.join(ML_DIR, "model_metadata.json")

def load_and_clean_data(file_path=DATASET_PATH):
    """
    Loads dataset, checks for nulls, and performs initial cleaning.
    """
    if not os.path.exists(file_path):
        # Try loading via dataset_loader if CSV isn't directly at path yet
        import sys
        sys.path.append(os.path.join(ML_DIR, "..", "dataset"))
        import dataset_loader
        df = dataset_loader.load_dataset(file_path)
    else:
        df = pd.read_csv(file_path)
        
    print(f"[INFO] Loaded raw dataset: {df.shape[0]} rows, {df.shape[1]} columns.")
    
    # Check for missing values
    null_counts = df.isnull().sum()
    total_nulls = null_counts.sum()
    if total_nulls > 0:
        print(f"[INFO] Handling {total_nulls} missing values via median/mode imputation...")
        for col in df.columns:
            if df[col].isnull().sum() > 0:
                if df[col].dtype in ['int64', 'float64']:
                    df[col].fillna(df[col].median(), inplace=True)
                else:
                    df[col].fillna(df[col].mode()[0], inplace=True)
    else:
        print("[INFO] No missing values detected in dataset.")
        
    # Drop redundant or non-predictive columns if they exist
    cols_to_drop = ["EmployeeCount", "EmployeeNumber", "Over18", "StandardHours"]
    existing_drops = [c for c in cols_to_drop if c in df.columns]
    if existing_drops:
        df.drop(columns=existing_drops, inplace=True)
        print(f"[INFO] Dropped zero-variance/identifier columns: {existing_drops}")
        
    return df

def perform_eda(df):
    """
    Performs basic exploratory data analysis and summary logging.
    """
    print("\n" + "="*50)
    print("EXPLORATORY DATA ANALYSIS (EDA)")
    print("="*50)
    print("Class Distribution (Attrition):")
    counts = df["Attrition"].value_counts()
    for label, count in counts.items():
        print(f" - {label}: {count} ({count/len(df)*100:.1f}%)")
        
    print("\nMean Numerical Values by Attrition:")
    num_cols = ["Age", "MonthlyIncome", "YearsAtCompany", "DistanceFromHome", "JobSatisfaction"]
    available_nums = [c for c in num_cols if c in df.columns]
    print(df.groupby("Attrition")[available_nums].mean().round(2))
    print("="*50 + "\n")

def train_and_evaluate():
    """
    Main pipeline:
    1. Strict Train/Test split before preprocessor fitting.
    2. Fit encoding and scaling artifacts.
    3. Train 4 ML models.
    4. Evaluate and compare metrics.
    5. Save best model and artifacts.
    """
    df = load_and_clean_data()
    perform_eda(df)
    
    # Target encoding
    target_encoder = LabelEncoder()
    y = target_encoder.fit_transform(df["Attrition"]) # No -> 0, Yes -> 1
    
    # Features
    # Define feature groups for preprocessor matching the 14 prediction form fields
    numeric_features = ["Age", "MonthlyIncome", "YearsAtCompany", "DistanceFromHome", 
                        "JobSatisfaction", "WorkLifeBalance", "Education", 
                        "EnvironmentSatisfaction", "RelationshipSatisfaction"]
            
    categorical_features = ["Gender", "Department", "JobRole", "OverTime", "BusinessTravel"]
    
    # Restrict X strictly to the 14 core features
    X = df[numeric_features + categorical_features]
            
    print(f"[INFO] Numeric features ({len(numeric_features)}): {numeric_features}")
    print(f"[INFO] Categorical features ({len(categorical_features)}): {categorical_features}")
    
    # STRICT FEATURIZATION ORDERING: Split data FIRST before fitting scaler/encoder
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"\n[INFO] Split dataset into Train ({len(X_train)}) and Test ({len(X_test)}) sets.")
    
    # Create preprocessing pipeline
    scaler = StandardScaler()
    encoder = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', scaler, numeric_features),
            ('cat', encoder, categorical_features)
        ]
    )
    
    # Fit preprocessor strictly on training data
    print("[INFO] Fitting StandardScaler and OneHotEncoder on training set...")
    preprocessor.fit(X_train)
    
    X_train_processed = preprocessor.transform(X_train)
    X_test_processed = preprocessor.transform(X_test)
    
    # Extract feature names after OneHotEncoding
    cat_encoder = preprocessor.named_transformers_['cat']
    encoded_cat_names = cat_encoder.get_feature_names_out(categorical_features)
    all_feature_names = list(numeric_features) + list(encoded_cat_names)
    
    # Define models
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42, class_weight='balanced'),
        "Decision Tree": DecisionTreeClassifier(max_depth=6, random_state=42, class_weight='balanced'),
        "Random Forest": RandomForestClassifier(n_estimators=150, max_depth=10, random_state=42, class_weight='balanced'),
        "XGBoost": XGBClassifier(n_estimators=150, max_depth=5, learning_rate=0.08, random_state=42, scale_pos_weight=4)
    }
    
    results = []
    best_model_name = None
    best_model_obj = None
    best_score = -1.0
    
    print("\n" + "="*70)
    print(f"{'MODEL COMPARISON RESULTS':^70}")
    print("="*70)
    print(f"{'Algorithm':<22} | {'Accuracy':<10} | {'Precision':<10} | {'Recall':<10} | {'F1-Score':<10} | {'ROC-AUC':<8}")
    print("-" * 70)
    
    for name, model in models.items():
        model.fit(X_train_processed, y_train)
        y_pred = model.predict(X_test_processed)
        y_prob = model.predict_proba(X_test_processed)[:, 1] if hasattr(model, "predict_proba") else y_pred
        
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        auc = roc_auc_score(y_test, y_prob)
        
        results.append({
            "model": name,
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "roc_auc": round(auc, 4)
        })
        
        print(f"{name:<22} | {acc:<10.4f} | {prec:<10.4f} | {rec:<10.4f} | {f1:<10.4f} | {auc:<8.4f}")
        
        # We select best model based on F1-Score (balance between precision & recall for attrition) or ROC-AUC
        score_to_maximize = (f1 * 0.5) + (acc * 0.5)
        if score_to_maximize > best_score:
            best_score = score_to_maximize
            best_model_name = name
            best_model_obj = model
            
    print("="*70)
    print(f"\n[WINNER] Best Performing Model: ** {best_model_name} ** (Combined Score: {best_score:.4f})")
    
    # Save artifacts
    print("\n[INFO] Saving serialized artifacts...")
    joblib.dump(best_model_obj, MODEL_PATH)
    joblib.dump(preprocessor, SCALER_PATH) # We save the full fit ColumnTransformer as scaler/preprocessor
    joblib.dump(target_encoder, ENCODER_PATH)
    
    # Also save separate scaler and encoder if requested individually by prompt
    # In our ColumnTransformer, 'num' is StandardScaler and 'cat' is OneHotEncoder
    joblib.dump(preprocessor.named_transformers_['num'], os.path.join(ML_DIR, "standalone_scaler.pkl"))
    joblib.dump(preprocessor.named_transformers_['cat'], os.path.join(ML_DIR, "standalone_encoder.pkl"))
    
    # Save metadata for API transparency
    metadata = {
        "best_model_name": best_model_name,
        "feature_names": all_feature_names,
        "numeric_features": numeric_features,
        "categorical_features": categorical_features,
        "target_classes": list(target_encoder.classes_),
        "evaluation_metrics": results
    }
    with open(METADATA_PATH, "w") as f:
        json.dump(metadata, f, indent=2)
        
    print(f"[SUCCESS] Saved model to {MODEL_PATH}")
    print(f"[SUCCESS] Saved preprocessor/scaler to {SCALER_PATH}")
    print(f"[SUCCESS] Saved label encoder to {ENCODER_PATH}")
    print(f"[SUCCESS] Saved metadata to {METADATA_PATH}")
    
    return best_model_obj, preprocessor, target_encoder, metadata

if __name__ == "__main__":
    train_and_evaluate()
