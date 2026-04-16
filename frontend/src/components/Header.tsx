
import { useAuthStore } from '../stores/authStore';
import { Bell, Search } from 'lucide-react';

export default function Header() {
  const { username, logout } = useAuthStore();
  return (
    <div className="header">
      <div>
        <h2 style={{ margin: 0, fontSize: 26, letterSpacing: '-0.02em' }}>Panel ejecutivo</h2>
        <div style={{ opacity: 0.62, fontSize: 14 }}>Vista operativa en tiempo real</div>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div className="header-search">
          <Search size={15} />
          <input placeholder="Buscar pedidos, mesas, clientes..." />
        </div>
        <button className="icon-button" aria-label="Notificaciones">
          <Bell size={16} />
        </button>
        <span style={{ opacity: 0.75, fontWeight: 600 }}>{username ?? 'Invitado'}</span>
        <button className="button" onClick={logout}>Salir</button>
      </div>
    </div>
  );
}
