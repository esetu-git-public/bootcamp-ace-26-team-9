from sqlalchemy.orm import Session

from app.database.models import User
from app.auth.security import (
    hash_password,
    verify_password
)
from app.auth.jwt_handler import create_access_token


class AuthService:

    @staticmethod
    def register(
        db: Session,
        name: str,
        email: str,
        password: str
    ):

        # Check if user already exists
        existing_user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if existing_user:
            return None

        # Create new user
        new_user = User(
            name=name,
            email=email,
            password=hash_password(password),
            role="HR"
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user

    @staticmethod
    def login(
        db: Session,
        email: str,
        password: str
    ):

        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if not user:
            return None

        if not verify_password(
            password,
            user.password
        ):
            return None

        access_token = create_access_token(
            {
                "sub": user.email,
                "role": user.role
            }
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }