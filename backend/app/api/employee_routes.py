from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.employee_schema import (
    EmployeeCreate,
    EmployeeUpdate
)

from app.services.employee_service import EmployeeService

from app.auth.oauth2 import get_current_user

router = APIRouter()


# ==========================================================
# Employee Management APIs
# ==========================================================

@router.post("/employees", tags=["Employees"])
def create_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return EmployeeService.create_employee(
        db,
        employee
    )


@router.get("/employees", tags=["Employees"])
def get_all_employees(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return EmployeeService.get_all_employees(db)


@router.get("/employees/{employee_id}", tags=["Employees"])
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    employee = EmployeeService.get_employee_by_id(
        db,
        employee_id
    )

    if employee is None:

        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    return employee


@router.put("/employees/{employee_id}", tags=["Employees"])
def update_employee(
    employee_id: int,
    employee: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    updated_employee = EmployeeService.update_employee(
        db,
        employee_id,
        employee
    )

    if updated_employee is None:

        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    return updated_employee


@router.delete("/employees/{employee_id}", tags=["Employees"])
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    deleted_employee = EmployeeService.delete_employee(
        db,
        employee_id
    )

    if deleted_employee is None:

        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    return {
        "message": "Employee deleted successfully"
    }