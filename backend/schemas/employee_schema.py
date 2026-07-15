from pydantic import BaseModel, ConfigDict


# ==========================================
# Base Employee Schema
# ==========================================

class EmployeeBase(BaseModel):

    employee_id: str

    age: int

    gender: str

    marital_status: str

    department: str

    job_role: str

    job_level: int

    monthly_income: float

    hourly_rate: float

    years_at_company: int

    years_in_current_role: int

    years_since_last_promotion: int

    work_life_balance: str

    job_satisfaction: str

    performance_rating: str

    training_hours_last_year: int

    overtime: str

    project_count: int

    average_hours_worked_per_week: float

    absenteeism: int

    work_environment_satisfaction: str

    relationship_with_manager: str

    job_involvement: str

    distance_from_home: float

    number_of_companies_worked: int

    attrition: str


# ==========================================
# Create Employee
# ==========================================

class EmployeeCreate(EmployeeBase):
    pass


# ==========================================
# Update Employee
# ==========================================

class EmployeeUpdate(EmployeeBase):
    pass


# ==========================================
# Response Schema
# ==========================================

class EmployeeResponse(EmployeeBase):

    id: int

    model_config = ConfigDict(
        from_attributes=True
    )