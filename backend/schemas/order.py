"""Order schemas.
Author: Kevin
Version: 1.0.0
"""
from datetime import datetime
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


class OrderUpdate(BaseModel):
    table_id: int | None = None
    waiter_id: int | None = None
    status: str | None = None
    order_type: str | None = None
    notes: str | None = None
    items: list[OrderItemCreate] | None = None
    is_active: bool | None = None

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
    created_at: datetime | None = None
    model_config = ConfigDict(from_attributes=True)


class OrderLineOut(BaseModel):
    id: int
    menu_item_id: int
    menu_item_name: str
    quantity: int
    unit_price: Decimal
    notes: str | None
    model_config = ConfigDict(from_attributes=True)


class OrderDetailOut(OrderOut):
    items: list[OrderLineOut]
