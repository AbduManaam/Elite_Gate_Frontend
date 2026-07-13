import { apiClient } from '../../../lib/api/client';

export interface AuditLog {
  id: string;
  project_id: string;
  admin_user_id: string;
  actor: string;
  action: string;
  entity_type: string;
  entity_id: string;
  entity_label: string;
  changes: string;
  ip_address: string;
  status: string;
  created_at: string;
}

export interface AuditLogFilters {
  actor?: string;
  action?: string;
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export interface AuditLogPage {
  audit_logs: AuditLog[];
  total: number;
  offset: number;
  limit: number;
}

export async function listAuditLogs(projectId: string, filters: AuditLogFilters = {}): Promise<AuditLogPage> {
  const { data } = await apiClient.get<AuditLogPage>(`/v1/projects/${projectId}/audit-logs`, {
    params: {
      actor: filters.actor || undefined,
      action: filters.action || undefined,
      date_from: filters.dateFrom || undefined,
      date_to: filters.dateTo || undefined,
      limit: filters.limit ?? 20,
      offset: filters.offset ?? 0,
    },
  });
  return data;
}
