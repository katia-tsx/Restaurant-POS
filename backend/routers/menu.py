"""Menu routes.
Author: Josber
Version: 1.0.0
"""
import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from backend.models.menu_item import Category, MenuItem
from backend.schemas.menu_item import CategoryCreate, CategoryOut, MenuItemCreate, MenuItemOut

router = APIRouter(prefix='/menu', tags=['menu'])

@router.get('/categories', response_model=list[CategoryOut], status_code=200, summary='List categories', description='Get all categories')
async def list_categories(db: AsyncSession = Depends(get_db)) -> list[CategoryOut]:
    return [CategoryOut.model_validate(c) for c in (await db.execute(select(Category))).scalars().all()]

@router.post('/categories', response_model=CategoryOut, status_code=201, summary='Create category', description='Create menu category')
async def create_category(payload: CategoryCreate, db: AsyncSession = Depends(get_db)) -> CategoryOut:
    obj = Category(**payload.model_dump())
    db.add(obj)
    await db.commit(); await db.refresh(obj)
    return CategoryOut.model_validate(obj)

@router.get('/items', response_model=list[MenuItemOut], status_code=200, summary='List menu items', description='Get menu items')
async def list_items(category: int | None = None, db: AsyncSession = Depends(get_db)) -> list[MenuItemOut]:
    query = select(MenuItem)
    if category is not None:
        query = query.where(MenuItem.category_id == category)
    return [MenuItemOut.model_validate(m) for m in (await db.execute(query)).scalars().all()]

@router.post('/items', response_model=MenuItemOut, status_code=201, summary='Create menu item', description='Create menu item')
async def create_item(payload: MenuItemCreate, db: AsyncSession = Depends(get_db)) -> MenuItemOut:
    data = payload.model_dump()
    data['allergens'] = json.dumps(data['allergens'])
    data['tags'] = json.dumps(data['tags'])
    obj = MenuItem(**data)
    db.add(obj)
    await db.commit(); await db.refresh(obj)
    return MenuItemOut.model_validate(obj)
