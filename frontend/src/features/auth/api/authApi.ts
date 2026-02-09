import axios from 'axios';
import type { AuthResponse, LoginCredentials, User } from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const authApi = {
    // Login user
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await axios.post<AuthResponse>(
            `${API_URL}/auth/login`,
            credentials
        );
        return response.data;
    },

    // Logout user
    async logout(): Promise<void> {
        await axios.post(`${API_URL}/auth/logout`);
    },

    // Get current user
    async getCurrentUser(): Promise<User> {
        const response = await axios.get<User>(`${API_URL}/auth/me`);
        return response.data;
    },

    // Refresh token
    async refreshToken(refreshToken: string): Promise<AuthResponse> {
        const response = await axios.post<AuthResponse>(
            `${API_URL}/auth/refresh`,
            { refreshToken }
        );
        return response.data;
    },
};
