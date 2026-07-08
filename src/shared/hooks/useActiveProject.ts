import { useUIStore } from '../../store/uiStore';

// Thin wrapper around uiStore's active-project state so feature components
// don't reach into the store directly. projectRole is the caller's
// membership role for projectId (owner/editor/viewer) — see uiStore.ts for
// why this can't come from the JWT.
export function useActiveProject() {
    const projectId = useUIStore((s) => s.activeProjectId);
    const projectRole = useUIStore((s) => s.activeProjectRole);
    const setActiveProjectId = useUIStore((s) => s.setActiveProjectId);
    const setActiveProjectRole = useUIStore((s) => s.setActiveProjectRole);

    return { projectId, projectRole, setActiveProjectId, setActiveProjectRole };
}