import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProjectSummary } from '../api/projectsApi';
import { useActiveProject } from './useActiveProject';

export function useProjectSummaryQuery(projectId: string | undefined) {
    const { setActiveProjectRole } = useActiveProject();

    const query = useQuery({
        queryKey: ['project-summary', projectId],
        queryFn: () => getProjectSummary(projectId as string),
        enabled: !!projectId,
        staleTime: 30_000,
    });

    useEffect(() => {
        if (query.data) {
            setActiveProjectRole((query.data.role as any) ?? null);
        }
    }, [query.data, setActiveProjectRole]);

    return query;
}
