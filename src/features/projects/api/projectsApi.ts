import { apiClient } from '../../../lib/api/client';
import { ProjectRecord, ProjectSummary } from './types';

export type { ProjectRecord, ProjectSummary } from './types';

interface ListProjectsResponse {
    items: ProjectRecord[];
    pagination: { page: number; limit: number; total: number; total_pages: number };
}

// Returns only projects the caller is a member of, each carrying that
// caller's own role — this is the primary source for activeProjectRole
// when the user picks a project from a selector.
export async function listProjects(): Promise<ProjectRecord[]> {
    const { data } = await apiClient.get<ListProjectsResponse>('/projects');
    return data.items;
}

// Secondary source for activeProjectRole: fetched when landing on a
// project's dashboard directly (e.g. deep link / page refresh), where
// there's no list response in hand to read role off of.
export async function getProjectSummary(projectId: string): Promise<ProjectSummary> {
    const { data } = await apiClient.get<ProjectSummary>(`/projects/${projectId}/summary`);
    return data;
}
