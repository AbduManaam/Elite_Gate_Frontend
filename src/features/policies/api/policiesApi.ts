import { apiClient } from '../../../lib/api/client';
import { PolicyRecord } from './types';

export type { PolicyRecord } from './types';

// Mirrors policyRequest in policy_handler.go exactly.
export interface PolicyInput {
    name: string;
    auth_required: boolean;
    rate_limit_rpm: number;
    allowed_origins: string[];
    allowed_roles: string[];
    allowed_scopes: string[];
    ip_allowlist: string[];
    ip_blocklist: string[];
}

interface ListPoliciesResponse {
    items: PolicyRecord[];
    pagination: { page: number; limit: number; total: number; total_pages: number };
}

export async function listPolicies(projectId: string): Promise<PolicyRecord[]> {
    const { data } = await apiClient.get<ListPoliciesResponse>(`/v1/projects/${projectId}/policies`);
    return data.items ?? [];
}

export async function createPolicy(projectId: string, input: PolicyInput): Promise<PolicyRecord> {
    const { data } = await apiClient.post<{ policy: PolicyRecord }>(`/v1/projects/${projectId}/policies`, input);
    return data.policy;
}

export async function updatePolicy(projectId: string, id: string, input: PolicyInput): Promise<PolicyRecord> {
    const { data } = await apiClient.put<{ policy: PolicyRecord }>(`/v1/projects/${projectId}/policies/${id}`, input);
    return data.policy;
}

// RBAC('owner') gates this on the backend — editors/viewers get a 403.
// Mirror that in the UI with can('owner') before showing the delete button.
export async function deletePolicy(projectId: string, id: string): Promise<void> {
    await apiClient.delete(`/v1/projects/${projectId}/policies/${id}`);
}