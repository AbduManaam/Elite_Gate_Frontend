export interface SidebarProject {
  readonly id: string;
  readonly name: string;
  readonly initials: string;
}

export interface SidebarNavItem {
  readonly label: string;
  readonly path: string;
  readonly icon: string;
  readonly isImage?: boolean;
  readonly imageUrl?: string;
}

export const MOCK_PROJECTS: readonly SidebarProject[] = [
  { id: 'bridgeon', name: 'BRIDGEON', initials: 'B' }
];

export const SIDEBAR_NAV_ITEMS: readonly SidebarNavItem[] = [
  {
    label: 'Welcome',
    path: '/',
    icon: 'home'
  },
  {
    label: 'Connectivity',
    path: '/connectivity',
    icon: 'hub',
    isImage: true,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMNMzsutofipclMtCLx10yT0XijWcwH3yQMT11UYckObcnqyeOYysEx4zjtw9zJQ158vHgc3HSYbK5ifhbqL23KyYFY0E8jgOfjLd-dxrla8yjIHCGdfPjS4OONSGJThGqbujzvytpQlUT_UCkln-dlOicqsVaATzo9K8LAKzLK4enKvtX_zqaRZ2bA7porNygVc6rCZVtkt2Td5QCZNDrY0MlvNokPc7_a07FLSuUa6E9lilI0xciZ5VcX-RAZdRt-0Bxgo9EvTmt'
  },
  {
    label: 'Analytics',
    path: '/analytics',
    icon: 'monitoring'
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: 'settings'
  },
  {
    label: 'Logs',
    path: '/logs',
    icon: 'history'
  }
];

export const ELITE_GATE_LOGO_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMNMzsutofipclMtCLx10yT0XijWcwH3yQMT11UYckObcnqyeOYysEx4zjtw9zJQ158vHgc3HSYbK5ifhbqL23KyYFY0E8jgOfjLd-dxrla8yjIHCGdfPjS4OONSGJThGqbujzvytpQlUT_UCkln-dlOicqsVaATzo9K8LAKzLK4enKvtX_zqaRZ2bA7porNygVc6rCZVtkt2Td5QCZNDrY0MlvNokPc7_a07FLSuUa6E9lilI0xciZ5VcX-RAZdRt-0Bxgo9EvTmt';
