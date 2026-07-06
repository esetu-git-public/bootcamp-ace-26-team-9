from flask import Blueprint, request, jsonify
from services.prediction_service import prediction_service
from services.analytics_service import analytics_service

api_bp = Blueprint("api", __name__)

@api_bp.route("/health", methods=["GET"])
def health_check():
    """
    Health check endpoint to verify backend server status and ML model readiness.
    """
    ready = prediction_service.is_ready()
    return jsonify({
        "status": "healthy" if ready else "degraded",
        "model_loaded": ready,
        "message": "Employee Attrition Prediction API is operational."
    }), 200

@api_bp.route("/dashboard", methods=["GET"])
def get_dashboard():
    """
    Returns KPIs for the HR Dashboard (Total Employees, High Risk, Attrition Rate, etc.)
    """
    try:
        kpis = analytics_service.get_dashboard_kpis()
        return jsonify(kpis), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch dashboard metrics", "details": str(e)}), 500

@api_bp.route("/analytics", methods=["GET"])
def get_analytics():
    """
    Returns multi-dimensional chart datasets formatted for Recharts.
    """
    try:
        charts = analytics_service.get_analytics_charts()
        return jsonify(charts), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch analytics charts", "details": str(e)}), 500

@api_bp.route("/predict", methods=["POST"])
def predict_attrition():
    """
    Accepts employee profile fields and predicts turnover probability, risk level, and retention strategies.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid request. JSON payload expected."}), 400

        result = prediction_service.predict(data)
        return jsonify(result), 200
    except RuntimeError as re:
        return jsonify({"error": str(re), "action": "Please run train_model.py to initialize ML model artifacts."}), 503
    except Exception as e:
        return jsonify({"error": "Prediction inference failed", "details": str(e)}), 500
