import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import { useVerifyEmailMutation } from '../hooks/useVerifyEmailMutation';

vi.mock('../hooks/useVerifyEmailMutation', () => ({
  useVerifyEmailMutation: vi.fn(),
}));

describe('VerifyEmailPage Security & Functionality Tests', () => {
  let queryClient: QueryClient;
  let mutateMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    mutateMock = vi.fn();
    vi.mocked(useVerifyEmailMutation).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    } as unknown as ReturnType<typeof useVerifyEmailMutation>);
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  const renderComponent = (initialEntries = ['/verify-email?token=valid-token-123']) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/login" element={<div>Login Page Mock</div>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('1. token from query string triggers verification request', () => {
    renderComponent(['/verify-email?token=raw-token-abc']);
    expect(mutateMock).toHaveBeenCalledTimes(1);
  });

  it('2. correct raw token reaches verifyEmail() via mutate function', () => {
    renderComponent(['/verify-email?token=raw-secret-token-456']);
    expect(mutateMock).toHaveBeenCalledWith('raw-secret-token-456', expect.anything());
  });

  it('3. verification request runs only once', () => {
    const { rerender } = renderComponent(['/verify-email?token=single-run-token']);
    rerender(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/verify-email?token=single-run-token']}>
          <Routes>
            <Route path="/verify-email" element={<VerifyEmailPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(mutateMock).toHaveBeenCalledTimes(1);
  });

  it('4. token is removed from visible browser URL state via replaceState', () => {
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState');
    renderComponent(['/verify-email?token=secret-token-url']);
    expect(replaceStateSpy).toHaveBeenCalled();
  });

  it('5. missing token does NOT call backend', () => {
    renderComponent(['/verify-email']);
    expect(mutateMock).not.toHaveBeenCalled();
  });

  it('6. missing token shows "Invalid verification link"', () => {
    renderComponent(['/verify-email']);
    expect(screen.getByRole('heading', { name: /invalid verification link/i })).toBeInTheDocument();
    expect(screen.getByText(/this verification link is invalid, expired, or has already been used/i)).toBeInTheDocument();
  });

  it('7. initial valid-token state shows "Verifying your email"', () => {
    renderComponent(['/verify-email?token=test-token']);
    expect(screen.getByRole('heading', { name: /verifying your email/i })).toBeInTheDocument();
    expect(screen.getByText(/please wait while we verify your account/i)).toBeInTheDocument();
  });

  it('8. successful backend response shows "Email verified successfully"', async () => {
    mutateMock.mockImplementation((_token: string, callbacks: { onSuccess: () => void }) => {
      callbacks.onSuccess();
    });

    renderComponent(['/verify-email?token=valid-token']);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /email verified successfully/i })).toBeInTheDocument();
    });
    expect(screen.getByText(/your email has been verified. you can now sign in to your elitegate account./i)).toBeInTheDocument();
  });

  it('9. success state shows "Go to Login" button', async () => {
    mutateMock.mockImplementation((_token: string, callbacks: { onSuccess: () => void }) => {
      callbacks.onSuccess();
    });

    renderComponent(['/verify-email?token=valid-token']);

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /go to login/i })).toBeInTheDocument();
    });
    expect(screen.getByRole('link', { name: /go to login/i })).toHaveAttribute('href', '/login');
  });

  it('10. failed backend response shows invalid/expired state', async () => {
    mutateMock.mockImplementation((_token: string, callbacks: { onError: () => void }) => {
      callbacks.onError();
    });

    renderComponent(['/verify-email?token=expired-token']);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /invalid verification link/i })).toBeInTheDocument();
    });
    expect(screen.getByRole('link', { name: /go to login/i })).toBeInTheDocument();
  });

  it('11. successful verification does NOT store an access token', async () => {
    mutateMock.mockImplementation((_token: string, callbacks: { onSuccess: () => void }) => {
      callbacks.onSuccess();
    });

    renderComponent(['/verify-email?token=valid-token']);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /email verified successfully/i })).toBeInTheDocument();
    });

    expect(localStorage.getItem('access_token')).toBeNull();
    expect(sessionStorage.getItem('access_token')).toBeNull();
  });

  it('12. verification token is NOT written to localStorage', () => {
    renderComponent(['/verify-email?token=token-123']);
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('13. verification token is NOT written to sessionStorage', () => {
    renderComponent(['/verify-email?token=token-123']);
    expect(sessionStorage.getItem('token')).toBeNull();
  });

  it('14. no authenticated state is created on verification', async () => {
    mutateMock.mockImplementation((_token: string, callbacks: { onSuccess: () => void }) => {
      callbacks.onSuccess();
    });

    renderComponent(['/verify-email?token=valid-token']);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /email verified successfully/i })).toBeInTheDocument();
    });

    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
  });
});
