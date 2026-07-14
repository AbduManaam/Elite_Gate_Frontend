import { create } from 'zustand';
import { tokenStore } from '../lib/api/tokenStore';

export interface AdminSessionUser {
    readonly username: string;
}

interface TokenPair {
    readonly accessToken: string;
    readonly refreshToken: string;
}

interface AuthState {
    readonly user: AdminSessionUser | null;
    readonly isSuperAdmin: boolean | null; // null = not yet resolved
    readonly isAuthenticated: boolean;
    readonly isRehydrating: boolean;
    readonly setSession: (tokens: TokenPair) => void;
    readonly setSuperAdminStatus: (isSuperAdmin: boolean, username: string) => void;
    readonly clearSession: () => void;
    readonly finishRehydrating: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isSuperAdmin: null,
    isAuthenticated: false,
    isRehydrating: !!tokenStore.getRefreshToken(),

    setSession: ({ accessToken, refreshToken }) => {
        tokenStore.setTokens(accessToken, refreshToken);
        // isAuthenticated becomes true after login.
        // isSuperAdmin remains null until /me resolves, so RequireRole treats it as loading.
        set({ isAuthenticated: true, isRehydrating: false });
    },

    setSuperAdminStatus: (isSuperAdmin, username) => {
        set({ user: { username }, isSuperAdmin });
    },

    clearSession: () => {
        tokenStore.clear();
        set({ user: null, isSuperAdmin: null, isAuthenticated: false, isRehydrating: false });
    },

    finishRehydrating: () => {
        set({ isRehydrating: false });
    },
}));
