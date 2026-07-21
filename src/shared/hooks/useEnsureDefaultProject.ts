import { useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useCreateProjectMutation } from './useProjects';
import type { Project } from '../api/projectsApi';

export function useEnsureDefaultProject(projects: readonly Project[], isLoading: boolean): void {
  const user = useAuthStore((s) => s.user);
  const createProject = useCreateProjectMutation();
  const hasAttempted = useRef(false);
  const slugSuffix = useRef<string | null>(null);

  useEffect(() => {
    if (isLoading || projects.length > 0 || hasAttempted.current) return;
    hasAttempted.current = true;
    if (!slugSuffix.current) {
      slugSuffix.current = Math.random().toString(36).substring(2, 6);
    }

    const normalizedUsername = user?.username?.replace(/_admin$/, '').replace(/_/g, ' ').trim();
    const slugBase = user?.username
      ? user.username.replace(/_admin$/, '').replace(/_/g, '-')
      : 'serverless';

    createProject.mutate({
      name: normalizedUsername ? `${normalizedUsername} default` : 'Serverless Default',
      slug: `${slugBase}-default-${slugSuffix.current}`,
      description: 'Default workspace',
      plan: '',
    });
  }, [isLoading, projects.length, user, createProject]);
}
