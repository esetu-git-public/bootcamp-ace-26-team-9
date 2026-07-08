from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_employees: int
    active_employees: int
    attrition_count: int
    prediction_count: int


class DepartmentChart(BaseModel):
    department: str
    count: int


class GenderChart(BaseModel):
    gender: str
    count: int


class AttritionChart(BaseModel):
    attrition: str
    count: int