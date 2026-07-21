import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProjectSummary } from '../api/projectsApi';
import { useActiveProject } from './useActiveProject';
import { useProjectsQuery } from './useProjects';

export function useProjectSummaryQuery(projectId?: string | null) {
    const { projectId: activeProjectId, setActiveProjectRole, setActiveProjectId } = useActiveProject();
    const { data: projectsData } = useProjectsQuery();
    const targetProjectId = projectId ?? activeProjectId;

    const query = useQuery({
        queryKey: ['project-summary', targetProjectId],
        queryFn: () => getProjectSummary(targetProjectId as string),
        enabled: !!targetProjectId,
        staleTime: 30_000,
        retry: false,
    });

    useEffect(() => {
        if (query.data) {
            setActiveProjectRole(query.data.role ?? null);
        }
    }, [query.data, setActiveProjectRole]);

    // Self-heal: If targetProjectId is inaccessible (e.g. 403 Forbidden) or not in the user's project list,
    // automatically switch activeProjectId to the first accessible project.
    useEffect(() => {
        const projects = projectsData?.items ?? [];
        if (projects.length > 0 && targetProjectId) {
            const hasAccess = projects.some((p) => p.id === targetProjectId);
            if (!hasAccess || query.isError) {
                const fallback = projects[0]?.id ?? null;
                if (fallback !== activeProjectId) {
                    setActiveProjectId(fallback);
                }
            }
        }
    }, [query.isError, targetProjectId, activeProjectId, projectsData, setActiveProjectId]);

    return query;
}

