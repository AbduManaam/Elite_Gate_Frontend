import { apiClient } from '../../../lib/api/client';

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
    await apiClient.post('/logout');
}