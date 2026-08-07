import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ObservabilitySummaryPage } from '../pages/ObservabilitySummaryPage';
import * as useMetricsModule from '../hooks/useMetrics';
import * as useGatewaysModule from '../../gateways/hooks/useGateways';
import * as useActiveProjectModule from '../../../shared/hooks/useActiveProject';

vi.mock('../hooks/useMetrics');
vi.mock('../../gateways/hooks/useGateways');
vi.mock('../../../shared/hooks/useActiveProject');

const mockDashboardSummary = {
  project_id: 'proj-123',
  generated_at: new Date().toISOString(),
  request_rate: { value: 120.5, unit: 'req/s' },
  error_rate: { value: 0.1, unit: '%' },
  error_rate_pct: { value: 0.1, unit: '%' },
  latency_p50: { value: 12.4, unit: 'ms' },
  latency_p95: { value: 45.2, unit: 'ms' },
  active_requests: { value: 14, unit: 'requests' },
  total_requests: { value: 5000, unit: 'req' },
  latency_avg: { value: 18.2, unit: 'ms' },
  request_rate_trend: [{ timestamp: 1700000000000, value: 100 }],
  status_breakdown: [{ label: '200', points: [{ timestamp: 1700000000000, value: 100 }] }],
  top_routes: [{ label: '/api/v1/users', points: [{ timestamp: 1700000000000, value: 50 }] }],
  top_upstreams: [{ label: 'user-service', points: [{ timestamp: 1700000000000, value: 50 }] }],
  upstream_health: [{ upstream: 'user-service-1', healthy: true }],
  active_requests_sparkline: [{ timestamp: 1700000000000, value: 14 }],
  latency_avg_trend: [{ timestamp: 1700000000000, value: 18.2 }],
};

const mockGateways = [
  {
    id: 'gw-1',
    project_id: 'proj-123',
    external_id: 'gw-ext-1',
    endpoint_ip: '192.168.1.1',
    gateway_port: '8080',
    public_host: 'gateway.local',
    public_port: '8080',
    plan: 'standard',
    status: 'running' as const,
  },
];

describe('ObservabilitySummaryPage', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    vi.spyOn(useActiveProjectModule, 'useActiveProject').mockReturnValue({
      projectId: 'proj-123',
      projectRole: 'owner',
      activeProject: null,
      projects: [],
      isLoading: false,
      error: null,
      switchProject: vi.fn(),
      selectProject: vi.fn(),
      createProject: vi.fn(),
      updateProject: vi.fn(),
      deleteProject: vi.fn(),
      refreshProjects: vi.fn(),
    });

    vi.spyOn(useMetricsModule, 'useDashboardSummaryQuery').mockReturnValue({
      data: mockDashboardSummary,
      isLoading: false,
      error: null,
    } as any);

    vi.spyOn(useMetricsModule, 'useProjectSystemRangeQuery').mockReturnValue({
      data: [{ timestamp: 1700000000000, value: 25 }],
      isLoading: false,
      error: null,
    } as any);

    vi.spyOn(useGatewaysModule, 'useGatewaysQuery').mockReturnValue({
      data: mockGateways,
      isLoading: false,
      error: null,
    } as any);
  });

  it('renders both Project Analytics and Gateway Health section headers', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ObservabilitySummaryPage />
      </QueryClientProvider>
    );

    expect(screen.getByRole('heading', { name: /Project Analytics/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Gateway Health/i })).toBeInTheDocument();
  });

  it('displays metrics in their respective sections', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ObservabilitySummaryPage />
      </QueryClientProvider>
    );

    // Project Analytics metrics
    expect(screen.getByText('Request Rate')).toBeInTheDocument();
    expect(screen.getByText('Error Rate')).toBeInTheDocument();
    expect(screen.getByText('Latency P50')).toBeInTheDocument();
    expect(screen.getByText('Latency P95')).toBeInTheDocument();
    expect(screen.getByText('HTTP Status Code Breakdown')).toBeInTheDocument();
    expect(screen.getByText('Upstream Target Health')).toBeInTheDocument();

    // Gateway Health metrics
    expect(screen.getByText('Active Requests')).toBeInTheDocument();
    expect(screen.getByText('Gateway CPU Usage')).toBeInTheDocument();
    expect(screen.getByText('Gateway Memory Usage')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Gateway Container/i })).toBeInTheDocument();
  });
});
