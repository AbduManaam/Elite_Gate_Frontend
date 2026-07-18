import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useRoles } from '../../shared/hooks/useRoles';
import { WorkspaceStatusScreen } from '../../shared/components/WorkspaceStatusScreen';

interface RequireRoleProps {
  children: React.ReactNode;
  superAdminOnly?: boolean;
  minProjectRole?: 'viewer' | 'editor' | 'owner';
}

export function RequireRole({ children, superAdminOnly, minProjectRole }: RequireRoleProps) {
  const isSuperAdmin = useAuthStore((s) => s.isSuperAdmin);
  const { can } = useRoles();

  if (isSuperAdmin === null) return <WorkspaceStatusScreen message="Resolving Session…" />;
  if (superAdminOnly && !isSuperAdmin) return <Navigate to="/unauthorized" replace />;
  if (minProjectRole && !isSuperAdmin && !can(minProjectRole)) return <Navigate to="/unauthorized" replace />;

  return <>{children}</>;
}
