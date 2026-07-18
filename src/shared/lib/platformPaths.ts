export const PLATFORM = {
  health: 'platform/health',
  metrics: 'platform/metrics',
  tenants: 'platform/tenants',
  projects: 'platform/projects',
  gateways: 'platform/gateways',
} as const;

export const ADMIN = {
  members: 'administration/members',
  roles: 'administration/roles',
} as const;

export const abs = (segment: string): string => `/${segment}`;
