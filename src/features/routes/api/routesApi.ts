import { apiClient } from '../../../lib/api/client';
import { RouteRecord } from './route.types';


export type { RouteRecord } from './route.types';

export interface RouteInput {
    name: string;
    path: string;
    upstream_id: string;
    policy_id?: string | null;
    methods: string[];
    match_type: 'exact' | 'prefix';
    enabled: boolean;
}

interface ListRoutesResponse {
    routes?: RouteRecord[];
    items?: RouteRecord[];
    pagination?: { page: number; limit: number; total: number; total_pages: number };
}

export async function listRoutes(projectId: string): Promise<RouteRecord[]> {
    const { data } = await apiClient.get<ListRoutesResponse | RouteRecord[]>(`/v1/projects/${projectId}/routes`);
    if (Array.isArray(data)) return data;
    return data.routes ?? data.items ?? [];
}

export async function createRoute(projectId: string, input: RouteInput): Promise<RouteRecord> {
    const { data } = await apiClient.post<{ route: RouteRecord }>(`/v1/projects/${projectId}/routes`, input);
    return data.route;
}

export async function updateRoute(projectId: string, id: string, input: RouteInput): Promise<RouteRecord> {
    const { data } = await apiClient.put<{ route: RouteRecord }>(`/v1/projects/${projectId}/routes/${id}`, input);
    return data.route;
}

export async function deleteRoute(projectId: string, id: string): Promise<void> {
    await apiClient.delete(`/v1/projects/${projectId}/routes/${id}`);
}

export async function disableRoute(projectId: string, id: string): Promise<void> {
    await apiClient.patch(`/v1/projects/${projectId}/routes/${id}/disable`);
}

export async function enableRoute(projectId: string, id: string): Promise<void> {
    await apiClient.patch(`/v1/projects/${projectId}/routes/${id}/enable`);
}

export async function assignPolicy(projectId: string, routeId: string, policyId: string): Promise<void> {
    await apiClient.post(`/v1/projects/${projectId}/routes/${routeId}/policy`, { policy_id: policyId });
}

export async function removePolicy(projectId: string, routeId: string): Promise<void> {
    await apiClient.delete(`/v1/projects/${projectId}/routes/${routeId}/policy`);
}