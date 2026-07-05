export interface MemberData {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: string;
  readonly accessScope: string;
  readonly status: 'Active' | 'Pending invite';
  readonly initials: string;
}

export interface CredentialData {
  readonly id: string;
  readonly name: string;
  readonly prefix: string;
  readonly permissions: string;
  readonly expiration: string;
  readonly lastUsed: string;
  readonly status: 'Active' | 'Revoked';
}

export const MOCK_MEMBERS: readonly MemberData[] = [
  {
    id: '1',
    name: 'Abdu Manaam',
    email: 'admin@elitegate.io',
    role: 'Super Admin',
    accessScope: 'All Workspaces',
    status: 'Active',
    initials: 'AM'
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@company.com',
    role: 'Developer',
    accessScope: 'serverless-default',
    status: 'Active',
    initials: 'JD'
  },
  {
    id: '3',
    name: 'Sarah Smith',
    email: 'sarah@company.com',
    role: 'Viewer',
    accessScope: 'Read-Only',
    status: 'Pending invite',
    initials: 'SS'
  }
];

export const MOCK_CREDENTIALS: readonly CredentialData[] = [
  {
    id: '1',
    name: 'ci-cd-deployment-token',
    prefix: 'eg_live_a1f9...****',
    permissions: 'Global-Write',
    expiration: '2026-06-12',
    lastUsed: '4m ago',
    status: 'Active'
  },
  {
    id: '2',
    name: 'dev-local-credentials',
    prefix: 'eg_live_bc3d...****',
    permissions: 'Read-Only',
    expiration: '2026-05-01',
    lastUsed: '1d ago',
    status: 'Active'
  },
  {
    id: '3',
    name: 'legacy-monitor-token',
    prefix: 'eg_live_ee4a...****',
    permissions: 'Read-Only',
    expiration: '2025-11-20',
    lastUsed: '—',
    status: 'Revoked'
  }
];
