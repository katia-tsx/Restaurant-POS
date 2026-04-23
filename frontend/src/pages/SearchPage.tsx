import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { canAccessRoute } from '../config/permissions';
import type { MenuItem, Order, Payment, RestaurantTable, User } from '../types';
import { orderStatusEs, orderTypeEs, paymentMethodEs, roleEs, tableStatusEs } from '../lib/labels';

function norm(s: unknown): string {
  if (s == null) return '';
  return String(s).toLowerCase();
}

function matches(q: string, ...parts: unknown[]): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return false;
  return parts.some((p) => norm(p).includes(needle));
}

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q')?.trim() ?? '';
  const role = useAuthStore((s) => s.role);

  const can = {
    orders: canAccessRoute(role, 'orders'),
    tables: canAccessRoute(role, 'tables'),
    menu: canAccessRoute(role, 'menu'),
    users: canAccessRoute(role, 'users'),
    payments: canAccessRoute(role, 'payments'),
  };

  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => (await api.get('/orders')).data as Order[],
    enabled: can.orders,
  });
  const { data: tables } = useQuery({
    queryKey: ['tables'],
    queryFn: async () => (await api.get('/tables')).data as RestaurantTable[],
    enabled: can.tables,
  });
  const { data: menuItems } = useQuery({
    queryKey: ['menu'],
    queryFn: async () => (await api.get('/menu/items')).data as MenuItem[],
    enabled: can.menu,
  });
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await api.get('/users')).data as User[],
    enabled: can.users,
  });
  const { data: payments } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => (await api.get('/payments')).data as Payment[],
    enabled: can.payments,
  });

  const filtered = useMemo(() => {
    if (!q) {
      return { orders: [] as Order[], tables: [] as RestaurantTable[], menu: [] as MenuItem[], users: [] as User[], payments: [] as Payment[] };
    }
    return {
      orders: (orders ?? []).filter((o) =>
        matches(q, o.id, o.status, o.order_type, o.notes, o.table_id, o.waiter_id, o.total),
      ),
      tables: (tables ?? []).filter((t) => matches(q, t.id, t.number, t.status, t.capacity, t.location)),
      menu: (menuItems ?? []).filter((m) => matches(q, m.id, m.name, m.description, m.price)),
      users: (users ?? []).filter((u) => matches(q, u.id, u.username, u.full_name, u.email, u.role)),
      payments: (payments ?? []).filter((p) => matches(q, p.id, p.order_id, p.method, p.amount, p.processed_by_id)),
    };
  }, [q, orders, tables, menuItems, users, payments]);

  const total =
    filtered.orders.length +
    filtered.tables.length +
    filtered.menu.length +
    filtered.users.length +
    filtered.payments.length;

  if (!q) {
    return (
      <div className="page-stack">
        <h1 className="page-title">Búsqueda</h1>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: 15 }}>
          Escribe en el buscador del encabezado y pulsa <strong>Enter</strong> para buscar en pedidos, mesas, menú, usuarios y pagos (según tu rol).
        </p>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <h1 className="page-title">Resultados para «{q}»</h1>
      <p style={{ margin: '0 0 8px', color: 'var(--muted)', fontSize: 14 }}>
        {total === 0 ? 'Sin coincidencias.' : `${total} coincidencia${total === 1 ? '' : 's'}.`}
      </p>

      {can.orders && filtered.orders.length > 0 && (
        <section className="card card--static">
          <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700 }}>Pedidos</h3>
          <ul className="search-result-list">
            {filtered.orders.map((o) => (
              <li key={o.id}>
                <Link to="/orders">Pedido #{o.id}</Link>
                <span className="search-result-meta">
                  {orderStatusEs(o.status)} · {orderTypeEs(o.order_type)} · ${o.total}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {can.tables && filtered.tables.length > 0 && (
        <section className="card card--static">
          <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700 }}>Mesas</h3>
          <ul className="search-result-list">
            {filtered.tables.map((t) => (
              <li key={t.id}>
                <Link to="/tables">Mesa {t.number}</Link>
                <span className="search-result-meta">
                  {tableStatusEs(t.status)} · Cap. {t.capacity}
                  {t.location ? ` · ${t.location}` : ''}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {can.menu && filtered.menu.length > 0 && (
        <section className="card card--static">
          <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700 }}>Menú</h3>
          <ul className="search-result-list">
            {filtered.menu.map((m) => (
              <li key={m.id}>
                <Link to="/menu">{m.name}</Link>
                <span className="search-result-meta">${m.price}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {can.users && filtered.users.length > 0 && (
        <section className="card card--static">
          <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700 }}>Usuarios</h3>
          <ul className="search-result-list">
            {filtered.users.map((u) => (
              <li key={u.id}>
                <Link to="/users">{u.full_name}</Link>
                <span className="search-result-meta">
                  @{u.username} · {roleEs(u.role)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {can.payments && filtered.payments.length > 0 && (
        <section className="card card--static">
          <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700 }}>Pagos</h3>
          <ul className="search-result-list">
            {filtered.payments.map((p) => (
              <li key={p.id}>
                <Link to="/payments">Pago #{p.id}</Link>
                <span className="search-result-meta">
                  Orden {p.order_id} · {paymentMethodEs(p.method)} · ${p.amount}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
