
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

export default function ReportsPage() {
  const { data } = useQuery({ queryKey: ['daily'], queryFn: async () => (await api.get('/reports/daily')).data });
  return <div className="card"><h3>Reporte diario</h3><p>Fecha: {data?.date}</p><p>Total de pedidos: {data?.total_orders}</p><p>Total ventas: ${data?.total_sales}</p></div>;
}
