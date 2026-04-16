"""Menu schemas.
Author: Kevin
Version: 1.0.0
"""
from decimal import Decimal
from pydantic import BaseModel, ConfigDict

class CategoryCreate(BaseModel):
    name: str
    description: str | None = None
    icon: str | None = None
    sort_order: int = 0

class CategoryOut(CategoryCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)

class MenuItemCreate(BaseModel):
    name: str
    description: str | None = None
    price: Decimal
    category_id: int
    image_url: str | None = None
    preparation_time: int = 10
    allergens: list[str] = []
    tags: list[str] = []

class MenuItemOut(BaseModel):
    id: int
    name: str
    description: str | None
    price: Decimal
    category_id: int
    image_url: str | None
    is_available: bool
    preparation_time: int
    allergens: str
    tags: str
    model_config = ConfigDict(from_attributes=True)
