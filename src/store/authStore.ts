import { create } from 'zustand';
import { tokenStore } from '../lib/api/tokenStore';
import { sessionFlag } from '../lib/api/sessionFlag';

export interface AdminSessionUser {
    readonly username: string;
}

interface AuthState {
    readonly user: AdminSessionUser | null;
    readonly isSuperAdmin: boolean | null; // null = not yet resolved
    readonly isAuthenticated: boolean;
    readonly isRehydrating: boolean;
    readonly setSession: (accessToken: string) => void;
    readonly setSuperAdminStatus: (isSuperAdmin: boolean, username: string) => void;
    readonly clearSession: () => void;
    readonly finishRehydrating: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isSuperAdmin: null,
    isAuthenticated: false,
    isRehydrating: sessionFlag.isSet(),

    setSession: (accessToken) => {
        tokenStore.setAccessToken(accessToken);
        sessionFlag.set();
        // isAuthenticated becomes true after login.
        // isSuperAdmin remains null until /me resolves, so RequireRole treats it as loading.
        set({ isAuthenticated: true, isRehydrating: false });
    },

    setSuperAdminStatus: (isSuperAdmin, username) => {
        set({ user: { username }, isSuperAdmin });
    },

    clearSession: () => {
        tokenStore.clear();
        sessionFlag.clear();
        set({ user: null, isSuperAdmin: null, isAuthenticated: false, isRehydrating: false });
    },

    finishRehydrating: () => {
        set({ isRehydrating: false });
    },
}));
