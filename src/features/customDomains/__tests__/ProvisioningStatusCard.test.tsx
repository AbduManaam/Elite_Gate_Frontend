import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProvisioningStatusCard } from '../components/ProvisioningStatusCard';
import * as customDomainsApi from '../api/customDomainsApi';
import { ProvisioningStatusResponse } from '../api/domain.types';

vi.mock('../api/customDomainsApi');

function renderCard(isExpanded: boolean = true, canRetry: boolean = true) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const onToast = vi.fn();

  const result = render(
    <QueryClientProvider client={queryClient}>
      <ProvisioningStatusCard
        projectId="proj-123"
        domainId="dom-1"
        isExpanded={isExpanded}
        canRetry={canRetry}
        onToast={onToast}
      />
    </QueryClientProvider>
  );

  return { ...result, onToast };
}

describe('ProvisioningStatusCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when not expanded', () => {
    renderCard(false);
    expect(screen.queryByText(/Loading provisioning status/i)).not.toBeInTheDocument();
  });

  it('renders in-progress status with CNAME validation record name', async () => {
    const mockStatus: ProvisioningStatusResponse = {
      id: 'dom-1',
      hostname: 'app.example.com',
      status: 'verified',
      routingStatus: 'ready',
      provisioningStatus: 'waiting_for_dns',
      certificateStatus: 'pending_validation',
      certificateValidationName: '_acm.app.example.com.',
      attempts: 1,
    };
    vi.mocked(customDomainsApi.getProvisioningStatus).mockResolvedValue(mockStatus);

    renderCard(true);

    await waitFor(() => {
      expect(screen.getByText('DNS Validation Pending')).toBeInTheDocument();
      expect(screen.getByText('_acm.app.example.com.')).toBeInTheDocument();
      expect(screen.getByText('Attempts: 1')).toBeInTheDocument();
    });
  });

  it('renders failed state with error message and executes retry', async () => {
    const mockFailedStatus: ProvisioningStatusResponse = {
      id: 'dom-1',
      hostname: 'app.example.com',
      status: 'verified',
      routingStatus: 'ready',
      provisioningStatus: 'failed',
      lastError: 'ACM domain validation timed out',
      attempts: 3,
    };
    vi.mocked(customDomainsApi.getProvisioningStatus).mockResolvedValue(mockFailedStatus);
    vi.mocked(customDomainsApi.retryProvisioning).mockResolvedValue({
      message: 'retry queued',
      status: 'provisioning_restarted',
      custom_domain: {
        id: 'dom-1',
        project_id: 'proj-123',
        hostname: 'app.example.com',
        status: 'verified',
        created_at: '2026-08-01T00:00:00Z',
        updated_at: '2026-08-01T00:00:00Z',
      },
    });

    const { onToast } = renderCard(true, true);

    await waitFor(() => {
      expect(screen.getByText('Provisioning Failed')).toBeInTheDocument();
      expect(screen.getByText('ACM domain validation timed out')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Retry Provisioning/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Retry Provisioning/i }));

    await waitFor(() => {
      expect(customDomainsApi.retryProvisioning).toHaveBeenCalledWith('proj-123', 'dom-1');
      expect(onToast).toHaveBeenCalledWith('Provisioning retry initiated.');
    });
  });
});
