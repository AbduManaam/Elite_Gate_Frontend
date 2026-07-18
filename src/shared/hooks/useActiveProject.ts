import { useNavigate, useLocation } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import { lastProjectStorage } from '../lib/projectStorage';
import { projectPath, parseProjectPath } from '../lib/routePaths';

// Thin wrapper around uiStore's active-project state so feature components
// don't reach into the store directly. projectRole is the caller's
// membership role for activeProjectId (owner/editor/viewer) — see uiStore.ts for
// why this can't come from the JWT.
export function useActiveProject() {
  const projectId = useUIStore((s) => s.activeProjectId);
  const projectRole = useUIStore((s) => s.activeProjectRole);
  const setActiveProjectIdStore = useUIStore((s) => s.setActiveProjectId);
  const setActiveProjectRole = useUIStore((s) => s.setActiveProjectRole);
  const navigate = useNavigate();
  const location = useLocation();

  const setActiveProjectId = (id: string | null) => {
    setActiveProjectIdStore(id);

    if (!id) {
      lastProjectStorage.clear();
      return;
    }

    lastProjectStorage.set(id);

    const { projectId: currentId, subPath } = parseProjectPath(location.pathname);
    if (currentId === id) return; // already on this project's URL

    // Keep the sub-path when switching between projects (e.g. stay on
    // "analytics"); land on the project index when coming from a
    // non-project route (e.g. AllProjectsPage or a fresh selection).
    navigate(projectPath(id, currentId ? subPath : '') + location.search, { replace: true });
  };

  return { projectId, projectRole, setActiveProjectId, setActiveProjectRole };
}