
import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Check, X, Loader2, Pencil, Trash2 } from 'lucide-react';
import { api } from '../api/client';
import Modal from '../components/Modal';
import { User } from '../types';
import { roleEs } from '../lib/labels';

const emptyUser = { username: '', full_name: '', email: '', password: '', role: 'waiter' };

const ROLE_ORDER = ['super_admin', 'manager', 'admin', 'cashier', 'waiter', 'cook', 'barman'] as const;

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState(emptyUser);
  const [feedback, setFeedback] = useState('');

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await api.get('/users')).data as User[],
  });

  const createUser = useMutation({
    mutationFn: () => api.post('/users', form),
    onSuccess: async () => {
      setFeedback('');
      setForm(emptyUser);
      setOpen(false);
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => setFeedback('No se pudo crear el usuario'),
  });

  const updateUser = useMutation({
    mutationFn: () => api.put(`/users/${editUser!.id}`, { role: form.role }),
    onSuccess: async () => {
      setEditUser(null);
      setForm(emptyUser);
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteUser = useMutation({
    mutationFn: (id: number) => api.delete(`/users/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const submitCreate = (e: FormEvent) => {
    e.preventDefault();
    setFeedback('');
    createUser.mutate();
  };

  const submitEdit = (e: FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    updateUser.mutate();
  };

  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div>
          <h1 className="page-title">Usuarios</h1>
        </div>
        <button type="button" className="button button-fab" title="Nuevo usuario" onClick={() => { setOpen(true); setForm(emptyUser); setFeedback(''); }}>
          <Plus size={22} strokeWidth={2.5} />
        </button>
      </div>

      <div className="card card--static">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th style={{ width: 120, textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(users ?? []).map((u) => (
                <tr key={u.id}>
                  <td>{u.full_name}</td>
                  <td>{u.username}</td>
                  <td>{roleEs(u.role)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="card-actions-inline" style={{ justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="icon-action icon-action--dark"
                        onClick={() => {
                          setEditUser(u);
                          setForm({ ...emptyUser, role: u.role });
                        }}
                        aria-label="Editar usuario"
                      >
                        <Pencil size={16} strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        className="icon-action icon-action--danger"
                        onClick={() => {
                          if (window.confirm(`¿Eliminar usuario ${u.username}?`)) deleteUser.mutate(u.id);
                        }}
                        aria-label="Eliminar usuario"
                      >
                        <Trash2 size={16} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={open} title="Nuevo usuario" onClose={() => setOpen(false)} size="lg">
        <form onSubmit={submitCreate} className="modal-form-grid">
          <div className="form-grid">
            <input className="input" placeholder="Usuario" value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} required />
            <input className="input" placeholder="Nombre completo" value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} required />
          </div>
          <input className="input" type="email" placeholder="Correo electrónico" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
          <input className="input" type="password" placeholder="Contraseña" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />
          <select className="select" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
            {ROLE_ORDER.map((r) => (
              <option key={r} value={r}>{roleEs(r)}</option>
            ))}
          </select>
          {feedback && <p className="form-error">{feedback}</p>}
          <div className="modal-actions">
            <button type="button" className="icon-action icon-action--dark" onClick={() => setOpen(false)} aria-label="Cancelar">
              <X size={20} strokeWidth={2} />
            </button>
            <button
              type="submit"
              className="icon-action icon-action--primary"
              disabled={createUser.isPending}
              aria-label={createUser.isPending ? 'Creando' : 'Crear usuario'}
            >
              {createUser.isPending ? <Loader2 size={20} className="icon-spin" /> : <Check size={20} strokeWidth={2.5} />}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={editUser !== null} title={`Rol — ${editUser?.username ?? ''}`} onClose={() => setEditUser(null)} size="md">
        <form onSubmit={submitEdit} className="modal-form-grid">
          <select className="select" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
            {ROLE_ORDER.map((r) => (
              <option key={r} value={r}>{roleEs(r)}</option>
            ))}
          </select>
          <div className="modal-actions">
            <button type="button" className="icon-action icon-action--dark" onClick={() => setEditUser(null)} aria-label="Cancelar">
              <X size={20} strokeWidth={2} />
            </button>
            <button
              type="submit"
              className="icon-action icon-action--primary"
              disabled={updateUser.isPending}
              aria-label={updateUser.isPending ? 'Guardando' : 'Guardar'}
            >
              {updateUser.isPending ? <Loader2 size={20} className="icon-spin" /> : <Check size={20} strokeWidth={2.5} />}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
