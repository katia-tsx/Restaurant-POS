"""Schemas de mesas.
Autor: Kevin
Versión: 1.0.0
"""
from pydantic import BaseModel, ConfigDict


class TableCreate(BaseModel):
    number: int
    capacity: int
    location: str = "Interior"


class TableOut(BaseModel):
    id: int
    number: int
    capacity: int
    status: str
    location: str

    model_config = ConfigDict(from_attributes=True)
