import { DashboardHeader } from './DashboardHeader';
import { DashboardLayout } from './DashboardLayout';
import { DashboardStats } from './DashboardStats';
import { TransactionSections } from './TransactionSections';

export const Dashboard = () => {
  return (
    <DashboardLayout>
      <DashboardHeader />
      <main>
        <TransactionSections />
        <DashboardStats />
      </main>
    </DashboardLayout>
  );
};
