import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProfileSettings } from '../pages/ProfileSettings';
import { useAuthStore } from '../../../store/authStore';
import * as authApi from '../api/authApi';

vi.mock('../api/authApi');

const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
};

describe('ProfileSettings Password Reset Navigation', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.clearAllMocks();

    useAuthStore.setState({
      user: { username: 'admin@company.com' },
      isSuperAdmin: false,
    });
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/profile']}>
          <Routes>
            <Route
              path="/profile"
              element={
                <>
                  <ProfileSettings />
                  <LocationDisplay />
                </>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <>
                  <div>Forgot Password Page</div>
                  <LocationDisplay />
                </>
              }
            />
            <Route
              path="/reset-password"
              element={
                <>
                  <div>Reset Password Page</div>
                  <LocationDisplay />
                </>
              }
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('renders the Reset Password button', () => {
    renderComponent();
    const btn = screen.getByRole('button', { name: /reset password/i });
    expect(btn).toBeInTheDocument();
  });

  it('navigates to /forgot-password when Reset Password is clicked', () => {
    renderComponent();

    const btn = screen.getByRole('button', { name: /reset password/i });
    fireEvent.click(btn);

    expect(screen.getByTestId('location-display')).toHaveTextContent('/forgot-password');
    expect(screen.getByText('Forgot Password Page')).toBeInTheDocument();
  });

  it('does NOT navigate directly to /reset-password', () => {
    renderComponent();

    const btn = screen.getByRole('button', { name: /reset password/i });
    fireEvent.click(btn);

    expect(screen.getByTestId('location-display')).not.toHaveTextContent('/reset-password');
  });

  it('does NOT trigger direct password-reset API requests from ProfileSettings', () => {
    renderComponent();

    const btn = screen.getByRole('button', { name: /reset password/i });
    fireEvent.click(btn);

    // Verify no direct auth API calls were made
    expect(authApi.resetPassword).not.toHaveBeenCalled();
    expect(authApi.forgotPassword).not.toHaveBeenCalled();
  });
});
