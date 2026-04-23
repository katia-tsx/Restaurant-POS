
import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Check, X, Loader2 } from 'lucide-react';
import { api } from '../api/client';
import TableGrid from '../components/TableGrid';
import Modal from '../components/Modal';
import { RestaurantTable } from '../types';
import { tableStatusEs } from '../lib/labels';

const MAX_TABLES = 5;

type FormState = { number: string; capacity: string; location: string; status: string };

const emptyCreate = (): FormState => ({ number: '', capacity: '', location: 'Interior', status: 'available' });

export default function TablesPage() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editTable, setEditTable] = useState<RestaurantTable | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyCreate());
  const [feedback, setFeedback] = useState('');

  const { data: tables } = useQuery({
    queryKey: ['tables'],
    queryFn: async () => (await api.get('/tables')).data as RestaurantTable[],
  });
  const { data: tableDetail } = useQuery({
    queryKey: ['table', detailId],
    enabled: detailId !== null,
    queryFn: async () => (await api.get(`/tables/${detailId}`)).data as RestaurantTable,
  });

  const count = tables?.length ?? 0;
  const canAdd = count < MAX_TABLES;

  const createTable = useMutation({
    mutationFn: () =>
      api.post('/tables', {
        number: Number(form.number),
        capacity: Number(form.capacity),
        location: form.location || 'Interior',
      }),
    onSuccess: async () => {
      setFeedback('');
      setForm(emptyCreate());
      setCreateOpen(false);
      await queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
    onError: (err: { response?: { data?: { detail?: string } } }) => {
      setFeedback(err.response?.data?.detail ?? 'No se pudo crear la mesa');
    },
  });

  const updateTable = useMutation({
    mutationFn: () =>
      api.put(`/tables/${editTable!.id}`, {
        capacity: Number(form.capacity),
        location: form.location,
        status: form.status,
      }),
    onSuccess: async () => {
      setEditTable(null);
      await queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });

  const deleteTable = useMutation({
    mutationFn: (id: number) => api.delete(`/tables/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });

  const openEdit = (t: RestaurantTable) => {
    setEditTable(t);
    setForm({
      number: String(t.number),
      capacity: String(t.capacity),
      location: t.location ?? 'Interior',
      status: t.status,
    });
  };

  const submitCreate = (e: FormEvent) => {
    e.preventDefault();
    setFeedback('');
    createTable.mutate();
  };

  const submitEdit = (e: FormEvent) => {
    e.preventDefault();
    if (!editTable) return;
    updateTable.mutate();
  };

  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div>
          <h1 className="page-title">Mesas</h1>
        </div>
        <button
          type="button"
          className="button button-fab"
          disabled={!canAdd}
          title={canAdd ? 'Nueva mesa' : `Máximo ${MAX_TABLES} mesas`}
          onClick={() => {
            if (!canAdd) return;
            setCreateOpen(true);
            setForm(emptyCreate());
            setFeedback('');
          }}
        >
          <Plus size={22} strokeWidth={2.5} />
        </button>
      </div>

      <TableGrid
        tables={tables ?? []}
        onDetail={(t) => setDetailId(t.id)}
        onEdit={openEdit}
        onDelete={(t) => {
          if (window.confirm(`Eliminar mesa ${t.number}?`)) deleteTable.mutate(t.id);
        }}
      />

      <Modal open={createOpen} title="Nueva mesa" onClose={() => setCreateOpen(false)} size="md">
        <form onSubmit={submitCreate} className="modal-form-grid">
          <input className="input" type="number" min="1" placeholder="Número de mesa" value={form.number} onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))} required />
          <input className="input" type="number" min="1" placeholder="Capacidad" value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} required />
          <input className="input" placeholder="Ubicación" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
          {feedback && <p className="form-error">{feedback}</p>}
          <div className="modal-actions">
            <button type="button" className="icon-action icon-action--dark" onClick={() => setCreateOpen(false)} aria-label="Cancelar">
              <X size={20} strokeWidth={2} />
            </button>
            <button
              type="submit"
              className="icon-action icon-action--primary"
              disabled={createTable.isPending}
              aria-label={createTable.isPending ? 'Creando' : 'Crear mesa'}
            >
              {createTable.isPending ? <Loader2 size={20} className="icon-spin" /> : <Check size={20} strokeWidth={2.5} />}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={editTable !== null} title={`Editar mesa ${editTable?.number ?? ''}`} onClose={() => setEditTable(null)} size="md">
        <form onSubmit={submitEdit} className="modal-form-grid">
          <input className="input" type="number" min="1" placeholder="Capacidad" value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} required />
          <input className="input" placeholder="Ubicación" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
          <select className="select" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
            <option value="available">{tableStatusEs('available')}</option>
            <option value="occupied">{tableStatusEs('occupied')}</option>
            <option value="reserved">{tableStatusEs('reserved')}</option>
          </select>
          <div className="modal-actions">
            <button type="button" className="icon-action icon-action--dark" onClick={() => setEditTable(null)} aria-label="Cancelar">
              <X size={20} strokeWidth={2} />
            </button>
            <button
              type="submit"
              className="icon-action icon-action--primary"
              disabled={updateTable.isPending}
              aria-label={updateTable.isPending ? 'Guardando' : 'Guardar'}
            >
              {updateTable.isPending ? <Loader2 size={20} className="icon-spin" /> : <Check size={20} strokeWidth={2.5} />}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={detailId !== null} title="Detalle de mesa" onClose={() => setDetailId(null)} size="md">
        {tableDetail && (
          <ul className="detail-list">
            <li><span>ID</span><span>{tableDetail.id}</span></li>
            <li><span>Número</span><strong>{tableDetail.number}</strong></li>
            <li><span>Capacidad</span><span>{tableDetail.capacity}</span></li>
            <li><span>Estado</span><span>{tableStatusEs(tableDetail.status)}</span></li>
            <li><span>Ubicación</span><span>{tableDetail.location ?? '—'}</span></li>
          </ul>
        )}
      </Modal>
    </div>
  );
}
