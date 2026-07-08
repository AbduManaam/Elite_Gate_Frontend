import { apiClient } from '../../../lib/api/client';

export interface ApiKeyRecord {
    readonly id: string;
    readonly project_id: string;
    readonly name: string;
    readonly status: string;
    readonly roles: string[];
    readonly scopes: string[];
    readonly expires_at?: string;
    readonly created_at: string;
    readonly updated_at: string;
    readonly api_key?: string;
    readonly raw_key?: string;
}

export interface ListApiKeysResponse {
    readonly keys?: ApiKeyRecord[];
    readonly api_keys?: ApiKeyRecord[];
    readonly items?: ApiKeyRecord[];
    readonly pagination?: {
        readonly page: number;
        readonly limit: number;
        readonly total: number;
        readonly total_pages: number;
    };
}

export interface CreateApiKeyInput {
    readonly name: string;
    readonly expires_at?: string | null;
    readonly roles: string[];
    readonly scopes: string[];
}

export async function listApiKeys(projectId: string): Promise<ApiKeyRecord[]> {
    const { data } = await apiClient.get<ListApiKeysResponse | ApiKeyRecord[]>(`/v1/projects/${projectId}/keys`);
    if (Array.isArray(data)) return data;
    return data.keys ?? data.api_keys ?? data.items ?? [];
}

export async function createApiKey(projectId: string, input: CreateApiKeyInput): Promise<ApiKeyRecord> {
    const { data } = await apiClient.post<ApiKeyRecord>(`/v1/projects/${projectId}/keys`, input);
    return data;
}

export async function rotateApiKey(projectId: string, id: string): Promise<ApiKeyRecord> {
    const { data } = await apiClient.post<ApiKeyRecord>(`/v1/projects/${projectId}/keys/${id}/rotate`);
    return data;
}

export async function revokeApiKey(projectId: string, id: string): Promise<void> {
    await apiClient.delete(`/v1/projects/${projectId}/keys/${id}`);
}
