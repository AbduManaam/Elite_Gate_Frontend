import { apiClient } from '../../lib/api/client';

/** Matches GET /v1/projects item shape from the Go backend. */
export interface Project {
    readonly id: string;
    readonly name: string;
    readonly slug: string;
    readonly description: string;
    readonly owner_id: string;
    readonly is_active: boolean;
    readonly plan: string;
    readonly dashboard_allowed_origins: string[] | null;
    /** Per-project membership role — present when the list endpoint includes it. */
    readonly role?: string;
    readonly created_at: string;
    readonly updated_at: string;
}

export interface ProjectSummary {
    readonly id: string;
    readonly name: string;
    readonly slug: string;
    readonly description: string;
    readonly is_active: boolean;
    readonly role?: string;
    readonly created_at: string;
    readonly updated_at: string;
    readonly metrics?: {
        readonly total_gateways: number;
        readonly total_routes: number;
        readonly enabled_routes: number;
        readonly total_upstreams: number;
        readonly enabled_upstreams: number;
        readonly total_policies: number;
        readonly total_api_keys: number;
        readonly active_api_keys: number;
        readonly total_members: number;
        readonly total_audit_logs_4d: number;
    };
    readonly plan?: string;
    readonly subscription?: {
        readonly plan: string;
        readonly status: string;
    };
}

/**
 * GET /v1/projects
 * Backend returns: { "projects": Project[] }
 * Normalised to { items } for app-wide consistency.
 */
export async function listProjects(): Promise<{ items: Project[] }> {
    const { data } = await apiClient.get<{ projects?: Project[]; items?: Project[] } | Project[]>('/v1/projects');
    if (Array.isArray(data)) return { items: data };
    if ('projects' in data && Array.isArray(data.projects)) return { items: data.projects };
    if ('items' in data && Array.isArray(data.items)) return { items: data.items };
    return { items: [] };
}

export async function getProjectSummary(projectId: string): Promise<ProjectSummary> {
    const { data } = await apiClient.get<ProjectSummary>(`/v1/projects/${projectId}/summary`);
    return data;
}

export interface CreateProjectInput {
    readonly name: string;
    readonly slug: string;
    readonly description: string;
    readonly plan: string;
}

/**
 * POST /v1/projects
 * Backend returns the created Project directly or wrapped in { project: ... }.
 */
export async function createProject(input: CreateProjectInput): Promise<Project> {
    const { data } = await apiClient.post<Project | { project: Project }>('/v1/projects', input);
    if ('project' in data && data.project) return data.project;
    return data as Project;
}

export async function deleteProject(projectId: string): Promise<void> {
    await apiClient.delete(`/v1/projects/${projectId}`);
}

export interface UpdateProjectInput {
    readonly name: string;
    readonly slug: string;
    readonly description: string;
}

/**
 * PUT /v1/projects/:id
 * Backend returns the updated Project directly or wrapped in { project: ... }.
 */
export async function updateProject(projectId: string, input: UpdateProjectInput): Promise<Project> {
    const { data } = await apiClient.put<Project | { project: Project }>(`/v1/projects/${projectId}`, input);
    if ('project' in data && data.project) return data.project;
    return data as Project;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    pagination: Pagination;
}

export interface TenantSummary {
    readonly id: string;
    readonly name: string;
    readonly slug: string;
    readonly description: string;
    readonly owner_id: string;
    readonly is_active: boolean;
    readonly plan: string;
    readonly created_at: string;
    readonly updated_at: string;
}

export async function listAllTenants(page = 1, limit = 10): Promise<PaginatedResponse<TenantSummary>> {
    const { data } = await apiClient.get<PaginatedResponse<TenantSummary>>('/v1/platform/projects', {
        params: { page, limit },
    });
    return data;
}

export async function deleteTenant(projectId: string): Promise<void> {
    await apiClient.delete(`/v1/platform/projects/${projectId}`);
}

export async function suspendTenant(projectId: string): Promise<void> {
    await apiClient.patch(`/v1/platform/projects/${projectId}/suspend`);
}

export async function reactivateTenant(projectId: string): Promise<void> {
    await apiClient.patch(`/v1/platform/projects/${projectId}/reactivate`);
}
