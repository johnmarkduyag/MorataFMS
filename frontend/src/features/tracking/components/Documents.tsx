import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Icon } from '../../../components/Icon';

interface LayoutContext {
    user?: { name: string; role: string };
    dateTime: { time: string; date: string };
}

interface TransactionDoc {
    id: number;
    name: string;
    type: 'pdf' | 'docx' | 'jpg';
    date: string;
    uploader: { name: string; initials: string; color: string };
    size: string;
}

interface Transaction {
    id: number;
    ref: string;
    client: string;
    type: 'import' | 'export' | 'legacy';
    date: string;
    status: 'Cleared' | 'In Transit' | 'Pending' | 'Shipped' | 'Processing';
    documents: TransactionDoc[];
}

// ─── Placeholder Data ────────────────────────────────────────────────────────
const TRANSACTIONS: Transaction[] = [
    {
        id: 1, ref: 'IMP-2025-001', client: 'Global Traders Inc.', type: 'import',
        date: 'Nov 20, 2025', status: 'Cleared',
        documents: [
            { id: 1, name: 'Import_Manifest_Nov2025.pdf', type: 'pdf', date: 'Nov 20, 2025', uploader: { name: 'John Doe', initials: 'JD', color: 'bg-[#1a2332]' }, size: '2.4 MB' },
            { id: 2, name: 'Packing_List_Final.docx', type: 'docx', date: 'Nov 18, 2025', uploader: { name: 'Alice Smith', initials: 'AS', color: 'bg-[#c41e3a]' }, size: '1.8 MB' },
            { id: 3, name: 'Container_Photo_01.jpg', type: 'jpg', date: 'Nov 15, 2025', uploader: { name: 'Robert J.', initials: 'RJ', color: 'bg-blue-500' }, size: '3.5 MB' },
        ],
    },
    {
        id: 2, ref: 'IMP-2025-002', client: 'Pacific Imports Ltd.', type: 'import',
        date: 'Nov 12, 2025', status: 'In Transit',
        documents: [
            { id: 4, name: 'BOL_Pacific_Nov2025.pdf', type: 'pdf', date: 'Nov 12, 2025', uploader: { name: 'John Doe', initials: 'JD', color: 'bg-[#1a2332]' }, size: '980 KB' },
            { id: 5, name: 'Customs_Declaration.docx', type: 'docx', date: 'Nov 10, 2025', uploader: { name: 'Alice Smith', initials: 'AS', color: 'bg-[#c41e3a]' }, size: '890 KB' },
        ],
    },
    {
        id: 3, ref: 'EXP-2025-001', client: 'Davao Export Corp.', type: 'export',
        date: 'Nov 8, 2025', status: 'Shipped',
        documents: [
            { id: 6, name: 'Export_Packing_List.pdf', type: 'pdf', date: 'Nov 8, 2025', uploader: { name: 'John Doe', initials: 'JD', color: 'bg-[#1a2332]' }, size: '1.2 MB' },
            { id: 7, name: 'Bill_of_Lading_Export.pdf', type: 'pdf', date: 'Nov 7, 2025', uploader: { name: 'Robert J.', initials: 'RJ', color: 'bg-blue-500' }, size: '4.1 MB' },
            { id: 8, name: 'Commercial_Invoice.pdf', type: 'pdf', date: 'Nov 5, 2025', uploader: { name: 'Alice Smith', initials: 'AS', color: 'bg-[#c41e3a]' }, size: '1.5 MB' },
            { id: 9, name: 'Certificate_of_Origin.pdf', type: 'pdf', date: 'Nov 4, 2025', uploader: { name: 'John Doe', initials: 'JD', color: 'bg-[#1a2332]' }, size: '980 KB' },
        ],
    },
    {
        id: 4, ref: 'EXP-2025-002', client: 'Mindanao Fresh Exports', type: 'export',
        date: 'Oct 25, 2025', status: 'Processing',
        documents: [
            { id: 10, name: 'Export_License.pdf', type: 'pdf', date: 'Oct 25, 2025', uploader: { name: 'Alice Smith', initials: 'AS', color: 'bg-[#c41e3a]' }, size: '1.1 MB' },
            { id: 11, name: 'Phyto_Certificate.docx', type: 'docx', date: 'Oct 23, 2025', uploader: { name: 'Robert J.', initials: 'RJ', color: 'bg-blue-500' }, size: '760 KB' },
        ],
    },
    {
        id: 5, ref: 'LEG-2022-001', client: 'Asia Pacific Trading', type: 'legacy',
        date: 'Jan 3, 2022', status: 'Cleared',
        documents: [
            { id: 12, name: 'Old_Shipping_Instructions.docx', type: 'docx', date: 'Jan 3, 2022', uploader: { name: 'Alice Smith', initials: 'AS', color: 'bg-[#c41e3a]' }, size: '720 KB' },
            { id: 13, name: 'Archive_2022_Quality_Check.docx', type: 'docx', date: 'Jan 5, 2022', uploader: { name: 'Robert J.', initials: 'RJ', color: 'bg-blue-500' }, size: '650 KB' },
        ],
    },
    {
        id: 6, ref: 'LEG-2020-001', client: 'Cebu Cargo Services', type: 'legacy',
        date: 'Feb 18, 2020', status: 'Cleared',
        documents: [
            { id: 14, name: 'Legacy_Warehouse_Receipt.jpg', type: 'jpg', date: 'Feb 18, 2020', uploader: { name: 'John Doe', initials: 'JD', color: 'bg-[#1a2332]' }, size: '4.8 MB' },
            { id: 15, name: 'Freight_Forwarding_Agreement.pdf', type: 'pdf', date: 'Feb 20, 2020', uploader: { name: 'Alice Smith', initials: 'AS', color: 'bg-[#c41e3a]' }, size: '1.9 MB' },
        ],
    },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const typeConfig = {
    import: { label: 'Import', color: '#0a84ff', bg: 'rgba(10,132,255,0.12)' },
    export: { label: 'Export', color: '#30d158', bg: 'rgba(48,209,88,0.12)' },
    legacy: { label: 'Legacy', color: '#ff9f0a', bg: 'rgba(255,159,10,0.12)' },
};

const statusConfig: Record<string, { color: string; bg: string }> = {
    Cleared: { color: '#30d158', bg: 'rgba(48,209,88,0.13)' },
    Shipped: { color: '#30d158', bg: 'rgba(48,209,88,0.13)' },
    'In Transit': { color: '#64d2ff', bg: 'rgba(100,210,255,0.13)' },
    Pending: { color: '#ff9f0a', bg: 'rgba(255,159,10,0.13)' },
    Processing: { color: '#ff9f0a', bg: 'rgba(255,159,10,0.13)' },
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const Documents = () => {
    const { dateTime, user } = useOutletContext<LayoutContext>();
    const isAdmin = user?.role === 'admin';

    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'import' | 'export' | 'legacy'>('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const navigate = useNavigate();

    // Stats
    const totalDocs = TRANSACTIONS.reduce((s, t) => s + t.documents.length, 0);
    const importCount = TRANSACTIONS.filter(t => t.type === 'import').length;
    const exportCount = TRANSACTIONS.filter(t => t.type === 'export').length;
    const legacyCount = TRANSACTIONS.filter(t => t.type === 'legacy').length;

    const stats = [
        { label: 'Total Transactions', value: TRANSACTIONS.length, sub: `${totalDocs} documents`, color: '#0a84ff', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { label: 'Import', value: importCount, sub: 'Inbound shipments', color: '#0a84ff', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
        { label: 'Export', value: exportCount, sub: 'Outbound shipments', color: '#30d158', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' },
        { label: 'Legacy', value: legacyCount, sub: 'Archived records', color: '#ff9f0a', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2L19 8' },
    ];

    // Filtered + searched transactions
    const filtered = TRANSACTIONS.filter(t => {
        const matchType = typeFilter === 'all' || t.type === typeFilter;
        const q = searchQuery.toLowerCase();
        const matchSearch = !q || t.ref.toLowerCase().includes(q) || t.client.toLowerCase().includes(q);
        return matchType && matchSearch;
    });

    const filterLabels = { all: 'All Types', import: 'Import', export: 'Export', legacy: 'Legacy' };

    const handleRowClick = (ref: string) => {
        navigate(`/documents/${ref}`);
    };

    return (
        <div className="space-y-5 p-4">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold mb-1 text-text-primary">Documents</h1>
                    <p className="text-sm text-text-secondary">Browse transaction documents by shipment</p>
                </div>
                <div className="text-right hidden sm:block">
                    <p className="text-2xl font-bold tabular-nums text-text-primary">{dateTime.time}</p>
                    <p className="text-sm text-text-secondary">{dateTime.date}</p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {stats.map(stat => (
                    <div key={stat.label} className="bg-surface-tint rounded-lg p-4 border border-border-tint">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-3xl font-bold tabular-nums text-text-primary">{stat.value}</p>
                                <p className="text-xs mt-1 text-text-secondary">{stat.label}</p>
                            </div>
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                                <svg className="w-4.5 h-4.5" fill="none" stroke={stat.color} viewBox="0 0 24 24" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Transaction List Card */}
            <div className="bg-surface rounded-lg border border-border overflow-visible">

                {/* Controls */}
                <div className="p-3 border-b border-border flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-surface-subtle">
                    {/* Left: Search */}
                    <div className="relative flex-1 max-w-sm">
                        <svg className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by ref or client..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 h-9 rounded-md border border-border-strong bg-input-bg text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                    </div>
                    {/* Right: Type filter + Upload */}
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <button
                                onClick={() => setIsFilterOpen(o => !o)}
                                className="px-3 h-9 rounded-md border border-border-strong bg-input-bg text-text-secondary text-xs font-semibold min-w-[140px] text-left flex items-center justify-between focus:outline-none transition-colors hover:text-text-primary"
                            >
                                {filterLabels[typeFilter]}
                                <Icon name="chevron-down" className="w-3.5 h-3.5 ml-2 text-text-muted" />
                            </button>
                            {isFilterOpen && (
                                <div className="absolute top-full right-0 mt-1 w-40 bg-surface border border-border-strong rounded-md shadow-lg z-50 overflow-hidden">
                                    {(['all', 'import', 'export', 'legacy'] as const).map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => { setTypeFilter(cat); setIsFilterOpen(false); }}
                                            className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors hover:bg-hover ${typeFilter === cat ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' : 'text-text-primary'
                                                }`}
                                        >
                                            {filterLabels[cat]}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {isAdmin && (
                            <button
                                type="button"
                                onClick={() => setIsUploadModalOpen(true)}
                                className="flex items-center gap-1.5 px-3.5 h-9 rounded-md text-xs font-bold transition-all shadow-sm hover:shadow-md"
                                style={{ backgroundColor: '#0a84ff', color: '#fff' }}
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                </svg>
                                Upload Document
                            </button>
                        )}
                    </div>
                </div>

                {/* Table Header */}
                <div className="grid gap-4 px-6 py-3 border-b border-border bg-surface-subtle"
                    style={{ gridTemplateColumns: '110px 1.4fr 1.6fr 1fr 100px 90px' }}>
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Type</span>
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Ref No.</span>
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Client</span>
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Date</span>
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Status</span>
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-wider text-center">Docs</span>
                </div>

                {/* Transaction Rows + Inline Document Accordion */}
                <div>
                    {filtered.length === 0 && (
                        <div className="py-16 text-center text-text-muted text-sm">No transactions found.</div>
                    )}
                    {filtered.map((txn, i) => {
                        const tc = typeConfig[txn.type];
                        const sc = statusConfig[txn.status] ?? { color: '#8e8e93', bg: 'rgba(142,142,147,0.13)' };

                        return (
                            <div
                                key={txn.id}
                                onClick={() => handleRowClick(txn.ref)}
                                className={`grid gap-4 py-3 px-6 items-center cursor-pointer transition-all duration-200 hover:bg-hover border-b border-border/50 ${i % 2 !== 0 ? 'bg-surface-secondary/40' : ''}`}
                                style={{ gridTemplateColumns: '110px 1.4fr 1.6fr 1fr 100px 90px' }}
                            >
                                {/* Type badge */}
                                <span
                                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold w-fit"
                                    style={{ color: tc.color, backgroundColor: tc.bg }}
                                >
                                    {tc.label}
                                </span>
                                <p className="text-sm text-text-primary font-bold">{txn.ref}</p>
                                <p className="text-sm text-text-secondary font-bold truncate">{txn.client}</p>
                                <p className="text-sm text-text-secondary font-bold">{txn.date}</p>
                                {/* Status badge */}
                                <span
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold w-fit"
                                    style={{ color: sc.color, backgroundColor: sc.bg }}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: sc.color, boxShadow: `0 0 4px ${sc.color}` }} />
                                    {txn.status}
                                </span>
                                {/* Doc count */}
                                <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-text-secondary">
                                    <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    {txn.documents.length}
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Upload Modal (admin only, placeholder) */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[150]">
                    <div className="bg-surface rounded-xl shadow-xl w-full max-w-lg overflow-hidden mx-4 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#1a2332] flex items-center justify-center text-white shadow-sm">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-text-primary">Upload Document</h3>
                                    <p className="text-xs text-text-muted">Attach a file to a transaction</p>
                                </div>
                            </div>
                            <button onClick={() => setIsUploadModalOpen(false)} className="text-text-muted hover:text-text-secondary transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="relative group rounded-xl overflow-hidden mb-6 cursor-pointer">
                                <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,#ffffff_0deg,#3b82f6_90deg,#ffffff_180deg,#3b82f6_270deg,#ffffff_360deg)] animate-[spin_3s_linear_infinite] opacity-100" />
                                <div className="relative bg-surface rounded-[10px] p-8 flex flex-col items-center justify-center border-[3px] border-dashed border-border-strong bg-clip-padding">
                                    <p className="text-sm text-text-primary font-medium mb-1 z-10">Choose a file or drag &amp; drop it here</p>
                                    <p className="text-xs text-gray-400 z-10">PDF, DOCX, JPG — max 500 MB</p>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setIsUploadModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-text-secondary bg-surface border border-border-strong rounded-lg hover:bg-hover transition-colors">
                                    Cancel
                                </button>
                                <button className="px-4 py-2 text-sm font-bold rounded-lg transition-colors" style={{ backgroundColor: '#0a84ff', color: '#fff' }}>
                                    Upload
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
