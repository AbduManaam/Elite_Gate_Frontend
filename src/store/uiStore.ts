import { create } from 'zustand';

interface UIState {
    readonly isSidebarCollapsed: boolean;
    readonly activeProjectId: string | null;
    readonly toggleSidebar: () => void;
    readonly setActiveProjectId: (projectId: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
    isSidebarCollapsed: false,
    activeProjectId: null,
    toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
    setActiveProjectId: (projectId) => set({ activeProjectId: projectId }),
}));