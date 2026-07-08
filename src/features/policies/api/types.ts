// Mirrors model.Policy in internal/model/policy.go.
export interface PolicyRecord {
    id: string;
    project_id: string;
    name: string;
    auth_required: boolean;
    rate_limit_rpm: number;
    allowed_origins: string[];
    allowed_roles: string[];
    allowed_scopes: string[];
    created_at: string;
    updated_at: string;
}