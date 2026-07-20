import React, { useState } from 'react';
import { isAxiosError } from 'axios';
import { useSignupMutation } from '../hooks/useSignupMutation';

export interface SignupFormProps {
  readonly onSignupSuccess: () => void;
  readonly onToggleLogin: () => void;
}

function describeSignupError(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response) {
      return 'Could not reach the server. Check your connection and try again.';
    }

    const status = error.response.status;
    const backendMessage = (error.response.data as { error?: string } | undefined)?.error;

    if (status === 409) {
      return backendMessage ?? 'Account details already registered. Please use another username or email.';
    }
    if (status === 400) {
      return backendMessage ?? 'Invalid registration data or weak password.';
    }
    return backendMessage ?? 'Signup failed. Please try again.';
  }
  return 'An unexpected error occurred. Please try again.';
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSignupSuccess, onToggleLogin }) => {
  const [companyName, setCompanyName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const signupMutation = useSignupMutation();

  const isSubmitting = signupMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!companyName.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setFormError('Please enter all the onboarding fields.');
      return;
    }

    signupMutation.mutate(
      { company: companyName.trim(), username: username.trim(), email: email.trim(), password },
      {
        onSuccess: () => {
          onSignupSuccess();
        },
        onError: (error) => {
          console.error('[SignupForm] Onboarding failed:', error);
          setFormError(describeSignupError(error));
        },
      }
    );
  };

  return (
    <div className="w-full flex flex-col justify-center px-8 md:px-16 py-10 text-left select-none animate-fade-in-up stagger-2">
      
      {/* Title Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#171c1f] mb-1 tracking-tight">Onboarding</h2>
        <p className="text-sm text-gray-500">Provision a new tenant and admin workspace</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {formError && (
          <div className="text-[#C03E48] text-xs font-semibold border border-[#C03E48]/20 bg-[#C03E48]/5 px-4 py-3 rounded-2xl">
            {formError}
          </div>
        )}

        {/* Company Name Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700" htmlFor="company">
            Company Name
          </label>
          <div className="relative">
            <input
              className="w-full bg-[#f6f8fa] border border-gray-200 text-[#171c1f] text-sm rounded-2xl pl-4 pr-12 py-3.5 focus:border-[#0a1821] focus:ring-1 focus:ring-[#0a1821]/20 focus:outline-none transition-all duration-300 placeholder:text-gray-300"
              id="company"
              placeholder="e.g. Acme Corp"
              type="text"
              value={companyName}
              disabled={isSubmitting}
              onChange={(e) => {
                setCompanyName(e.target.value);
                setFormError('');
              }}
            />
            <span className="material-symbols-outlined absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-[20px] pointer-events-none select-none">
              domain
            </span>
          </div>
        </div>

        {/* User Name Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700" htmlFor="username">
            User Name
          </label>
          <div className="relative">
            <input
              className="w-full bg-[#f6f8fa] border border-gray-200 text-[#171c1f] text-sm rounded-2xl pl-4 pr-12 py-3.5 focus:border-[#0a1821] focus:ring-1 focus:ring-[#0a1821]/20 focus:outline-none transition-all duration-300 placeholder:text-gray-300"
              id="username"
              placeholder="e.g. admin"
              type="text"
              value={username}
              disabled={isSubmitting}
              onChange={(e) => {
                setUsername(e.target.value);
                setFormError('');
              }}
            />
            <span className="material-symbols-outlined absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-[20px] pointer-events-none select-none">
              person
            </span>
          </div>
        </div>

        {/* Email Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700" htmlFor="signup-email">
            Email Address
          </label>
          <div className="relative">
            <input
              className="w-full bg-[#f6f8fa] border border-gray-200 text-[#171c1f] text-sm rounded-2xl pl-4 pr-12 py-3.5 focus:border-[#0a1821] focus:ring-1 focus:ring-[#0a1821]/20 focus:outline-none transition-all duration-300 placeholder:text-gray-300"
              id="signup-email"
              placeholder="name@company.com"
              type="email"
              required
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              value={email}
              disabled={isSubmitting}
              onChange={(e) => {
                setEmail(e.target.value);
                setFormError('');
              }}
            />
            <span className="material-symbols-outlined absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-[20px] pointer-events-none select-none">
              mail
            </span>
          </div>
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              className="w-full bg-[#f6f8fa] border border-gray-200 text-[#171c1f] text-sm rounded-2xl pl-4 pr-12 py-3.5 focus:border-[#0a1821] focus:ring-1 focus:ring-[#0a1821]/20 focus:outline-none transition-all duration-300 placeholder:text-gray-300"
              id="password"
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
              value={password}
              disabled={isSubmitting}
              onChange={(e) => {
                setPassword(e.target.value);
                setFormError('');
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] select-none">
                {showPassword ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#0a1821] text-white font-bold text-sm py-4 rounded-full hover:bg-[#123749] hover:shadow-[0_8px_20px_rgba(10,24,33,0.25)] transition-all duration-300 flex justify-center items-center gap-2 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting ? 'Provisioning...' : 'Provision Workspace'}
        </button>

        {/* Footer text */}
        <div className="text-center mt-4">
          <span className="text-xs text-gray-500 mr-1.5">Already have an account?</span>
          <button
            type="button"
            onClick={onToggleLogin}
            className="text-xs font-semibold text-[#C03E48] hover:underline cursor-pointer bg-transparent border-none outline-none"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
