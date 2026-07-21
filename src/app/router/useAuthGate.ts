import { useAuthStore } from '../../store/authStore';

export const useAuthGate = () => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const clearSession = useAuthStore((s) => s.clearSession);
    return { isAuthenticated, logout: clearSession };
};
