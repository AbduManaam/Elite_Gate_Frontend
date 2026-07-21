import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { apiClient } from './client';
import { tokenStore } from './tokenStore';
import { buildApiUrl } from '../../shared/lib/apiUrl';

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

interface RefreshResponseBody {
    access_token: string;
    expires_in: number;
    token_type: string;
}

let onSessionExpired: (() => void) | null = null;

export const registerSessionExpiredHandler = (handler: () => void): void => {
    onSessionExpired = handler;
};

apiClient.interceptors.request.use((config) => {
    const token = tokenStore.getAccessToken();
    if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
    try {
        const { data } = await axios.post<RefreshResponseBody>(
            buildApiUrl('/refresh'),
            {},
            { withCredentials: true }
        );
        tokenStore.setAccessToken(data.access_token);
        return data.access_token;
    } catch {
        return null;
    }
}

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetriableRequestConfig | undefined;
        const isUnauthorized = error.response?.status === 401;
        const alreadyRetried = originalRequest?._retry === true;
        const isLoginRequest = originalRequest?.url?.endsWith('/login') === true;

        if (!isUnauthorized || !originalRequest || alreadyRetried || isLoginRequest) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (!refreshPromise) {
            refreshPromise = refreshAccessToken().finally(() => {
                refreshPromise = null;
            });
        }

        const newAccessToken = await refreshPromise;

        if (!newAccessToken) {
            tokenStore.clear();
            onSessionExpired?.();
            return Promise.reject(error);
        }

        originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
        return apiClient(originalRequest);
    }
);