
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import StatsCard from '../components/StatsCard';
import { PieChart, Pie, Tooltip, Cell, LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const { data: daily } = useQuery({ queryKey: ['daily'], queryFn: async () => (await api.get('/reports/daily')).data });
  const { data: byHour } = useQuery({ queryKey: ['by-hour'], queryFn: async () => (await api.get('/reports/by-hour')).data });
  const hourSeries = (byHour ?? []).map((x: any) => ({ hour: x.hour, total: x.total }));
  const pieData = [{ name:'Efectivo', value: 45 }, { name:'Tarjeta', value: 35 }, { name:'Mixto', value: 20 }];

  return <>
    <div className="card" style={{ marginBottom: 16 }}>
      <h3 style={{ margin: 0, fontSize: 24 }}>Resumen del dia</h3>
      <p style={{ marginBottom: 0, opacity: 0.65 }}>Metricas en tiempo real del rendimiento del restaurante</p>
    </div>
    <div className="grid grid-4">
      <StatsCard label="Ventas hoy" value={`$${daily?.total_sales ?? 0}`} />
      <StatsCard label="Pedidos hoy" value={daily?.total_orders ?? 0} />
      <StatsCard label="Mesas ocupadas" value={12} />
      <StatsCard label="Ticket promedio" value={daily?.total_orders ? `$${(daily.total_sales / daily.total_orders).toFixed(2)}` : '$0'} />
    </div>
    <div className="grid grid-2" style={{ marginTop: 16 }}>
      <div className="card" style={{ height: 330 }}>
        <h3>Ventas por hora</h3>
        <ResponsiveContainer width="100%" height={260}><LineChart data={hourSeries}><CartesianGrid strokeDasharray="3 3" stroke="rgba(26,26,46,.1)" /><XAxis dataKey="hour" /><YAxis /><Tooltip /><Line type="monotone" dataKey="total" stroke="#6c63ff" strokeWidth={3} /></LineChart></ResponsiveContainer>
      </div>
      <div className="card" style={{ height: 330 }}>
        <h3>Metodo de pago</h3>
        <ResponsiveContainer width="100%" height={260}><PieChart><Pie data={pieData} dataKey="value" outerRadius={90}>{pieData.map((_, i) => <Cell key={i} fill={['#6c63ff','#43b89c','#ff6584'][i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
      </div>
    </div>
  </>;
}
