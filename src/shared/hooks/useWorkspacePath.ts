import { useActiveProject } from './useActiveProject';
import { projectPath } from '../lib/routePaths';

export function useWorkspacePath() {
  const { projectId } = useActiveProject();
  return (subPath: string) => (projectId ? projectPath(projectId, subPath) : subPath);
}
