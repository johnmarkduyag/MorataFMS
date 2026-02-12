import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ConfirmationModal } from '../../../components/ConfirmationModal';

import { StatusChart } from './StatusChart';
import { CalendarCard } from './CalendarCard';

interface LayoutContext {
    user?: { name: string; role: string };
    dateTime: { time: string; date: string };
}

export const ExportList = () => {
    const navigate = useNavigate();
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        confirmText?: string;
        confirmButtonClass?: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
    });

    const { user, dateTime } = useOutletContext<LayoutContext>();

    const data = [
        { ref: 'REF-EXP-001', bl: 'BL-78542136', status: 'Shipped', color: 'bg-green-500', shipper: 'ABC Exports Inc.', vessel: 'MV Northern Light' },
        { ref: 'REF-EXP-002', bl: 'BL-78542137', status: 'Processing', color: 'bg-yellow-500', shipper: 'Global Trade Ltd.', vessel: 'Evergreen Star' },
        { ref: 'REF-EXP-003', bl: 'BL-78542138', status: 'Delayed', color: 'bg-red-500', shipper: 'Fast Cargo Co.', vessel: 'Pacific Voyager' },
        { ref: 'REF-EXP-004', bl: 'BL-78542139', status: 'Shipped', color: 'bg-green-500', shipper: 'Metro Supplies', vessel: 'MSC Oscar' },
        { ref: 'REF-EXP-005', bl: 'BL-78542140', status: 'In Transit', color: 'bg-blue-500', shipper: 'Prime Logistics', vessel: 'Hapag-Lloyd' },
    ];

    // Calculate status counts
    const statusCounts = data.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const chartData = [
        { label: 'Shipped', value: statusCounts['Shipped'] || 0, color: '#4cd964' },
        { label: 'Processing', value: statusCounts['Processing'] || 0, color: '#ffcc00' },
        { label: 'Delayed', value: statusCounts['Delayed'] || 0, color: '#ff2d55' },
        { label: 'In Transit', value: statusCounts['In Transit'] || 0, color: '#00d2ff' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Export Transactions</h1>
                    <p className="text-sm text-gray-900 dark:text-gray-300 font-bold">Dashboard / Export Transactions</p>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name || 'FirstN LastN'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Document In Charge</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#1a2332] flex items-center justify-center text-white font-semibold border-2 border-white shadow-md">
                        {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('') : 'FL'}
                    </div>
                </div>
            </div>

            {/* Stats Row - 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                {/* 1. Time Card */}
                <div className="bg-blue-50 dark:bg-gray-800 rounded-[2rem] p-5 border border-blue-100 dark:border-black shadow-sm flex flex-col items-center justify-center text-center h-full">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">
                        {dateTime.time}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-4">
                        {dateTime.date}
                    </p>

                    <div className="w-full border-t border-blue-100 dark:border-black my-2"></div>

                    <div className="flex items-center gap-2 mt-2 text-gray-600 dark:text-gray-300 font-bold text-xs">
                        <svg className="w-4 h-4 text-[#c41e3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Manila, Philippines
                    </div>
                </div>

                {/* 2. Calendar Card */}
                <div className="h-full">
                    <CalendarCard className="bg-blue-50 border-blue-100" />
                </div>

                {/* 3. Status Chart (Untouched) */}
                <div className="h-full">
                    <StatusChart data={chartData} />
                </div>
            </div>

            {/* Controls Bar Above the List Card */}
            <div className="flex justify-end items-center mb-6 px-2">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search anything"
                            className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 text-sm w-64 focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none text-gray-900 dark:text-white font-medium"
                        />
                        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <button
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-slate-500 dark:text-gray-300 text-xs font-bold py-2.5 px-6 rounded-xl uppercase tracking-wider transition-all hover:border-gray-300 dark:hover:border-gray-600 shadow-sm ml-auto"
                    >
                        DEFAULT
                    </button>
                </div>
            </div>

            {/* Transaction List Card */}
            <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-black shadow-sm transition-colors overflow-hidden">
                <div className="p-6">
                    {/* Table Header */}
                    <div className="grid gap-4 pb-3 border-b border-gray-100 dark:border-black mb-3 px-2 font-bold"
                        style={{ gridTemplateColumns: '1fr 2fr 1.5fr 1.5fr 80px' }}>
                        <span className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Ref ID</span>
                        <span className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Shipper</span>
                        <span className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Bill of Lading</span>
                        <span className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Vessel</span>
                        <span className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</span>
                    </div>

                    {/* Table Rows */}
                    <div className="space-y-1">
                        {data.map((row, i) => (
                            <div
                                key={i}
                                onClick={() => navigate('/tracking/REF-EXPORT-001')}
                                className="grid gap-4 py-2 items-center cursor-pointer rounded-xl transition-all duration-200 px-2 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm"
                                style={{ gridTemplateColumns: '1fr 2fr 1.5fr 1.5fr 80px' }}
                            >
                                <p className="text-sm font-bold text-gray-900 dark:text-white">{row.ref}</p>
                                <p className="text-sm text-slate-500 dark:text-gray-400 font-bold">{row.shipper}</p>
                                <p className="text-sm text-slate-500 dark:text-gray-400 font-bold">{row.bl}</p>
                                <p className="text-sm text-slate-500 dark:text-gray-400 font-bold">{row.vessel}</p>
                                <div className="flex justify-end gap-2 px-1">
                                    <button
                                        className="p-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setConfirmModal({
                                                isOpen: true,
                                                title: 'Edit Export',
                                                message: 'Are you sure you want to edit this export transaction?',
                                                confirmText: 'Confirm Edit',
                                                confirmButtonClass: 'bg-gray-900 hover:bg-black',
                                                onConfirm: () => {
                                                    navigate(`/tracking/${row.ref}`);
                                                }
                                            });
                                        }}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setConfirmModal({
                                                isOpen: true,
                                                title: 'Delete Export',
                                                message: 'Are you sure you want to delete this export transaction? This action cannot be undone.',
                                                confirmText: 'Delete',
                                                confirmButtonClass: 'bg-red-600 hover:bg-red-700',
                                                onConfirm: () => {
                                                    console.log('Deleted', row.ref);
                                                }
                                            });
                                        }}
                                        className="p-1.5 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Table Pagination */}
                    <div className="mt-6 flex items-center justify-between border-t border-gray-100 dark:border-black pt-6 px-2">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-900 dark:text-white font-bold">Show</span>
                            <select className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-xs rounded-lg focus:ring-gray-500 focus:border-gray-500 p-1 px-2 outline-none cursor-pointer font-bold">
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="25">25</option>
                            </select>
                            <span className="text-sm text-gray-900 dark:text-white font-bold">of 100 pages</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div className="flex items-center gap-1">
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1a2332] dark:bg-gray-600 text-white text-sm font-bold">1</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm font-bold transition-colors">2</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm font-bold transition-colors">3</button>
                                <span className="text-gray-900 dark:text-white px-1 font-bold">...</span>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm font-bold transition-colors">16</button>
                            </div>
                            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                confirmButtonClass={confirmModal.confirmButtonClass}
            />
        </div>
    );
};
