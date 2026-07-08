import { create } from 'zustand';
import { tokenStore } from '../lib/api/tokenStore';

export interface AdminSessionUser {
    readonly username: string;
    readonly role: string;
}

interface TokenPair {
    readonly accessToken: string;
    readonly refreshToken: string;
}

interface AuthState {
    readonly user: AdminSessionUser | null;
    readonly isAuthenticated: boolean;
    readonly isRehydrating: boolean;
    readonly setSession: (tokens: TokenPair) => void;
    readonly clearSession: () => void;
    readonly finishRehydrating: () => void;
}

function decodeJwtPayload(token: string): { username: string; role: string } | null {
    try {
        const payload = token.split('.')[1];
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(
            atob(base64).split('').map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
        );
        const claims = JSON.parse(json) as { username?: string; role?: string; exp?: number };
        if (!claims.username || !claims.role) return null;
        if (claims.exp && claims.exp * 1000 < Date.now()) return null;
        return { username: claims.username, role: claims.role };
    } catch {
        return null;
    }
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    // Start as rehydrating if there is a refresh token in the cookie
    isRehydrating: !!tokenStore.getRefreshToken(),
    setSession: ({ accessToken, refreshToken }) => {
        tokenStore.setTokens(accessToken, refreshToken);
        const claims = decodeJwtPayload(accessToken);
        set({ user: claims, isAuthenticated: true, isRehydrating: false });
    },
    clearSession: () => {
        tokenStore.clear();
        set({ user: null, isAuthenticated: false, isRehydrating: false });
    },
    finishRehydrating: () => {
        set({ isRehydrating: false });
    },
}));