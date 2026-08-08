import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UpstreamHealthBadge } from '../components/UpstreamHealthBadge';
import { UpstreamTable } from '../components/UpstreamTable';
import * as upstreamsApi from '../api/upstreamsApi';
import { queryKeys } from '../../../shared/api/queryKeys';
import { UpstreamRecord } from '../api/types';

vi.mock('../api/upstreamsApi', async () => {
  const actual = await vi.importActual('../api/upstreamsApi');
  return {
    ...actual,
    checkUpstreamHealth: vi.fn(),
  };
});

const mockUpstream1: UpstreamRecord = {
  id: 'ups-1',
  project_id: 'proj-123',
  name: 'yumzy-backend',
  target_url: 'http://localhost:8080',
  protocol: 'http',
  enabled: true,
  health_path: '/health',
  lb_strategy: 'round_robin',
  created_at: '2026-08-01T10:00:00Z',
  updated_at: '2026-08-01T10:00:00Z',
};

const mockUpstream2: UpstreamRecord = {
  id: 'ups-2',
  project_id: 'proj-123',
  name: 'order-service',
  target_url: 'http://localhost:9090',
  protocol: 'http',
  enabled: true,
  health_path: '/health',
  lb_strategy: 'round_robin',
  created_at: '2026-08-01T10:00:00Z',
  updated_at: '2026-08-01T10:00:00Z',
};

const mockDisabledUpstream: UpstreamRecord = {
  id: 'ups-3',
  project_id: 'proj-123',
  name: 'legacy-service',
  target_url: 'http://localhost:7070',
  protocol: 'http',
  enabled: false,
  health_path: '/health',
  lb_strategy: 'round_robin',
  created_at: '2026-08-01T10:00:00Z',
  updated_at: '2026-08-01T10:00:00Z',
};

describe('UpstreamHealth Badge & Data-fetching', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  it('displays Checking... while loading initial health state', () => {
    vi.mocked(upstreamsApi.checkUpstreamHealth).mockReturnValue(new Promise(() => {}));

    render(
      <QueryClientProvider client={queryClient}>
        <UpstreamHealthBadge projectId="proj-123" upstreamId="ups-1" enabled={true} />
      </QueryClientProvider>
    );

    expect(screen.getByText('Checking...')).toBeInTheDocument();
  });

  it('displays Healthy when backend confirms reachable target', async () => {
    vi.mocked(upstreamsApi.checkUpstreamHealth).mockResolvedValue({
      status: 'healthy',
      status_code: 200,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <UpstreamHealthBadge projectId="proj-123" upstreamId="ups-1" enabled={true} />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Healthy')).toBeInTheDocument();
    });
  });

  it('displays Unhealthy with failure detail when target or tunnel is stopped', async () => {
    vi.mocked(upstreamsApi.checkUpstreamHealth).mockResolvedValue({
      status: 'unhealthy',
      error: 'connection refused (Cloudflare tunnel down)',
    });

    render(
      <QueryClientProvider client={queryClient}>
        <UpstreamHealthBadge projectId="proj-123" upstreamId="ups-1" enabled={true} />
      </QueryClientProvider>
    );

    await waitFor(() => {
      const badge = screen.getByText('Unhealthy');
      expect(badge).toBeInTheDocument();
    });

    const badgeContainer = screen.getByLabelText(/Upstream health: Unhealthy/i);
    expect(badgeContainer.getAttribute('title')).toContain('connection refused (Cloudflare tunnel down)');
  });

  it('displays Unknown when health check API returns error', async () => {
    vi.mocked(upstreamsApi.checkUpstreamHealth).mockRejectedValue(new Error('Network error'));

    render(
      <QueryClientProvider client={queryClient}>
        <UpstreamHealthBadge projectId="proj-123" upstreamId="ups-1" enabled={true} />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });
  });

  it('displays Disabled and does NOT poll when upstream configuration is disabled', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <UpstreamHealthBadge projectId="proj-123" upstreamId="ups-3" enabled={false} />
      </QueryClientProvider>
    );

    expect(screen.getByText('Disabled')).toBeInTheDocument();
    expect(upstreamsApi.checkUpstreamHealth).not.toHaveBeenCalled();
  });

  it('renders independent health statuses for multiple upstreams in UpstreamTable', async () => {
    vi.mocked(upstreamsApi.checkUpstreamHealth).mockImplementation(async (_proj, id) => {
      if (id === 'ups-1') return { status: 'healthy', status_code: 200 };
      if (id === 'ups-2') return { status: 'unhealthy', error: 'DNS resolution failed' };
      return { status: 'unsupported' };
    });

    render(
      <QueryClientProvider client={queryClient}>
        <UpstreamTable
          projectId="proj-123"
          upstreams={[mockUpstream1, mockUpstream2, mockDisabledUpstream]}
          expandedRowId={null}
          onToggleExpand={vi.fn()}
          onEdit={vi.fn()}
          onToggleEnabled={vi.fn()}
          onViewTargets={vi.fn()}
          onDelete={vi.fn()}
        />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Healthy')).toBeInTheDocument();
      expect(screen.getByText('Unhealthy')).toBeInTheDocument();
      expect(
        screen.getByLabelText('Upstream health: Disabled')
      ).toBeInTheDocument();
    });
  });

  it('constructs project-scoped query key for upstream health', () => {
    const key = queryKeys.upstreamHealth('proj-abc', 'ups-123');
    expect(key).toEqual(['projects', 'proj-abc', 'upstreams', 'ups-123', 'health']);
  });
});
