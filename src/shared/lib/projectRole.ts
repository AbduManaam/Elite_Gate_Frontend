import type { ProjectRole } from '../../store/uiStore';

interface HasOptionalRole {
  readonly role?: string;
}

export function resolveProjectRole(project: HasOptionalRole | null | undefined): ProjectRole {
  return (project?.role as ProjectRole) ?? 'owner';
}
