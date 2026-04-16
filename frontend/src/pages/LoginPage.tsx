
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuthStore } from '../stores/authStore';

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
      navigate('/');
    } catch {
      setError('Credenciales invalidas');
    }
  };

  return (
    <div className="login-wrap">
      <form className="card login-card" onSubmit={onSubmit}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ color: '#6c63ff', fontWeight: 700, fontSize: 13, letterSpacing: '0.08em' }}>LUGAR POS</div>
          <h2 style={{ margin: '4px 0 6px', fontSize: 30 }}>Bienvenido</h2>
          <div style={{ opacity: 0.62 }}>Inicia sesion para administrar el restaurante</div>
        </div>
        <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuario" />
        <br />
        <br />
        <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
        <br />
        <br />
        <button className="button" type="submit" style={{ width: '100%' }}>Entrar al panel</button>
        {error && <p style={{ color: '#f44336', marginTop: 14 }}>{error}</p>}
      </form>
    </div>
  );
}
