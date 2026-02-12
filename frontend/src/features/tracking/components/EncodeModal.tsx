import React, { useState } from 'react';

interface EncodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'import' | 'export';
    onSave: (data: any) => void;
}

export const EncodeModal: React.FC<EncodeModalProps> = ({ isOpen, onClose, type, onSave }) => {
    const [formData, setFormData] = useState<any>({});

    if (!isOpen) return null;

    const isImport = type === 'import';

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
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

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header - Matching Documents style */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white shadow-lg ring-4 ring-gray-50">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v12m6-6H6" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Encode {isImport ? 'Import' : 'Export'}</h3>
                            <p className="text-xs text-gray-500 font-medium">Please fill in the details of the new transaction</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Import Only: BLSC (Selective Color) */}
                        {isImport && (
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                    BLSC (Selective Color)
                                </label>
                                <div className="relative">
                                    <select
                                        required
                                        name="blsc"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Color</option>
                                        {blscOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    <svg className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        )}

                        {/* Ref ID / Ref No */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                {isImport ? 'Customs Ref No.' : 'Ref ID'}
                            </label>
                            <input
                                required
                                name="ref"
                                type="text"
                                placeholder={isImport ? 'e.g. REF-2024-001' : 'e.g. REF-EXP-001'}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-300"
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Export Only: Shipper (Placed early for Export order) */}
                        {!isImport && (
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                    Shipper
                                </label>
                                <input
                                    required
                                    name="party"
                                    type="text"
                                    placeholder="Enter Shipper Name"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-300"
                                    onChange={handleInputChange}
                                />
                            </div>
                        )}

                        {/* Bill of Lading */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                Bill of Lading
                            </label>
                            <input
                                required
                                name="bl"
                                type="text"
                                placeholder="e.g. BL-78542136"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-300"
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Import Only: Status */}
                        {isImport && (
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                    Status
                                </label>
                                <div className="relative">
                                    <select
                                        required
                                        name="status"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Status</option>
                                        {statusOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    <svg className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        )}

                        {/* Import Only: Importer (Placed here for Import order) */}
                        {isImport && (
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                    Importer
                                </label>
                                <input
                                    required
                                    name="party"
                                    type="text"
                                    placeholder="Enter Importer Name"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-300"
                                    onChange={handleInputChange}
                                />
                            </div>
                        )}

                        {/* Export Only: Vessel */}
                        {!isImport && (
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                    Vessel
                                </label>
                                <input
                                    required
                                    name="extra"
                                    type="text"
                                    placeholder="Enter Vessel Name"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-300"
                                    onChange={handleInputChange}
                                />
                            </div>
                        )}

                        {/* Import Only: Arrival Date (Full width for Import) */}
                        {isImport && (
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                    Arrival Date
                                </label>
                                <input
                                    required
                                    name="extra"
                                    type="date"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-300"
                                    onChange={handleInputChange}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-4 bg-black text-white rounded-2xl text-sm font-bold hover:bg-gray-900 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                            Encode
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
