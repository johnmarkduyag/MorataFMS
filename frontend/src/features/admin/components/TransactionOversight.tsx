import { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { transactionApi } from '../api/transactionApi';
import { ReassignModal } from './ReassignModal';
import { StatusOverrideModal } from './StatusOverrideModal';
import type { OversightTransaction } from '../types/transaction.types';

interface LayoutContext {
    user?: { name: string; role: string };
    dateTime: { time: string; date: string };
}

type TypeFilter = 'all' | 'import' | 'export';
type StatusFilter = 'all' | 'pending' | 'in_progress' | 'completed' | 'cancelled';

const STATUS_BADGE: Record<string, string> = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

const TYPE_BADGE: Record<string, string> = {
    import: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    export: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
};

export const TransactionOversight = () => {
    const { theme } = useTheme();
    const { dateTime } = useOutletContext<LayoutContext>();

    const [transactions, setTransactions] = useState<OversightTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

    // Modals
    const [reassignTarget, setReassignTarget] = useState<OversightTransaction | null>(null);
    const [statusTarget, setStatusTarget] = useState<OversightTransaction | null>(null);

    // Stats
    const [stats, setStats] = useState({ total: 0, imports: 0, exports: 0 });

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            setIsLoading(true);
            const res = await transactionApi.getAllTransactions();
            setTransactions(res.data);
            setStats({ total: res.total, imports: res.imports_count, exports: res.exports_count });
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load transactions.');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredTransactions = useMemo(() => {
        return transactions.filter((t) => {
            const matchesType = typeFilter === 'all' || t.type === typeFilter;
            const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
            const search = searchTerm.toLowerCase();
            const matchesSearch =
                !search ||
                t.reference_no?.toLowerCase().includes(search) ||
                t.bl_no?.toLowerCase().includes(search) ||
                t.client?.toLowerCase().includes(search) ||
                t.assigned_to?.toLowerCase().includes(search);
            return matchesType && matchesStatus && matchesSearch;
        });
    }, [transactions, typeFilter, statusFilter, searchTerm]);

    const handleReassignSuccess = (id: number, type: 'import' | 'export', assignedTo: string, assignedUserId: number) => {
        setTransactions((prev) =>
            prev.map((t) =>
                t.id === id && t.type === type ? { ...t, assigned_to: assignedTo, assigned_user_id: assignedUserId } : t
            )
        );
    };

    const handleStatusSuccess = (id: number, type: 'import' | 'export', newStatus: string) => {
        setTransactions((prev) =>
            prev.map((t) => (t.id === id && t.type === type ? { ...t, status: newStatus } : t))
        );
    };

    const isDark = theme === 'dark';

    return (
        <div className="space-y-6 p-4">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Transaction Oversight
                    </h1>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                        All imports &amp; exports in one view — reassign encoders, override statuses
                    </p>
                </div>
                <div className="text-right">
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{dateTime.time}</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{dateTime.date}</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total Transactions', value: stats.total, color: 'from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800' },
                    { label: 'Imports', value: stats.imports, color: 'from-indigo-500 to-indigo-700' },
                    { label: 'Exports', value: stats.exports, color: 'from-amber-500 to-amber-700' },
                ].map((card) => (
                    <div
                        key={card.label}
                        className={`rounded-2xl p-5 bg-gradient-to-br ${card.color} text-white shadow-sm`}
                    >
                        <p className="text-3xl font-bold">{card.value}</p>
                        <p className="text-sm opacity-80 mt-1">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                {/* Search */}
                <div className="flex-1 max-w-sm">
                    <input
                        type="text"
                        placeholder="Search by ref, BL no, client, encoder..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:border-gray-400 ${isDark
                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                            }`}
                    />
                </div>

                {/* Type Filter */}
                <div className={`flex rounded-xl border overflow-hidden ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    {(['all', 'import', 'export'] as TypeFilter[]).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTypeFilter(t)}
                            className={`px-4 py-3 text-sm font-semibold capitalize transition-colors ${typeFilter === t
                                ? isDark ? 'bg-white text-black' : 'bg-black text-white'
                                : isDark ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-white text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            {t === 'all' ? 'All Types' : t === 'import' ? 'Imports' : 'Exports'}
                        </button>
                    ))}
                </div>

                {/* Status Filter */}
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                    className={`px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:border-gray-400 ${isDark
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                        }`}
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>

                {/* Refresh */}
                <button
                    onClick={loadTransactions}
                    className={`px-4 py-3 rounded-xl border font-semibold transition-colors flex items-center gap-2 ${isDark
                        ? 'border-gray-700 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="p-4 rounded-xl bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* Table */}
            <div className={`rounded-[2rem] border shadow-sm overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                {isLoading ? (
                    <div className="p-12 text-center">
                        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Loading transactions...</p>
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                                ? 'No transactions match your filters.'
                                : 'No transactions found.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className={isDark ? 'bg-gray-700/50' : 'bg-gray-50'}>
                                <tr>
                                    {['Type', 'Ref / BL No', 'Client', 'Date', 'Status', 'Encoder', 'Actions'].map((h) => (
                                        <th
                                            key={h}
                                            className={`px-5 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-100'}`}>
                                {filteredTransactions.map((t) => (
                                    <tr
                                        key={`${t.type}-${t.id}`}
                                        className={`transition-colors ${isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}`}
                                    >
                                        {/* Type */}
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold capitalize ${TYPE_BADGE[t.type]}`}>
                                                {t.type}
                                            </span>
                                        </td>

                                        {/* Ref / BL No */}
                                        <td className={`px-5 py-4 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            <div>{t.reference_no || '—'}</div>
                                            {t.bl_no && (
                                                <div className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    BL: {t.bl_no}
                                                </div>
                                            )}
                                        </td>

                                        {/* Client */}
                                        <td className={`px-5 py-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {t.client || '—'}
                                        </td>

                                        {/* Date */}
                                        <td className={`px-5 py-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {t.date ? new Date(t.date).toLocaleDateString() : '—'}
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold capitalize ${STATUS_BADGE[t.status] || STATUS_BADGE.pending}`}>
                                                {t.status.replace('_', ' ')}
                                            </span>
                                        </td>

                                        {/* Encoder */}
                                        <td className={`px-5 py-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {t.assigned_to || (
                                                <span className={`italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Unassigned</span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setReassignTarget(t)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${isDark
                                                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    Reassign
                                                </button>
                                                <button
                                                    onClick={() => setStatusTarget(t)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${isDark
                                                        ? 'bg-indigo-900/40 text-indigo-300 hover:bg-indigo-900/60'
                                                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                                                        }`}
                                                >
                                                    Override Status
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Footer count */}
                        <div className={`px-5 py-3 border-t text-sm ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-100 text-gray-500'}`}>
                            Showing {filteredTransactions.length} of {stats.total} transactions
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <ReassignModal
                isOpen={!!reassignTarget}
                onClose={() => setReassignTarget(null)}
                transaction={reassignTarget}
                onSuccess={handleReassignSuccess}
            />
            <StatusOverrideModal
                isOpen={!!statusTarget}
                onClose={() => setStatusTarget(null)}
                transaction={statusTarget}
                onSuccess={handleStatusSuccess}
            />
        </div>
    );
};
