// Auth Types
export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
