
import { Order } from '../types';

export default function OrderCard({ order }: { order: Order }) {
  return (
    <div className="card">
      <div style={{ display:'flex', justifyContent:'space-between' }}>
        <strong>Orden #{order.id}</strong>
        <span className={`badge ${order.status === 'paid' ? 'paid' : order.status === 'ready' ? 'ready' : 'pending'}`}>{order.status}</span>
      </div>
      <div style={{ marginTop: 8, opacity: .8 }}>Mesa: {order.table_id ?? 'Takeaway'}</div>
      <div style={{ marginTop: 4, opacity: .8 }}>Total: ${order.total}</div>
    </div>
  );
}
