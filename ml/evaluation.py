"""
Professional Model Evaluation Module for Employee Attrition Prediction System.
Calculates metrics, plots confusion matrices & feature importances, and exports comparison reports.
"""

import os
import json
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)


def evaluate_model(model, X_test, y_test, name: str) -> dict:
    """Evaluates a single trained model on test data."""
    y_pred = model.predict(X_test)
    if hasattr(model, "predict_proba"):
        y_prob = model.predict_proba(X_test)[:, 1]
    else:
        y_prob = y_pred

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    try:
        auc = roc_auc_score(y_test, y_prob)
    except ValueError:
        auc = 0.5

    return {
        "model": name,
        "accuracy": round(float(acc), 4),
        "precision": round(float(prec), 4),
        "recall": round(float(rec), 4),
        "f1_score": round(float(f1), 4),
        "roc_auc": round(float(auc), 4),
        "y_pred": y_pred,
        "y_prob": y_prob
    }


def save_confusion_matrix_plot(y_test, y_pred, model_name: str, output_path: str):
    """Generates and saves a confusion matrix heatmap image."""
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(6, 5))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", cbar=False,
                xticklabels=["Stayed (No)", "Left (Yes)"],
                yticklabels=["Stayed (No)", "Left (Yes)"])
    plt.title(f"Confusion Matrix: {model_name}")
    plt.xlabel("Predicted Label")
    plt.ylabel("True Label")
    plt.tight_layout()
    plt.savefig(output_path, dpi=300)
    plt.close()


def save_feature_importance_plot(model, feature_names: list[str], output_path: str):
    """Generates and saves feature importance chart for tree/ensemble models or linear coefs."""
    importances = None
    if hasattr(model, "feature_importances_"):
        importances = model.feature_importances_
    elif hasattr(model, "coef_"):
        importances = np.abs(model.coef_[0])

    if importances is None:
        return

    # Sort top 15 features
    indices = np.argsort(importances)[::-1][:15]
    top_features = [feature_names[i] for i in indices]
    top_scores = [importances[i] for i in indices]

    plt.figure(figsize=(9, 6))
    sns.barplot(x=top_scores, y=top_features, palette="viridis")
    plt.title("Top 15 Feature Importances for Attrition Prediction")
    plt.xlabel("Relative Importance Score")
    plt.ylabel("Feature")
    plt.tight_layout()
    plt.savefig(output_path, dpi=300)
    plt.close()


def print_comparison_table(results: list[dict]):
    """Prints a clear terminal comparison table."""
    print("\n" + "=" * 78)
    print(f"{'MODEL COMPARISON REPORT':^78}")
    print("=" * 78)
    print(f"{'Algorithm':<22} | {'Accuracy':<10} | {'Precision':<10} | {'Recall':<10} | {'F1-Score':<10} | {'ROC-AUC':<8}")
    print("-" * 78)
    for res in results:
        print(f"{res['model']:<22} | {res['accuracy']:<10.4f} | {res['precision']:<10.4f} | {res['recall']:<10.4f} | {res['f1_score']:<10.4f} | {res['roc_auc']:<8.4f}")
    print("=" * 78 + "\n")
