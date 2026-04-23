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


class CategoryUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    icon: str | None = None
    sort_order: int | None = None
    is_active: bool | None = None

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


class MenuItemUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: Decimal | None = None
    category_id: int | None = None
    image_url: str | None = None
    preparation_time: int | None = None
    allergens: list[str] | None = None
    tags: list[str] | None = None
    is_available: bool | None = None
    is_active: bool | None = None

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
