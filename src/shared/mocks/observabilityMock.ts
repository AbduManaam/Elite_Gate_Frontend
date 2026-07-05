export interface KpiCardData {
  readonly label: string;
  readonly value: string;
  readonly diff?: string;
  readonly diffStatus?: 'up' | 'warning' | 'stable' | 'down';
  readonly p95?: string;
  readonly warningText?: string;
  readonly successIndicatorColor?: string;
  readonly successText?: string;
  readonly sparklineHeights?: readonly number[];
}

export interface ErrorRateService {
  readonly name: string;
  readonly rate: string;
  readonly percentValue: number; // For progress bar width
  readonly statusColor: string;
}

export interface TrafficMapMarker {
  readonly label: string;
  readonly rate: string;
  readonly style: React.CSSProperties;
  readonly isAlert?: boolean;
}

export interface TraceRecord {
  readonly timestamp: string;
  readonly method: string;
  readonly path: string;
  readonly status: string;
  readonly statusClass: string;
  readonly latency: string;
  readonly upstream: string;
}

export const MOCK_KPIS: readonly KpiCardData[] = [
  {
    label: 'Total Requests',
    value: '1.28M',
    diff: '+12.4%',
    diffStatus: 'up',
    sparklineHeights: [40, 60, 55, 80, 70, 90, 100]
  },
  {
    label: 'Avg Latency',
    value: '42ms',
    diff: '+5ms',
    diffStatus: 'warning',
    p95: 'p95: 88ms'
  },
  {
    label: 'Error Rate (5xx)',
    value: '0.14%',
    diff: '-0.02%',
    diffStatus: 'up',
    warningText: 'Elevated in US-EAST'
  },
  {
    label: 'Success Rate',
    value: '99.86%',
    diff: 'Stable',
    diffStatus: 'stable',
    successIndicatorColor: 'bg-green-500',
    successText: 'Within target SLA'
  }
];

export const MOCK_STATUS_CHART_BARS: readonly number[] = [
  60, 45, 85, 70, 90, 75, 80, 55, 65, 95
];

export const MOCK_TOP_SERVICES_ERRORS: readonly ErrorRateService[] = [
  {
    name: 'auth-service-v2',
    rate: '4.2%',
    percentValue: 42,
    statusColor: 'bg-error'
  },
  {
    name: 'payment-gateway',
    rate: '2.1%',
    percentValue: 21,
    statusColor: 'bg-amber-500'
  },
  {
    name: 'image-optimizer',
    rate: '1.8%',
    percentValue: 18,
    statusColor: 'bg-amber-500'
  },
  {
    name: 'search-api-edge',
    rate: '0.05%',
    percentValue: 5,
    statusColor: 'bg-green-500'
  }
];

export const MOCK_TRAFFIC_MARKERS: readonly TrafficMapMarker[] = [
  {
    label: 'US-East',
    rate: '440k/s',
    style: { top: '25%', left: '25%' }
  },
  {
    label: 'EU-West',
    rate: '580k/s',
    style: { top: '33%', left: '60%' }
  },
  {
    label: 'APAC',
    rate: '120k/s',
    style: { top: '60%', left: '78%' },
    isAlert: true
  }
];

// Explorer values
export const MOCK_SERVICES = ['Auth-Service-V2', 'Payment-Gateway', 'User-Profile-API'];
export const MOCK_ROUTES = ['All Routes', '/api/v1/auth/*', '/api/v1/login'];
export const MOCK_STATUSES = ['2xx Success', '4xx Client Error', '5xx Server Error'];
export const MOCK_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

export const MOCK_LATENCY_P99_BARS = [60, 55, 70, 85, 65, 40, 50, 90, 75, 60, 80, 65];
export const MOCK_LATENCY_P50_BARS = [20, 15, 25, 35, 18, 10, 15, 40, 30, 20, 35, 25];

export const MOCK_TRACES: readonly TraceRecord[] = [
  {
    timestamp: '2023-11-24 10:42:15.002',
    method: 'GET',
    path: '/api/v1/auth/token',
    status: '200 OK',
    statusClass: 'bg-green-100 text-green-700 border-green-200',
    latency: '12.4ms',
    upstream: 'k8s-pod-auth-x92'
  },
  {
    timestamp: '2023-11-24 10:42:14.881',
    method: 'POST',
    path: '/api/v1/payments/intent',
    status: '503 Error',
    statusClass: 'bg-red-100 text-red-700 border-red-200',
    latency: '452.1ms',
    upstream: 'ext-stripe-gw'
  },
  {
    timestamp: '2023-11-24 10:42:14.500',
    method: 'GET',
    path: '/api/v1/user/settings',
    status: '200 OK',
    statusClass: 'bg-green-100 text-green-700 border-green-200',
    latency: '8.9ms',
    upstream: 'k8s-pod-user-a12'
  },
  {
    timestamp: '2023-11-24 10:42:13.992',
    method: 'POST',
    path: '/api/v1/auth/mfa/verify',
    status: '401 Auth',
    statusClass: 'bg-orange-100 text-orange-700 border-orange-200',
    latency: '124.0ms',
    upstream: 'k8s-pod-auth-x92'
  },
  {
    timestamp: '2023-11-24 10:42:13.111',
    method: 'GET',
    path: '/healthz',
    status: '200 OK',
    statusClass: 'bg-green-100 text-green-700 border-green-200',
    latency: '1.2ms',
    upstream: 'internal-balancer'
  }
];
