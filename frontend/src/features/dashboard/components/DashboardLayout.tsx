import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#0A1929] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
};
