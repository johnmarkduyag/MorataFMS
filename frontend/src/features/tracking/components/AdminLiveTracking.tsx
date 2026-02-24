import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Icon } from '../../../components/Icon';
import { useExports } from '../hooks/useExports';
import { useImports } from '../hooks/useImports';
import type { ExportTransaction, ImportTransaction } from '../types';

const getImportStatusStyle = (status: string) => {
    switch (status) {
        case 'Cleared': return { color: '#30d158', bg: 'rgba(48,209,88,0.15)' };
        case 'Pending': return { color: '#ff9f0a', bg: 'rgba(255,159,10,0.15)' };
        case 'Delayed': return { color: '#ff453a', bg: 'rgba(255,69,58,0.15)' };
        default: return { color: '#64d2ff', bg: 'rgba(100,210,255,0.15)' };
    }
};

const getExportStatusStyle = (status: string) => {
    switch (status) {
        case 'Shipped': return { color: '#30d158', bg: 'rgba(48,209,88,0.15)' };
        case 'Processing': return { color: '#ff9f0a', bg: 'rgba(255,159,10,0.15)' };
        case 'Delayed': return { color: '#ff453a', bg: 'rgba(255,69,58,0.15)' };
        default: return { color: '#64d2ff', bg: 'rgba(100,210,255,0.15)' };
    }
};

const StatusBadge = ({ status, style }: { status: string; style: { color: string; bg: string } }) => (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap w-fit justify-self-start"
        style={{ color: style.color, backgroundColor: style.bg }}>
        <span className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: style.color, boxShadow: `0 0 5px ${style.color}` }} />
        {status}
    </span>
);

const ColH = ({ children }: { children: React.ReactNode }) => (
    <span className="text-[10px] font-bold uppercase tracking-[0.08em] whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.35)' }}>{children}</span>
);

const Spinner = ({ color }: { color: string }) => (
    <div className="flex-1 flex items-center justify-center py-10">
        <div className="w-7 h-7 border-[3px] border-transparent rounded-full animate-spin" style={{ borderTopColor: color }} />
    </div>
);

const EmptyState = ({ label }: { label: string }) => (
    <div className="flex-1 flex flex-col items-center justify-center py-10 gap-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
        <Icon name="search" className="w-6 h-6 opacity-30" />
        <p className="text-xs">No active {label}.</p>
    </div>
);

export const AdminLiveTracking = () => {
    const navigate = useNavigate();

    const [dateTime, setDateTime] = useState({ time: '', date: '' });
    useEffect(() => {
        const fmt = () => {
            const now = new Date();
            setDateTime({
                time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            });
        };
        fmt();
        const id = setInterval(fmt, 1000);
        return () => clearInterval(id);
    }, []);

    const { data: importsData, isLoading: importsLoading } = useImports();
    const { data: exportsData, isLoading: exportsLoading } = useExports();

    const imports = useMemo<ImportTransaction[]>(() =>
        (importsData?.data || []).map(t => ({
            id: t.id,
            ref: t.customs_ref_no,
            bl: t.bl_no,
            status: t.status === 'pending' ? 'Pending' : t.status === 'in_progress' ? 'In Transit' : t.status === 'completed' ? 'Cleared' : 'Delayed',
            color: t.selective_color === 'green' ? '#30d158' : t.selective_color === 'yellow' ? '#ff9f0a' : '#ff453a',
            importer: t.importer?.name || 'Unknown',
            date: t.arrival_date || '',
        })), [importsData]);

    const exports = useMemo<ExportTransaction[]>(() =>
        (exportsData?.data || []).map(t => ({
            id: t.id,
            ref: `EXP-${String(t.id).padStart(4, '0')}`,
            bl: t.bl_no,
            status: t.status === 'pending' ? 'Processing' : t.status === 'in_progress' ? 'In Transit' : t.status === 'completed' ? 'Shipped' : 'Delayed',
            color: '',
            shipper: t.shipper?.name || 'Unknown',
            vessel: t.vessel || '—',
            departureDate: t.created_at ? new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
            portOfDestination: t.destination_country?.name || '—',
        })), [exportsData]);

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden p-6 gap-5"
            style={{ backgroundColor: '#0d0d0f' }}>

            {/* Centered Header */}
            <div className="shrink-0 flex flex-col items-center text-center relative">
                <h1 className="text-3xl font-bold mb-1" style={{ color: '#ffffff' }}>Live Tracking Overview</h1>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Real-time view of all import and export transactions across all encoders.</p>
                {/* Clock pinned top-right */}
                <div className="absolute right-0 top-0 text-right">
                    <p className="text-2xl font-bold tabular-nums" style={{ color: '#ffffff' }}>{dateTime.time}</p>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{dateTime.date}</p>
                </div>
            </div>

            {/* Stat Cards */}
            {(() => {
                const inTransit = imports.filter(r => r.status === 'In Transit').length + exports.filter(r => r.status === 'In Transit').length;
                const completed = imports.filter(r => r.status === 'Cleared').length + exports.filter(r => r.status === 'Shipped').length;
                const cards = [
                    { label: 'Total Imports', value: imports.length, iconColor: '#30d158', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
                    { label: 'Total Exports', value: exports.length, iconColor: '#0a84ff', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' },
                    { label: 'In Transit', value: inTransit, iconColor: '#ff9f0a', icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0' },
                    { label: 'Completed', value: completed, iconColor: '#bf5af2', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                ];
                return (
                    <div className="shrink-0 grid grid-cols-4 gap-3">
                        {cards.map(card => (
                            <div key={card.label} className="flex items-center justify-between px-4 py-3 rounded-lg"
                                style={{ backgroundColor: '#161618', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <div>
                                    <p className="text-3xl font-bold leading-none mb-1" style={{ color: '#ffffff' }}>{card.value}</p>
                                    <p className="text-xs font-semibold" style={{ color: card.iconColor }}>{card.label}</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: `${card.iconColor}22` }}>
                                    <svg className="w-5 h-5" fill="none" stroke={card.iconColor} viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d={card.icon} />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            })()}

            {/* Two panels */}
            <div className="flex gap-3 flex-1 min-h-0">

                {/* Import Panel */}
                <div className="flex-1 min-w-0 flex flex-col rounded-lg overflow-hidden"
                    style={{ backgroundColor: '#161618', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="shrink-0 px-4 py-2.5 flex items-center justify-between"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#30d158', boxShadow: '0 0 6px #30d15880' }} />
                            <h2 className="text-sm font-bold" style={{ color: '#ffffff' }}>Import Transactions</h2>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ color: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            {imports.length} active
                        </span>
                    </div>
                    <div className="shrink-0 grid px-4 py-1.5"
                        style={{ gridTemplateColumns: '22px repeat(5, 1fr)', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                        <ColH>SC</ColH><ColH>Customs Ref No.</ColH><ColH>Bill of Lading</ColH>
                        <ColH>Status</ColH><ColH>Importer</ColH><ColH>Arrival</ColH>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
                        {importsLoading ? <Spinner color="#30d158" /> :
                            imports.length === 0 ? <EmptyState label="imports" /> :
                                imports.map((row, i) => {
                                    const s = getImportStatusStyle(row.status);
                                    return (
                                        <div key={row.id} onClick={() => navigate(`/tracking/${row.ref}`)}
                                            className="grid px-4 py-1.5 items-center cursor-pointer transition-colors"
                                            style={{
                                                gridTemplateColumns: '22px repeat(5, 1fr)',
                                                borderBottom: '1px solid rgba(255,255,255,0.04)',
                                                backgroundColor: i % 2 !== 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                                            }}
                                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
                                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = i % 2 !== 0 ? 'rgba(255,255,255,0.02)' : 'transparent')}
                                        >
                                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: row.color as string }} />
                                            <p className="text-xs font-bold truncate pr-2" style={{ color: '#ffffff' }}>{row.ref}</p>
                                            <p className="text-xs truncate pr-2" style={{ color: 'rgba(255,255,255,0.55)' }}>{row.bl || '—'}</p>
                                            <StatusBadge status={row.status} style={s} />
                                            <p className="text-xs truncate pr-2" style={{ color: 'rgba(255,255,255,0.55)' }}>{row.importer}</p>
                                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{row.date || '—'}</p>
                                        </div>
                                    );
                                })}
                    </div>
                </div>

                {/* Export Panel */}
                <div className="flex-1 min-w-0 flex flex-col rounded-lg overflow-hidden"
                    style={{ backgroundColor: '#161618', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="shrink-0 px-4 py-2.5 flex items-center justify-between"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0a84ff', boxShadow: '0 0 6px #0a84ff80' }} />
                            <h2 className="text-sm font-bold" style={{ color: '#ffffff' }}>Export Transactions</h2>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ color: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            {exports.length} active
                        </span>
                    </div>
                    <div className="shrink-0 grid px-4 py-1.5"
                        style={{ gridTemplateColumns: 'repeat(6, 1fr)', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                        <ColH>Shipper</ColH><ColH>Bill of Lading</ColH><ColH>Vessel</ColH>
                        <ColH>Departure</ColH><ColH>Status</ColH><ColH>Destination</ColH>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
                        {exportsLoading ? <Spinner color="#0a84ff" /> :
                            exports.length === 0 ? <EmptyState label="exports" /> :
                                exports.map((row, i) => {
                                    const s = getExportStatusStyle(row.status);
                                    return (
                                        <div key={row.id} onClick={() => navigate(`/tracking/${row.ref}`)}
                                            className="grid px-4 py-1.5 items-center cursor-pointer transition-colors"
                                            style={{
                                                gridTemplateColumns: 'repeat(6, 1fr)',
                                                borderBottom: '1px solid rgba(255,255,255,0.04)',
                                                backgroundColor: i % 2 !== 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                                            }}
                                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
                                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = i % 2 !== 0 ? 'rgba(255,255,255,0.02)' : 'transparent')}
                                        >
                                            <p className="text-xs font-bold truncate pr-2" style={{ color: '#ffffff' }}>{row.shipper}</p>
                                            <p className="text-xs truncate pr-2" style={{ color: 'rgba(255,255,255,0.55)' }}>{row.bl || '—'}</p>
                                            <p className="text-xs truncate pr-2" style={{ color: 'rgba(255,255,255,0.55)' }}>{row.vessel}</p>
                                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{row.departureDate || '—'}</p>
                                            <StatusBadge status={row.status} style={s} />
                                            <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.55)' }}>{row.portOfDestination}</p>
                                        </div>
                                    );
                                })}
                    </div>
                </div>

            </div>
        </div>
    );
};
