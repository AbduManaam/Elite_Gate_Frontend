import { apiClient } from '../../../lib/api/client';
import { AuditLogData } from '../../../shared/mocks/logsMock';

export async function listAuditLogs(projectId: string): Promise<AuditLogData[]> {
    const { data } = await apiClient.get<AuditLogData[] | { items: AuditLogData[] } | { audit: AuditLogData[] }>(`/v1/projects/${projectId}/audit`);
    if (Array.isArray(data)) return data;
    if (data && 'items' in data && Array.isArray(data.items)) return data.items;
    if (data && 'audit' in data && Array.isArray(data.audit)) return data.audit;
    return [];
}
