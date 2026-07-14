import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useRoles } from '../../shared/hooks/useRoles';

interface RequireRoleProps {
    children: React.ReactNode;
    superAdminOnly?: boolean;
    minProjectRole?: 'viewer' | 'editor' | 'owner';
}

export function RequireRole({ children, superAdminOnly, minProjectRole }: RequireRoleProps) {
    const isSuperAdmin = useAuthStore((s) => s.isSuperAdmin);
    const { can } = useRoles();

    // isSuperAdmin === null means /me hasn't resolved yet — don't redirect
    // prematurely on a hard refresh; render nothing until it's known.
    if (isSuperAdmin === null) {
        return (
            <div className="flex h-screen items-center justify-center bg-background text-on-background">
                <div className="flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined text-[36px] animate-spin text-[#587c94]">progress_activity</span>
                    <span className="text-xs font-semibold uppercase tracking-widest text-outline">Resolving Session…</span>
                </div>
            </div>
        );
    }

    if (superAdminOnly && !isSuperAdmin) {
        return <Navigate to="/unauthorized" replace />;
    }
    if (minProjectRole && !isSuperAdmin && !can(minProjectRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
}
