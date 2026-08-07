import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { GatewayStatusPage } from '../pages/GatewayStatusPage';
import * as gatewaysApi from '../api/gatewaysApi';
import * as useActiveProjectModule from '../../../shared/hooks/useActiveProject';

vi.mock('../api/gatewaysApi');
vi.mock('../../../shared/hooks/useActiveProject');

const mockGatewayA: gatewaysApi.GatewayRecord = {
  id: 'gw-proj-a',
  project_id: 'project-a',
  external_id: 'node-a-01',
  endpoint_ip: '10.0.1.100',
  gateway_port: '8080',
  public_host: 'gw-a.elitegateway.site',
  public_port: 443,
  plan: 'dedicated-enterprise',
  status: 'active',
};

const mockGatewayB: gatewaysApi.GatewayRecord = {
  id: 'gw-proj-b',
  project_id: 'project-b',
  external_id: 'node-b-02',
  endpoint_ip: '10.0.2.200',
  gateway_port: '8443',
  public_host: 'gw-b.elitegateway.site',
  public_port: 8443,
  plan: 'standard',
  status: 'running',
};

describe('GatewayStatusPage Project Isolation & React Query Caching', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const renderPage = (projectId: string) => {
    vi.spyOn(useActiveProjectModule, 'useActiveProject').mockReturnValue({
      projectId,
      projectRole: 'viewer',
      setActiveProjectId: vi.fn(),
      setActiveProjectRole: vi.fn(),
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[`/projects/${projectId}/gateway/status`]}>
          <Routes>
            <Route path="/projects/:projectId/gateway/status" element={<GatewayStatusPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('calls listProjectGateways("project-a") when viewing Project A and renders Project A gateways', async () => {
    vi.mocked(gatewaysApi.listProjectGateways).mockResolvedValue([mockGatewayA]);

    renderPage('project-a');

    await waitFor(() => {
      expect(gatewaysApi.listProjectGateways).toHaveBeenCalledWith('project-a');
      expect(gatewaysApi.listAllGateways).not.toHaveBeenCalled();
      expect(screen.getByText('10.0.1.100')).toBeInTheDocument();
      expect(screen.getByText('node-a-01')).toBeInTheDocument();
    });
  });

  it('calls listProjectGateways("project-b") when viewing Project B and renders Project B gateways', async () => {
    vi.mocked(gatewaysApi.listProjectGateways).mockResolvedValue([mockGatewayB]);

    renderPage('project-b');

    await waitFor(() => {
      expect(gatewaysApi.listProjectGateways).toHaveBeenCalledWith('project-b');
      expect(gatewaysApi.listAllGateways).not.toHaveBeenCalled();
      expect(screen.getByText('10.0.2.200')).toBeInTheDocument();
      expect(screen.getByText('node-b-02')).toBeInTheDocument();
    });
  });

  it('never calls listAllGateways on GatewayStatusPage', async () => {
    vi.mocked(gatewaysApi.listProjectGateways).mockResolvedValue([mockGatewayA]);

    renderPage('project-a');

    await waitFor(() => {
      expect(gatewaysApi.listAllGateways).not.toHaveBeenCalled();
    });
  });

  it('ensures Project A gateway is not shown when viewing Project B', async () => {
    vi.mocked(gatewaysApi.listProjectGateways).mockImplementation(async (pid) => {
      if (pid === 'project-b') return [mockGatewayB];
      return [mockGatewayA];
    });

    renderPage('project-b');

    await waitFor(() => {
      expect(screen.getByText('10.0.2.200')).toBeInTheDocument();
      expect(screen.queryByText('10.0.1.100')).not.toBeInTheDocument();
      expect(screen.queryByText('node-a-01')).not.toBeInTheDocument();
    });
  });

  it('prevents leaking stale cached gateways when switching projects', async () => {
    vi.mocked(gatewaysApi.listProjectGateways).mockImplementation(async (pid) => {
      if (pid === 'project-a') return [mockGatewayA];
      if (pid === 'project-b') return [mockGatewayB];
      return [];
    });

    // Render Project A first
    const { unmount } = renderPage('project-a');

    await waitFor(() => {
      expect(screen.getByText('10.0.1.100')).toBeInTheDocument();
    });

    unmount();

    // Now render Project B with the same queryClient
    renderPage('project-b');

    await waitFor(() => {
      expect(gatewaysApi.listProjectGateways).toHaveBeenCalledWith('project-b');
      expect(screen.getByText('10.0.2.200')).toBeInTheDocument();
      expect(screen.queryByText('10.0.1.100')).not.toBeInTheDocument();
    });
  });

  it('allows Viewer role to read the project gateway list without action buttons', async () => {
    vi.mocked(gatewaysApi.listProjectGateways).mockResolvedValue([mockGatewayA]);

    renderPage('project-a');

    await waitFor(() => {
      expect(screen.getByText('Gateway Status')).toBeInTheDocument();
      expect(screen.getByText('10.0.1.100')).toBeInTheDocument();
      // Ensure no provision/restart/decommission buttons exist
      expect(screen.queryByText(/provision/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/restart/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/decommission/i)).not.toBeInTheDocument();
    });
  });

  it('displays clear empty state when the current project has no gateways', async () => {
    vi.mocked(gatewaysApi.listProjectGateways).mockResolvedValue([]);

    renderPage('project-empty');

    await waitFor(() => {
      expect(screen.getByText('No Gateways Found')).toBeInTheDocument();
      expect(
        screen.getByText('This project does not currently have any active or provisioned gateways.')
      ).toBeInTheDocument();
    });
  });

  it('displays useful error state when the API call fails', async () => {
    vi.mocked(gatewaysApi.listProjectGateways).mockRejectedValue(new Error('Network error 500'));

    renderPage('project-err');

    await waitFor(() => {
      expect(screen.getByText(/Failed to load gateways: Network error 500/i)).toBeInTheDocument();
    });
  });
});
