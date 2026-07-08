export interface RouteRecord {
    id: string;
    project_id: string;
    name: string;
    path: string;
    upstream_id: string | null;
    upstream_url: string;
    methods: string[];
    protocol: string;
    match_type: string;
    enabled: boolean;
    policy_id: string | null;
    auth_required: boolean;
    rate_limit_rpm: number;
    allowed_origins: string[];
    allowed_roles: string[];
    allowed_scopes: string[];
    created_at: string;
    updated_at: string;
}