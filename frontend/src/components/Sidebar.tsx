
import { NavLink } from 'react-router-dom';
import { BarChart3, CreditCard, LayoutDashboard, MenuSquare, SquareKanban, Table2, Users } from 'lucide-react';

const links = [
  { to: '/', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/orders', label: 'Pedidos', Icon: SquareKanban },
  { to: '/menu', label: 'Menu', Icon: MenuSquare },
  { to: '/tables', label: 'Mesas', Icon: Table2 },
  { to: '/payments', label: 'Pagos', Icon: CreditCard },
  { to: '/reports', label: 'Reportes', Icon: BarChart3 },
  { to: '/users', label: 'Usuarios', Icon: Users },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">LUGAR POS</div>
      <div className="sidebar-subtitle">Restaurant Control Suite</div>
      {links.map(({ to, label, Icon }) => (
        <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon"><Icon size={16} /></span>
          <span>{label}</span>
        </NavLink>
      ))}
    </aside>
  );
}
