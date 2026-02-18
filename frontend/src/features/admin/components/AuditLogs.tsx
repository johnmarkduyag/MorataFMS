import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { auditLogApi } from '../api/auditLogApi';
import type { AuditLogEntry, AuditLogMeta, AuditLogFilters } from '../types/auditLog.types';

interface LayoutContext {
    user?: { name: string; role: string };
    dateTime: { time: string; date: string };
}

// ─── Action badge config ──────────────────────────────────────────────────────
const ACTION_CONFIG: Record<string, { label: string; color: string }> = {
    login: { label: 'Login', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    logout: { label: 'Logout', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' },
    status_changed: { label: 'Status Changed', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    encoder_reassigned: { label: 'Encoder Reassigned', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
};

const getActionConfig = (action: string) =>
    ACTION_CONFIG[action] ?? { label: action.replace(/_/g, ' '), color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' };

const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' });
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const AuditLogs = () => {
    const { theme } = useTheme();
    const { dateTime } = useOutletContext<LayoutContext>();
    const isDark = theme === 'dark';

    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [meta, setMeta] = useState<AuditLogMeta>({ current_page: 1, last_page: 1, per_page: 25, total: 0 });
    const [availableActions, setAvailableActions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters
    const [search, setSearch] = useState('');
    const [actionFilter, setActionFilter] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [page, setPage] = useState(1);

    const loadLogs = useCallback(async (filters: AuditLogFilters) => {
        try {
            setIsLoading(true);
            setError('');
            const res = await auditLogApi.getLogs(filters);
            setLogs(res.data);
            setMeta(res.meta);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load audit logs.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadActions = useCallback(async () => {
        try {
            const res = await auditLogApi.getActions();
            setAvailableActions(res.data);
        } catch { /* non-critical */ }
    }, []);

    useEffect(() => { loadActions(); }, [loadActions]);

    useEffect(() => {
        loadLogs({
            search: search || undefined,
            action: actionFilter || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
            page,
            per_page: 25,
        });
    }, [loadLogs, search, actionFilter, dateFrom, dateTo, page]);

    const handleSearch = (val: string) => { setSearch(val); setPage(1); };
    const handleAction = (val: string) => { setActionFilter(val); setPage(1); };
    const handleDateFrom = (val: string) => { setDateFrom(val); setPage(1); };
    const handleDateTo = (val: string) => { setDateTo(val); setPage(1); };

    const inputCls = `px-3 py-2.5 rounded-xl border text-sm focus:outline-none ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
        }`;

    return (
        <div className="space-y-6 p-4">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Audit Logs
                    </h1>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                        Who encoded what, status changes, login history
                    </p>
                </div>
                <div className="text-right">
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{dateTime.time}</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{dateTime.date}</p>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total Events', value: meta.total, color: isDark ? 'text-white' : 'text-gray-900' },
                    { label: 'Logins', value: logs.filter(l => l.action === 'login').length + (page > 1 ? '…' : ''), color: 'text-emerald-500' },
                    { label: 'Status Changes', value: logs.filter(l => l.action === 'status_changed').length + (page > 1 ? '…' : ''), color: 'text-amber-500' },
                    { label: 'Reassignments', value: logs.filter(l => l.action === 'encoder_reassigned').length + (page > 1 ? '…' : ''), color: 'text-indigo-500' },
                ].map(({ label, value, color }) => (
                    <div key={label} className={`rounded-2xl p-5 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} shadow-sm`}>
                        <p className={`text-3xl font-bold ${color}`}>{value}</p>
                        <p className={`text-sm font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
                    </div>
                ))}
            </div>

            {/* Filter bar */}
            <div className={`rounded-[2rem] border p-5 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-sm`}>
                <div className="flex flex-wrap gap-3 items-center">
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search description or user…"
                        value={search}
                        onChange={e => handleSearch(e.target.value)}
                        className={`${inputCls} flex-1 min-w-[200px]`}
                    />

                    {/* Action filter */}
                    <select
                        value={actionFilter}
                        onChange={e => handleAction(e.target.value)}
                        className={inputCls}
                    >
                        <option value="">All Actions</option>
                        {availableActions.map(a => (
                            <option key={a} value={a}>{getActionConfig(a).label}</option>
                        ))}
                    </select>

                    {/* Date from */}
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={e => handleDateFrom(e.target.value)}
                        className={inputCls}
                    />

                    {/* Date to */}
                    <input
                        type="date"
                        value={dateTo}
                        onChange={e => handleDateTo(e.target.value)}
                        className={inputCls}
                    />

                    {/* Clear */}
                    {(search || actionFilter || dateFrom || dateTo) && (
                        <button
                            onClick={() => { setSearch(''); setActionFilter(''); setDateFrom(''); setDateTo(''); setPage(1); }}
                            className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${isDark ? 'border-gray-700 text-gray-400 hover:bg-gray-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="p-4 rounded-xl bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">{error}</div>
            )}

            {/* Table */}
            <div className={`rounded-[2rem] border shadow-sm overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <div className="px-6 py-4 border-b flex justify-between items-center" style={{ borderColor: isDark ? '#374151' : '#f3f4f6' }}>
                    <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Event Log
                    </h2>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                        {meta.total} total · Page {meta.current_page} of {meta.last_page}
                    </span>
                </div>

                {isLoading ? (
                    <div className="py-16 text-center">
                        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Loading logs…</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className={`text-lg font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>No events found</p>
                        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {search || actionFilter || dateFrom || dateTo ? 'Try adjusting your filters.' : 'Events will appear here as actions are performed.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className={isDark ? 'bg-gray-700/50' : 'bg-gray-50'}>
                                <tr>
                                    {['Timestamp', 'User', 'Action', 'Subject', 'Description', 'IP Address'].map(h => (
                                        <th key={h} className={`px-5 py-3 text-left text-xs font-bold uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-100'}`}>
                                {logs.map(log => {
                                    const cfg = getActionConfig(log.action);
                                    return (
                                        <tr key={log.id} className={`transition-colors ${isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}`}>
                                            {/* Timestamp */}
                                            <td className="px-5 py-3 whitespace-nowrap">
                                                <p className={`text-xs tabular-nums ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {formatDate(log.created_at)}
                                                </p>
                                            </td>

                                            {/* User */}
                                            <td className="px-5 py-3">
                                                {log.user ? (
                                                    <>
                                                        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{log.user.name}</p>
                                                        <p className={`text-xs capitalize ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{log.user.role}</p>
                                                    </>
                                                ) : (
                                                    <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>—</span>
                                                )}
                                            </td>

                                            {/* Action badge */}
                                            <td className="px-5 py-3 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${cfg.color}`}>
                                                    {cfg.label}
                                                </span>
                                            </td>

                                            {/* Subject */}
                                            <td className="px-5 py-3 whitespace-nowrap">
                                                {log.subject_type ? (
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                                        {log.subject_type} #{log.subject_id}
                                                    </span>
                                                ) : (
                                                    <span className={isDark ? 'text-gray-600' : 'text-gray-300'}>—</span>
                                                )}
                                            </td>

                                            {/* Description */}
                                            <td className={`px-5 py-3 max-w-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                <p className="truncate" title={log.description}>{log.description}</p>
                                            </td>

                                            {/* IP */}
                                            <td className={`px-5 py-3 whitespace-nowrap text-xs tabular-nums ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                                {log.ip_address ?? '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {meta.last_page > 1 && (
                    <div className={`px-6 py-4 border-t flex justify-between items-center ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors disabled:opacity-40 ${isDark ? 'border-gray-700 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                            ← Previous
                        </button>
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Page {meta.current_page} of {meta.last_page}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                            disabled={page === meta.last_page}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors disabled:opacity-40 ${isDark ? 'border-gray-700 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
