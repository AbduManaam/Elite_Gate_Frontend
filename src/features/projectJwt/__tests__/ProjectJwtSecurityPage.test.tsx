import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProjectJwtSecurityPage } from '../pages/ProjectJwtSecurityPage';
import { RequireProjectOwner } from '../../../app/router/RequireProjectOwner';
import * as projectJwtApi from '../api/projectJwtApi';
import * as useActiveProjectModule from '../../../shared/hooks/useActiveProject';
import type { ProjectJwtConfig } from '../api/types';

vi.mock('../api/projectJwtApi');
vi.mock('../../../shared/hooks/useActiveProject');

const mockConfiguredResponse: ProjectJwtConfig = {
  configured: true,
  secret_configured: true,
  enabled: true,
  algorithm: 'HS256',
  config_version: 2,
  issuer: 'https://auth.company.com',
  audiences: ['api.company.com'],
  subject_claim: 'sub',
  role_claim: 'role',
  scopes_claim: 'scope',
  clock_skew_seconds: 30,
};

const mockUnconfiguredResponse: ProjectJwtConfig = {
  configured: false,
  secret_configured: false,
  enabled: false,
  algorithm: 'HS256',
  config_version: 0,
  issuer: null,
  audiences: [],
  subject_claim: 'sub',
  role_claim: 'role',
  scopes_claim: 'scope',
  clock_skew_seconds: 30,
};

function renderPage(role = 'owner', projectId = 'proj-123') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  vi.spyOn(useActiveProjectModule, 'useActiveProject').mockReturnValue({
    projectId,
    projectRole: role as 'owner' | 'editor' | 'viewer',
    setActiveProjectId: vi.fn(),
    setActiveProjectRole: vi.fn(),
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/projects/${projectId}/security`]}>
        <Routes>
          <Route
            path="/projects/:projectId/security"
            element={
              <RequireProjectOwner>
                <ProjectJwtSecurityPage />
              </RequireProjectOwner>
            }
          />
          <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('ProjectJwtSecurityPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. GET loads existing safe JWT configuration', async () => {
    vi.mocked(projectJwtApi.getProjectJwtConfig).mockResolvedValue(mockConfiguredResponse);

    renderPage('owner');

    expect(screen.getByText(/Loading JWT authentication configuration.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByDisplayValue('https://auth.company.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('api.company.com')).toBeInTheDocument();
    });

    expect(projectJwtApi.getProjectJwtConfig).toHaveBeenCalledWith('proj-123');
  });

  it('2. Stored secret value is never rendered in inputs or DOM', async () => {
    vi.mocked(projectJwtApi.getProjectJwtConfig).mockResolvedValue(mockConfiguredResponse);

    renderPage('owner');

    await waitFor(() => {
      expect(screen.getByDisplayValue('https://auth.company.com')).toBeInTheDocument();
    });

    const secretInput = screen.getByLabelText(/JWT Secret/i) as HTMLInputElement;
    expect(secretInput.value).toBe('');
    expect(screen.queryByText(/arn:aws:secretsmanager/i)).not.toBeInTheDocument();
  });

  it('3. secret_configured=true shows "A secret is already configured"', async () => {
    vi.mocked(projectJwtApi.getProjectJwtConfig).mockResolvedValue(mockConfiguredResponse);

    renderPage('owner');

    await waitFor(() => {
      expect(screen.getByText(/A secret is already configured/i)).toBeInTheDocument();
    });
  });

  it('4. First configuration with secret_configured=false requires a secret', async () => {
    vi.mocked(projectJwtApi.getProjectJwtConfig).mockResolvedValue(mockUnconfiguredResponse);

    renderPage('owner');

    await waitFor(() => {
      expect(screen.getByText(/Save JWT Configuration/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Save JWT Configuration/i }));

    await waitFor(() => {
      expect(screen.getByText(/A secret key is required for initial JWT configuration/i)).toBeInTheDocument();
    });

    expect(projectJwtApi.configureProjectJwt).not.toHaveBeenCalled();
  });

  it('5 & 6. Existing configuration saves with blank secret and omits "secret" property from PUT input', async () => {
    vi.mocked(projectJwtApi.getProjectJwtConfig).mockResolvedValue(mockConfiguredResponse);
    vi.mocked(projectJwtApi.configureProjectJwt).mockResolvedValue({
      ...mockConfiguredResponse,
      config_version: 3,
    });

    renderPage('owner');

    await waitFor(() => {
      expect(screen.getByDisplayValue('https://auth.company.com')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Save JWT Configuration/i }));

    await waitFor(() => {
      expect(projectJwtApi.configureProjectJwt).toHaveBeenCalled();
    });

    const calls = vi.mocked(projectJwtApi.configureProjectJwt).mock.calls;
    const input = calls[0][1];
    expect(input).not.toHaveProperty('secret');
  });

  it('7. Entering a new secret sends the secret for rotation', async () => {
    vi.mocked(projectJwtApi.getProjectJwtConfig).mockResolvedValue(mockConfiguredResponse);
    vi.mocked(projectJwtApi.configureProjectJwt).mockResolvedValue({
      ...mockConfiguredResponse,
      config_version: 3,
    });

    renderPage('owner');

    await waitFor(() => {
      expect(screen.getByDisplayValue('https://auth.company.com')).toBeInTheDocument();
    });

    const secretInput = screen.getByLabelText(/JWT Secret/i);
    fireEvent.change(secretInput, {
      target: { value: 'this-is-a-new-test-secret-at-least-32-bytes-long' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Save JWT Configuration/i }));

    await waitFor(() => {
      expect(projectJwtApi.configureProjectJwt).toHaveBeenCalledWith('proj-123', expect.objectContaining({
        secret: 'this-is-a-new-test-secret-at-least-32-bytes-long',
      }));
    });
  });

  it('7b. DOM/autofill-populated secret submits even without React onChange event', async () => {
    vi.mocked(projectJwtApi.getProjectJwtConfig).mockResolvedValue(mockConfiguredResponse);
    vi.mocked(projectJwtApi.configureProjectJwt).mockResolvedValue({
      ...mockConfiguredResponse,
      config_version: 3,
    });

    renderPage('owner');

    await waitFor(() => {
      expect(screen.getByDisplayValue('https://auth.company.com')).toBeInTheDocument();
    });

    const secretInput = screen.getByLabelText(/JWT Secret/i) as HTMLInputElement;
    // Directly mutate DOM input value simulating password manager / browser autofill without React synthetic change event
    secretInput.value = 'autofilled-secret-value-at-least-32-bytes-long-1234';

    fireEvent.click(screen.getByRole('button', { name: /Save JWT Configuration/i }));

    await waitFor(() => {
      expect(projectJwtApi.configureProjectJwt).toHaveBeenCalledWith('proj-123', expect.objectContaining({
        secret: 'autofilled-secret-value-at-least-32-bytes-long-1234',
      }));
    });
  });

  it('8. Secret input is cleared after successful save', async () => {
    vi.mocked(projectJwtApi.getProjectJwtConfig).mockResolvedValue(mockConfiguredResponse);
    vi.mocked(projectJwtApi.configureProjectJwt).mockResolvedValue(mockConfiguredResponse);

    renderPage('owner');

    await waitFor(() => {
      expect(screen.getByDisplayValue('https://auth.company.com')).toBeInTheDocument();
    });

    const secretInput = screen.getByLabelText(/JWT Secret/i) as HTMLInputElement;
    fireEvent.change(secretInput, {
      target: { value: 'this-is-a-new-test-secret-at-least-32-bytes-long' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Save JWT Configuration/i }));

    await waitFor(() => {
      expect(secretInput.value).toBe('');
      expect(screen.getByText(/JWT authentication configuration saved successfully/i)).toBeInTheDocument();
    });
  });

  it('9. Project ID is included in GET, PUT, and DELETE API calls', async () => {
    vi.mocked(projectJwtApi.getProjectJwtConfig).mockResolvedValue(mockConfiguredResponse);
    vi.mocked(projectJwtApi.configureProjectJwt).mockResolvedValue(mockConfiguredResponse);
    vi.mocked(projectJwtApi.deleteProjectJwtConfig).mockResolvedValue(undefined);

    renderPage('owner', 'proj-custom-999');

    await waitFor(() => {
      expect(projectJwtApi.getProjectJwtConfig).toHaveBeenCalledWith('proj-custom-999');
      expect(screen.getByDisplayValue('https://auth.company.com')).toBeInTheDocument();
    });

    // Test PUT
    fireEvent.click(screen.getByRole('button', { name: /Save JWT Configuration/i }));
    await waitFor(() => {
      expect(projectJwtApi.configureProjectJwt).toHaveBeenCalledWith('proj-custom-999', expect.any(Object));
    });

    // Test DELETE
    fireEvent.click(screen.getByRole('button', { name: /Delete JWT Configuration/i }));
    await waitFor(() => {
      expect(screen.getByText(/Are you sure you want to delete this project's JWT/i)).toBeInTheDocument();
    });

    const input = screen.getByLabelText(/To confirm, type/i);
    fireEvent.change(input, { target: { value: 'DELETE' } });
    fireEvent.click(screen.getByRole('button', { name: /Delete Configuration/i }));

    await waitFor(() => {
      expect(projectJwtApi.deleteProjectJwtConfig).toHaveBeenCalledWith('proj-custom-999');
    });
  });

  it('10. route/project mismatch blocks old project data until project state is synchronized', async () => {
    vi.mocked(projectJwtApi.getProjectJwtConfig).mockResolvedValue({
      ...mockConfiguredResponse,
      issuer: 'https://auth.project-b.com',
    });

    const activeProjectMock = vi.mocked(
      useActiveProjectModule.useActiveProject
    );

    // Browser URL already points to Project B,
    // but the active-project store still contains Project A.
    activeProjectMock.mockReturnValue({
      projectId: 'proj-A',
      projectRole: 'owner',
      setActiveProjectId: vi.fn(),
      setActiveProjectRole: vi.fn(),
    });

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    const renderTree = () => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/projects/proj-B/security']}>
          <Routes>
            <Route
              path="/projects/:projectId/security"
              element={
                <RequireProjectOwner>
                  <ProjectJwtSecurityPage />
                </RequireProjectOwner>
              }
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const { rerender } = render(renderTree());

    // URL is B but active project is still A.
    // RequireProjectOwner must block rendering of the JWT page.
    expect(
      screen.getByText(/Resolving Project/i)
    ).toBeInTheDocument();

    // Project A configuration must never appear under Project B's URL.
    expect(
      screen.queryByDisplayValue('https://auth.company.com')
    ).not.toBeInTheDocument();

    // The JWT page should not request configuration while
    // routeProjectId and activeProjectId disagree.
    expect(
      projectJwtApi.getProjectJwtConfig
    ).not.toHaveBeenCalled();

    // Simulate ProjectLayout/store synchronization catching up to the URL.
    activeProjectMock.mockReturnValue({
      projectId: 'proj-B',
      projectRole: 'owner',
      setActiveProjectId: vi.fn(),
      setActiveProjectRole: vi.fn(),
    });

    rerender(renderTree());

    await waitFor(() => {
      expect(
        projectJwtApi.getProjectJwtConfig
      ).toHaveBeenCalledWith('proj-B');

      expect(
        screen.getByDisplayValue('https://auth.project-b.com')
      ).toBeInTheDocument();
    });
  });

  it('11, 12, 13. Delete opens ConfirmModal, requires DELETE text, and calls DELETE API', async () => {
    vi.mocked(projectJwtApi.getProjectJwtConfig).mockResolvedValue(mockConfiguredResponse);
    vi.mocked(projectJwtApi.deleteProjectJwtConfig).mockResolvedValue(undefined);

    renderPage('owner');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Delete JWT Configuration/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Delete JWT Configuration/i }));

    await waitFor(() => {
      expect(screen.getByText(/Are you sure you want to delete this project's JWT/i)).toBeInTheDocument();
    });

    const confirmButton = screen.getByRole('button', { name: /Delete Configuration/i });
    expect(confirmButton).toBeDisabled();

    const input = screen.getByLabelText(/To confirm, type/i);
    fireEvent.change(input, { target: { value: 'DELETE' } });

    expect(confirmButton).not.toBeDisabled();

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(projectJwtApi.deleteProjectJwtConfig).toHaveBeenCalledWith('proj-123');
    });
  });

  it('14. GET failure displays error state with Retry button instead of editable default form', async () => {
    vi.mocked(projectJwtApi.getProjectJwtConfig).mockRejectedValue(new Error('Network error'));

    renderPage('owner');

    await waitFor(() => {
      expect(screen.getByText(/Unable to load JWT authentication configuration/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: /Save JWT Configuration/i })).not.toBeInTheDocument();
  });

  it.each(['editor', 'viewer'] as const)(
    'RBAC Guard: redirects %s to /unauthorized',
    async (role) => {
      renderPage(role);

      await waitFor(() => {
        expect(screen.getByText('Unauthorized Page')).toBeInTheDocument();
      });
    }
  );
});
