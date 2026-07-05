export interface ServiceCardItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly linkText: string;
  readonly href: string;
  readonly isRecommended?: boolean;
  readonly isDisabled?: boolean;
}

export interface QuickStatItem {
  readonly label: string;
  readonly value: string;
  readonly status?: 'up' | 'stable' | 'down';
  readonly icon?: string;
  readonly isOnlineIndicator?: boolean;
}

export interface ActivityItem {
  readonly id: string;
  readonly title: string;
  readonly time: string;
  readonly category: string;
  readonly icon: string;
}

export const MOCK_SERVICES: readonly ServiceCardItem[] = [
  {
    id: 'api-gateway',
    title: 'API Gateway',
    description: 'Route, secure, and manage API traffic across modern microservices environments.',
    icon: 'api',
    linkText: 'Configure Routes',
    href: '#routes',
    isRecommended: true
  },
  {
    id: 'ai-gateway',
    title: 'AI Gateway',
    description: 'Govern and proxy AI model traffic, enforce rate limits, and monitor usage.',
    icon: 'psychology',
    linkText: 'Manage AI Providers',
    href: '#policies'
  },
  {
    id: 'dev-portal',
    title: 'Dev Portal',
    description: 'Publish APIs, manage consumer access, and generate interactive documentation.',
    icon: 'developer_board',
    linkText: 'View Portal',
    href: '#portal'
  },
  {
    id: 'service-mesh',
    title: 'Service Mesh',
    description: 'Secure service-to-service communication with mTLS and advanced traffic routing.',
    icon: 'account_tree',
    linkText: 'Enable Mesh',
    href: '#mesh',
    isDisabled: true
  }
];

export const MOCK_STATS: readonly QuickStatItem[] = [
  {
    label: 'Active Services',
    value: '12',
    isOnlineIndicator: true
  },
  {
    label: 'Total Requests (24h)',
    value: '1.2M',
    status: 'up',
    icon: 'trending_up'
  },
  {
    label: 'Error Rate',
    value: '0.02%',
    status: 'stable',
    icon: 'horizontal_rule'
  }
];

export const MOCK_ACTIVITIES: readonly ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Updated route config',
    time: '2 mins ago',
    category: 'API Gateway',
    icon: 'update'
  },
  {
    id: 'act-2',
    title: 'Added new team member',
    time: '1 hr ago',
    category: 'Settings',
    icon: 'person_add'
  }
];
