from sqlalchemy.orm import Session

from database.models import Employee


class EmployeeService:

    # ======================================
    # Create Employee
    # ======================================

    @staticmethod
    def create_employee(
        db: Session,
        employee
    ):

        new_employee = Employee(
            **employee.model_dump()
        )

        db.add(new_employee)

        db.commit()

        db.refresh(new_employee)

        return new_employee

    # ======================================
    # Get All Employees
    # ======================================

    @staticmethod
    def get_all_employees(
        db: Session
    ):

        return db.query(
            Employee
        ).all()

    # ======================================
    # Get Employee By ID
    # ======================================

    @staticmethod
    def get_employee_by_id(
        db: Session,
        employee_id: int
    ):

        return (
            db.query(Employee)
            .filter(Employee.id == employee_id)
            .first()
        )

    # ======================================
    # Update Employee
    # ======================================

    @staticmethod
    def update_employee(
        db: Session,
        employee_id: int,
        employee
    ):

        existing_employee = (

            db.query(Employee)

            .filter(
                Employee.id == employee_id
            )

            .first()

        )

        if existing_employee is None:

            return None

        for key, value in employee.model_dump().items():

            setattr(
                existing_employee,
                key,
                value
            )

        db.commit()

        db.refresh(
            existing_employee
        )

        return existing_employee

    # ======================================
    # Delete Employee
    # ======================================

    @staticmethod
    def delete_employee(
        db: Session,
        employee_id: int
    ):

        employee = (

            db.query(Employee)

            .filter(
                Employee.id == employee_id
            )

            .first()

        )

        if employee is None:

            return None

        db.delete(employee)

        db.commit()

        return employee