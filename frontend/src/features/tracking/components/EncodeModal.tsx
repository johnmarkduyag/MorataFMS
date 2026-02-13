import React, { useEffect, useState } from 'react';
import { Icon } from '../../../components/Icon';
import type { EncodeFormData } from '../types';

interface EncodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'import' | 'export';
    onSave: (data: EncodeFormData) => void;
}

const INITIAL_FORM: EncodeFormData = {
    ref: '',
    bl: '',
    party: '',
    status: '',
    blsc: '',
    extra: '',
};

export const EncodeModal: React.FC<EncodeModalProps> = ({ isOpen, onClose, type, onSave }) => {
    const [formData, setFormData] = useState<EncodeFormData>({ ...INITIAL_FORM });

    const isImport = type === 'import';

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({ ...INITIAL_FORM });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const statusOptions = isImport
        ? ['Cleared', 'Pending', 'Delayed', 'In Transit']
        : ['Shipped', 'Processing', 'Delayed', 'In Transit'];

    const blscOptions = ['Green', 'Yellow', 'Orange', 'Red', 'Blue'];

    const inputClass =
        'w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600';

    const labelClass =
        'text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1';

    const selectClass = `${inputClass} appearance-none cursor-pointer`;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-200 dark:border-gray-800 transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg ring-4 ring-blue-50 dark:ring-blue-900/30">
                            <Icon name="plus" className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
                                Encode {isImport ? 'Import' : 'Export'}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                Please fill in the details of the new transaction
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                    >
                        <Icon name="x" className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Import Only: BLSC (Selective Color) */}
                        {isImport && (
                            <div className="space-y-2 md:col-span-2">
                                <label className={labelClass}>BLSC (Selective Color)</label>
                                <div className="relative">
                                    <select
                                        required
                                        name="blsc"
                                        value={formData.blsc}
                                        className={selectClass}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Color</option>
                                        {blscOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    <Icon name="chevron-down" className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        )}

                        {/* Ref ID / Ref No */}
                        <div className="space-y-2">
                            <label className={labelClass}>
                                {isImport ? 'Customs Ref No.' : 'Ref ID'}
                            </label>
                            <input
                                required
                                name="ref"
                                type="text"
                                value={formData.ref}
                                placeholder={isImport ? 'e.g. REF-2024-001' : 'e.g. REF-EXP-001'}
                                className={inputClass}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Export Only: Shipper */}
                        {!isImport && (
                            <div className="space-y-2">
                                <label className={labelClass}>Shipper</label>
                                <input
                                    required
                                    name="party"
                                    type="text"
                                    value={formData.party}
                                    placeholder="Enter Shipper Name"
                                    className={inputClass}
                                    onChange={handleInputChange}
                                />
                            </div>
                        )}

                        {/* Bill of Lading */}
                        <div className="space-y-2">
                            <label className={labelClass}>Bill of Lading</label>
                            <input
                                required
                                name="bl"
                                type="text"
                                value={formData.bl}
                                placeholder="e.g. BL-78542136"
                                className={inputClass}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Import Only: Status */}
                        {isImport && (
                            <div className="space-y-2">
                                <label className={labelClass}>Status</label>
                                <div className="relative">
                                    <select
                                        required
                                        name="status"
                                        value={formData.status}
                                        className={selectClass}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Status</option>
                                        {statusOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    <Icon name="chevron-down" className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        )}

                        {/* Import Only: Importer */}
                        {isImport && (
                            <div className="space-y-2">
                                <label className={labelClass}>Importer</label>
                                <input
                                    required
                                    name="party"
                                    type="text"
                                    value={formData.party}
                                    placeholder="Enter Importer Name"
                                    className={inputClass}
                                    onChange={handleInputChange}
                                />
                            </div>
                        )}

                        {/* Export Only: Vessel */}
                        {!isImport && (
                            <div className="space-y-2">
                                <label className={labelClass}>Vessel</label>
                                <input
                                    required
                                    name="extra"
                                    type="text"
                                    value={formData.extra}
                                    placeholder="Enter Vessel Name"
                                    className={inputClass}
                                    onChange={handleInputChange}
                                />
                            </div>
                        )}

                        {/* Import Only: Arrival Date */}
                        {isImport && (
                            <div className="space-y-2 md:col-span-2">
                                <label className={labelClass}>Arrival Date</label>
                                <input
                                    required
                                    name="extra"
                                    type="date"
                                    value={formData.extra}
                                    className={inputClass}
                                    onChange={handleInputChange}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Icon name="check-circle" className="w-4 h-4" />
                            Encode
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
