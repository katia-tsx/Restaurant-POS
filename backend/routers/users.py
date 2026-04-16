"""Users routes.
Author: Josber
Version: 1.0.0
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.core.security import hash_password
from backend.database import get_db
from backend.models.user import User
from backend.schemas.user import UserCreate, UserOut

router = APIRouter(prefix='/users', tags=['users'])

@router.get('', response_model=list[UserOut], status_code=200, summary='List users', description='Return all users')
async def list_users(db: AsyncSession = Depends(get_db)) -> list[UserOut]:
    return [UserOut.model_validate(u) for u in (await db.execute(select(User))).scalars().all()]

@router.post('', response_model=UserOut, status_code=201, summary='Create user', description='Create new system user')
async def create_user(payload: UserCreate, db: AsyncSession = Depends(get_db)) -> UserOut:
    exists = (await db.execute(select(User).where((User.username == payload.username) | (User.email == payload.email)))).scalar_one_or_none()
    if exists:
        raise HTTPException(status_code=409, detail='User already exists')
    user = User(username=payload.username, full_name=payload.full_name, email=payload.email, role=payload.role, password_hash=hash_password(payload.password))
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return UserOut.model_validate(user)
