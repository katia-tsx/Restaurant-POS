
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { getHomePathForRole } from '../config/permissions';

export default function LoginPage() {
  const [username, setUsername] = useState('katia');
  const [password, setPassword] = useState('Katia@POS2025!');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { username, password });
      setAuth(data.access_token, username);
      const role = useAuthStore.getState().role;
      navigate(getHomePathForRole(role));
    } catch {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-surface">
        <div className="login-showcase">
          <div className="login-badge">LUGAR POS</div>
          <h1>Gestión gastronómica</h1>
          <p>Operación de mesas, pedidos y cobros en tiempo real.</p>
          <div className="login-metrics">
            <div><strong>120+</strong><span>Productos</span></div>
            <div><strong>16</strong><span>Mesas</span></div>
            <div><strong>700+</strong><span>Órdenes</span></div>
          </div>
        </div>
        <form className="card login-card" onSubmit={onSubmit}>
          <div className="section-header">
            <h2>Bienvenida de nuevo</h2>
            <p>Inicia sesión para continuar.</p>
          </div>
          <div className="form-grid">
            <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuario" />
            <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" type="password" />
          </div>
          <button className="button button-full" type="submit">Entrar al panel</button>
          {error && <p className="form-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
