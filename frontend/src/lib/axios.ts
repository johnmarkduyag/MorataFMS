import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    withXSRFToken: true
});

// Global 401 interceptor: redirect to login on session expiry
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Don't redirect if already on auth routes (prevents loops)
            const url = error.config?.url || '';
            const isAuthRoute = url.includes('/auth/') || url.includes('/sanctum/');

            if (!isAuthRoute) {
                localStorage.removeItem('user');
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
