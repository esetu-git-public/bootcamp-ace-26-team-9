import os
import pandas as pd
import numpy as np

# Define exact file path for dataset
DATASET_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_FILE_PATH = os.path.join(DATASET_DIR, "WA_Fn-UseC_-HR-Employee-Attrition.csv")

def generate_synthetic_ibm_hr_dataset(num_rows=1470, random_state=42):
    """
    Generates a realistic synthetic IBM HR Analytics Employee Attrition dataset
    with correlated features reflecting real-world HR dynamics.
    """
    np.random.seed(random_state)
    
    # 1. Demographics & Basics
    ages = np.random.normal(loc=37, scale=9, size=num_rows).astype(int)
    ages = np.clip(ages, 18, 60)
    
    genders = np.random.choice(["Male", "Female"], size=num_rows, p=[0.6, 0.4])
    
    departments = np.random.choice(
        ["Research & Development", "Sales", "Human Resources"],
        size=num_rows,
        p=[0.65, 0.30, 0.05]
    )
    
    # Map JobRole based on Department
    job_roles = []
    for dept in departments:
        if dept == "Sales":
            job_roles.append(np.random.choice(["Sales Executive", "Sales Representative"], p=[0.75, 0.25]))
        elif dept == "Research & Development":
            job_roles.append(np.random.choice([
                "Research Scientist", "Laboratory Technician", "Manufacturing Director", 
                "Healthcare Representative", "Research Director"
            ], p=[0.35, 0.30, 0.15, 0.15, 0.05]))
        else:
            job_roles.append("Human Resources")
            
    # 2. Compensation & Tenure
    years_at_company = []
    monthly_incomes = []
    for age in ages:
        max_tenure = max(1, age - 18)
        tenure = np.random.exponential(scale=6)
        tenure = min(int(tenure), max_tenure)
        years_at_company.append(tenure)
        
        # Income correlates with tenure and age
        base_income = 2500 + (age - 18) * 150 + tenure * 250
        noise = np.random.normal(0, 1000)
        income = max(1500, int(base_income + noise))
        monthly_incomes.append(income)
        
    distance_from_home = np.random.exponential(scale=8, size=num_rows).astype(int)
    distance_from_home = np.clip(distance_from_home, 1, 29)
    
    overtime = np.random.choice(["Yes", "No"], size=num_rows, p=[0.28, 0.72])
    
    # 3. Satisfaction & Work Life (1 to 4 scale)
    job_satisfaction = np.random.choice([1, 2, 3, 4], size=num_rows, p=[0.20, 0.19, 0.30, 0.31])
    work_life_balance = np.random.choice([1, 2, 3, 4], size=num_rows, p=[0.05, 0.23, 0.61, 0.11])
    environment_satisfaction = np.random.choice([1, 2, 3, 4], size=num_rows, p=[0.19, 0.19, 0.31, 0.31])
    relationship_satisfaction = np.random.choice([1, 2, 3, 4], size=num_rows, p=[0.19, 0.21, 0.31, 0.29])
    education = np.random.choice([1, 2, 3, 4, 5], size=num_rows, p=[0.12, 0.19, 0.39, 0.27, 0.03])
    
    business_travel = np.random.choice(
        ["Travel_Rarely", "Travel_Frequently", "Non-Travel"],
        size=num_rows,
        p=[0.71, 0.19, 0.10]
    )
    
    # 4. Calculate Attrition Probability based on realistic drivers
    attrition_probs = []
    for i in range(num_rows):
        prob = -1.8 # baseline logit
        
        # Risk factors
        if overtime[i] == "Yes":
            prob += 1.2
        if job_satisfaction[i] <= 2:
            prob += 0.8
        if environment_satisfaction[i] == 1:
            prob += 0.6
        if work_life_balance[i] == 1:
            prob += 0.9
        if years_at_company[i] <= 2:
            prob += 0.5
        if monthly_incomes[i] < 3000:
            prob += 0.6
        if distance_from_home[i] > 20:
            prob += 0.4
        if business_travel[i] == "Travel_Frequently":
            prob += 0.5
            
        # Protective factors
        if job_satisfaction[i] == 4:
            prob -= 0.6
        if years_at_company[i] >= 10:
            prob -= 0.8
        if monthly_incomes[i] > 10000:
            prob -= 0.7
            
        # Sigmoid conversion
        p = 1.0 / (1.0 + np.exp(-prob))
        attrition_probs.append(p)
        
    attrition = [np.random.choice(["Yes", "No"], p=[p, 1-p]) for p in attrition_probs]
    
    # Other standard IBM columns for schema completeness
    df = pd.DataFrame({
        "Age": ages,
        "Attrition": attrition,
        "BusinessTravel": business_travel,
        "Department": departments,
        "DistanceFromHome": distance_from_home,
        "Education": education,
        "EducationField": np.random.choice(["Life Sciences", "Medical", "Marketing", "Technical Degree", "Other"], size=num_rows),
        "EmployeeCount": 1,
        "EmployeeNumber": np.arange(1, num_rows + 1),
        "EnvironmentSatisfaction": environment_satisfaction,
        "Gender": genders,
        "HourlyRate": np.random.randint(30, 100, size=num_rows),
        "JobInvolvement": np.random.choice([1, 2, 3, 4], size=num_rows),
        "JobLevel": np.random.choice([1, 2, 3, 4, 5], size=num_rows),
        "JobRole": job_roles,
        "JobSatisfaction": job_satisfaction,
        "MaritalStatus": np.random.choice(["Married", "Single", "Divorced"], size=num_rows),
        "MonthlyIncome": monthly_incomes,
        "MonthlyRate": np.random.randint(2000, 27000, size=num_rows),
        "NumCompaniesWorked": np.random.randint(0, 10, size=num_rows),
        "Over18": "Y",
        "OverTime": overtime,
        "PercentSalaryHike": np.random.randint(11, 26, size=num_rows),
        "PerformanceRating": np.random.choice([3, 4], size=num_rows, p=[0.85, 0.15]),
        "RelationshipSatisfaction": relationship_satisfaction,
        "StandardHours": 80,
        "StockOptionLevel": np.random.choice([0, 1, 2, 3], size=num_rows),
        "TotalWorkingYears": np.random.randint(1, 40, size=num_rows),
        "TrainingTimesLastYear": np.random.randint(0, 7, size=num_rows),
        "WorkLifeBalance": work_life_balance,
        "YearsAtCompany": years_at_company,
        "YearsInCurrentRole": [min(t, np.random.randint(0, max(1, t+1))) for t in years_at_company],
        "YearsSinceLastPromotion": [min(t, np.random.randint(0, max(1, t+1))) for t in years_at_company],
        "YearsWithCurrManager": [min(t, np.random.randint(0, max(1, t+1))) for t in years_at_company]
    })
    
    # Save CSV
    df.to_csv(CSV_FILE_PATH, index=False)
    print(f"[SUCCESS] Synthetic IBM HR dataset generated with {len(df)} rows at: {CSV_FILE_PATH}")
    return df

def load_dataset(file_path=None):
    """
    Loads the HR Attrition dataset from CSV.
    If the file doesn't exist, it automatically generates a realistic dataset.
    """
    path = file_path or CSV_FILE_PATH
    if not os.path.exists(path):
        print(f"[INFO] Dataset file not found at {path}. Generating synthetic dataset...")
        return generate_synthetic_ibm_hr_dataset()
    
    try:
        df = pd.read_csv(path)
        print(f"[SUCCESS] Loaded dataset from {path} ({len(df)} rows, {len(df.columns)} columns)")
        return df
    except Exception as e:
        print(f"[ERROR] Failed to read CSV: {str(e)}")
        raise e

def inspect_data(df):
    """
    Prints summary statistics and quality checks for the dataset.
    """
    print("\n" + "="*50)
    print("DATASET INSPECTION SUMMARY")
    print("="*50)
    print(f"Total Rows: {len(df)}")
    print(f"Total Columns: {len(df.columns)}")
    print(f"Missing Values: {df.isnull().sum().sum()}")
    print("\nAttrition Distribution:")
    print(df["Attrition"].value_counts(normalize=True) * 100)
    print("\nDepartment Distribution:")
    print(df["Department"].value_counts())
    print("\nSummary Statistics (Numerical):")
    print(df[["Age", "MonthlyIncome", "YearsAtCompany", "JobSatisfaction"]].describe())
    print("="*50 + "\n")

if __name__ == "__main__":
    df = load_dataset()
    inspect_data(df)
