import { useActiveProject } from './useActiveProject';
import { hasRole, Role } from '../auth/roles';

export function useRoles() {
    const { projectRole } = useActiveProject();

    return {
        role: projectRole,
        can: (minRole: Role) => hasRole(projectRole || undefined, minRole),
    };
}