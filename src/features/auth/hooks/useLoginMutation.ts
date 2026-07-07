import { useMutation } from '@tanstack/react-query';
import { login } from '../api/authApi';
import { useAuthStore } from '../../../store/authStore';

export function useLoginMutation() {
    const setSession = useAuthStore((s) => s.setSession);

    return useMutation({
        mutationFn: ({ username, password }: { username: string; password: string }) =>
            login(username, password),
        onSuccess: (data) => {
            setSession({ accessToken: data.access_token, refreshToken: data.refresh_token });
        },
    });
}