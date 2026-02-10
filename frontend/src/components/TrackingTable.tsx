import type { TrackingItem } from "../types/tracking";
import { getStatusColor } from "../types/tracking";

interface TrackingTableProps {
    items: TrackingItem[];
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export const TrackingTable = ({ items, onEdit, onDelete }: TrackingTableProps) => {
    return (
        <div className="flex-1 bg-white rounded-2xl p-6">
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 pb-3 border-b border-gray-200 mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase">Customer Ref No.</span>
                <span className="text-xs font-semibold text-gray-500 uppercase">Bill of Lading</span>
                <span className="text-xs font-semibold text-gray-500 uppercase">Color Status</span>
                <span className="text-xs font-semibold text-gray-500 uppercase">Importer</span>
                <span className="text-xs font-semibold text-gray-500 uppercase">Annual Date</span>
                <span className="text-xs font-semibold text-gray-500 uppercase text-right">Actions</span>
            </div>

            {/* Table Rows */}
            <div className="space-y-3">
                {items.map((item) => {
                    const color = getStatusColor(item.status);
                    const dotColor = color === 'green' ? 'bg-green-500' :
                        color === 'yellow' ? 'bg-yellow-500' :
                            color === 'red' ? 'bg-red-500' :
                                color === 'blue' ? 'bg-blue-500' : 'bg-gray-500';
                    const textColor = color === 'green' ? 'text-green-600' :
                        color === 'yellow' ? 'text-yellow-600' :
                            color === 'red' ? 'text-red-600' :
                                color === 'blue' ? 'text-blue-600' : 'text-gray-600';
                    return (
                        <div key={item.id} className="grid grid-cols-6 gap-4 py-2 items-center">
                            <p className="text-sm text-gray-900 font-medium">{item.customerRefNo}</p>
                            <p className="text-sm text-gray-600">{item.billOfLading}</p>
                            <span className="inline-flex items-center gap-1.5">
                                <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></span>
                                <span className={`text-sm ${textColor}`}>{item.status}</span>
                            </span>
                            <p className="text-sm text-gray-600">{item.importer}</p>
                            <p className="text-sm text-gray-600">{item.annualDate}</p>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => onEdit?.(item.id)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Edit"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => onDelete?.(item.id)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Delete"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
