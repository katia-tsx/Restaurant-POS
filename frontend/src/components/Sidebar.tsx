
import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  ChefHat,
  CreditCard,
  LayoutDashboard,
  MenuSquare,
  SquareKanban,
  Table2,
  Users,
  Wine,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { canAccessRoute, type RouteKey } from '../config/permissions';
import { roleEs } from '../lib/labels';

type LinkDef = { key: RouteKey; to: string; label: string; Icon: typeof LayoutDashboard };

const ALL_LINKS: LinkDef[] = [
  { key: 'dashboard', to: '/', label: 'Inicio', Icon: LayoutDashboard },
  { key: 'orders', to: '/orders', label: 'Pedidos', Icon: SquareKanban },
  { key: 'kitchen', to: '/kitchen', label: 'Cola cocina', Icon: ChefHat },
  { key: 'bar', to: '/bar', label: 'Cola barra', Icon: Wine },
  { key: 'menu', to: '/menu', label: 'Menú', Icon: MenuSquare },
  { key: 'tables', to: '/tables', label: 'Mesas', Icon: Table2 },
  { key: 'payments', to: '/payments', label: 'Pagos', Icon: CreditCard },
  { key: 'reports', to: '/reports', label: 'Reportes', Icon: BarChart3 },
  { key: 'users', to: '/users', label: 'Usuarios', Icon: Users },
];

export default function Sidebar() {
  const role = useAuthStore((s) => s.role);
  const links = ALL_LINKS.filter((l) => canAccessRoute(role, l.key));

  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <div className="sidebar-brand-block">
          <div className="sidebar-logo" aria-hidden>
            LP
          </div>
          <div>
            <div className="brand">LUGAR POS</div>
            <div className="sidebar-subtitle">Panel del local</div>
          </div>
        </div>

        <div className="sidebar-nav-label">Operación</div>
        {links.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon"><Icon size={18} strokeWidth={2} /></span>
            <span>{label}</span>
          </NavLink>
        ))}

        <div className="sidebar-footer">
          {role ? `Rol: ${roleEs(role)}` : 'Sesión'} · v1.0
        </div>
      </div>
    </aside>
  );
}
