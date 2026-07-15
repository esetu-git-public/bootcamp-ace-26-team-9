from pydantic import BaseModel


class EmployeeData(BaseModel):

    Age: int
    Gender: str
    Marital_Status: str
    Department: str
    Job_Role: str
    Job_Level: int
    Monthly_Income: float
    Hourly_Rate: float
    Years_at_Company: int
    Years_in_Current_Role: int
    Years_Since_Last_Promotion: int
    Work_Life_Balance: int
    Job_Satisfaction: int
    Performance_Rating: int
    Training_Hours_Last_Year: int
    Overtime: str
    Project_Count: int
    Average_Hours_Worked_Per_Week: int
    Absenteeism: int
    Relationship_with_Manager: int
    Job_Involvement: int = 3
    Distance_From_Home: int
    Number_of_Companies_Worked: int


class WhatIfRequest(BaseModel):
    employee: EmployeeData
    modifications: dict