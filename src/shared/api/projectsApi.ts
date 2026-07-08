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
