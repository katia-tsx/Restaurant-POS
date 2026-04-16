
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { User } from '../types';

export default function UsersPage() {
  const { data } = useQuery({ queryKey: ['users'], queryFn: async () => (await api.get('/users')).data as User[] });
  return <div className="card"><h3>Usuarios del sistema</h3><table className="table"><thead><tr><th>ID</th><th>Nombre</th><th>Usuario</th><th>Rol</th></tr></thead><tbody>{(data ?? []).map((u) => <tr key={u.id}><td>{u.id}</td><td>{u.full_name}</td><td>{u.username}</td><td>{u.role}</td></tr>)}</tbody></table></div>;
}
