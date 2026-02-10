import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';

export const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
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
  );
};
