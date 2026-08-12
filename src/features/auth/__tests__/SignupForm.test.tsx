import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SignupForm } from '../components/SignupForm';
import { useAuthStore } from '../../../store/authStore';
import * as authApi from '../api/authApi';

vi.mock('../api/authApi', async (importOriginal) => {
  const actual = await importOriginal<typeof authApi>();
  return {
    ...actual,
    signup: vi.fn(),
    resendVerification: vi.fn(),
  };
});

describe('SignupForm Email Verification & Flow Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    vi.clearAllMocks();
    useAuthStore.setState({ accessToken: null, isAuthenticated: false });
  });

  const renderComponent = (onToggleLogin = vi.fn()) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SignupForm onToggleLogin={onToggleLogin} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('renders onboarding form initially', () => {
    renderComponent();

    expect(screen.getByRole('heading', { name: /onboarding/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/user name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('displays validation error if fields are empty', async () => {
    const { container } = renderComponent();

    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    fireEvent.submit(form!);

    expect(await screen.findByText(/please enter all the onboarding fields/i)).toBeInTheDocument();
  });

  it('displays backend 409 conflict error when email/username is taken', async () => {
    const signupMock = vi.mocked(authApi.signup).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 409,
        data: { error: 'username already taken' },
      },
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/company name/i), { target: { value: 'Acme Corp' } });
    fireEvent.change(screen.getByLabelText(/user name/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'admin@acme.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123!' } });

    fireEvent.click(screen.getByRole('button', { name: /provision workspace/i }));

    await waitFor(() => {
      expect(signupMock).toHaveBeenCalledWith('admin', 'admin@acme.com', 'Password123!', 'Acme Corp');
    });

    expect(await screen.findByText(/username already taken/i)).toBeInTheDocument();
  });

  it('successful signup displays "Check your email" view and does NOT set auth session', async () => {
    vi.mocked(authApi.signup).mockResolvedValueOnce({
      message: 'Account created. Please check your email to verify your account.',
      project_id: 'proj_12345',
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/company name/i), { target: { value: 'Acme Corp' } });
    fireEvent.change(screen.getByLabelText(/user name/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123!' } });

    fireEvent.click(screen.getByRole('button', { name: /provision workspace/i }));

    expect(await screen.findByRole('heading', { name: /check your email/i })).toBeInTheDocument();
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
    expect(screen.getByText(/please verify your email before signing in/i)).toBeInTheDocument();

    // Verify user is NOT authenticated in store
    const state = useAuthStore.getState();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('clicking "Go to login" calls onToggleLogin callback', async () => {
    vi.mocked(authApi.signup).mockResolvedValueOnce({
      message: 'Account created.',
      project_id: 'proj_12345',
    });

    const onToggleLogin = vi.fn();
    renderComponent(onToggleLogin);

    fireEvent.change(screen.getByLabelText(/company name/i), { target: { value: 'Acme Corp' } });
    fireEvent.change(screen.getByLabelText(/user name/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123!' } });

    fireEvent.click(screen.getByRole('button', { name: /provision workspace/i }));

    const goToLoginBtn = await screen.findByRole('button', { name: /go to login/i });
    fireEvent.click(goToLoginBtn);

    expect(onToggleLogin).toHaveBeenCalledTimes(1);
  });

  it('clicking "Resend verification email" calls resendVerification API with submitted email and shows success state', async () => {
    vi.mocked(authApi.signup).mockResolvedValueOnce({
      message: 'Account created.',
      project_id: 'proj_12345',
    });
    const resendMock = vi.mocked(authApi.resendVerification).mockResolvedValueOnce({
      message: 'If an unverified account exists for that email, a verification link has been sent.',
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/company name/i), { target: { value: 'Acme Corp' } });
    fireEvent.change(screen.getByLabelText(/user name/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123!' } });

    fireEvent.click(screen.getByRole('button', { name: /provision workspace/i }));

    const resendBtn = await screen.findByRole('button', { name: /resend verification email/i });
    fireEvent.click(resendBtn);

    await waitFor(() => {
      expect(resendMock).toHaveBeenCalledWith('user@example.com');
    });

    expect(await screen.findByText(/verification email sent. please check your inbox/i)).toBeInTheDocument();
  });

  it('handles rate limit HTTP 429 gracefully with a friendly wait message', async () => {
    vi.mocked(authApi.signup).mockResolvedValueOnce({
      message: 'Account created.',
      project_id: 'proj_12345',
    });
    vi.mocked(authApi.resendVerification).mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 429, data: { error: 'too many requests' } },
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/company name/i), { target: { value: 'Acme Corp' } });
    fireEvent.change(screen.getByLabelText(/user name/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123!' } });

    fireEvent.click(screen.getByRole('button', { name: /provision workspace/i }));

    const resendBtn = await screen.findByRole('button', { name: /resend verification email/i });
    fireEvent.click(resendBtn);

    expect(await screen.findByText(/too many requests. please wait a little before trying again/i)).toBeInTheDocument();
  });

  it('handles general network/server errors on resend safely', async () => {
    vi.mocked(authApi.signup).mockResolvedValueOnce({
      message: 'Account created.',
      project_id: 'proj_12345',
    });
    vi.mocked(authApi.resendVerification).mockRejectedValueOnce(new Error('Network error'));

    renderComponent();

    fireEvent.change(screen.getByLabelText(/company name/i), { target: { value: 'Acme Corp' } });
    fireEvent.change(screen.getByLabelText(/user name/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password123!' } });

    fireEvent.click(screen.getByRole('button', { name: /provision workspace/i }));

    const resendBtn = await screen.findByRole('button', { name: /resend verification email/i });
    fireEvent.click(resendBtn);

    expect(await screen.findByText(/unable to request another verification email right now. please try again later/i)).toBeInTheDocument();
  });
});
