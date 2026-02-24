import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
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
    status: string;
    documents: TransactionDoc[];
}

// ─── Shared Placeholder Data (same as Documents.tsx) ─────────────────────────
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

function FileTypeIcon({ type }: { type: 'pdf' | 'docx' | 'jpg' }) {
    const cls = type === 'pdf'
        ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
        : type === 'docx'
            ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
    return (
        <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${cls}`}>
            {type === 'pdf' ? (
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            ) : type === 'docx' ? (
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ) : (
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )}
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────
export const DocumentsDetail = () => {
    const { ref } = useParams<{ ref: string }>();
    const navigate = useNavigate();
    const { dateTime } = useOutletContext<LayoutContext>();

    const txn = TRANSACTIONS.find(t => t.ref === ref);

    if (!txn) {
        return (
            <div className="space-y-5 p-4">
                <button
                    onClick={() => navigate('/documents')}
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                    <Icon name="chevron-left" className="w-4 h-4" />
                    Back to Documents
                </button>
                <div className="flex items-center justify-center h-64 text-text-muted text-sm">
                    Transaction not found.
                </div>
            </div>
        );
    }

    const tc = typeConfig[txn.type];
    const sc = statusConfig[txn.status] ?? { color: '#8e8e93', bg: 'rgba(142,142,147,0.13)' };

    return (
        <div className="space-y-5 p-4">
            {/* Back button */}
            <button
                onClick={() => navigate('/documents')}
                className="flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors group"
            >
                <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Documents
            </button>

            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-bold text-text-primary">{txn.ref}</h1>
                        <span
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
                            style={{ color: tc.color, backgroundColor: tc.bg }}
                        >
                            {tc.label}
                        </span>
                        <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                            style={{ color: sc.color, backgroundColor: sc.bg }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sc.color, boxShadow: `0 0 4px ${sc.color}` }} />
                            {txn.status}
                        </span>
                    </div>
                    <p className="text-sm text-text-secondary">{txn.client} · {txn.date}</p>
                </div>
                <div className="text-right hidden sm:block">
                    <p className="text-2xl font-bold tabular-nums text-text-primary">{dateTime.time}</p>
                    <p className="text-sm text-text-secondary">{dateTime.date}</p>
                </div>
            </div>

            {/* Document List Card */}
            <div className="bg-surface rounded-lg border border-border overflow-hidden">
                {/* Card header */}
                <div className="px-6 py-4 border-b border-border bg-surface-subtle flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm font-bold text-text-primary">
                            {txn.documents.length} Document{txn.documents.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                {/* Table header */}
                <div
                    className="grid gap-4 px-6 py-3 border-b border-border text-xs font-bold text-text-secondary uppercase tracking-wider"
                    style={{ gridTemplateColumns: '40px 2.5fr 1fr 1.4fr 80px 90px' }}
                >
                    <span />
                    <span>File Name</span>
                    <span>Date</span>
                    <span>Uploaded By</span>
                    <span>Size</span>
                    <span className="text-center">Actions</span>
                </div>

                {/* Document rows */}
                <div>
                    {txn.documents.map((doc, i) => (
                        <div
                            key={doc.id}
                            className={`grid gap-4 px-6 py-3.5 items-center border-b border-border/50 transition-colors hover:bg-hover ${i % 2 !== 0 ? 'bg-surface-secondary/40' : ''}`}
                            style={{ gridTemplateColumns: '40px 2.5fr 1fr 1.4fr 80px 90px' }}
                        >
                            <FileTypeIcon type={doc.type} />
                            <p className="text-sm font-semibold text-text-primary truncate">{doc.name}</p>
                            <p className="text-sm font-bold text-text-secondary">{doc.date}</p>
                            <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full ${doc.uploader.color} flex items-center justify-center text-[9px] font-bold text-white shrink-0`}>
                                    {doc.uploader.initials}
                                </div>
                                <span className="text-sm font-bold text-text-secondary truncate">{doc.uploader.name}</span>
                            </div>
                            <p className="text-sm font-bold text-text-secondary">{doc.size}</p>
                            <div className="flex items-center justify-center gap-1">
                                {/* Download */}
                                <button
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                                    title="Download"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>
                                {/* View */}
                                <button
                                    className="p-1.5 text-text-secondary hover:bg-hover rounded-md transition-colors"
                                    title="View"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
