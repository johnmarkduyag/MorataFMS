import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { clientApi } from '../api/clientApi';
import { ClientFormModal } from './ClientFormModal';
import { TransactionHistoryModal } from './TransactionHistoryModal';
import type { Client, CreateClientData, UpdateClientData, ImportTransaction, ExportTransaction } from '../types/client.types';

interface LayoutContext {
    user?: { name: string; role: string };
    dateTime: { time: string; date: string };
}

export const ClientManagement = () => {
    const { theme } = useTheme();
    const { dateTime } = useOutletContext<LayoutContext>();
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [transactionHistory, setTransactionHistory] = useState<{
        clientName: string;
        imports: ImportTransaction[];
        exports: ExportTransaction[];
    }>({ clientName: '', imports: [], exports: [] });

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            setIsLoading(true);
            const response = await clientApi.getClients();
            setClients(response.data);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load clients');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateClient = async (data: CreateClientData | UpdateClientData) => {
        await clientApi.createClient(data as CreateClientData);
        await loadClients();
    };

    const handleUpdateClient = async (data: CreateClientData | UpdateClientData) => {
        if (selectedClient) {
            await clientApi.updateClient(selectedClient.id, data as UpdateClientData);
            await loadClients();
        }
    };

    const handleToggleActive = async (clientId: number) => {
        try {
            await clientApi.toggleActiveClient(clientId);
            await loadClients();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to toggle client status');
        }
    };

    const handleViewTransactions = async (client: Client) => {
        try {
            const history = await clientApi.getClientTransactions(client.id);
            setTransactionHistory({
                clientName: client.name,
                imports: history.transactions.imports,
                exports: history.transactions.exports,
            });
            setIsHistoryModalOpen(true);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to load transaction history');
        }
    };

    const handleEdit = (client: Client) => {
        setSelectedClient(client);
        setModalMode('edit');
        setIsFormModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedClient(null);
        setModalMode('create');
        setIsFormModalOpen(true);
    };

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.country?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contact_person?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 p-4">
            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Client Management
                    </h1>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Manage clients, toggle status, and view transaction history
                    </p>
                </div>
                <div className="text-right">
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {dateTime.time}
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {dateTime.date}
                    </p>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                <div className="flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border transition-colors ${theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                            } focus:outline-none focus:border-gray-400`}
                    />
                </div>
                <button
                    onClick={handleCreate}
                    className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Create Client
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 rounded-xl bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* Clients Table */}
            <div className={`rounded-[2rem] border shadow-sm overflow-hidden ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                {isLoading ? (
                    <div className="p-12 text-center">
                        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                            Loading clients...
                        </p>
                    </div>
                ) : filteredClients.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                            {searchTerm ? 'No clients found matching your search' : 'No clients found'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className={theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}>
                                <tr>
                                    <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                        Name
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                        Type
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                        Country
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                        Contact
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                        Status
                                    </th>
                                    <th className={`px-6 py-4 text-right text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-100'}`}>
                                {filteredClients.map((client) => (
                                    <tr
                                        key={client.id}
                                        className={`transition-colors ${theme === 'dark' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <td className={`px-6 py-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                            } font-medium`}>
                                            {client.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold capitalize ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {client.type}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                            }`}>
                                            {client.country?.name || 'N/A'}
                                        </td>
                                        <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                            }`}>
                                            <div className="text-sm">
                                                {client.contact_person && <div>{client.contact_person}</div>}
                                                {client.contact_email && <div className="text-xs">{client.contact_email}</div>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${client.is_active
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                }`}>
                                                {client.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleEdit(client)}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${theme === 'dark'
                                                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                                    }`}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleToggleActive(client.id)}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${client.is_active
                                                        ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50'
                                                        : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50'
                                                    }`}
                                            >
                                                {client.is_active ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => handleViewTransactions(client)}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${theme === 'dark'
                                                        ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50'
                                                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                    }`}
                                            >
                                                View History
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Client Form Modal */}
            <ClientFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={modalMode === 'create' ? handleCreateClient : handleUpdateClient}
                client={selectedClient}
                mode={modalMode}
            />

            {/* Transaction History Modal */}
            <TransactionHistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                clientName={transactionHistory.clientName}
                imports={transactionHistory.imports}
                exports={transactionHistory.exports}
            />
        </div>
    );
};
