import React, { createContext, useContext, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';

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

export const useAuthGate = (): AuthGateContextValue => {
    const ctx = useContext(AuthGateContext);
    if (!ctx) {
        throw new Error('useAuthGate must be used within an AuthGateProvider');
    }
    return ctx;
};

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuthGate();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};