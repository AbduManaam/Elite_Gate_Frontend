import { useActiveProject } from './useActiveProject';
import { useAuthStore } from '../../store/authStore';
import { hasRole, Role } from '../auth/roles';

export function useRoles() {
    const { projectRole } = useActiveProject();
    const user = useAuthStore((s) => s.user);
    const isGlobalAdmin = user?.role === 'admin';
    const effectiveRole = isGlobalAdmin ? 'owner' : (projectRole || 'viewer');

    return {
        role: effectiveRole,
        can: (minRole: Role) => hasRole(effectiveRole, minRole),
    };
}