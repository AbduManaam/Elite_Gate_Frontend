import { useAuthStore } from '../../store/authStore';
import { hasRole, Role } from '../auth/roles';

export function useRoles() {
    const role = useAuthStore((s) => s.user?.role);
    return {
        role,
        can: (minRole: Role) => hasRole(role, minRole),
    };
}