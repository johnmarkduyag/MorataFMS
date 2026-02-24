import { useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import { Icon } from '../../../components/Icon';
import { useExports } from '../hooks/useExports';
import { useImports } from '../hooks/useImports';
import type { ExportTransaction, ImportTransaction, LayoutContext } from '../types';

const getImportStatusStyle = (status: string) => {
    switch (status) {
        case 'Cleared': return { color: '#30d158', bg: 'rgba(48,209,88,0.12)' };
        case 'Pending': return { color: '#ff9f0a', bg: 'rgba(255,159,10,0.12)' };
        case 'Delayed': return { color: '#ff453a', bg: 'rgba(255,69,58,0.12)' };
        default: return { color: '#64d2ff', bg: 'rgba(100,210,255,0.12)' };
    }
};

const getExportStatusStyle = (status: string) => {
    switch (status) {
        case 'Shipped': return { color: '#30d158', bg: 'rgba(48,209,88,0.12)' };
        case 'Processing': return { color: '#ff9f0a', bg: 'rgba(255,159,10,0.12)' };
        case 'Delayed': return { color: '#ff453a', bg: 'rgba(255,69,58,0.12)' };
        default: return { color: '#64d2ff', bg: 'rgba(100,210,255,0.12)' };
    }
};

const StatusBadge = ({ status, style }: { status: string; style: { color: string; bg: string } }) => (
    <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap w-fit justify-self-start"
        style={{ color: style.color, backgroundColor: style.bg }}
    >
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: style.color, boxShadow: `0 0 5px ${style.color}` }} />
        {status}
    </span>
);

const ColHeader = ({ children }: { children: React.ReactNode }) => (
    <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.08em] whitespace-nowrap">{children}</span>
);

export const TrackingDashboard = () => {
    const navigate = useNavigate();
    const { dateTime } = useOutletContext<LayoutContext>();

    const { data: importsData, isLoading: importsLoading } = useImports();
    const { data: exportsData, isLoading: exportsLoading } = useExports();

    const imports = useMemo<ImportTransaction[]>(() => {
        return (importsData?.data || []).map(t => ({
            id: t.id,
            ref: t.customs_ref_no,
            bl: t.bl_no,
            status: t.status === 'pending' ? 'Pending' : t.status === 'in_progress' ? 'In Transit' : t.status === 'completed' ? 'Cleared' : 'Delayed',
            color: t.selective_color === 'green' ? 'bg-green-500' : t.selective_color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500',
            importer: t.importer?.name || 'Unknown',
            date: t.arrival_date || '',
        }));
    }, [importsData]);

    const exports = useMemo<ExportTransaction[]>(() => {
        return (exportsData?.data || []).map(t => ({
            id: t.id,
            ref: `EXP-${String(t.id).padStart(4, '0')}`,
            bl: t.bl_no,
            status: t.status === 'pending' ? 'Processing' : t.status === 'in_progress' ? 'In Transit' : t.status === 'completed' ? 'Shipped' : 'Delayed',
            color: '',
            shipper: t.shipper?.name || 'Unknown',
            vessel: t.vessel || '—',
            departureDate: t.created_at
                ? new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : '',
            portOfDestination: t.destination_country?.name || '—',
        }));
    }, [exportsData]);

    const Spinner = ({ color }: { color: string }) => (
        <div className="flex-1 flex items-center justify-center">
            <div className="w-7 h-7 border-[3px] border-transparent rounded-full animate-spin" style={{ borderTopColor: color }} />
        </div>
    );

    const EmptyState = ({ label }: { label: string }) => (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-text-muted">
            <div className="w-12 h-12 rounded-full bg-surface-secondary flex items-center justify-center">
                <Icon name="search" className="w-5 h-5 opacity-40" />
            </div>
            <p className="text-xs font-medium tracking-wide">No active {label}.</p>
        </div>
    );

    return (
        /* Outer shell — fills the full available height given by MainLayout's flex-1 */
        <div className="flex flex-col gap-5" style={{ height: 'calc(100vh - 3rem)', overflow: 'hidden' }}>

            {/* ── Page Header ── */}
            <div className="shrink-0 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold mb-1 text-text-primary">Live Tracking Overview</h1>
                    <p className="text-sm text-text-secondary">Real-time view of your assigned import and export transactions.</p>
                </div>
                <div className="text-right hidden sm:block">
                    <p className="text-2xl font-bold tabular-nums text-text-primary">{dateTime.time}</p>
                    <p className="text-sm text-text-secondary">{dateTime.date}</p>
                </div>
            </div>

            {/* ── Two panels side by side, each flex-1 ── */}
            <div className="flex gap-3 flex-1 min-h-0">

                {/* ─── Import Transactions Panel ─── */}
                <div className="flex-1 min-w-0 flex flex-col bg-surface border border-border/60 rounded-lg shadow-sm overflow-hidden">

                    {/* Panel header */}
                    <div className="shrink-0 px-4 py-2.5 border-b border-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-[#30d158] shadow-sm" style={{ boxShadow: '0 0 6px #30d15880' }} />
                            <h2 className="text-sm font-bold text-text-primary">Import Transactions</h2>
                        </div>
                        <span className="text-[10px] font-bold text-text-muted bg-surface-secondary px-2 py-0.5 rounded-full border border-border">
                            {imports.length} active
                        </span>
                    </div>

                    {/* Column headers */}
                    <div className="shrink-0 grid px-4 py-1.5 border-b border-border/30 bg-surface-secondary/50"
                        style={{ gridTemplateColumns: '22px repeat(5, 1fr)' }}>
                        <ColHeader>SC</ColHeader>
                        <ColHeader>Customs Ref No.</ColHeader>
                        <ColHeader>Bill of Lading</ColHeader>
                        <ColHeader>Status</ColHeader>
                        <ColHeader>Importer</ColHeader>
                        <ColHeader>Arrival</ColHeader>
                    </div>

                    {/* Rows — scrollable */}
                    <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
                        {importsLoading ? (
                            <Spinner color="#30d158" />
                        ) : imports.length === 0 ? (
                            <EmptyState label="imports" />
                        ) : (
                            imports.map((row, i) => {
                                const s = getImportStatusStyle(row.status);
                                return (
                                    <div
                                        key={row.id}
                                        onClick={() => navigate(`/tracking/${row.ref}`)}
                                        className={`grid px-4 py-1.5 items-center cursor-pointer hover:bg-hover/60 transition-colors border-b border-border/30 ${i % 2 !== 0 ? 'bg-surface-secondary/30' : ''}`}
                                        style={{ gridTemplateColumns: '22px repeat(5, 1fr)' }}
                                    >
                                        <span className={`w-2 h-2 rounded-full shrink-0 ${row.color}`} />
                                        <p className="text-xs font-bold text-text-primary truncate pr-2">{row.ref}</p>
                                        <p className="text-xs text-text-secondary truncate pr-2">{row.bl || '—'}</p>
                                        <StatusBadge status={row.status} style={s} />
                                        <p className="text-xs text-text-secondary truncate pr-2">{row.importer}</p>
                                        <p className="text-xs text-text-muted">{row.date || '—'}</p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* ─── Export Transactions Panel ─── */}
                <div className="flex-1 min-w-0 flex flex-col bg-surface border border-border/60 rounded-lg shadow-sm overflow-hidden">

                    {/* Panel header */}
                    <div className="shrink-0 px-4 py-2.5 border-b border-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-[#0a84ff]" style={{ boxShadow: '0 0 6px #0a84ff80' }} />
                            <h2 className="text-sm font-bold text-text-primary">Export Transactions</h2>
                        </div>
                        <span className="text-[10px] font-bold text-text-muted bg-surface-secondary px-2 py-0.5 rounded-full border border-border">
                            {exports.length} active
                        </span>
                    </div>

                    {/* Column headers */}
                    <div className="shrink-0 grid px-4 py-1.5 border-b border-border/30 bg-surface-secondary/50"
                        style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
                        <ColHeader>Shipper</ColHeader>
                        <ColHeader>Bill of Lading</ColHeader>
                        <ColHeader>Vessel</ColHeader>
                        <ColHeader>Departure</ColHeader>
                        <ColHeader>Status</ColHeader>
                        <ColHeader>Destination</ColHeader>
                    </div>

                    {/* Rows — scrollable */}
                    <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
                        {exportsLoading ? (
                            <Spinner color="#0a84ff" />
                        ) : exports.length === 0 ? (
                            <EmptyState label="exports" />
                        ) : (
                            exports.map((row, i) => {
                                const s = getExportStatusStyle(row.status);
                                return (
                                    <div
                                        key={row.id}
                                        onClick={() => navigate(`/tracking/${row.ref}`)}
                                        className={`grid px-4 py-1.5 items-center cursor-pointer hover:bg-hover/60 transition-colors border-b border-border/30 ${i % 2 !== 0 ? 'bg-surface-secondary/30' : ''}`}
                                        style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}
                                    >
                                        <p className="text-xs font-bold text-text-primary truncate pr-2">{row.shipper}</p>
                                        <p className="text-xs text-text-secondary truncate pr-2">{row.bl || '—'}</p>
                                        <p className="text-xs text-text-secondary truncate pr-2">{row.vessel}</p>
                                        <p className="text-xs text-text-muted">{row.departureDate || '—'}</p>
                                        <StatusBadge status={row.status} style={s} />
                                        <p className="text-xs text-text-secondary truncate">{row.portOfDestination}</p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
