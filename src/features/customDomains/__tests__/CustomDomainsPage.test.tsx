import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CustomDomainsPage } from '../pages/CustomDomainsPage';
import * as customDomainsApi from '../api/customDomainsApi';
import * as useActiveProjectModule from '../../../shared/hooks/useActiveProject';
import * as useRolesModule from '../../../shared/hooks/useRoles';
import { CustomDomain } from '../api/domain.types';

vi.mock('../api/customDomainsApi');
vi.mock('../../../shared/hooks/useActiveProject');
vi.mock('../../../shared/hooks/useRoles');

const mockDomains: CustomDomain[] = [
  {
    id: 'dom-1',
    project_id: 'proj-123',
    hostname: 'api.customer.com',
    status: 'pending_verification',
    verification_record_name: '_elitegate-verification.api.customer.com',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'dom-2',
    project_id: 'proj-123',
    hostname: 'app.customer.com',
    status: 'verified',
    routing_status: 'pending',
    routing_target: 'gateway.elitegateway.site',
    created_at: '2026-08-01T09:00:00Z',
    updated_at: '2026-08-01T09:30:00Z',
  },
  {
    id: 'dom-3',
    project_id: 'proj-123',
    hostname: 'ready.customer.com',
    status: 'verified',
    routing_status: 'ready',
    routing_target: 'gateway.elitegateway.site',
    created_at: '2026-08-01T08:00:00Z',
    updated_at: '2026-08-01T08:30:00Z',
  },
  {
    id: 'dom-4',
    project_id: 'proj-123',
    hostname: 'live.customer.com',
    status: 'active',
    routing_status: 'ready',
    routing_target: 'gateway.elitegateway.site',
    created_at: '2026-08-01T07:00:00Z',
    updated_at: '2026-08-01T07:30:00Z',
  },
];

function renderWithProviders(role = 'owner') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  vi.spyOn(useActiveProjectModule, 'useActiveProject').mockReturnValue({
    projectId: 'proj-123',
    activeProjectId: 'proj-123',
    projectRole: role as 'owner' | 'editor' | 'viewer',
    setActiveProjectId: vi.fn(),
    setActiveProjectRole: vi.fn(),
  });

  vi.spyOn(useRolesModule, 'useRoles').mockReturnValue({
    role,
    isSuperAdmin: false,
    can: (minRole: string) => (role === 'owner') || (role === 'editor' && minRole === 'viewer'),
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/projects/proj-123/custom-domains']}>
        <Routes>
          <Route path="/projects/:projectId/custom-domains" element={<CustomDomainsPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('CustomDomainsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state then lists domains', async () => {
    vi.mocked(customDomainsApi.listCustomDomains).mockResolvedValue(mockDomains);

    renderWithProviders('owner');

    expect(screen.getByText(/Loading custom domains.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('api.customer.com')).toBeInTheDocument();
      expect(screen.getByText('app.customer.com')).toBeInTheDocument();
      expect(screen.getByText('ready.customer.com')).toBeInTheDocument();
      expect(screen.getByText('live.customer.com')).toBeInTheDocument();
    });
  });

  it('displays empty state when no domains exist', async () => {
    vi.mocked(customDomainsApi.listCustomDomains).mockResolvedValue([]);

    renderWithProviders('owner');

    await waitFor(() => {
      expect(screen.getByText('No Custom Domains Configured')).toBeInTheDocument();
    });
  });

  it('opens create modal, submits hostname and displays TXT record instructions', async () => {
    vi.mocked(customDomainsApi.listCustomDomains).mockResolvedValue([]);
    const createdDomain: CustomDomain = {
      id: 'dom-new',
      project_id: 'proj-123',
      hostname: 'new.customer.com',
      status: 'pending_verification',
      verification_record: {
        type: 'TXT',
        name: '_elitegate-verification.new.customer.com',
        value: 'elitegate-verification=secret-token-123',
      },
      created_at: '2026-08-01T11:00:00Z',
      updated_at: '2026-08-01T11:00:00Z',
    };
    vi.mocked(customDomainsApi.createCustomDomain).mockResolvedValue(createdDomain);

    renderWithProviders('owner');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Add Custom Domain/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Add Custom Domain/i }));

    const input = screen.getByLabelText(/Hostname/i);
    fireEvent.change(input, { target: { value: 'NEW.CUSTOMER.COM  ' } });

    fireEvent.click(screen.getByRole('button', { name: /^Add Domain$/i }));

    await waitFor(() => {
      expect(customDomainsApi.createCustomDomain).toHaveBeenCalledWith('proj-123', {
        hostname: 'new.customer.com',
      });
      expect(screen.getByText('_elitegate-verification.new.customer.com')).toBeInTheDocument();
      expect(screen.getByText('elitegate-verification=secret-token-123')).toBeInTheDocument();
    });
  });

  it('handles verify ownership action', async () => {
    vi.mocked(customDomainsApi.listCustomDomains).mockResolvedValue(mockDomains);
    vi.mocked(customDomainsApi.verifyDomainOwnership).mockResolvedValue({
      ...mockDomains[0],
      status: 'verified',
    });

    renderWithProviders('owner');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Verify Ownership/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Verify Ownership/i }));

    await waitFor(() => {
      expect(customDomainsApi.verifyDomainOwnership).toHaveBeenCalledWith('proj-123', 'dom-1');
    });
  });

  it('handles check routing action', async () => {
    vi.mocked(customDomainsApi.listCustomDomains).mockResolvedValue(mockDomains);
    vi.mocked(customDomainsApi.checkDomainRouting).mockResolvedValue({
      ...mockDomains[1],
      routing_status: 'ready',
    });

    renderWithProviders('owner');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Check Routing/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Check Routing/i }));

    await waitFor(() => {
      expect(customDomainsApi.checkDomainRouting).toHaveBeenCalledWith('proj-123', 'dom-2');
    });
  });

  it('handles activate action', async () => {
    vi.mocked(customDomainsApi.listCustomDomains).mockResolvedValue(mockDomains);
    vi.mocked(customDomainsApi.activateCustomDomain).mockResolvedValue({
      message: 'activation queued',
      status: 'provisioning_started',
      custom_domain: {
        ...mockDomains[2],
        status: 'verified',
      },
    });

    renderWithProviders('owner');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Activate/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Activate/i }));

    await waitFor(() => {
      expect(customDomainsApi.activateCustomDomain).toHaveBeenCalledWith('proj-123', 'dom-3');
    });
  });

  it('hides mutation action buttons for viewer role', async () => {
    vi.mocked(customDomainsApi.listCustomDomains).mockResolvedValue(mockDomains);

    renderWithProviders('viewer');

    await waitFor(() => {
      expect(screen.getByText('api.customer.com')).toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: /Add Custom Domain/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Verify Ownership/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Check Routing/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Activate/i })).not.toBeInTheDocument();
  });

  it('handles delete confirmation dialog and execution', async () => {
    vi.mocked(customDomainsApi.listCustomDomains).mockResolvedValue(mockDomains);
    vi.mocked(customDomainsApi.deleteCustomDomain).mockResolvedValue(undefined);

    renderWithProviders('owner');

    await waitFor(() => {
      expect(screen.getAllByTitle('Delete domain').length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getAllByTitle('Delete domain')[0]);

    await waitFor(() => {
      expect(screen.getByText(/Are you sure you want to delete the custom domain/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Delete Domain/i }));

    await waitFor(() => {
      expect(customDomainsApi.deleteCustomDomain).toHaveBeenCalledWith('proj-123', 'dom-1');
    });
  });
});
