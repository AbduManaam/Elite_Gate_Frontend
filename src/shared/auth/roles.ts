const ROLE_WEIGHTS: Record<string, number> = {
    viewer: 0,
    editor: 1,
    owner: 2,
};

export type Role = 'viewer' | 'editor' | 'owner';

export function hasRole(currentRole: string | undefined, minRole: Role): boolean {
    if (!currentRole) return false;
    const current = ROLE_WEIGHTS[currentRole];
    const min = ROLE_WEIGHTS[minRole];
    if (current === undefined || min === undefined) return false;
    return current >= min;
}