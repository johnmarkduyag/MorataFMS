import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0A1929] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-red-500">F.M. MORATA</h1>
            <p className="text-blue-400">Transaction Tracking Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-xs text-white/50 capitalize">{user?.role}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/10"
            >
              Logout
            </button>
          </div>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Import Transactions Placeholder */}
            <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="w-2 h-6 bg-blue-500 rounded-full mr-3"></span>
                Import Transactions
              </h2>
              <div className="space-y-4">
                <div className="h-32 flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl text-white/30">
                  Placeholder: Import tracking will appear here
                </div>
              </div>
            </div>

            {/* Export Transactions Placeholder */}
            <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="w-2 h-6 bg-red-500 rounded-full mr-3"></span>
                Export Transactions
              </h2>
              <div className="space-y-4">
                <div className="h-32 flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl text-white/30">
                  Placeholder: Export tracking will appear here
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold mb-4">Quick Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Today\'s Transactions', value: '0' },
                { label: 'Active Imports', value: '0' },
                { label: 'Active Exports', value: '0' },
                { label: 'Pending Approvals', value: '0' },
              ].map((stat, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-white/50 text-xs mb-1 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
