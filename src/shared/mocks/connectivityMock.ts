export interface RouteData {
  readonly path: string;
  readonly service: string;
  readonly methods: readonly string[];
  readonly protocols: readonly string[];
  readonly plugins: readonly string[];
  readonly traffic: string;
}

export interface UpstreamData {
  readonly status: 'active' | 'passive' | 'warning' | 'error';
  readonly name: string;
  readonly algorithm: string;
  readonly targetsActive: number;
  readonly targetsTotal: number;
  readonly healthchecks: string;
  readonly latency: string;
}

export const MOCK_ROUTES: readonly RouteData[] = [
  {
    path: '/v1/auth',
    service: 'auth-service',
    methods: ['GET', 'POST'],
    protocols: ['HTTPS'],
    plugins: ['rate-limiting', 'key-auth'],
    traffic: '342k req'
  },
  {
    path: '/v2/payments',
    service: 'payment-service',
    methods: ['POST'],
    protocols: ['HTTPS'],
    plugins: ['cors'],
    traffic: '1.2M req'
  },
  {
    path: '/static/resources',
    service: 'static-service',
    methods: ['GET'],
    protocols: ['HTTP', 'HTTPS'],
    plugins: [],
    traffic: '45k req'
  }
];

export const MOCK_UPSTREAMS: readonly UpstreamData[] = [
  {
    status: 'active',
    name: 'auth-upstream',
    algorithm: 'Round-Robin',
    targetsActive: 6,
    targetsTotal: 6,
    healthchecks: 'Active (30s)',
    latency: '14ms'
  },
  {
    status: 'active',
    name: 'payment-upstream',
    algorithm: 'Least-Connections',
    targetsActive: 4,
    targetsTotal: 4,
    healthchecks: 'Active (15s)',
    latency: '28ms'
  },
  {
    status: 'warning',
    name: 'analytics-upstream',
    algorithm: 'Round-Robin',
    targetsActive: 2,
    targetsTotal: 4,
    healthchecks: 'Passive',
    latency: '195ms'
  }
];
