import { apiClient } from '../../../lib/api/client';
import { tokenStore } from '../../../lib/api/tokenStore';

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}

export interface SignupResponse extends TokenResponse {
    project_id: string;
}

export async function login(username: string, password: string): Promise<TokenResponse> {
    const { data } = await apiClient.post<TokenResponse>('/login', { username, password });
    return data;
}

export async function signup(username: string, password: string, company: string): Promise<SignupResponse> {
    const { data } = await apiClient.post<SignupResponse>('/signup', { username, password, company });
    return data;
}

export async function refresh(refreshToken: string): Promise<TokenResponse> {
    const { data } = await apiClient.post<TokenResponse>('/refresh', { refresh_token: refreshToken });
    return data;
}

export async function logout(): Promise<void> {
    const refreshToken = tokenStore.getRefreshToken() || '';
    await apiClient.post('/logout', { refresh_token: refreshToken });
}

export interface MeResponse {
    user_id: string;
    username: string;
    is_super_admin: boolean;
}

export async function getMe(): Promise<MeResponse> {
    const { data } = await apiClient.get<MeResponse>('/v1/me');
    return data;
}

export async function addTeamMemberAdmin(username: string, password: string): Promise<void> {
    await apiClient.post('/v1/admins', { username, password });
}