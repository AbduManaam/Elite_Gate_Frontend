import { apiClient } from '../../../lib/api/client';

export interface GatewayRecord {
    readonly id: string;
    readonly project_id: string;
    readonly external_id: string;
    readonly endpoint_ip: string;
    readonly gateway_port: string;
    readonly public_host: string;
    readonly public_port: string;
    readonly plan: string;
    readonly status: string;
    readonly created_at?: string;
}

export interface ListGatewaysResponse {
    readonly items?: GatewayRecord[];
    readonly gateways?: GatewayRecord[];
    readonly pagination?: {
        readonly page: number;
        readonly limit: number;
        readonly total: number;
        readonly total_pages: number;
    };
}

export async function listProjectGateways(projectId: string): Promise<GatewayRecord[]> {
    const { data } = await apiClient.get<ListGatewaysResponse>(`/v1/projects/${projectId}/gateways`);
    return data.gateways ?? data.items ?? [];
}

export async function listAllGateways(): Promise<GatewayRecord[]> {
    const { data } = await apiClient.get<ListGatewaysResponse>('/v1/gateways', { params: { limit: 100 } });
    return data.gateways ?? data.items ?? [];
}

export async function provisionGateway(projectId: string, plan: string): Promise<GatewayRecord> {
    const { data } = await apiClient.post<{
        readonly gateway_id: string;
        readonly status: string;
        readonly endpoint_ip: string;
        readonly gateway_port: string;
        readonly public_host: string;
        readonly public_port: string;
    }>(`/v1/projects/${projectId}/gateways`, {
        project_id: projectId,
        plan,
    });
    return {
        id: data.gateway_id,
        project_id: projectId,
        external_id: data.gateway_id,
        endpoint_ip: data.endpoint_ip,
        gateway_port: data.gateway_port,
        public_host: data.public_host,
        public_port: data.public_port,
        plan,
        status: data.status,
    };
}

export async function decommissionGateway(projectId: string, gatewayId: string): Promise<void> {
    await apiClient.delete(`/v1/projects/${projectId}/gateways/${gatewayId}`);
}

export async function reloadConfig(projectId: string): Promise<void> {
    await apiClient.post(`/v1/projects/${projectId}/reload`);
}
export async function restartGateway(gatewayId: string): Promise<void> {
    await apiClient.post(`/v1/platform/gateways/${gatewayId}/restart`);
}

export async function reloadAllGateways(): Promise<void> {
    await apiClient.post('/v1/reload');
}

export async function forceDecommissionGateway(gatewayId: string): Promise<void> {
    await apiClient.post(`/v1/platform/gateways/${gatewayId}/force-decommission`);
}

