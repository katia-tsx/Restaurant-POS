# Usuarios del Sistema POS — Restaurante

> ⚠️ CONFIDENCIAL — No compartir. Cambiar contraseñas en producción.

## Credenciales de acceso

| # | Nombre completo | Usuario     | Contraseña inicial  | Rol          | Permisos                                                        |
|---|-----------------|-------------|---------------------|--------------|----------------------------------------------------------------|
| 1 | Katia           | katia       | Katia@POS2025!      | Super Admin  | Acceso total: usuarios, config, reportes, pagos, menú, mesas  |
| 2 | Raylin          | raylin      | Raylin@POS2025!     | Gerente      | Menú, reportes, inventario, usuarios (sin SuperAdmin), mesas  |
| 3 | Josber          | josber      | Josber@POS2025!     | Cajero       | Procesar pagos, ver pedidos, cerrar órdenes, corte de caja    |
| 4 | Kevin           | kevin       | Kevin@POS2025!      | Mesero       | Crear/editar pedidos, ver mesas asignadas, ver menú           |
| 5 | Johan           | johan       | Johan@POS2025!      | Cocinero     | Ver cola de cocina, marcar items listos (solo comida)         |
| 6 | Said            | said        | Said@POS2025!       | Barman       | Ver cola de bebidas, marcar drinks listos, ver menú bebidas   |

## Matriz de permisos

| Permiso                  | Super Admin | Gerente | Cajero | Mesero | Cocinero | Barman |
|--------------------------|:-----------:|:-------:|:------:|:------:|:--------:|:------:|
| Gestionar usuarios       | ✅          | ✅      | ❌     | ❌     | ❌       | ❌     |
| Configuración sistema    | ✅          | ❌      | ❌     | ❌     | ❌       | ❌     |
| Ver/editar menú          | ✅          | ✅      | ❌     | 👁️     | 👁️       | 👁️     |
| Crear pedidos            | ✅          | ✅      | ❌     | ✅     | ❌       | ❌     |
| Editar pedidos           | ✅          | ✅      | ❌     | ✅     | ❌       | ❌     |
| Cancelar pedidos         | ✅          | ✅      | ✅     | ❌     | ❌       | ❌     |
| Procesar pagos           | ✅          | ✅      | ✅     | ❌     | ❌       | ❌     |
| Anular pagos             | ✅          | ❌      | ❌     | ❌     | ❌       | ❌     |
| Ver reportes             | ✅          | ✅      | ✅     | ❌     | ❌       | ❌     |
| Gestionar mesas          | ✅          | ✅      | ✅     | ✅     | ❌       | ❌     |
| Cola de cocina           | ✅          | ✅      | ❌     | ❌     | ✅       | ❌     |
| Cola de barra            | ✅          | ✅      | ❌     | ❌     | ❌       | ✅     |
| Corte de caja            | ✅          | ✅      | ✅     | ❌     | ❌       | ❌     |

## Notas de seguridad

- Todas las contraseñas se almacenan hasheadas con bcrypt (12 rounds).
- JWT expira en 8 horas. Refresh token dura 7 días.
- Los intentos fallidos de login (5 seguidos) bloquean el usuario por 15 minutos.
- El Super Admin (Katia) es el único que puede desbloquear usuarios.
- Cambiar TODAS las contraseñas al desplegar en producción.
