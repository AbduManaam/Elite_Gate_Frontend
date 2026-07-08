import { useQuery } from '@tanstack/react-query';
import { listProjects, getProjectSummary } from '../api/projectsApi';
import { useActiveProject } from '../../../shared/hooks/useActiveProject';
import type { ProjectRole } from '../../../store/uiStore';

export function useProjectsQuery() {
    return useQuery({
        queryKey: ['projects'],
        queryFn: listProjects,
        staleTime: 30_000,
    });
}

// Call this from whatever selects a project (sidebar dropdown, project
// list row click, etc). Sets id + role together in one store update so
// there's never a render where id is set but role is still the previous
// project's — setActiveProjectId already nulls role, this just refills it
// in the same tick.
export function useSelectProject() {
    const { setActiveProjectId, setActiveProjectRole } = useActiveProject();

    return (projectId: string, role: ProjectRole) => {
        setActiveProjectId(projectId);
        setActiveProjectRole(role);
    };
}

// Fallback for direct navigation / page refresh, where activeProjectId is
// already known (e.g. from a URL param) but role hasn't been set yet.
export function useProjectSummaryQuery(projectId: string | null) {
    const { setActiveProjectRole } = useActiveProject();

    return useQuery({
        queryKey: projectId ? ['projects', projectId, 'summary'] : ['projects', 'summary', 'idle'],
        queryFn: async () => {
            const summary = await getProjectSummary(projectId as string);
            setActiveProjectRole(summary.role);
            return summary;
        },
        enabled: !!projectId,
        staleTime: 30_000,
    });
}
