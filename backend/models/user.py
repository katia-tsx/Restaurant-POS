"""User model and role logic.
Author: Raylin
Version: 1.0.0
"""
from datetime import datetime
from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from backend.core.security import verify_password, hash_password
from backend.models.base import BaseModel


class User(BaseModel):
    """System user account."""

    __tablename__ = "users"

    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False)
    failed_attempts: Mapped[int] = mapped_column(Integer, default=0)
    locked_until: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    def authenticate(self, password: str) -> bool:
        """Validate password against stored hash."""
        return verify_password(password, self.password_hash)

    def change_password(self, old: str, new: str) -> None:
        """Change user password after verification."""
        if not self.authenticate(old):
            raise ValueError("Invalid current password")
        self.password_hash = hash_password(new)
