import { apiClient } from '../../../lib/api/client';
import { RouteRecord } from './types';

// Mirrors createRouteRequest in route_handler.go exactly — auth_required,
// rate_limit_rpm, allowed_origins/roles/scopes are NOT sent here because
// they're read-only, joined from the assigned policy. Sending them would
// be silently ignored by the backend and would mislead whoever reads this file.
export interface RouteInput {
    name: string;
    path: string;
    upstream_id: string;
    policy_id?: string | null;
    methods: string[];
    match_type: 'exact' | 'prefix';
    enabled: boolean;
}

export async function createRoute(projectId: string, input: RouteInput): Promise<RouteRecord> {
    const { data } = await apiClient.post<{ route: RouteRecord }>(`/projects/${projectId}/routes`, input);
    return data.route;
}

export async function updateRoute(projectId: string, id: string, input: RouteInput): Promise<RouteRecord> {
    const { data } = await apiClient.put<{ route: RouteRecord }>(`/projects/${projectId}/routes/${id}`, input);
    return data.route;
}

export async function disableRoute(projectId: string, id: string): Promise<void> {
    await apiClient.patch(`/projects/${projectId}/routes/${id}/disable`);
}

// Backend gap: no PATCH /:id/enable yet (see Go diff below).
// Until that exists, "enable" has to resend the full route via PUT,
// which is why this function requires the full current record, not just an id.
export async function enableRoute(projectId: string, current: RouteRecord): Promise<RouteRecord> {
    return updateRoute(projectId, current.id, {
        name: current.name,
        path: current.path,
        upstream_id: current.upstream_id ?? '',
        policy_id: current.policy_id,
        methods: current.methods,
        match_type: current.match_type as 'exact' | 'prefix',
        enabled: true,
    });
}

export async function assignPolicy(projectId: string, routeId: string, policyId: string): Promise<void> {
    await apiClient.post(`/projects/${projectId}/routes/${routeId}/policy`, { policy_id: policyId });
}

export async function removePolicy(projectId: string, routeId: string): Promise<void> {
    await apiClient.delete(`/projects/${projectId}/routes/${routeId}/policy`);
}