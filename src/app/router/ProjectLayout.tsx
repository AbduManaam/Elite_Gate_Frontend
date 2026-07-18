import React, { useEffect } from 'react';
import { useParams, Outlet, Navigate } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import { useProjectsQuery } from '../../shared/hooks/useProjects';
import { resolveProjectRole } from '../../shared/lib/projectRole';
import { WorkspaceStatusScreen } from '../../shared/components/WorkspaceStatusScreen';

export const ProjectLayout: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const activeProjectId = useUIStore((s) => s.activeProjectId);
  const setActiveProjectId = useUIStore((s) => s.setActiveProjectId);
  const setActiveProjectRole = useUIStore((s) => s.setActiveProjectRole);
  const { data: projectsData, isLoading } = useProjectsQuery();

  const projects = projectsData?.items ?? [];
  const matched = projectId ? projects.find((p) => p.id === projectId) : undefined;

  useEffect(() => {
    if (!projectId || projects.length === 0 || !matched) return;
    if (projectId !== activeProjectId) setActiveProjectId(projectId);
    setActiveProjectRole(resolveProjectRole(matched));
  }, [projectId, matched, projects.length, activeProjectId, setActiveProjectId, setActiveProjectRole]);

  if (isLoading) return <WorkspaceStatusScreen message="Loading Workspace…" />;

  // Project list loaded but this id isn't in it (deleted / no access) —
  // self-heal by sending the user back through RootRedirect.
  if (projectId && projects.length > 0 && !matched) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProjectLayout;
