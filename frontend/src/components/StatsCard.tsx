
type Props = { label: string; value: string | number };
export default function StatsCard({ label, value }: Props) {
  return (
    <div className="card">
      <div style={{ opacity: 0.58, marginBottom: 8, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ marginTop: 10, height: 4, borderRadius: 999, background: 'linear-gradient(135deg,#6c63ff,#43b89c)' }} />
    </div>
  );
}
