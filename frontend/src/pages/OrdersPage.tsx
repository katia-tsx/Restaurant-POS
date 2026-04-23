
import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Check, X, Loader2 } from 'lucide-react';
import { api } from '../api/client';
import OrderCard from '../components/OrderCard';
import Modal from '../components/Modal';
import { useAuthStore } from '../stores/authStore';
import { canCancelOrder, canCreateOrders, canEditOrder } from '../config/permissions';
import { MenuItem, Order, OrderDetail, RestaurantTable, User } from '../types';
import { orderStatusEs, orderTypeEs } from '../lib/labels';

const emptyCreate = { table_id: '', waiter_id: '', menu_item_id: '', quantity: '1', notes: '', order_type: 'dine_in' };

type Variant = 'default' | 'kitchen' | 'bar';

const PAGE_TITLE: Record<Variant, string> = {
  default: 'Pedidos',
  kitchen: 'Cola cocina',
  bar: 'Cola barra',
};

type Props = { variant?: Variant };

export default function OrdersPage({ variant = 'default' }: Props) {
  const role = useAuthStore((s) => s.role);
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [createForm, setCreateForm] = useState(emptyCreate);
  const [editForm, setEditForm] = useState({ status: '', notes: '' });
  const [feedback, setFeedback] = useState('');

  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => (await api.get('/orders')).data as Order[],
  });
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await api.get('/users')).data as User[],
  });
  const { data: tables } = useQuery({
    queryKey: ['tables'],
    queryFn: async () => (await api.get('/tables')).data as RestaurantTable[],
  });
  const { data: menuItems } = useQuery({
    queryKey: ['menu'],
    queryFn: async () => (await api.get('/menu/items')).data as MenuItem[],
  });
  const { data: orderDetail } = useQuery({
    queryKey: ['order', detailId],
    enabled: detailId !== null,
    queryFn: async () => (await api.get(`/orders/${detailId}`)).data as OrderDetail,
  });

  const createOrder = useMutation({
    mutationFn: () =>
      api.post('/orders', {
        table_id: createForm.table_id ? Number(createForm.table_id) : undefined,
        waiter_id: Number(createForm.waiter_id),
        order_type: createForm.order_type,
        notes: createForm.notes || undefined,
        items: [{ menu_item_id: Number(createForm.menu_item_id), quantity: Number(createForm.quantity) }],
      }),
    onSuccess: async () => {
      setFeedback('');
      setCreateForm(emptyCreate);
      setCreateOpen(false);
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: () => setFeedback('No se pudo crear la orden'),
  });

  const updateOrder = useMutation({
    mutationFn: () =>
      api.put(`/orders/${editOrder!.id}`, {
        status: editForm.status,
        notes: editForm.notes || undefined,
      }),
    onSuccess: async () => {
      setEditOrder(null);
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const deleteOrder = useMutation({
    mutationFn: (id: number) => api.delete(`/orders/${id}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const openEdit = (o: Order) => {
    setEditOrder(o);
    setEditForm({ status: o.status, notes: o.notes ?? '' });
  };

  const submitCreate = (e: FormEvent) => {
    e.preventDefault();
    setFeedback('');
    createOrder.mutate();
  };

  const submitEdit = (e: FormEvent) => {
    e.preventDefault();
    if (!editOrder) return;
    updateOrder.mutate();
  };

  const showCreate = variant === 'default' && canCreateOrders(role);
  const showEdit = canEditOrder(role, variant);
  const showDelete = canCancelOrder(role);
  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div>
          <h1 className="page-title">{PAGE_TITLE[variant]}</h1>
        </div>
        {showCreate && (
          <button type="button" className="button button-fab" title="Nuevo pedido" onClick={() => { setCreateOpen(true); setCreateForm(emptyCreate); setFeedback(''); }}>
            <Plus size={22} strokeWidth={2.5} />
          </button>
        )}
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {(orders ?? []).map((o) => (
          <OrderCard
            key={o.id}
            order={o}
            onDetail={() => setDetailId(o.id)}
            onEdit={() => openEdit(o)}
            onDelete={() => {
              if (window.confirm(`Eliminar orden #${o.id}?`)) deleteOrder.mutate(o.id);
            }}
            showEdit={showEdit}
            showDelete={showDelete}
          />
        ))}
      </div>

      <Modal open={createOpen} title="Nuevo pedido" onClose={() => setCreateOpen(false)} size="lg">
        <form onSubmit={submitCreate} className="modal-form-grid">
          <div className="form-grid">
            <select className="select" value={createForm.table_id} onChange={(e) => setCreateForm((f) => ({ ...f, table_id: e.target.value }))}>
              <option value="">Mesa (opcional)</option>
              {(tables ?? []).map((t) => (
                <option key={t.id} value={t.id}>Mesa {t.number}</option>
              ))}
            </select>
            <select className="select" value={createForm.waiter_id} onChange={(e) => setCreateForm((f) => ({ ...f, waiter_id: e.target.value }))} required>
              <option value="">Mesero</option>
              {(users ?? []).filter((u) => u.is_active).map((u) => (
                <option key={u.id} value={u.id}>{u.full_name}</option>
              ))}
            </select>
          </div>
          <select className="select" value={createForm.order_type} onChange={(e) => setCreateForm((f) => ({ ...f, order_type: e.target.value }))}>
            <option value="dine_in">En local</option>
            <option value="takeaway">Para llevar</option>
            <option value="delivery">Domicilio</option>
          </select>
          <div className="form-grid">
            <select className="select" value={createForm.menu_item_id} onChange={(e) => setCreateForm((f) => ({ ...f, menu_item_id: e.target.value }))} required>
              <option value="">Producto inicial</option>
              {(menuItems ?? []).map((m) => (
                <option key={m.id} value={m.id}>{m.name} — ${m.price}</option>
              ))}
            </select>
            <input className="input" type="number" min="1" placeholder="Cantidad" value={createForm.quantity} onChange={(e) => setCreateForm((f) => ({ ...f, quantity: e.target.value }))} required />
          </div>
          <input className="input" placeholder="Notas (opcional)" value={createForm.notes} onChange={(e) => setCreateForm((f) => ({ ...f, notes: e.target.value }))} />
          {feedback && <p className="form-error">{feedback}</p>}
          <div className="modal-actions">
            <button type="button" className="icon-action icon-action--dark" onClick={() => setCreateOpen(false)} aria-label="Cancelar">
              <X size={20} strokeWidth={2} />
            </button>
            <button
              type="submit"
              className="icon-action icon-action--primary"
              disabled={createOrder.isPending}
              aria-label={createOrder.isPending ? 'Creando' : 'Crear pedido'}
            >
              {createOrder.isPending ? <Loader2 size={20} className="icon-spin" /> : <Check size={20} strokeWidth={2.5} />}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={editOrder !== null} title={`Editar orden #${editOrder?.id ?? ''}`} onClose={() => setEditOrder(null)} size="md">
        <form onSubmit={submitEdit} className="modal-form-grid">
          <select className="select" value={editForm.status} onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))} required>
            <option value="pending">{orderStatusEs('pending')}</option>
            <option value="in_kitchen">{orderStatusEs('in_kitchen')}</option>
            <option value="ready">{orderStatusEs('ready')}</option>
            <option value="delivered">{orderStatusEs('delivered')}</option>
            <option value="paid">{orderStatusEs('paid')}</option>
          </select>
          <textarea className="input" style={{ minHeight: 80, resize: 'vertical' }} placeholder="Notas" value={editForm.notes} onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))} />
          <div className="modal-actions">
            <button type="button" className="icon-action icon-action--dark" onClick={() => setEditOrder(null)} aria-label="Cancelar">
              <X size={20} strokeWidth={2} />
            </button>
            <button
              type="submit"
              className="icon-action icon-action--primary"
              disabled={updateOrder.isPending}
              aria-label={updateOrder.isPending ? 'Guardando' : 'Guardar'}
            >
              {updateOrder.isPending ? <Loader2 size={20} className="icon-spin" /> : <Check size={20} strokeWidth={2.5} />}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={detailId !== null} title={`Pedido #${detailId ?? ''}`} onClose={() => setDetailId(null)} size="lg">
        {orderDetail && (
          <div>
            <ul className="detail-list">
              <li><span>Estado</span><strong>{orderStatusEs(orderDetail.status)}</strong></li>
              <li><span>Tipo</span><span>{orderTypeEs(orderDetail.order_type)}</span></li>
              <li><span>Mesa</span><span>{orderDetail.table_id ?? '—'}</span></li>
              <li><span>ID mesero</span><span>{orderDetail.waiter_id}</span></li>
              <li><span>Subtotal</span><span>${orderDetail.subtotal}</span></li>
              <li><span>Impuesto</span><span>${orderDetail.tax}</span></li>
              <li><span>Total</span><strong style={{ color: 'var(--primary)' }}>${orderDetail.total}</strong></li>
              {orderDetail.notes && <li><span>Notas</span><span style={{ textAlign: 'right' }}>{orderDetail.notes}</span></li>}
            </ul>
            <h4 style={{ margin: '18px 0 8px', fontSize: 14, fontWeight: 700 }}>Líneas</h4>
            <ul className="detail-list">
              {orderDetail.items.map((line) => (
                <li key={line.id}>
                  <span>{line.menu_item_name} x{line.quantity}</span>
                  <span>${(Number(line.unit_price) * line.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
}
