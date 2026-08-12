import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from '../pages/LoginPage';
import { useLoginMutation } from '../hooks/useLoginMutation';

vi.mock('../hooks/useLoginMutation', () => ({
  useLoginMutation: vi.fn().mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

vi.mock('../hooks/useSignupMutation', () => ({
  useSignupMutation: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

describe('LoginPage Glassmorphism UI & Form Functionality', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.clearAllMocks();
  });

  const renderComponent = (onLoginSuccess = vi.fn()) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <LoginPage onLoginSuccess={onLoginSuccess} />
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('applies bg-white/70 and backdrop-blur-md to the right-side authentication form container', () => {
    const { container } = renderComponent();

    const rightSidePanel = container.querySelector('.bg-white\\/70');
    expect(rightSidePanel).toBeInTheDocument();
    expect(rightSidePanel).toHaveClass('backdrop-blur-md');
  });

  it('renders all core login form elements intact and readable', () => {
    renderComponent();

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot password\?/i)).toBeInTheDocument();
  });

  it('allows toggling between Sign In and Sign Up onboard forms seamlessly', () => {
    renderComponent();

    const signUpToggle = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(signUpToggle);

    expect(screen.getByRole('heading', { name: /onboarding/i })).toBeInTheDocument();

    const signInToggle = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInToggle);

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
  });

  it('handles EMAIL_NOT_VERIFIED 403 response cleanly without authenticating user', async () => {
    const loginMutateMock = vi.fn().mockImplementation((_vars, opts) => {
      opts.onError({
        isAxiosError: true,
        response: {
          status: 403,
          data: { error: 'Please verify your email before signing in.', code: 'EMAIL_NOT_VERIFIED' },
        },
      });
    });

    vi.mocked(useLoginMutation).mockReturnValue({
      mutate: loginMutateMock,
      isPending: false,
    } as unknown as ReturnType<typeof useLoginMutation>);

    const onLoginSuccess = vi.fn();
    renderComponent(onLoginSuccess);

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'unverified@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });

    fireEvent.click(screen.getByRole('button', { name: /^login$/i }));

    expect(loginMutateMock).toHaveBeenCalledWith(
      { username: 'unverified@example.com', password: 'Password123!' },
      expect.anything()
    );

    expect(onLoginSuccess).not.toHaveBeenCalled();
    expect(screen.getByText(/email verification required/i)).toBeInTheDocument();
    expect(screen.getByText(/please verify your email before signing in/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /resend verification email/i })).toBeInTheDocument();
  });
});
