"""FastAPI app entrypoint.
Author: Katia
Version: 1.0.0
"""
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from backend.config import settings
from backend.database import Base, engine
from backend.routers import auth, users, menu, orders, tables, payments, reports

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(name)s %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(title=settings.app_name, version=settings.app_version)
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origins, allow_credentials=True, allow_methods=['*'], allow_headers=['*'])

@app.on_event('startup')
async def startup() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info('POS backend started')

@app.exception_handler(SQLAlchemyError)
async def db_error(_: Request, exc: SQLAlchemyError) -> JSONResponse:
    logger.error('DB error: %s', exc)
    return JSONResponse(status_code=500, content={'detail': 'Database error'})

@app.exception_handler(Exception)
async def generic_error(_: Request, exc: Exception) -> JSONResponse:
    logger.error('Unexpected error: %s', exc)
    return JSONResponse(status_code=500, content={'detail': 'Unexpected error'})

app.include_router(auth.router, prefix='/api/v1')
app.include_router(users.router, prefix='/api/v1')
app.include_router(menu.router, prefix='/api/v1')
app.include_router(orders.router, prefix='/api/v1')
app.include_router(tables.router, prefix='/api/v1')
app.include_router(payments.router, prefix='/api/v1')
app.include_router(reports.router, prefix='/api/v1')


@app.get("/ui", response_class=HTMLResponse)
async def ui_dashboard() -> str:
    """Minimal local UI page linked to API docs."""
    return """
    <html><head><title>POS Restaurante UI</title></head>
    <body style="font-family:Inter,Arial;background:#0F0F1A;color:#fff;padding:24px">
    <h1 style="color:#6C63FF">POS Restaurante</h1>
    <p>Backend operativo con SQLite local y dataset de prueba masivo.</p>
    <a href="/docs" style="color:#43B89C">Abrir Swagger</a>
    </body></html>
    """
