"""Order schemas.
Author: Kevin
Version: 1.0.0
"""
from decimal import Decimal
from pydantic import BaseModel, ConfigDict

class OrderItemCreate(BaseModel):
    menu_item_id: int
    quantity: int
    notes: str | None = None

class OrderCreate(BaseModel):
    table_id: int | None = None
    waiter_id: int
    order_type: str = "dine_in"
    notes: str | None = None
    items: list[OrderItemCreate]

class OrderOut(BaseModel):
    id: int
    table_id: int | None
    waiter_id: int
    status: str
    order_type: str
    notes: str | None
    subtotal: Decimal
    tax: Decimal
    total: Decimal
    model_config = ConfigDict(from_attributes=True)
