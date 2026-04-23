
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

export default function ReportsPage() {
  const { data } = useQuery({ queryKey: ['daily'], queryFn: async () => (await api.get('/reports/daily')).data });
  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div>
          <h1 className="page-title">Reportes</h1>
        </div>
      </div>
      <div className="card card--static">
        <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700 }}>Reporte diario</h3>
        <ul className="detail-list">
          <li><span>Fecha</span><span>{data?.date ?? '—'}</span></li>
          <li><span>Total pedidos</span><strong>{data?.total_orders ?? '—'}</strong></li>
          <li><span>Total ventas</span><strong style={{ color: 'var(--primary)' }}>${data?.total_sales ?? '—'}</strong></li>
        </ul>
      </div>
    </div>
  );
}
