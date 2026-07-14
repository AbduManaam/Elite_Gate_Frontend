import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '../../features/auth/api/authApi';
import { useAuthStore } from '../../store/authStore';

export function useResolveSession() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const isSuperAdmin = useAuthStore((s) => s.isSuperAdmin);
    const setSuperAdminStatus = useAuthStore((s) => s.setSuperAdminStatus);

    const { data, isError } = useQuery({
        queryKey: ['me'],
        queryFn: getMe,
        enabled: isAuthenticated && isSuperAdmin === null,
        retry: false,
    });

    useEffect(() => {
        if (data) {
            setSuperAdminStatus(data.is_super_admin, data.username);
        }
    }, [data, setSuperAdminStatus]);

    // If /me fails (e.g. expired token slipped through), treat as not resolved
    // rather than crashing — existing auth-error interceptor should handle logout.
    return { isResolved: isSuperAdmin !== null, isError };
}
