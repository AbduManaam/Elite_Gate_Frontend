import { useQuery } from '@tanstack/react-query';
import { listAuditLogs } from '../api/auditLogsApi';

export function useAuditLogsQuery(projectId: string | null) {
    return useQuery({
        queryKey: projectId ? ['projects', projectId, 'auditLogs'] : ['auditLogs', 'idle'],
        queryFn: () => listAuditLogs(projectId as string),
        enabled: !!projectId,
        staleTime: 30_000,
    });
}
