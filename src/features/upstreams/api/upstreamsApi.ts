import { apiClient } from '../../../lib/api/client';
import { UpstreamRecord, UpstreamTargetRecord } from './types';

export type { UpstreamRecord, UpstreamTargetRecord } from './types';

export interface UpstreamInput {
    name: string;
    target_url: string;
    protocol: 'http' | 'grpc';
    health_path?: string;
    enabled: boolean;
}

interface ListUpstreamsResponse {
    upstreams?: UpstreamRecord[];
    items?: UpstreamRecord[];
    pagination?: { page: number; limit: number; total: number; total_pages: number };
}

export async function listUpstreams(projectId: string): Promise<UpstreamRecord[]> {
    const { data } = await apiClient.get<ListUpstreamsResponse | UpstreamRecord[]>(`/v1/projects/${projectId}/upstreams`);
    if (Array.isArray(data)) return data;
    return data.upstreams ?? data.items ?? [];
}

export async function createUpstream(projectId: string, input: UpstreamInput): Promise<UpstreamRecord> {
    const { data } = await apiClient.post<{ upstream: UpstreamRecord }>(`/v1/projects/${projectId}/upstreams`, input);
    return data.upstream;
}

export async function updateUpstream(projectId: string, id: string, input: UpstreamInput): Promise<UpstreamRecord> {
    const { data } = await apiClient.put<{ upstream: UpstreamRecord }>(
        `/v1/projects/${projectId}/upstreams/${id}`,
        input
    );
    return data.upstream;
}

export async function disableUpstream(projectId: string, id: string): Promise<void> {
    await apiClient.patch(`/v1/projects/${projectId}/upstreams/${id}/disable`);
}

export async function deleteUpstream(projectId: string, id: string): Promise<void> {
    await apiClient.delete(`/v1/projects/${projectId}/upstreams/${id}`);
}

export interface UpstreamHealthResult {
    status: 'healthy' | 'unhealthy' | 'unsupported';
    status_code?: number;
    response_time?: string;
    detail?: string;
    error?: string;
}

export async function checkUpstreamHealth(projectId: string, id: string): Promise<UpstreamHealthResult> {
    const { data } = await apiClient.get<UpstreamHealthResult>(`/v1/projects/${projectId}/upstreams/${id}/health`);
    return data;
}

export async function listUpstreamTargets(projectId: string, upstreamId: string): Promise<UpstreamTargetRecord[]> {
    const { data } = await apiClient.get<{ targets: UpstreamTargetRecord[] }>(
        `/v1/projects/${projectId}/upstreams/${upstreamId}/targets`
    );
    return data.targets ?? [];
}

export interface UpstreamTargetInput {
    target_url: string;
    weight?: number;
    enabled?: boolean;
}

export async function addUpstreamTarget(
    projectId: string,
    upstreamId: string,
    input: UpstreamTargetInput
): Promise<UpstreamTargetRecord> {
    const { data } = await apiClient.post<{ target: UpstreamTargetRecord }>(
        `/v1/projects/${projectId}/upstreams/${upstreamId}/targets`,
        input
    );
    return data.target;
}

export async function removeUpstreamTarget(
    projectId: string,
    upstreamId: string,
    targetId: string
): Promise<void> {
    await apiClient.delete(`/v1/projects/${projectId}/upstreams/${upstreamId}/targets/${targetId}`);
}