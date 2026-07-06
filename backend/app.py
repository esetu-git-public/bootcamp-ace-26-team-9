import os
from flask import Flask, jsonify
from flask_cors import CORS
from routes.api_routes import api_bp

def create_app():
    app = Flask(__name__)
    
    # Enable CORS for frontend communication (React default Vite port 5173 or 3000)
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # Register API Blueprint
    app.register_blueprint(api_bp)
    
    @app.route("/", methods=["GET"])
    def index():
        return jsonify({
            "project": "Employee Attrition Prediction System",
            "version": "1.0.0",
            "status": "Online",
            "documentation": {
                "health_check": "GET /health",
                "dashboard_kpis": "GET /dashboard",
                "analytics_charts": "GET /analytics",
                "predict_attrition": "POST /predict"
            }
        }), 200
        
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Endpoint not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error", "details": str(error)}), 500
        
    return app

if __name__ == "__main__":
    app = create_app()
    port = int(os.environ.get("PORT", 5000))
    print(f"\n" + "="*60)
    print(f"STARTING EMPLOYEE ATTRITION PREDICTION FLASK SERVER")
    print(f"API Listening on: http://localhost:{port}")
    print("="*60 + "\n")
    app.run(host="0.0.0.0", port=port, debug=True)
