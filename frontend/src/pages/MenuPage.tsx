
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import MenuItemCard from '../components/MenuItemCard';
import { MenuItem } from '../types';

export default function MenuPage() {
  const { data } = useQuery({ queryKey: ['menu'], queryFn: async () => (await api.get('/menu/items')).data as MenuItem[] });
  return <div className="grid" style={{ gridTemplateColumns:'repeat(4,minmax(0,1fr))' }}>{(data ?? []).slice(0, 40).map((item) => <MenuItemCard key={item.id} item={item} />)}</div>;
}
