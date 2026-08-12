import { apiClient } from '../../../lib/api/client';

export interface TokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}

export interface SignupResponse {
    message: string;
    project_id: string;
}

export interface ForgotPasswordResponse {
    message: string;
}

export interface ResetPasswordResponse {
    message: string;
}

export interface ResendVerificationResponse {
    message: string;
}

export async function login(username: string, password: string): Promise<TokenResponse> {
    const { data } = await apiClient.post<TokenResponse>('/login', { username, password });
    return data;
}

export async function signup(username: string, email: string, password: string, company: string): Promise<SignupResponse> {
    const { data } = await apiClient.post<SignupResponse>('/signup', { username, email, password, company });
    return data;
}

export async function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const { data } = await apiClient.post<ForgotPasswordResponse>('/forgot-password', { email });
    return data;
}

export async function resetPassword(token: string, newPassword: string): Promise<ResetPasswordResponse> {
    const { data } = await apiClient.post<ResetPasswordResponse>('/reset-password', {
        token,
        new_password: newPassword,
    });
    return data;
}

export async function resendVerification(email: string): Promise<ResendVerificationResponse> {
    const { data } = await apiClient.post<ResendVerificationResponse>('/resend-verification', { email });
    return data;
}

export async function refresh(): Promise<TokenResponse> {
    const { data } = await apiClient.post<TokenResponse>('/refresh', {});
    return data;
}

export async function logout(): Promise<void> {
    await apiClient.post('/logout', {});
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