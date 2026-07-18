const LAST_PROJECT_KEY = 'coreguard_active_project_id';

/**
 * Failure-safe wrapper around localStorage for the one value we persist
 * client-side. Wrapped in try/catch because localStorage can throw
 * (private browsing, quota exceeded, disabled storage) — losing this is a
 * UX nicety, not something that should crash navigation.
 */
export const lastProjectStorage = {
  get(): string | null {
    try {
      return localStorage.getItem(LAST_PROJECT_KEY);
    } catch {
      return null;
    }
  },
  set(projectId: string): void {
    try {
      localStorage.setItem(LAST_PROJECT_KEY, projectId);
    } catch {
      /* persistence is best-effort */
    }
  },
  clear(): void {
    try {
      localStorage.removeItem(LAST_PROJECT_KEY);
    } catch {
      /* no-op */
    }
  },
};
