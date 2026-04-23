"""Payment schemas.
Author: Kevin
Version: 1.0.0
"""
from decimal import Decimal
from pydantic import BaseModel, ConfigDict

class PaymentCreate(BaseModel):
    order_id: int
    method: str
    received_amount: Decimal | None = None
    processed_by_id: int


class PaymentUpdate(BaseModel):
    method: str | None = None
    received_amount: Decimal | None = None
    processed_by_id: int | None = None
    is_voided: bool | None = None
    is_active: bool | None = None

class PaymentOut(BaseModel):
    id: int
    order_id: int
    method: str
    amount: Decimal
    received_amount: Decimal | None
    change_amount: Decimal | None
    processed_by_id: int
    is_voided: bool
    model_config = ConfigDict(from_attributes=True)
