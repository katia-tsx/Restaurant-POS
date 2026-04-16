
import { MenuItem } from '../types';

export default function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <div className="card">
      {item.image_url && <img src={item.image_url} style={{ width:'100%', height:140, objectFit:'cover', borderRadius:10 }} />}
      <h4>{item.name}</h4>
      <div style={{ opacity: .75 }}>{item.description}</div>
      <div style={{ marginTop: 10, fontWeight: 700 }}>${item.price}</div>
    </div>
  );
}
