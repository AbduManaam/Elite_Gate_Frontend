import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { apiClient } from './client';
import { tokenStore } from './tokenStore';

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

interface RefreshResponseBody {
    access_token: string;
    refresh_token: string;
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
    const refreshToken = tokenStore.getRefreshToken();
    if (!refreshToken) return null;

    try {
        const { data } = await axios.post<RefreshResponseBody>(
            `${import.meta.env.VITE_API_BASE_URL}/refresh`,
            { refresh_token: refreshToken }
        );
        tokenStore.setTokens(data.access_token, data.refresh_token);
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

        if (!isUnauthorized || !originalRequest || alreadyRetried) {
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