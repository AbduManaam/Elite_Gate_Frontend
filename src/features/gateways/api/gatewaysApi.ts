import { apiClient } from '../../../lib/api/client';

export interface GatewayRecord {
    readonly id: string;
    readonly project_id: string;
    readonly external_id: string;
    readonly endpoint_ip: string;
    readonly gateway_port: string;
    readonly plan: string;
    readonly status: string;
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
    const { data } = await apiClient.get<ListGatewaysResponse>('/v1/gateways');
    return data.gateways ?? data.items ?? [];
}

export async function provisionGateway(projectId: string, plan: string): Promise<GatewayRecord> {
    const { data } = await apiClient.post<{
        readonly gateway_id: string;
        readonly status: string;
        readonly endpoint_ip: string;
        readonly gateway_port: string;
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

