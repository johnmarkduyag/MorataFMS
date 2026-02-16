import api from '../../../lib/axios';
import type {
    ApiClient,
    ApiExportTransaction,
    ApiImportTransaction,
    CreateExportPayload,
    CreateImportPayload,
    PaginatedResponse,
} from '../types';

export const trackingApi = {
    // --- Import Transactions ---
    getImports: async (params?: {
        search?: string;
        status?: string;
        selective_color?: string;
        page?: number;
    }): Promise<PaginatedResponse<ApiImportTransaction>> => {
        const response = await api.get('/api/import-transactions', { params });
        return response.data;
    },

    createImport: async (data: CreateImportPayload): Promise<ApiImportTransaction> => {
        const response = await api.post('/api/import-transactions', data);
        return response.data.data;
    },

    // --- Export Transactions ---
    getExports: async (params?: {
        search?: string;
        status?: string;
        page?: number;
    }): Promise<PaginatedResponse<ApiExportTransaction>> => {
        const response = await api.get('/api/export-transactions', { params });
        return response.data;
    },

    createExport: async (data: CreateExportPayload): Promise<ApiExportTransaction> => {
        const response = await api.post('/api/export-transactions', data);
        return response.data.data;
    },

    // --- Clients (for dropdowns) ---
    getClients: async (type?: 'importer' | 'exporter'): Promise<ApiClient[]> => {
        const response = await api.get('/api/clients', {
            params: type ? { type } : undefined,
        });
        return response.data.data;
    },
};
