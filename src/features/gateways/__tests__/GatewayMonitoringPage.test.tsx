import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GatewayMonitoringPage } from '../pages/GatewayMonitoringPage';
import * as metricsApi from '../../observability/api/metricsApi';
import * as gatewaysApi from '../api/gatewaysApi';

vi.mock('../../observability/api/metricsApi');
vi.mock('../api/gatewaysApi');
vi.mock('../../../shared/hooks/useActiveProject', () => ({
  useActiveProject: () => ({
    projectId: 'proj-123',
    projectRole: 'viewer',
  }),
}));

const mockActiveGateway: gatewaysApi.GatewayRecord = {
  id: 'gw-123',
  project_id: 'proj-123',
  external_id: 'elitegate-gw-1',
  endpoint_ip: '10.0.0.1',
  gateway_port: '8080',
  public_host: 'gw-123.elitegateway.site',
  public_port: 443,
  plan: 'Standard',
  status: 'running',
};

const mockProvisioningGateway: gatewaysApi.GatewayRecord = {
  id: 'gw-456',
  project_id: 'proj-123',
  external_id: 'elitegate-gw-provisioning',
  endpoint_ip: '10.0.0.2',
  gateway_port: '8080',
  public_host: 'gw-456.elitegateway.site',
  public_port: 443,
  plan: 'Standard',
  status: 'provisioning',
};

const mockDashboardSummary: metricsApi.DashboardSummary = {
  project_id: 'proj-123',
  generated_at: '2026-08-07T10:00:00Z',
  request_rate: { value: 12.5, unit: 'req/s' },
  error_rate: { value: 0.1, unit: 'req/s' },
  error_rate_pct: { value: 0.8, unit: '%' },
  latency_p50: { value: 14.2, unit: 'ms' },
  latency_p95: { value: 45.0, unit: 'ms' },
  active_requests: { value: 42, unit: 'requests' },
  total_requests: { value: 5000, unit: 'req' },
  latency_avg: { value: 18.0, unit: 'ms' },
  request_rate_trend: [{ timestamp: 1780000000000, value: 12.5 }],
  status_breakdown: [{ label: '2xx', points: [{ timestamp: 1780000000000, value: 12.0 }] }],
  top_routes: [],
  top_upstreams: [],
  upstream_health: [],
  active_requests_sparkline: [],
};

describe('GatewayMonitoringPage Telemetry & Project Isolation', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.clearAllMocks();
  });

  it('permanently excludes hardcoded 1,208 connections and 14.8 hrs uptime', async () => {
    vi.mocked(gatewaysApi.listProjectGateways).mockResolvedValue([mockActiveGateway]);
    vi.mocked(metricsApi.getDashboardSummary).mockResolvedValue(mockDashboardSummary);
    vi.mocked(metricsApi.queryProjectSystemRange).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <GatewayMonitoringPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('1,208')).not.toBeInTheDocument();
      expect(screen.queryByText('14.8 hrs')).not.toBeInTheDocument();
      expect(screen.queryByText(/Average Connection Uptime/i)).not.toBeInTheDocument();
    });
  });

  it('correctly labels active HTTP requests as Active Requests', async () => {
    vi.mocked(gatewaysApi.listProjectGateways).mockResolvedValue([mockActiveGateway]);
    vi.mocked(metricsApi.getDashboardSummary).mockResolvedValue(mockDashboardSummary);
    vi.mocked(metricsApi.queryProjectSystemRange).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <GatewayMonitoringPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Active Requests')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
    });
  });

  it('enforces project isolation by querying listProjectGateways and never listAllGateways', async () => {
    vi.mocked(gatewaysApi.listProjectGateways).mockResolvedValue([mockActiveGateway]);
    vi.mocked(metricsApi.getDashboardSummary).mockResolvedValue(mockDashboardSummary);
    vi.mocked(metricsApi.queryProjectSystemRange).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <GatewayMonitoringPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(gatewaysApi.listProjectGateways).toHaveBeenCalledWith('proj-123');
      expect(gatewaysApi.listAllGateways).not.toHaveBeenCalled();
    });
  });

  it('strictly selects running/active gateway and ignores unready provisioning gateways', async () => {
    // Only a provisioning gateway exists
    vi.mocked(gatewaysApi.listProjectGateways).mockResolvedValue([mockProvisioningGateway]);
    vi.mocked(metricsApi.getDashboardSummary).mockResolvedValue(mockDashboardSummary);
    vi.mocked(metricsApi.queryProjectSystemRange).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <GatewayMonitoringPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      // Must trigger No Active Gateway state because provisioning gateway is not running/active
      expect(screen.getByText('No Active Gateway Provisioned')).toBeInTheDocument();
    });
  });

  it('renders real telemetry values for throughput, error rate, and latencies', async () => {
    vi.mocked(gatewaysApi.listProjectGateways).mockResolvedValue([mockActiveGateway]);
    vi.mocked(metricsApi.getDashboardSummary).mockResolvedValue(mockDashboardSummary);
    vi.mocked(metricsApi.queryProjectSystemRange).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <GatewayMonitoringPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('12.50 req/s')).toBeInTheDocument();
      expect(screen.getByText('0.8%')).toBeInTheDocument();
      expect(screen.getByText('14.2 ms')).toBeInTheDocument();
      expect(screen.getByText('45.0 ms')).toBeInTheDocument();
    });
  });

  it('displays error banner when metrics query fails', async () => {
    vi.mocked(gatewaysApi.listProjectGateways).mockResolvedValue([mockActiveGateway]);
    vi.mocked(metricsApi.getDashboardSummary).mockRejectedValue(new Error('Prometheus service unavailable'));
    vi.mocked(metricsApi.queryProjectSystemRange).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <GatewayMonitoringPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Prometheus service unavailable/i)).toBeInTheDocument();
    });
  });
});
