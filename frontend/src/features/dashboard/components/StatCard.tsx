import type { StatCardData } from '../types/dashboard.types';

interface StatCardProps {
  stat: StatCardData;
}

export const StatCard = ({ stat }: StatCardProps) => {
  return (
    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
      <p className="text-white/50 text-xs mb-1 uppercase tracking-wider">
        {stat.label}
      </p>
      <p className="text-2xl font-bold">{stat.value}</p>
    </div>
  );
};
