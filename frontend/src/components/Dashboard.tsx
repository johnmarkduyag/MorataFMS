import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth';
import { Sidebar } from './Sidebar';
import { TrackingTable } from './TrackingTable';
import { TimeCard } from './TimeCard';
import { CalendarCard } from './CalendarCard';
import type { TrackingItem } from '../types/tracking';
import { TrackingStatus } from '../types/tracking';

// Sample data
const sampleTrackingItems: TrackingItem[] = [
  {
    id: '1',
    customerRefNo: 'REF-2024-001',
    billOfLading: 'BL-78542136',
    status: TrackingStatus.Cleared,
    importer: 'ABC Trading Co.',
    annualDate: 'Jan 15, 2024',
  },
  {
    id: '2',
    customerRefNo: 'REF-2024-002',
    billOfLading: 'BL-78542137',
    status: TrackingStatus.Pending,
    importer: 'XYZ Imports Ltd.',
    annualDate: 'Feb 20, 2024',
  },
  {
    id: '3',
    customerRefNo: 'REF-2024-003',
    billOfLading: 'BL-78542138',
    status: TrackingStatus.Delayed,
    importer: 'Global Freight Inc.',
    annualDate: 'Mar 10, 2024',
  },
  {
    id: '4',
    customerRefNo: 'REF-2024-004',
    billOfLading: 'BL-78542139',
    status: TrackingStatus.Cleared,
    importer: 'Metro Supplies',
    annualDate: 'Apr 05, 2024',
  },
  {
    id: '5',
    customerRefNo: 'REF-2024-005',
    billOfLading: 'BL-78542140',
    status: TrackingStatus.InTransit,
    importer: 'Prime Logistics',
    annualDate: 'May 18, 2024',
  },
];

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [trackingItems] = useState<TrackingItem[]>(sampleTrackingItems);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleEdit = (id: string) => {
    console.log('Edit item:', id);
    // TODO: Implement edit functionality
  };

  const handleDelete = (id: string) => {
    console.log('Delete item:', id);
    // TODO: Implement delete functionality
  };

  return (
    <div className="bg-[#e8e8e8] min-h-screen flex">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Import Transactions</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-200 text-sm w-48 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by</span>
              <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Date</option>
                <option>Customer Ref</option>
                <option>Importer</option>
                <option>Status</option>
              </select>
            </div>

            {/* Export Button */}
            <button className="flex items-center gap-2 bg-[#1a2332] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2a3342] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Export
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'Admin'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#1a2332] flex items-center justify-center text-white font-semibold">
                {user?.name?.substring(0, 2).toUpperCase() || 'FM'}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex gap-6">
          {/* Tracking List Table */}
          <TrackingTable
            items={trackingItems}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Right Side Panel */}
          <div className="w-72 space-y-6">
            {/* Time & Country Card */}
            <TimeCard />

            {/* Calendar Card */}
            <CalendarCard />
          </div>
        </div>
      </main>
    </div>
  );
};
