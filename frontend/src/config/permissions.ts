
/**
 * Matriz alineada con docs/users.md (roles del seed: super_admin, manager, cashier, waiter, cook, barman).
 * Cada clave = una sección/ruta de la app.
 */
export type AppRole =
  | 'super_admin'
  | 'manager'
  | 'cashier'
  | 'waiter'
  | 'cook'
  | 'barman';

export type RouteKey =
  | 'dashboard'
  | 'orders'
  | 'kitchen'
  | 'bar'
  | 'menu'
  | 'tables'
  | 'payments'
  | 'reports'
  | 'users';

/** Qué rutas puede ver cada rol en el sidebar y cargar en el router. */
const MATRIX: Record<AppRole, RouteKey[]> = {
  super_admin: ['dashboard', 'orders', 'kitchen', 'bar', 'menu', 'tables', 'payments', 'reports', 'users'],
  manager: ['dashboard', 'orders', 'kitchen', 'bar', 'menu', 'tables', 'payments', 'reports', 'users'],
  /** Sin menu (matriz: cajero no gestiona carta; solo pedidos/pagos/mesas/reportes). */
  cashier: ['dashboard', 'orders', 'tables', 'payments', 'reports'],
  waiter: ['dashboard', 'orders', 'menu', 'tables'],
  cook: ['dashboard', 'kitchen'],
  barman: ['dashboard', 'bar'],
};

const ALLOWED_ROLES: AppRole[] = ['super_admin', 'manager', 'cashier', 'waiter', 'cook', 'barman'];

export function normalizeRole(role: string | null): AppRole | null {
  if (!role) return null;
  const r = role.toLowerCase().trim();
  return ALLOWED_ROLES.includes(r as AppRole) ? (r as AppRole) : null;
}

export function canAccessRoute(role: string | null, key: RouteKey): boolean {
  const r = normalizeRole(role);
  if (!r) return false;
  return MATRIX[r].includes(key);
}

/** Pantalla inicial tras login (cocina/barra priorizan su cola). */
export function getHomePathForRole(role: string | null): string {
  const r = normalizeRole(role);
  if (!r) return '/';
  if (r === 'cook') return '/kitchen';
  if (r === 'barman') return '/bar';
  return '/';
}

/** Crear pedidos: matriz — Super Admin, Gerente, Mesero (no cajero/cocina/bar). */
export function canCreateOrders(role: string | null): boolean {
  const r = normalizeRole(role);
  if (!r) return false;
  return r === 'super_admin' || r === 'manager' || r === 'waiter';
}

/** Gestionar usuarios en UI (alta/baja) — Super Admin y Gerente. */
export function canManageUsers(role: string | null): boolean {
  const r = normalizeRole(role);
  return r === 'super_admin' || r === 'manager';
}

/** Editar menu (FAB, modales crear/editar) — Super Admin y Gerente; resto solo lectura si ven la pagina. */
export function canManageMenu(role: string | null): boolean {
  const r = normalizeRole(role);
  return r === 'super_admin' || r === 'manager';
}

/** Cancelar / eliminar pedido — matriz: Super Admin, Gerente, Cajero. */
export function canCancelOrder(role: string | null): boolean {
  const r = normalizeRole(role);
  return r === 'super_admin' || r === 'manager' || r === 'cashier';
}

/** Editar estado/notas del pedido — Gerencia, mesero, cajero; en cola cocina/bar tambien cocinero/barman. */
export function canEditOrder(
  role: string | null,
  context: 'default' | 'kitchen' | 'bar',
): boolean {
  const r = normalizeRole(role);
  if (!r) return false;
  if (['super_admin', 'manager', 'waiter', 'cashier'].includes(r)) return true;
  if (context === 'kitchen' && r === 'cook') return true;
  if (context === 'bar' && r === 'barman') return true;
  return false;
}

export function routeKeyFromPath(pathname: string): RouteKey | null {
  const p = pathname.replace(/\/$/, '') || '/';
  if (p === '/' || p === '') return 'dashboard';
  const seg = p.split('/').filter(Boolean)[0];
  const map: Record<string, RouteKey> = {
    orders: 'orders',
    kitchen: 'kitchen',
    bar: 'bar',
    menu: 'menu',
    tables: 'tables',
    payments: 'payments',
    reports: 'reports',
    users: 'users',
  };
  return map[seg] ?? null;
}
