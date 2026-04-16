"""Security helpers.
Author: Katia
Version: 1.0.0
"""
import hashlib
import hmac
import secrets
from datetime import UTC, datetime, timedelta
from typing import Any
from jose import JWTError, jwt
from backend.config import settings


def hash_password(password: str) -> str:
    """Hash password using scrypt for local deployments."""
    salt = secrets.token_hex(16)
    derived = hashlib.scrypt(password.encode("utf-8"), salt=salt.encode("utf-8"), n=2**14, r=8, p=1)
    return f"{salt}${derived.hex()}"


def verify_password(password: str, password_hash: str) -> bool:
    """Verify hashed password value."""
    try:
        salt, expected = password_hash.split("$", 1)
    except ValueError:
        return False
    derived = hashlib.scrypt(password.encode("utf-8"), salt=salt.encode("utf-8"), n=2**14, r=8, p=1).hex()
    return hmac.compare_digest(derived, expected)

def create_token(data: dict[str, Any], expires_delta: timedelta) -> str:
    payload = data.copy()
    payload["exp"] = datetime.now(UTC) + expires_delta
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)

def decode_token(token: str) -> dict[str, Any] | None:
    try:
        return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError:
        return None
