from datetime import datetime, timedelta
try:
    import jwt
    try:
        from jwt import PyJWTError as JWTError
    except ImportError:
        from jwt.exceptions import InvalidTokenError as JWTError
except Exception:
    # Fallback if PyJWT is not available
    class JWTError(Exception):
        pass

import os

# Secret Key
SECRET_KEY = os.getenv("SECRET_KEY", "employee_attrition_secret_key_prod_change_me")

# Algorithm
ALGORITHM = os.getenv("ALGORITHM", "HS256")

# Token Expiry Time (Minutes)
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 120))


def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update(
        {"exp": expire}
    )

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


def verify_token(token: str):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError:

        return None