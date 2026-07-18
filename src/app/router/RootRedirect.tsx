import React from 'react';
import { Navigate } from 'react-router-dom';
import { useProjectsQuery } from '../../shared/hooks/useProjects';
import { useEnsureDefaultProject } from '../../shared/hooks/useEnsureDefaultProject';
import { lastProjectStorage } from '../../shared/lib/projectStorage';
import { projectPath } from '../../shared/lib/routePaths';
import { WorkspaceStatusScreen } from '../../shared/components/WorkspaceStatusScreen';

export const RootRedirect: React.FC = () => {
  const { data: projectsData, isLoading } = useProjectsQuery();
  const projects = projectsData?.items ?? [];

  useEnsureDefaultProject(projects, isLoading);

  if (isLoading) return <WorkspaceStatusScreen message="Redirecting…" />;
  if (projects.length === 0) return <WorkspaceStatusScreen message="Setting up default workspace…" />;

  const target = projects.find((p) => p.id === lastProjectStorage.get()) ?? projects[0];
  return <Navigate to={projectPath(target.id)} replace />;
};

export default RootRedirect;
