"""Tables routes.
Author: Josber
Version: 1.0.0
"""
from pydantic import BaseModel
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from backend.models.table import RestaurantTable

router = APIRouter(prefix='/tables', tags=['tables'])

class TableCreate(BaseModel):
    number: int
    capacity: int
    location: str = 'Interior'

@router.get('', status_code=200, summary='List tables', description='Get all restaurant tables')
async def list_tables(db: AsyncSession = Depends(get_db)) -> list[dict]:
    rows = (await db.execute(select(RestaurantTable))).scalars().all()
    return [r.to_dict() for r in rows]

@router.post('', status_code=201, summary='Create table', description='Create a restaurant table')
async def create_table(payload: TableCreate, db: AsyncSession = Depends(get_db)) -> dict:
    table = RestaurantTable(**payload.model_dump())
    db.add(table)
    await db.commit(); await db.refresh(table)
    return table.to_dict()
