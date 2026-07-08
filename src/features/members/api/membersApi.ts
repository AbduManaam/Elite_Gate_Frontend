import { apiClient } from '../../../lib/api/client';

export interface ProjectMember {
    readonly project_id: string;
    readonly admin_user_id: string;
    readonly username: string;
    readonly email: string;
    readonly role: 'viewer' | 'editor' | 'owner';
    readonly joined_at: string;
}

export interface UserLookupResult {
    readonly user: {
        readonly id: string;
        readonly email: string;
        readonly username: string;
    };
}

export async function listMembers(projectId: string): Promise<ProjectMember[]> {
    const { data } = await apiClient.get<{ items: ProjectMember[] }>(`/v1/projects/${projectId}/members`);
    return data.items ?? [];
}

export async function lookupMemberByEmail(projectId: string, email: string): Promise<UserLookupResult> {
    const { data } = await apiClient.get<UserLookupResult>(`/v1/projects/${projectId}/members/lookup`, {
        params: { email },
    });
    return data;
}

export async function addMember(projectId: string, email: string, role: string): Promise<void> {
    await apiClient.post(`/v1/projects/${projectId}/members`, {
        email,
        role,
    });
}

export async function changeMemberRole(projectId: string, memberId: string, role: string): Promise<void> {
    await apiClient.put(`/v1/projects/${projectId}/members/${memberId}`, {
        role,
    });
}

export async function removeMember(projectId: string, memberId: string): Promise<void> {
    await apiClient.delete(`/v1/projects/${projectId}/members/${memberId}`);
}
