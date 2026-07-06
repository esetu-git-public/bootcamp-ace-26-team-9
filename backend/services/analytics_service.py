import os
import pandas as pd
import numpy as np

# Path to dataset
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BACKEND_DIR, "..", "..", "dataset", "WA_Fn-UseC_-HR-Employee-Attrition.csv")

class AnalyticsService:
    def __init__(self):
        self.df = None
        self.load_data()

    def load_data(self):
        try:
            if not os.path.exists(DATASET_PATH):
                import sys
                sys.path.append(os.path.join(BACKEND_DIR, "..", "..", "dataset"))
                import dataset_loader
                self.df = dataset_loader.load_dataset(DATASET_PATH)
            else:
                self.df = pd.read_csv(DATASET_PATH)
            print(f"[SUCCESS] AnalyticsService loaded dataset with {len(self.df)} records.")
        except Exception as e:
            print(f"[ERROR] AnalyticsService failed to load dataset: {str(e)}")
            self.df = pd.DataFrame()

    def get_dashboard_kpis(self):
        """
        Returns high-level KPI summary for the HR Dashboard.
        """
        if self.df.empty:
            self.load_data()
            if self.df.empty:
                return {}

        total_emp = len(self.df)
        left_emp = int((self.df["Attrition"] == "Yes").sum())
        attrition_rate = round((left_emp / total_emp) * 100, 2)
        avg_sat = round(float(self.df["JobSatisfaction"].mean()), 2)
        avg_inc = round(float(self.df["MonthlyIncome"].mean()), 2)

        # Generate sample recent alerts/activity for UI tables
        recent_activity = []
        sample_high_risk = self.df[self.df["Attrition"] == "Yes"].head(5)
        for idx, row in sample_high_risk.iterrows():
            recent_activity.append({
                "id": f"EMP-{1000 + idx}",
                "department": row["Department"],
                "role": row["JobRole"],
                "income": f"${row['MonthlyIncome']:,}",
                "overtime": row["OverTime"],
                "satisfaction": f"{row['JobSatisfaction']}/4",
                "risk": "High"
            })

        return {
            "total_employees": total_emp,
            "high_risk_employees": left_emp,
            "average_satisfaction": avg_sat,
            "average_monthly_income": avg_inc,
            "attrition_rate": attrition_rate,
            "recent_activity": recent_activity
        }

    def get_analytics_charts(self):
        """
        Returns structured chart datasets for Recharts (Bar, Pie, Line charts).
        """
        if self.df.empty:
            self.load_data()
            if self.df.empty:
                return {}

        # 1. Department-wise Attrition (Bar Chart)
        dept_group = self.df.groupby("Department")
        dept_data = []
        for name, group in dept_group:
            total = len(group)
            left = int((group["Attrition"] == "Yes").sum())
            rate = round((left / total) * 100, 1) if total > 0 else 0
            dept_data.append({
                "name": name.replace("Research & Development", "R&D"),
                "Total": total,
                "Left": left,
                "Rate": rate
            })

        # 2. Gender-wise Attrition (Pie Chart)
        left_df = self.df[self.df["Attrition"] == "Yes"]
        gender_counts = left_df["Gender"].value_counts()
        gender_data = [
            {"name": "Male", "value": int(gender_counts.get("Male", 0))},
            {"name": "Female", "value": int(gender_counts.get("Female", 0))}
        ]

        # 3. Age Distribution (Line/Area Chart)
        age_bins = [18, 25, 35, 45, 55, 65]
        age_labels = ["18-25", "26-35", "36-45", "46-55", "56+"]
        self.df["AgeGroup"] = pd.cut(self.df["Age"], bins=age_bins, labels=age_labels, right=False)
        age_group = self.df.groupby("AgeGroup", observed=False)
        age_data = []
        for name, group in age_group:
            total = len(group)
            left = int((group["Attrition"] == "Yes").sum())
            rate = round((left / total) * 100, 1) if total > 0 else 0
            age_data.append({
                "age_group": str(name),
                "Total": total,
                "Left": left,
                "Rate": rate
            })

        # 4. Monthly Income Distribution (Bar Chart)
        inc_bins = [0, 3000, 5000, 8000, 12000, 50000]
        inc_labels = ["<$3k", "$3k-$5k", "$5k-$8k", "$8k-$12k", ">$12k"]
        self.df["IncomeGroup"] = pd.cut(self.df["MonthlyIncome"], bins=inc_bins, labels=inc_labels, right=False)
        inc_group = self.df.groupby("IncomeGroup", observed=False)
        inc_data = []
        for name, group in inc_group:
            total = len(group)
            left = int((group["Attrition"] == "Yes").sum())
            rate = round((left / total) * 100, 1) if total > 0 else 0
            inc_data.append({
                "bracket": str(name),
                "Total": total,
                "Left": left,
                "Rate": rate
            })

        # 5. Job Satisfaction (Pie Chart)
        sat_map = {1: "Low", 2: "Medium", 3: "High", 4: "Very High"}
        sat_counts = self.df["JobSatisfaction"].map(sat_map).value_counts()
        sat_data = [
            {"name": label, "value": int(sat_counts.get(label, 0))}
            for label in ["Low", "Medium", "High", "Very High"]
        ]

        # 6. Overtime Analysis (Bar Chart)
        ot_group = self.df.groupby("OverTime")
        ot_data = []
        for name, group in ot_group:
            total = len(group)
            left = int((group["Attrition"] == "Yes").sum())
            rate = round((left / total) * 100, 1) if total > 0 else 0
            ot_data.append({
                "overtime": str(name),
                "Total": total,
                "Left": left,
                "Rate": rate
            })

        return {
            "department_attrition": dept_data,
            "gender_attrition": gender_data,
            "age_distribution": age_data,
            "monthly_income_distribution": inc_data,
            "job_satisfaction": sat_data,
            "overtime_analysis": ot_data
        }

# Singleton instance
analytics_service = AnalyticsService()
