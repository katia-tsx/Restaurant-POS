
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import OrderCard from '../components/OrderCard';
import { Order } from '../types';

export default function OrdersPage() {
  const { data } = useQuery({ queryKey: ['orders'], queryFn: async () => (await api.get('/orders')).data as Order[] });
  return <div className="grid" style={{ gridTemplateColumns:'repeat(3,minmax(0,1fr))' }}>{(data ?? []).map((o) => <OrderCard key={o.id} order={o} />)}</div>;
}
