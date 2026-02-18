import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { reportApi } from '../api/reportApi';
import type {
    MonthlyReportResponse,
    ClientReportResponse,
    TurnaroundReportResponse,
    MonthlyDataPoint,
    ClientReportRow,
} from '../types/report.types';

interface LayoutContext {
    user?: { name: string; role: string };
    dateTime: { time: string; date: string };
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// ─── SVG Bar Chart ────────────────────────────────────────────────────────────
const BarChart = ({ data, isDark }: { data: MonthlyDataPoint[]; isDark: boolean }) => {
    const W = 700, H = 220, PAD = { top: 16, right: 16, bottom: 36, left: 40 };
    const chartW = W - PAD.left - PAD.right;
    const chartH = H - PAD.top - PAD.bottom;
    const maxVal = Math.max(...data.map(d => d.total), 1);
    const barGroupW = chartW / 12;
    const barW = barGroupW * 0.3;

    const yTicks = 4;
    const tickStep = Math.ceil(maxVal / yTicks);

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 220 }}>
            {/* Y-axis grid lines + labels */}
            {Array.from({ length: yTicks + 1 }, (_, i) => {
                const val = i * tickStep;
                const y = PAD.top + chartH - (val / (tickStep * yTicks)) * chartH;
                return (
                    <g key={i}>
                        <line x1={PAD.left} x2={PAD.left + chartW} y1={y} y2={y}
                            stroke={isDark ? '#374151' : '#e5e7eb'} strokeWidth="1" />
                        <text x={PAD.left - 6} y={y + 4} textAnchor="end"
                            fontSize="10" fill={isDark ? '#9ca3af' : '#6b7280'}>{val}</text>
                    </g>
                );
            })}

            {/* Bars */}
            {data.map((d, i) => {
                const groupX = PAD.left + i * barGroupW;
                const cx = groupX + barGroupW / 2;

                const importH = (d.imports / (tickStep * yTicks)) * chartH;
                const exportH = (d.exports / (tickStep * yTicks)) * chartH;

                return (
                    <g key={i}>
                        {/* Import bar */}
                        <rect
                            x={cx - barW - 1}
                            y={PAD.top + chartH - importH}
                            width={barW}
                            height={importH}
                            rx="3"
                            fill={isDark ? '#6366f1' : '#4f46e5'}
                            opacity="0.85"
                        />
                        {/* Export bar */}
                        <rect
                            x={cx + 1}
                            y={PAD.top + chartH - exportH}
                            width={barW}
                            height={exportH}
                            rx="3"
                            fill={isDark ? '#f59e0b' : '#d97706'}
                            opacity="0.85"
                        />
                        {/* Month label */}
                        <text x={cx} y={H - 8} textAnchor="middle"
                            fontSize="10" fill={isDark ? '#9ca3af' : '#6b7280'}>
                            {MONTH_NAMES[i]}
                        </text>
                    </g>
                );
            })}

            {/* Y-axis line */}
            <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={PAD.top + chartH}
                stroke={isDark ? '#4b5563' : '#d1d5db'} strokeWidth="1" />
        </svg>
    );
};

// ─── CSV Export ───────────────────────────────────────────────────────────────
const downloadCSV = (
    monthly: MonthlyReportResponse | null,
    clients: ClientReportResponse | null,
    turnaround: TurnaroundReportResponse | null,
    year: number,
    month: number
) => {
    const lines: string[] = [];

    lines.push(`Reports & Analytics — ${year}${month ? ' / ' + MONTH_FULL[month - 1] : ''}`);
    lines.push('');

    // Monthly Volume
    lines.push('Monthly Volume');
    lines.push('Month,Imports,Exports,Total');
    monthly?.months.forEach(m => {
        lines.push(`${MONTH_FULL[m.month - 1]},${m.imports},${m.exports},${m.total}`);
    });
    lines.push(`TOTAL,${monthly?.total_imports ?? 0},${monthly?.total_exports ?? 0},${monthly?.total ?? 0}`);
    lines.push('');

    // Revenue per Client
    lines.push('Transactions per Client');
    lines.push('Client,Type,Imports,Exports,Total');
    clients?.clients.forEach(c => {
        lines.push(`"${c.client_name}",${c.client_type},${c.imports},${c.exports},${c.total}`);
    });
    lines.push('');

    // Turnaround
    lines.push('Turnaround Times (completed transactions)');
    lines.push('Type,Completed,Avg Days,Min Days,Max Days');
    lines.push(`Imports,${turnaround?.imports.completed_count ?? 0},${turnaround?.imports.avg_days ?? 'N/A'},${turnaround?.imports.min_days ?? 'N/A'},${turnaround?.imports.max_days ?? 'N/A'}`);
    lines.push(`Exports,${turnaround?.exports.completed_count ?? 0},${turnaround?.exports.avg_days ?? 'N/A'},${turnaround?.exports.min_days ?? 'N/A'},${turnaround?.exports.max_days ?? 'N/A'}`);

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `morata-report-${year}${month ? '-' + String(month).padStart(2, '0') : ''}.csv`;
    a.click();
    URL.revokeObjectURL(url);
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const ReportsAnalytics = () => {
    const { theme } = useTheme();
    const { dateTime } = useOutletContext<LayoutContext>();
    const isDark = theme === 'dark';

    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(0); // 0 = all months

    const [monthly, setMonthly] = useState<MonthlyReportResponse | null>(null);
    const [clients, setClients] = useState<ClientReportResponse | null>(null);
    const [turnaround, setTurnaround] = useState<TurnaroundReportResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Client table sort
    const [sortKey, setSortKey] = useState<keyof ClientReportRow>('total');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

    const loadAll = useCallback(async () => {
        try {
            setIsLoading(true);
            setError('');
            const [m, c, t] = await Promise.all([
                reportApi.getMonthly(year),
                reportApi.getClients(year, month || undefined),
                reportApi.getTurnaround(year, month || undefined),
            ]);
            setMonthly(m);
            setClients(c);
            setTurnaround(t);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load report data.');
        } finally {
            setIsLoading(false);
        }
    }, [year, month]);

    useEffect(() => { loadAll(); }, [loadAll]);

    const sortedClients = [...(clients?.clients ?? [])].sort((a, b) => {
        const va = a[sortKey] as number;
        const vb = b[sortKey] as number;
        return sortDir === 'desc' ? vb - va : va - vb;
    });

    const handleSort = (key: keyof ClientReportRow) => {
        if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
        else { setSortKey(key); setSortDir('desc'); }
    };

    const SortIcon = ({ col }: { col: keyof ClientReportRow }) => (
        <span className="ml-1 opacity-50">
            {sortKey === col ? (sortDir === 'desc' ? '↓' : '↑') : '↕'}
        </span>
    );

    const card = (label: string, value: string | number, sub?: string, color?: string) => (
        <div className={`rounded-2xl p-5 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} shadow-sm`}>
            <p className={`text-3xl font-bold ${color ?? (isDark ? 'text-white' : 'text-gray-900')}`}>{value}</p>
            <p className={`text-sm font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
            {sub && <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{sub}</p>}
        </div>
    );

    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
        <>
            {/* Print styles */}
            <style>{`
                @media print {
                    body > * { display: none !important; }
                    #reports-print-area { display: block !important; }
                    #reports-print-area { position: fixed; top: 0; left: 0; width: 100%; }
                }
                @media screen {
                    #reports-print-area { display: contents; }
                }
            `}</style>

            <div id="reports-print-area" className="space-y-6 p-4">
                {/* Header */}
                <div className="flex justify-between items-end print:mb-4">
                    <div>
                        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Reports &amp; Analytics
                        </h1>
                        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                            Monthly reports, revenue per client, turnaround times
                        </p>
                    </div>
                    <div className="text-right print:hidden">
                        <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{dateTime.time}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{dateTime.date}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap gap-3 items-center print:hidden">
                    {/* Year */}
                    <select
                        value={year}
                        onChange={e => setYear(Number(e.target.value))}
                        className={`px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                    >
                        {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>

                    {/* Month */}
                    <select
                        value={month}
                        onChange={e => setMonth(Number(e.target.value))}
                        className={`px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                    >
                        <option value={0}>All Months</option>
                        {MONTH_FULL.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                    </select>

                    {/* Refresh */}
                    <button
                        onClick={loadAll}
                        className={`px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-colors ${isDark ? 'border-gray-700 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>

                    <div className="flex-1" />

                    {/* Export CSV */}
                    <button
                        onClick={() => downloadCSV(monthly, clients, turnaround, year, month)}
                        className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export CSV
                    </button>

                    {/* Export PDF */}
                    <button
                        onClick={() => window.print()}
                        className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Export PDF
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="p-4 rounded-xl bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="py-20 text-center">
                        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Loading report data...</p>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {card('Total Transactions', monthly?.total ?? 0, `${year}${month ? ' / ' + MONTH_FULL[month - 1] : ''}`)}
                            {card('Total Imports', monthly?.total_imports ?? 0, undefined, 'text-indigo-500')}
                            {card('Total Exports', monthly?.total_exports ?? 0, undefined, 'text-amber-500')}
                            {card('Active Clients', clients?.clients.length ?? 0, 'with transactions')}
                        </div>

                        {/* Monthly Volume Chart */}
                        <div className={`rounded-[2rem] border p-6 shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Monthly Volume — {year}
                                </h2>
                                {/* Legend */}
                                <div className="flex gap-4 text-xs font-semibold">
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-3 h-3 rounded-sm bg-indigo-500 inline-block" />
                                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Imports</span>
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" />
                                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Exports</span>
                                    </span>
                                </div>
                            </div>
                            {monthly && <BarChart data={monthly.months} isDark={isDark} />}
                        </div>

                        {/* Bottom two panels */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Revenue per Client */}
                            <div className={`rounded-[2rem] border shadow-sm overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                                <div className="px-6 py-5 border-b flex justify-between items-center" style={{ borderColor: isDark ? '#374151' : '#f3f4f6' }}>
                                    <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Transactions per Client
                                    </h2>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                        {sortedClients.length} clients
                                    </span>
                                </div>
                                {sortedClients.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>No client data for this period</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className={isDark ? 'bg-gray-700/50' : 'bg-gray-50'}>
                                                <tr>
                                                    <th className={`px-5 py-3 text-left text-xs font-bold uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Client</th>
                                                    {(['imports', 'exports', 'total'] as const).map(k => (
                                                        <th key={k}
                                                            onClick={() => handleSort(k)}
                                                            className={`px-4 py-3 text-right text-xs font-bold uppercase cursor-pointer select-none ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                                                            {k} <SortIcon col={k} />
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-100'}`}>
                                                {sortedClients.map(c => (
                                                    <tr key={c.client_id} className={`transition-colors ${isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}`}>
                                                        <td className="px-5 py-3">
                                                            <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{c.client_name}</p>
                                                            <p className={`text-xs capitalize ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{c.client_type}</p>
                                                        </td>
                                                        <td className={`px-4 py-3 text-right tabular-nums ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>{c.imports}</td>
                                                        <td className={`px-4 py-3 text-right tabular-nums ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{c.exports}</td>
                                                        <td className={`px-4 py-3 text-right tabular-nums font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{c.total}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Turnaround Times */}
                            <div className={`rounded-[2rem] border shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                                <div className="px-6 py-5 border-b" style={{ borderColor: isDark ? '#374151' : '#f3f4f6' }}>
                                    <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Turnaround Times
                                    </h2>
                                    <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                        Completed transactions only — days from creation to completion
                                    </p>
                                </div>

                                <div className="p-6 space-y-6">
                                    {(['imports', 'exports'] as const).map(type => {
                                        const stats = turnaround?.[type];
                                        const color = type === 'imports' ? 'indigo' : 'amber';
                                        return (
                                            <div key={type}>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className={`w-2.5 h-2.5 rounded-full bg-${color}-500`} />
                                                    <h3 className={`text-sm font-bold capitalize ${isDark ? 'text-white' : 'text-gray-900'}`}>{type}</h3>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                                                        {stats?.completed_count ?? 0} completed
                                                    </span>
                                                </div>
                                                {(stats?.completed_count ?? 0) === 0 ? (
                                                    <p className={`text-sm italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No completed transactions in this period</p>
                                                ) : (
                                                    <div className="grid grid-cols-3 gap-3">
                                                        {[
                                                            { label: 'Avg', value: stats?.avg_days },
                                                            { label: 'Min', value: stats?.min_days },
                                                            { label: 'Max', value: stats?.max_days },
                                                        ].map(({ label, value }) => (
                                                            <div key={label} className={`rounded-xl p-3 text-center ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                                                <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                                    {value !== null && value !== undefined ? value : '—'}
                                                                </p>
                                                                <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label} days</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
