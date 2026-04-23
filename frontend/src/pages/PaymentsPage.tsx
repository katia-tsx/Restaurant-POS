
import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Check, X, Loader2, Pencil, Trash2 } from 'lucide-react';
import { api } from '../api/client';
import Modal from '../components/Modal';
import { Payment } from '../types';
import { paymentMethodEs } from '../lib/labels';

const emptyPayment = { order_id: '', method: 'cash', received_amount: '', processed_by_id: '' };

const METHOD_CODES = ['cash', 'card', 'transfer', 'mixed'] as const;

export default function PaymentsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [form, setForm] = useState(emptyPayment);

  const { data: payments } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => (await api.get('/payments')).data as Payment[],
  });

  const createPayment = useMutation({
    mutationFn: () =>
      api.post('/payments', {
        order_id: Number(form.order_id),
        method: form.method,
        received_amount: form.received_amount ? Number(form.received_amount) : undefined,
        processed_by_id: Number(form.processed_by_id),
      }),
    onSuccess: async () => {
      setFeedback('');
      setForm(emptyPayment);
      setOpen(false);
      await queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
    onError: () => setFeedback('No se pudo registrar el pago'),
  });

  const updatePayment = useMutation({
    mutationFn: ({ id, method }: { id: number; method: string }) => api.put(`/payments/${id}`, { method }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });

  const deletePayment = useMutation({
    mutationFn: (id: number) => api.delete(`/payments/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setFeedback('');
    createPayment.mutate();
  };

  const promptChangeMethod = (p: Payment) => {
    const hint = METHOD_CODES.map((c) => `${c} (${paymentMethodEs(c)})`).join(', ');
    const next = window.prompt(`Nuevo método (${hint}):`, p.method);
    const code = next?.trim();
    if (!code || !(METHOD_CODES as readonly string[]).includes(code)) return;
    updatePayment.mutate({ id: p.id, method: code });
  };

  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div>
          <h1 className="page-title">Pagos</h1>
        </div>
        <button type="button" className="button button-fab" title="Registrar pago" onClick={() => { setOpen(true); setForm(emptyPayment); setFeedback(''); }}>
          <Plus size={22} strokeWidth={2.5} />
        </button>
      </div>

      <div className="card card--static">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Orden</th>
                <th>Método</th>
                <th>Monto</th>
                <th style={{ width: 120, textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(payments ?? []).map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.order_id}</td>
                  <td>{paymentMethodEs(p.method)}</td>
                  <td>${p.amount}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="card-actions-inline" style={{ justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="icon-action icon-action--dark"
                        onClick={() => promptChangeMethod(p)}
                        aria-label="Cambiar método de pago"
                      >
                        <Pencil size={16} strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        className="icon-action icon-action--danger"
                        onClick={() => {
                          if (window.confirm('¿Eliminar este pago?')) deletePayment.mutate(p.id);
                        }}
                        aria-label="Eliminar pago"
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

      <Modal open={open} title="Registrar pago" onClose={() => setOpen(false)} size="lg">
        <form onSubmit={submit} className="modal-form-grid">
          <input className="input" type="number" min="1" placeholder="ID de orden" value={form.order_id} onChange={(e) => setForm((f) => ({ ...f, order_id: e.target.value }))} required />
          <div className="form-grid">
            <select className="select" value={form.method} onChange={(e) => setForm((f) => ({ ...f, method: e.target.value }))}>
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
              <option value="transfer">Transferencia</option>
              <option value="mixed">Mixto</option>
            </select>
            <input className="input" type="number" min="0" step="0.01" placeholder="Monto recibido (opcional)" value={form.received_amount} onChange={(e) => setForm((f) => ({ ...f, received_amount: e.target.value }))} />
          </div>
          <input className="input" type="number" min="1" placeholder="ID usuario (cajero)" value={form.processed_by_id} onChange={(e) => setForm((f) => ({ ...f, processed_by_id: e.target.value }))} required />
          {feedback && <p className="form-error">{feedback}</p>}
          <div className="modal-actions">
            <button type="button" className="icon-action icon-action--dark" onClick={() => setOpen(false)} aria-label="Cancelar">
              <X size={20} strokeWidth={2} />
            </button>
            <button
              type="submit"
              className="icon-action icon-action--primary"
              disabled={createPayment.isPending}
              aria-label={createPayment.isPending ? 'Registrando' : 'Registrar pago'}
            >
              {createPayment.isPending ? <Loader2 size={20} className="icon-spin" /> : <Check size={20} strokeWidth={2.5} />}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
