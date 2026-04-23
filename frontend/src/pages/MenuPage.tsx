
import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Check, X, Loader2 } from 'lucide-react';
import { api } from '../api/client';
import MenuItemCard from '../components/MenuItemCard';
import Modal from '../components/Modal';
import { useAuthStore } from '../stores/authStore';
import { canManageMenu } from '../config/permissions';
import { Category, MenuItem } from '../types';

const emptyForm = { name: '', description: '', price: '', category_id: '', image_url: '' };

export default function MenuPage() {
  const role = useAuthStore((s) => s.role);
  const manage = canManageMenu(role);
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [feedback, setFeedback] = useState('');

  const { data: items } = useQuery({
    queryKey: ['menu'],
    queryFn: async () => (await api.get('/menu/items')).data as MenuItem[],
  });
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/menu/categories')).data as Category[],
  });
  const { data: detailItem } = useQuery({
    queryKey: ['menu-item', detailId],
    enabled: detailId !== null,
    queryFn: async () => (await api.get(`/menu/items/${detailId}`)).data as MenuItem & {
      preparation_time?: number;
      allergens?: string;
      tags?: string;
    },
  });

  const createItem = useMutation({
    mutationFn: () =>
      api.post('/menu/items', {
        name: form.name,
        description: form.description || undefined,
        price: Number(form.price),
        category_id: Number(form.category_id),
        image_url: form.image_url || undefined,
      }),
    onSuccess: async () => {
      setFeedback('');
      setForm(emptyForm);
      setCreateOpen(false);
      await queryClient.invalidateQueries({ queryKey: ['menu'] });
    },
    onError: () => setFeedback('No se pudo crear el producto'),
  });

  const updateItem = useMutation({
    mutationFn: () =>
      api.put(`/menu/items/${editId}`, {
        name: form.name,
        description: form.description || undefined,
        price: Number(form.price),
        category_id: Number(form.category_id),
        image_url: form.image_url || undefined,
      }),
    onSuccess: async () => {
      setFeedback('');
      setEditId(null);
      setForm(emptyForm);
      await queryClient.invalidateQueries({ queryKey: ['menu'] });
    },
    onError: () => setFeedback('No se pudo guardar'),
  });

  const deleteItem = useMutation({
    mutationFn: (id: number) => api.delete(`/menu/items/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['menu'] });
    },
  });

  const openEdit = (item: MenuItem) => {
    setEditId(item.id);
    setForm({
      name: item.name,
      description: item.description ?? '',
      price: String(item.price),
      category_id: String(item.category_id),
      image_url: item.image_url ?? '',
    });
    setFeedback('');
  };

  const submitCreate = (e: FormEvent) => {
    e.preventDefault();
    setFeedback('');
    createItem.mutate();
  };

  const submitEdit = (e: FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setFeedback('');
    updateItem.mutate();
  };

  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div>
          <h1 className="page-title">Menú</h1>
        </div>
        {manage && (
          <button type="button" className="button button-fab" title="Nuevo producto" onClick={() => { setCreateOpen(true); setForm(emptyForm); setFeedback(''); }}>
            <Plus size={22} strokeWidth={2.5} />
          </button>
        )}
      </div>

      <div className="grid grid-4">
        {(items ?? []).map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            showManage={manage}
            onDetail={() => setDetailId(item.id)}
            onEdit={() => openEdit(item)}
            onDelete={() => {
              if (window.confirm(`Eliminar "${item.name}"?`)) deleteItem.mutate(item.id);
            }}
          />
        ))}
      </div>

      <Modal open={createOpen && manage} title="Nuevo producto" onClose={() => setCreateOpen(false)} size="lg">
        <form onSubmit={submitCreate} className="modal-form-grid">
          <input className="input" placeholder="Nombre" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <input className="input" placeholder="Descripción" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <div className="form-grid">
            <input className="input" type="number" min="0" step="0.01" placeholder="Precio" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required />
            <select className="select" value={form.category_id} onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))} required>
              <option value="">Categoría</option>
              {(categories ?? []).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <input className="input" placeholder="URL imagen (opcional)" value={form.image_url} onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))} />
          {feedback && <p className="form-error">{feedback}</p>}
          <div className="modal-actions">
            <button type="button" className="icon-action icon-action--dark" onClick={() => setCreateOpen(false)} aria-label="Cancelar">
              <X size={20} strokeWidth={2} />
            </button>
            <button
              type="submit"
              className="icon-action icon-action--primary"
              disabled={createItem.isPending}
              aria-label={createItem.isPending ? 'Guardando' : 'Crear producto'}
            >
              {createItem.isPending ? <Loader2 size={20} className="icon-spin" /> : <Check size={20} strokeWidth={2.5} />}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={editId !== null && manage} title="Editar producto" onClose={() => { setEditId(null); setForm(emptyForm); }} size="lg">
        <form onSubmit={submitEdit} className="modal-form-grid">
          <input className="input" placeholder="Nombre" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <input className="input" placeholder="Descripción" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <div className="form-grid">
            <input className="input" type="number" min="0" step="0.01" placeholder="Precio" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required />
            <select className="select" value={form.category_id} onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))} required>
              <option value="">Categoría</option>
              {(categories ?? []).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <input className="input" placeholder="URL imagen" value={form.image_url} onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))} />
          {feedback && <p className="form-error">{feedback}</p>}
          <div className="modal-actions">
            <button type="button" className="icon-action icon-action--dark" onClick={() => { setEditId(null); setForm(emptyForm); }} aria-label="Cancelar">
              <X size={20} strokeWidth={2} />
            </button>
            <button
              type="submit"
              className="icon-action icon-action--primary"
              disabled={updateItem.isPending}
              aria-label={updateItem.isPending ? 'Guardando' : 'Guardar cambios'}
            >
              {updateItem.isPending ? <Loader2 size={20} className="icon-spin" /> : <Check size={20} strokeWidth={2.5} />}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={detailId !== null} title="Detalle del producto" onClose={() => setDetailId(null)} size="lg">
        {detailItem && (
          <div>
            {detailItem.image_url && (
              <img src={detailItem.image_url} alt="" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 14, marginBottom: 14 }} />
            )}
            <ul className="detail-list">
              <li><span>Nombre</span><strong>{detailItem.name}</strong></li>
              <li><span>Precio</span><strong style={{ color: 'var(--primary)' }}>${detailItem.price}</strong></li>
              <li><span>Categoria ID</span><span>{detailItem.category_id}</span></li>
              <li><span>Disponible</span><span>{detailItem.is_available ? 'Si' : 'No'}</span></li>
              {detailItem.preparation_time != null && (
                <li><span>Tiempo prep. (min)</span><span>{detailItem.preparation_time}</span></li>
              )}
              <li><span>Descripcion</span><span style={{ textAlign: 'right', maxWidth: '60%' }}>{detailItem.description ?? '—'}</span></li>
              {detailItem.allergens && <li><span>Alergenos</span><span style={{ textAlign: 'right', fontSize: 12 }}>{detailItem.allergens}</span></li>}
              {detailItem.tags && <li><span>Etiquetas</span><span style={{ textAlign: 'right', fontSize: 12 }}>{detailItem.tags}</span></li>}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
}
