// Mirrors model.Project. role is only populated when this project came from
// ListForUser (i.e. the project-list endpoint) — omitempty on the Go side.
export interface ProjectRecord {
    id: string;
    name: string;
    slug: string;
    description: string;
    owner_id: string;
    is_active: boolean;
    role?: 'viewer' | 'editor' | 'owner';
    plan: string;
    dashboard_allowed_origins: string[];
    created_at: string;
    updated_at: string;
}

// Mirrors model.ProjectSummary. role is always present here — the handler
// sets it unconditionally from tenant context before returning.
export interface ProjectSummary {
    id: string;
    name: string;
    slug: string;
    description: string;
    is_active: boolean;
    role: 'viewer' | 'editor' | 'owner';
    created_at: string;
    updated_at: string;
    metrics: {
        total_gateways: number;
        total_routes: number;
        enabled_routes: number;
        total_upstreams: number;
        enabled_upstreams: number;
        total_policies: number;
        total_api_keys: number;
        active_api_keys: number;
        total_members: number;
        total_audit_logs_4d: number;
    };
    plan?: string;
    subscription?: { plan: string; status: string };
}
