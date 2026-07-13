import joblib
from pathlib import Path

ARTIFACT_PATH = Path("app/artifacts")


class PredictionService:

    @staticmethod
    def load_model():

        model = joblib.load(
            ARTIFACT_PATH / "model.pkl"
        )

        return model

    @staticmethod
    def get_explainability_and_recommendations(employee_dict: dict):
        """
        Calculates top factors pushing toward attrition and returns business suggestions.
        """
        factors = []
        recommendations = []

        # Overtime Check
        overtime_val = str(employee_dict.get("Overtime") or employee_dict.get("OverTime") or "No").lower()
        if overtime_val == "yes":
            factors.append("Working Overtime (Yes)")
            recommendations.append("Reduce Overtime: Limit extra hours and adjust workload distribution to prevent burnout.")

        # Job Satisfaction Check
        job_sat = employee_dict.get("Job_Satisfaction") or employee_dict.get("JobSatisfaction")
        if job_sat is not None:
            try:
                js = int(job_sat)
                if js <= 2:
                    factors.append(f"Low Job Satisfaction ({js}/4)")
                    recommendations.append("Engagement Plan: Schedule a 1-on-1 career progression check-in and explore recognition programs.")
            except (ValueError, TypeError):
                pass

        # Work Life Balance Check
        wlb = employee_dict.get("Work_Life_Balance") or employee_dict.get("WorkLifeBalance")
        if wlb is not None:
            try:
                w = int(wlb)
                if w <= 2:
                    factors.append(f"Low Work-Life Balance ({w}/4)")
                    recommendations.append("Flexible Arrangements: Offer flexible hours, hybrid remote options, or mental health support.")
            except (ValueError, TypeError):
                pass

        # Environment Satisfaction Check
        env_sat = employee_dict.get("Work_Environment_Satisfaction") or employee_dict.get("EnvironmentSatisfaction")
        if env_sat is not None:
            try:
                es = int(env_sat)
                if es <= 2:
                    factors.append(f"Low Environment Satisfaction ({es}/4)")
                    recommendations.append("Work Environment Review: Address workplace ergonomics, team dynamics, or facility concerns.")
            except (ValueError, TypeError):
                pass

        # Monthly Income Check
        income = employee_dict.get("Monthly_Income") or employee_dict.get("MonthlyIncome")
        if income is not None:
            try:
                inc = float(income)
                if inc < 4500:
                    factors.append(f"Low Monthly Income (${inc:,.0f})")
                    recommendations.append("Compensation Review: Assess salary against market standard and consider a market-rate adjustment.")
            except (ValueError, TypeError):
                pass

        # Promotion stagnation Check
        promo = employee_dict.get("Years_Since_Last_Promotion") or employee_dict.get("YearsSinceLastPromotion")
        if promo is not None:
            try:
                p = int(promo)
                if p >= 4:
                    factors.append(f"No Promotion in {p} Years")
                    recommendations.append("Career Progression Review: Evaluate for promotion potential or career development opportunities.")
            except (ValueError, TypeError):
                pass

        # Relationship with Manager Check
        rel_mgr = employee_dict.get("Relationship_with_Manager") or employee_dict.get("RelationshipSatisfaction")
        if rel_mgr is not None:
            try:
                rm = int(rel_mgr)
                if rm <= 2:
                    factors.append(f"Low Relationship with Manager ({rm}/4)")
                    recommendations.append("Manager Communication: Provide leadership coaching for supervisors or support mediation.")
            except (ValueError, TypeError):
                pass

        # Commute Distance Check
        dist = employee_dict.get("Distance_From_Home") or employee_dict.get("DistanceFromHome")
        if dist is not None:
            try:
                d = float(dist)
                if d > 15:
                    factors.append(f"Long Commute Distance ({d:.0f} miles)")
                    recommendations.append("Commute Support: Explore travel subsidies or offer remote work options.")
            except (ValueError, TypeError):
                pass

        # Fallbacks if list is empty
        if not factors:
            factors.append("General Demographics & Tenures")
        if not recommendations:
            recommendations.append("Assign Mentor: Standard career development mentorship to ensure long-term retention.")
            recommendations.append("Recognition: Highlight achievements in monthly team meetings.")

        return factors[:4], recommendations

    @staticmethod
    def predict(employee_data):

        model = PredictionService.load_model()

        prediction = model.predict(employee_data)

        probability = model.predict_proba(employee_data)

        # Load best model name from metrics metadata
        model_name = "Gradient Boosting"
        metrics_file = ARTIFACT_PATH / "model_metrics.json"
        if metrics_file.exists():
            try:
                import json
                with open(metrics_file, "r") as f:
                    metrics = json.load(f)
                    model_name = metrics.get("best_model", model_name)
            except Exception:
                pass

        # Get classes and calculate attrition probability
        classes = list(model.classes_)
        if "Yes" in classes:
            yes_idx = classes.index("Yes")
            attrition_prob = probability[0][yes_idx]
        elif 1 in classes:
            yes_idx = classes.index(1)
            attrition_prob = probability[0][yes_idx]
        else:
            attrition_prob = probability[0][1]

        risk_percentage = round(float(attrition_prob) * 100, 2)
        risk_level = "High" if risk_percentage >= 70 else "Medium" if risk_percentage >= 30 else "Low"

        # Calculate factors and recommendations
        employee_dict = employee_data.iloc[0].to_dict()
        factors, recommendations = PredictionService.get_explainability_and_recommendations(employee_dict)

        return {
            "prediction": prediction[0],
            "probability": risk_percentage,
            "confidence": risk_percentage,
            "risk_percentage": risk_percentage,
            "risk_level": risk_level,
            "factors": factors,
            "recommendations": recommendations,
            "model_name": model_name
        }