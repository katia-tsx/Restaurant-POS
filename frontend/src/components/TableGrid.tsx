
export default function TableGrid({ tables }: { tables: Array<{ number: number; status: string; capacity: number }> }) {
  return (
    <div className="grid" style={{ gridTemplateColumns: 'repeat(5,minmax(0,1fr))' }}>
      {tables.map((t) => (
        <div key={t.number} className="card">
          <strong>Mesa {t.number}</strong>
          <div>Cap: {t.capacity}</div>
          <div className="badge pending" style={{ marginTop: 8 }}>{t.status}</div>
        </div>
      ))}
    </div>
  );
}
