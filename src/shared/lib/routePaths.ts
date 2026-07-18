export const PROJECT_ROOT = 'projects';

export function projectPath(projectId: string, subPath: string = ''): string {
  const formatted = subPath && !subPath.startsWith('/') ? `/${subPath}` : subPath;
  return `/${PROJECT_ROOT}/${projectId}${formatted}`;
}

export function parseProjectPath(pathname: string): { projectId: string | null; subPath: string } {
  const parts = pathname.split('/');
  if (parts[1] !== PROJECT_ROOT || !parts[2]) {
    return { projectId: null, subPath: pathname };
  }
  return { projectId: parts[2], subPath: '/' + parts.slice(3).join('/') };
}
