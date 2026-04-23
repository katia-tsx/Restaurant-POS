
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { MenuItem } from '../types';

type Props = {
  item: MenuItem;
  onDetail: () => void;
  onEdit: () => void;
  onDelete: () => void;
  /** Si false, solo consulta (rol con permiso de ver menu sin editar). */
  showManage?: boolean;
};

export default function MenuItemCard({ item, onDetail, onEdit, onDelete, showManage = true }: Props) {
  return (
    <div className="card card--static">
      <div className="product-card-image-wrap">
        {item.image_url ? (
          <img src={item.image_url} alt="" loading="lazy" />
        ) : (
          <div style={{ height: 140, background: '#e5e7eb' }} />
        )}
        <div className="product-card-detail">
          <button type="button" className="icon-action icon-action--ghost" onClick={onDetail} aria-label="Ver detalle">
            <Eye size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
      <div className="product-card-body">
        <h4>{item.name}</h4>
        <div className="product-card-desc">{item.description ?? 'Sin descripción'}</div>
        <div className="product-card-footer">
          <span className="product-card-price">${item.price}</span>
          {showManage && (
            <div className="card-actions-inline">
              <button type="button" className="icon-action icon-action--dark" onClick={onEdit} aria-label="Editar producto">
                <Pencil size={16} strokeWidth={2} />
              </button>
              <button type="button" className="icon-action icon-action--danger" onClick={onDelete} aria-label="Eliminar producto">
                <Trash2 size={16} strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
