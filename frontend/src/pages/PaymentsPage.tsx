
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { Payment } from '../types';

export default function PaymentsPage() {
  const { data } = useQuery({ queryKey: ['payments'], queryFn: async () => (await api.get('/payments')).data as Payment[] });
  return <div className="card"><h3>Historial de pagos</h3><table className="table"><thead><tr><th>ID</th><th>Orden</th><th>Metodo</th><th>Monto</th></tr></thead><tbody>{(data ?? []).map((p) => <tr key={p.id}><td>{p.id}</td><td>{p.order_id}</td><td>{p.method}</td><td>${p.amount}</td></tr>)}</tbody></table></div>;
}
