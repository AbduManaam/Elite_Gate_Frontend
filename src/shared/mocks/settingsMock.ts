export interface SessionData {
  readonly id: string;
  readonly device: string;
  readonly ip: string;
  readonly location: string;
  readonly lastActive: string;
  readonly icon: string;
  readonly isCurrent: boolean;
}

export const MOCK_SESSIONS: readonly SessionData[] = [
  {
    id: '1',
    device: 'Mac OS - Chrome',
    ip: '192.168.1.104',
    location: 'San Francisco, CA',
    lastActive: 'Active now',
    icon: 'desktop_mac',
    isCurrent: true
  },
  {
    id: '2',
    device: 'iOS - Safari',
    ip: '104.28.192.11',
    location: 'San Francisco, CA',
    lastActive: 'Last active: 2 hours ago',
    icon: 'smartphone',
    isCurrent: false
  }
];

export interface PersonalTokenData {
  readonly id: string;
  readonly name: string;
  readonly lastUsed: string;
  readonly expires: string;
}

export const MOCK_PERSONAL_TOKENS: readonly PersonalTokenData[] = [
  {
    id: '1',
    name: 'CLI Integration Prod',
    lastUsed: 'Today, 14:32',
    expires: 'Never'
  },
  {
    id: '2',
    name: 'Analytics Script Read-Only',
    lastUsed: 'Yesterday, 09:15',
    expires: 'Oct 24, 2024'
  }
];
