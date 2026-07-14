import { useActiveProject } from './useActiveProject';
import { useAuthStore } from '../../store/authStore';
import { hasRole, Role } from '../auth/roles';

export function useRoles() {
    const { projectRole } = useActiveProject();
    const isSuperAdmin = useAuthStore((s) => s.isSuperAdmin);
    // Super-admins get owner-equivalent access to whatever project is active;
    // everyone else is governed strictly by their real project membership role.
    const effectiveRole = isSuperAdmin ? 'owner' : (projectRole || 'viewer');

    return {
        role: effectiveRole,
        isSuperAdmin: !!isSuperAdmin,
        can: (minRole: Role) => hasRole(effectiveRole, minRole),
    };
}