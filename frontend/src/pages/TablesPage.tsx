
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import TableGrid from '../components/TableGrid';

export default function TablesPage() {
  const { data } = useQuery({ queryKey: ['tables'], queryFn: async () => (await api.get('/tables')).data });
  return <TableGrid tables={data ?? []} />;
}
