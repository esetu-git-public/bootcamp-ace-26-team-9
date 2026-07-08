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

# Secret Key
SECRET_KEY = "employee_attrition_secret_key"

# Algorithm
ALGORITHM = "HS256"

# Token Expiry Time (Minutes)
ACCESS_TOKEN_EXPIRE_MINUTES = 60


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