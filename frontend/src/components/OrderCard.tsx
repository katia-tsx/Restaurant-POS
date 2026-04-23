
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Order } from '../types';
import { orderStatusEs, orderTypeEs } from '../lib/labels';

function statusBadgeClass(status: string): string {
  if (status === 'paid') return 'paid';
  if (status === 'ready') return 'ready';
  if (status === 'in_kitchen') return 'in_kitchen';
  if (status === 'delivered') return 'delivered';
  return 'pending';
}

type Props = {
  order: Order;
  onDetail: () => void;
  onEdit: () => void;
  onDelete: () => void;
  showEdit?: boolean;
  showDelete?: boolean;
};

export default function OrderCard({ order, onDetail, onEdit, onDelete, showEdit = true, showDelete = true }: Props) {
  return (
    <div className="card card--static">
      <div className="order-card-top">
        <strong style={{ fontSize: 15, letterSpacing: '-0.02em' }}>Pedido #{order.id}</strong>
        <span className={`badge ${statusBadgeClass(order.status)}`}>{orderStatusEs(order.status)}</span>
      </div>
      <div className="order-card-meta">
        <div>Mesa: {order.table_id ?? '—'}</div>
        <div>Tipo: {orderTypeEs(order.order_type)}</div>
        {order.notes && <div>Nota: {order.notes}</div>}
      </div>
      <div className="order-card-total">${order.total}</div>
      <div className="product-card-footer" style={{ marginTop: 12, paddingTop: 12 }}>
        <button type="button" className="icon-action icon-action--ghost" onClick={onDetail} aria-label="Ver detalle del pedido">
          <Eye size={18} strokeWidth={2} />
        </button>
        {(showEdit || showDelete) && (
          <div className="card-actions-inline">
            {showEdit && (
              <button type="button" className="icon-action icon-action--dark" onClick={onEdit} aria-label="Editar pedido">
                <Pencil size={16} strokeWidth={2} />
              </button>
            )}
            {showDelete && (
              <button type="button" className="icon-action icon-action--danger" onClick={onDelete} aria-label="Eliminar pedido">
                <Trash2 size={16} strokeWidth={2} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
