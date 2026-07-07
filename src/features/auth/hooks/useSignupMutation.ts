import { useMutation } from '@tanstack/react-query';
import { signup } from '../api/authApi';
import { useAuthStore } from '../../../store/authStore';

export function useSignupMutation() {
    const setSession = useAuthStore((s) => s.setSession);

    return useMutation({
        mutationFn: ({ username, password, company }: { username: string; password: string; company: string }) =>
            signup(username, password, company),
        onSuccess: (data) => {
            setSession({ accessToken: data.access_token, refreshToken: data.refresh_token });
        },
    });
}
