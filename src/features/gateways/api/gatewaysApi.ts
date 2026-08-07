import { apiClient } from '../../../lib/api/client';

export type GatewayStatus =
  | 'provisioning'
  | 'active'
  | 'running'
  | 'stopped'
  | 'failed'
  | 'decommissioned';

export interface GatewayRecord {
    readonly id: string;
    readonly project_id: string;
    readonly external_id: string;
    readonly endpoint_ip: string;
    readonly gateway_port: string;
    readonly public_host: string;
    readonly public_port: string | number;
    readonly plan: string;
    readonly status: GatewayStatus;
    readonly created_at?: string;
    readonly public_endpoint?: string;
    readonly protocol?: string;
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

export function mapGatewayRecord(raw: any): GatewayRecord {
    if (!raw) return raw;
    const port = raw.public_port ?? raw.gateway_port ?? '';
    return {
        id: raw.id ?? raw.gateway_id ?? '',
        project_id: raw.project_id ?? '',
        external_id: raw.external_id ?? raw.gateway_id ?? '',
        endpoint_ip: raw.endpoint_ip ?? '',
        gateway_port: String(raw.gateway_port ?? ''),
        public_host: raw.public_host ?? '',
        public_port: port,
        plan: raw.plan ?? '',
        status: (raw.status ?? 'provisioning') as GatewayStatus,
        created_at: raw.created_at,
        public_endpoint: raw.public_endpoint,
        protocol: raw.protocol,
    };
}

export async function listProjectGateways(projectId: string): Promise<GatewayRecord[]> {
    const { data } = await apiClient.get<ListGatewaysResponse>(`/v1/projects/${projectId}/gateways`);
    const rawList = data.gateways ?? data.items ?? [];
    return rawList.map(mapGatewayRecord);
}

export async function listAllGateways(): Promise<GatewayRecord[]> {
    const { data } = await apiClient.get<ListGatewaysResponse>('/v1/gateways', { params: { limit: 100 } });
    const rawList = data.gateways ?? data.items ?? [];
    return rawList.map(mapGatewayRecord);
}

export async function provisionGateway(projectId: string, plan: string): Promise<GatewayRecord> {
    const { data } = await apiClient.post<any>(`/v1/projects/${projectId}/gateways`, {
        project_id: projectId,
        plan,
    });
    return mapGatewayRecord(data);
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

