export interface UpstreamTargetRecord {
    id: string;
    upstream_id: string;
    target_url: string;
    weight: number;
    enabled: boolean;
    created_at: string;
    updated_at: string;
}

export interface UpstreamRecord {
    id: string;
    project_id: string;
    name: string;
    target_url: string;
    protocol: 'http' | 'grpc';
    health_path: string;
    enabled: boolean;
    lb_strategy: string;
    targets?: UpstreamTargetRecord[];
    created_at: string;
    updated_at: string;
}