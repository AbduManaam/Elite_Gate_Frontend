import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

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