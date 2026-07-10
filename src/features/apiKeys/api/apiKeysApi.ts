import { apiClient } from '../../../lib/api/client';
import { ApiKeyRecord, CreateApiKeyInput, ListApiKeysResponse } from '../types/apiKey';

export async function listApiKeys(
    projectId: string,
    page: number = 1,
    limit: number = 10,
    search?: string
): Promise<ListApiKeysResponse> {
    const { data } = await apiClient.get<ListApiKeysResponse | ApiKeyRecord[]>(
        `/v1/projects/${projectId}/keys`,
        {
            params: { page, limit, search }
        }
    );

    if (Array.isArray(data)) {
        return {
            keys: data,
            pagination: {
                page,
                limit,
                total: data.length,
                total_pages: Math.ceil(data.length / limit) || 1
            }
        };
    }

    const keysList = data.keys ?? data.api_keys ?? data.items ?? [];
    return {
        keys: keysList,
        pagination: data.pagination ?? {
            page,
            limit,
            total: keysList.length,
            total_pages: Math.ceil(keysList.length / limit) || 1
        }
    };
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
