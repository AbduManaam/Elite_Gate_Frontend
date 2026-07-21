import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';


export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const isRehydrating = useAuthStore((s) => s.isRehydrating);

    if (isRehydrating) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-brand-dark">
                <div className="flex flex-col items-center gap-sm">
                    <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                    <span className="text-white/80 text-xs font-semibold font-sans mt-2">Restoring session...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};