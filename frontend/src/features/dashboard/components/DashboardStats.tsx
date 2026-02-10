import type { StatCardData } from '../types/dashboard.types';
import { StatCard } from './StatCard';

const statsData: StatCardData[] = [
  { label: "Today's Transactions", value: '0' },
  { label: 'Active Imports', value: '0' },
  { label: 'Active Exports', value: '0' },
  { label: 'Pending Approvals', value: '0' },
];

export const DashboardStats = () => {
  return (
    <div className="mt-8 p-6 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10">
      <h2 className="text-xl font-bold mb-4">Quick Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsData.map((stat, i) => (
          <StatCard key={i} stat={stat} />
        ))}
      </div>
    </div>
  );
};
