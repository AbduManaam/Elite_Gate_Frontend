import React, { createContext, useContext, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';


interface AuthGateContextValue {
    readonly isAuthenticated: boolean;
    readonly login: () => void;
    readonly logout: () => void;
}

const AuthGateContext = createContext<AuthGateContextValue | undefined>(undefined);


export const AuthGateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const value = useMemo<AuthGateContextValue>(
        () => ({
            isAuthenticated,
            login: () => setIsAuthenticated(true),
            logout: () => setIsAuthenticated(false),
        }),
        [isAuthenticated]
    );

    return <AuthGateContext.Provider value={value}>{children}</AuthGateContext.Provider>;
};

export const useAuthGate = () => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const clearSession = useAuthStore((s) => s.clearSession);
    return { isAuthenticated, logout: clearSession };
};


export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};