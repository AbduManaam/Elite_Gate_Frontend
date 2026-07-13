import { useQuery } from '@tanstack/react-query';
import { listAuditLogs, AuditLogFilters } from '../api/auditLogsApi';

export function useAuditLogsQuery(projectId: string | null, filters: AuditLogFilters) {
  return useQuery({
    queryKey: ['auditLogs', projectId, filters],
    queryFn: () => listAuditLogs(projectId as string, filters),
    enabled: !!projectId,
    staleTime: 30_000,
  });
}
