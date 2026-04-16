"""Large seed data generator.
Author: Josber
Version: 1.0.0
"""
import asyncio
import json
import random
from decimal import Decimal
from sqlalchemy import select
from backend.core.security import hash_password
from backend.database import AsyncSessionLocal, Base, engine
from backend.models.menu_item import Category, MenuItem
from backend.models.order import Order, OrderItem
from backend.models.payment import Payment
from backend.models.table import RestaurantTable
from backend.models.user import User

USERS = [
    ("katia", "Katia", "katia@restaurant.local", "Katia@POS2025!", "super_admin"),
    ("raylin", "Raylin", "raylin@restaurant.local", "Raylin@POS2025!", "manager"),
    ("josber", "Josber", "josber@restaurant.local", "Josber@POS2025!", "cashier"),
    ("kevin", "Kevin", "kevin@restaurant.local", "Kevin@POS2025!", "waiter"),
    ("johan", "Johan", "johan@restaurant.local", "Johan@POS2025!", "cook"),
    ("said", "Said", "said@restaurant.local", "Said@POS2025!", "barman"),
]

CATEGORIES = [
    ("Entradas", "Entradas para abrir apetito", "restaurant_menu", 1),
    ("Platos principales", "Especialidades de la casa", "lunch_dining", 2),
    ("Postres", "Dulces finales", "icecream", 3),
    ("Bebidas", "Bebidas frias y calientes", "local_bar", 4),
    ("Especiales", "Promociones del chef", "star", 5),
]

UNSPLASH = [
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
    "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543",
    "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
]

MENU_NAMES = [
    "Bruschettas mixtas", "Croquetas de pollo", "Empanadas criollas", "Sopa de tomate", "Ceviche fresco",
    "Pasta carbonara", "Risotto de hongos", "Hamburguesa premium", "Lomo salteado", "Pollo grillado",
    "Cheesecake frutos rojos", "Brownie caliente", "Tiramisu clasico", "Flan de coco", "Helado artesanal",
    "Limonada menta", "Mojito clasico", "Cafe latte", "Smoothie tropical", "Jugo detox",
    "Pizza trufada", "Ramen picante", "Tacos al pastor", "Sushi roll", "Ensalada quinoa",
    "Poke bowl", "Wrap vegano", "Paella marina", "Costillas BBQ", "Salmon teriyaki",
    "Churros", "Panacotta", "Mousse chocolate", "Creme brulee", "Pie de limon",
    "Te frio", "Matcha latte", "Sangria", "Agua de coco", "Refresco artesanal",
]

async def seed() -> None:
    """Populate database with large demo dataset."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        if (await db.execute(select(User))).scalars().first():
            print('Seed already applied')
            return

        for username, full_name, email, password, role in USERS:
            db.add(User(username=username, full_name=full_name, email=email, password_hash=hash_password(password), role=role))

        await db.flush()

        categories = []
        for name, description, icon, sort_order in CATEGORIES:
            category = Category(name=name, description=description, icon=icon, sort_order=sort_order)
            db.add(category)
            categories.append(category)

        await db.flush()

        menu_items = []
        for i in range(120):
            name = f"{MENU_NAMES[i % len(MENU_NAMES)]} #{i + 1}"
            category = categories[i % len(categories)]
            price = Decimal(str(round(random.uniform(4.5, 38.0), 2)))
            item = MenuItem(
                name=name,
                description=f"Preparacion especial de {name.lower()} con ingredientes frescos.",
                price=price,
                category_id=category.id,
                image_url=f"{UNSPLASH[i % len(UNSPLASH)]}?auto=format&fit=crop&w=900&q=80",
                is_available=True,
                preparation_time=random.randint(8, 24),
                allergens=json.dumps(random.sample(["gluten", "lactosa", "nueces", "mariscos"], k=random.randint(0, 2))),
                tags=json.dumps(random.sample(["popular", "picante", "vegano", "chef", "nuevo"], k=random.randint(1, 3))),
            )
            db.add(item)
            menu_items.append(item)

        capacities = [2, 4, 4, 6, 6, 2, 4, 8, 4, 2, 10, 6, 4, 4, 2, 8]
        for idx, cap in enumerate(capacities, start=1):
            db.add(RestaurantTable(number=idx, capacity=cap, status="available", location=random.choice(["Interior", "Terraza", "Bar"])))

        await db.flush()

        waiter = (await db.execute(select(User).where(User.username == "kevin"))).scalar_one()
        cashier = (await db.execute(select(User).where(User.username == "josber"))).scalar_one()

        for _ in range(180):
            order = Order(
                table_id=random.randint(1, len(capacities)),
                waiter_id=waiter.id,
                status=random.choice(["pending", "in_kitchen", "ready", "delivered", "paid"]),
                order_type=random.choice(["dine_in", "takeaway", "delivery"]),
                notes="Pedido generado para pruebas masivas",
            )
            db.add(order)
            await db.flush()

            subtotal = Decimal('0.00')
            for __ in range(random.randint(2, 6)):
                menu_item = random.choice(menu_items)
                qty = random.randint(1, 4)
                subtotal += menu_item.price * qty
                db.add(OrderItem(order_id=order.id, menu_item_id=menu_item.id, quantity=qty, unit_price=menu_item.price, notes="sin cebolla"))

            order.subtotal = subtotal
            order.tax = (subtotal * Decimal('0.18')).quantize(Decimal('0.01'))
            order.total = order.subtotal + order.tax

            if order.status == 'paid':
                method = random.choice(['cash', 'card', 'mixed'])
                received = (order.total + Decimal(str(round(random.uniform(1, 10), 2)))) if method == 'cash' else None
                change = (received - order.total).quantize(Decimal('0.01')) if received is not None else Decimal('0.00')
                db.add(Payment(order_id=order.id, method=method, amount=order.total, received_amount=received, change_amount=change, processed_by_id=cashier.id))

        await db.commit()
        print('Large seed generated successfully')

if __name__ == '__main__':
    asyncio.run(seed())
