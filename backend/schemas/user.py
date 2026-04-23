"""User schemas.
Author: Kevin
Version: 1.0.0
"""
from pydantic import BaseModel, ConfigDict

class UserCreate(BaseModel):
    username: str
    full_name: str
    email: str
    password: str
    role: str


class UserUpdate(BaseModel):
    username: str | None = None
    full_name: str | None = None
    email: str | None = None
    password: str | None = None
    role: str | None = None
    is_active: bool | None = None

class UserOut(BaseModel):
    id: int
    username: str
    full_name: str
    email: str
    role: str
    is_active: bool
    model_config = ConfigDict(from_attributes=True)
