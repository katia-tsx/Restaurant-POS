# POS Restaurante

Sistema POS local para restaurante con `FastAPI + SQLAlchemy Async + SQLite`.

## Instalacion

1. `python -m venv venv`
2. `venv\\Scripts\\activate`
3. `pip install -r requirements.txt`
4. `copy .env.example .env`
5. `python -m backend.seed`
6. `python -m uvicorn backend.main:app --reload`

## URLs

- API: `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Credenciales iniciales

Revisa `docs/users.md`.

## Dataset mock incluido

- 6 usuarios reales del negocio
- 5 categorias
- 120 items de menu con imagenes de Unsplash
- 16 mesas
- 180 ordenes
- 700+ lineas de order items
- pagos historicos de prueba
