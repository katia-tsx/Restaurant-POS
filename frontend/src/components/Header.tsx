
import { FormEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Bell, Search } from 'lucide-react';
import { roleEs } from '../lib/labels';

export default function Header() {
  const { username, role, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (location.pathname === '/search') {
      setSearchText(params.get('q') ?? '');
    }
  }, [location.pathname, location.search, params]);

  const onSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = searchText.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  return (
    <header className="header">
      <div>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)' }}>Hola, {username ?? 'equipo'}</h2>
        <div style={{ marginTop: 4, fontSize: 14, color: 'var(--muted)', fontWeight: 500 }}>
          {role ? `Rol: ${roleEs(role)} · ` : ''}
          Resumen operativo
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <form className="header-search" onSubmit={onSearchSubmit} role="search">
          <Search size={16} color="var(--muted)" strokeWidth={2} aria-hidden />
          <input
            placeholder="Buscar pedidos, mesas, menú, usuarios…"
            aria-label="Buscar en la aplicación"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            name="q"
            autoComplete="off"
          />
        </form>
        <button className="icon-button" type="button" aria-label="Notificaciones">
          <Bell size={17} strokeWidth={2} />
        </button>
        <span
          style={{
            fontWeight: 700,
            fontSize: 13,
            padding: '6px 12px',
            borderRadius: 999,
            background: 'var(--primary-soft)',
            color: '#c2410c',
            border: '1px solid rgba(249, 115, 22, 0.22)',
          }}
        >
          {username ?? 'Invitado'}
        </span>
        <button className="button" type="button" onClick={logout}>
          Salir
        </button>
      </div>
    </header>
  );
}
