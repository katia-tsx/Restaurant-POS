
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import StatsCard from '../components/StatsCard';
import { PieChart, Pie, Tooltip, Cell, LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Armchair, Receipt, ShoppingBag, TrendingUp, Sparkles } from 'lucide-react';

const CHART_ORANGE = '#f97316';
const CHART_ORANGE_SOFT = '#fb923c';
const CHART_DEEP = '#ea580c';

export default function DashboardPage() {
  const { data: daily } = useQuery({ queryKey: ['daily'], queryFn: async () => (await api.get('/reports/daily')).data });
  const { data: byHour } = useQuery({ queryKey: ['by-hour'], queryFn: async () => (await api.get('/reports/by-hour')).data });
  const hourSeries = (byHour ?? []).map((x: { hour: string; total: number }) => ({ hour: x.hour, total: x.total }));
  const pieData = [
    { name: 'Efectivo', value: 45 },
    { name: 'Tarjeta', value: 35 },
    { name: 'Mixto', value: 20 },
  ];
  const pieColors = [CHART_ORANGE, CHART_ORANGE_SOFT, CHART_DEEP];

  const totalSales = daily?.total_sales ?? 0;
  const totalOrders = daily?.total_orders ?? 0;
  const avgTicket = totalOrders ? (totalSales / totalOrders).toFixed(2) : '0.00';

  const now = new Date();
  const dateLabel = now.toLocaleDateString('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <section className="dashboard-hero">
        <div className="dashboard-hero-inner">
          <div>
            <h1>Panel ejecutivo</h1>
            <p>Ventas, pedidos y cobros del día.</p>
          </div>
          <div className="dashboard-hero-meta">
            <span className="dashboard-pill">
              <Sparkles size={14} strokeWidth={2} />
              En vivo
            </span>
            <span className="dashboard-date">{dateLabel}</span>
          </div>
        </div>
      </section>

      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        <StatsCard label="Ventas hoy" value={`$${totalSales}`} icon={TrendingUp} />
        <StatsCard label="Pedidos hoy" value={totalOrders} icon={ShoppingBag} />
        <StatsCard label="Mesas (ejemplo)" value={12} icon={Armchair} />
        <StatsCard label="Ticket promedio" value={`$${avgTicket}`} icon={Receipt} />
      </div>

      <div className="grid grid-2">
        <div className="card chart-card" style={{ minHeight: 340 }}>
          <h3>Ventas por hora</h3>
          <p className="chart-sub">Por hora</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={hourSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid rgba(148, 163, 184, 0.25)',
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke={CHART_ORANGE}
                strokeWidth={3}
                dot={{ fill: CHART_ORANGE, strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: CHART_DEEP }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart-card" style={{ minHeight: 340 }}>
          <h3>Método de pago</h3>
          <p className="chart-sub">Distribución ilustrativa</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={96} innerRadius={48} paddingAngle={3}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={pieColors[i % pieColors.length]} stroke="rgba(255,255,255,0.9)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid rgba(148, 163, 184, 0.25)',
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
