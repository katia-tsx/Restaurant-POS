
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { RestaurantTable } from '../types';
import { tableStatusEs } from '../lib/labels';

function tableBadgeClass(status: string): string {
  if (status === 'occupied') return 'pending';
  if (status === 'reserved') return 'reserved';
  return 'available';
}

export default function TableGrid({
  tables,
  onDetail,
  onEdit,
  onDelete,
}: {
  tables: RestaurantTable[];
  onDetail: (t: RestaurantTable) => void;
  onEdit: (t: RestaurantTable) => void;
  onDelete: (t: RestaurantTable) => void;
}) {
  return (
    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
      {tables.map((t) => (
        <div key={t.id} className="card card--static">
          <div className="table-card-head">
            <span className="table-card-title">Mesa {t.number}</span>
            <span className={`badge ${tableBadgeClass(t.status)}`}>{tableStatusEs(t.status)}</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
            <div>Capacidad: {t.capacity}</div>
            <div>{t.location ?? 'Interior'}</div>
          </div>
          <div className="product-card-footer" style={{ marginTop: 12, paddingTop: 12 }}>
            <button type="button" className="icon-action icon-action--ghost" onClick={() => onDetail(t)} aria-label="Ver detalle de mesa">
              <Eye size={18} strokeWidth={2} />
            </button>
            <div className="card-actions-inline">
              <button type="button" className="icon-action icon-action--dark" onClick={() => onEdit(t)} aria-label="Editar mesa">
                <Pencil size={16} strokeWidth={2} />
              </button>
              <button type="button" className="icon-action icon-action--danger" onClick={() => onDelete(t)} aria-label="Eliminar mesa">
                <Trash2 size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
