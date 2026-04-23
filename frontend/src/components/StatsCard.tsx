
import type { LucideIcon } from 'lucide-react';

type Props = { label: string; value: string | number; icon: LucideIcon };

export default function StatsCard({ label, value, icon: Icon }: Props) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div>
          <div className="stat-card-label">{label}</div>
          <div className="stat-card-value">{value}</div>
        </div>
        <div className="stat-card-icon" aria-hidden>
          <Icon size={20} strokeWidth={2} />
        </div>
      </div>
      <div className="stat-card-bar" />
    </div>
  );
}
