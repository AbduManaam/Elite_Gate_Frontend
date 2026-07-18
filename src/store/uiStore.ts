import { create } from 'zustand';
import { lastProjectStorage } from '../shared/lib/projectStorage';

export type ProjectRole = 'viewer' | 'editor' | 'owner';

interface UIState {
    readonly isSidebarCollapsed: boolean;
    readonly activeProjectId: string | null;
    // The caller's membership role for activeProjectId — comes from the
    // project list/summary response (project_members.role), NOT the JWT.
    // The JWT's role claim is always the literal string "admin" (see
    // auth.AdminClaims); it carries no per-project permission info.
    readonly activeProjectRole: ProjectRole | null;
    readonly toggleSidebar: () => void;
    readonly setActiveProjectId: (projectId: string | null) => void;
    readonly setActiveProjectRole: (role: ProjectRole | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
    isSidebarCollapsed: false,
    activeProjectId: lastProjectStorage.get(),
    activeProjectRole: null,
    toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
    // Switching projects always clears the old role — never let a stale
    // "owner" from the previous project leak into a newly-selected one
    // before its real role has loaded.
    setActiveProjectId: (projectId) => set({ activeProjectId: projectId, activeProjectRole: null }),
    setActiveProjectRole: (role) => set({ activeProjectRole: role }),
}));