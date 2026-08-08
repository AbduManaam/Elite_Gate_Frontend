import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useActiveProject } from '../../shared/hooks/useActiveProject';
import { WorkspaceStatusScreen } from '../../shared/components/WorkspaceStatusScreen';

interface RequireProjectOwnerProps {
  children: React.ReactNode;
}

export function RequireProjectOwner({ children }: RequireProjectOwnerProps) {
  const { projectId: routeProjectId } = useParams<{ projectId: string }>();
  const { projectId: activeProjectId, projectRole } = useActiveProject();

  if (
    !routeProjectId ||
    !activeProjectId ||
    routeProjectId !== activeProjectId ||
    !projectRole
  ) {
    return <WorkspaceStatusScreen message="Resolving Project…" />;
  }

  if (projectRole !== 'owner') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
