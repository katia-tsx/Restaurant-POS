"""Sistema de permisos por rol.
Autor: Josber
Versión: 1.0.0
"""
from enum import Enum


class UserRole(str, Enum):
    """Roles disponibles en el sistema."""
    super_admin = "super_admin"
    manager = "manager"
    cashier = "cashier"
    waiter = "waiter"
    cook = "cook"
    barman = "barman"
