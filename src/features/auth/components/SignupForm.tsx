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
      return 'This username is already taken. Please choose another one.';
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
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const signupMutation = useSignupMutation();

  const isSubmitting = signupMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!companyName.trim() || !username.trim() || !password.trim()) {
      setFormError('Please initialize all onboarding fields.');
      return;
    }

    signupMutation.mutate(
      { company: companyName.trim(), username: username.trim(), password },
      {
        onSuccess: (data) => {
          console.log('[SignupForm] Onboarding successful! Backend returned tokens:', data);
          onSignupSuccess();
        },
        onError: (error) => {
          console.error('[SignupForm] Onboarding failed:', error);
          if (isAxiosError(error)) {
            console.error('[SignupForm] Backend error response status:', error.response?.status);
            console.error('[SignupForm] Backend error response data:', error.response?.data);
          }
          setFormError(describeSignupError(error));
        },
      }
    );
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl shadow-2xl relative overflow-hidden animate-fade-in-up stagger-2">
      {/* Subtle Form Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 blur-[100px] rounded-full"></div>

      <div className="mb-lg relative z-10 text-left">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-xs tracking-tight">Onboarding Terminal</h2>
        <p className="font-body-md text-sm text-on-surface-variant">Provision a new tenant and admin workspace.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-md relative z-10 text-left">
        {formError && (
          <div className="text-error font-body-sm text-sm border border-error/20 bg-error/5 p-sm rounded animate-reveal-sequential">
            {formError}
          </div>
        )}

        {/* Company Name Input */}
        <div className="flex flex-col gap-xs animate-reveal-sequential stagger-3">
          <label className="font-label-mono text-[11px] uppercase tracking-widest text-[#94A39E]" htmlFor="company">
            Company Name
          </label>
          <div className="relative group input-glow">
            <span className="material-symbols-outlined absolute left-sm top-1/2 transform -translate-y-1/2 text-[#94A39E] transition-colors duration-300 group-focus-within:text-primary">
              domain
            </span>
            <input
              className="w-full bg-[#00120b] border border-[#0F4032] text-on-surface font-body-md text-sm rounded pl-xl py-3 focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all duration-300 placeholder:text-[#3C4A46]"
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
          </div>
        </div>

        {/* User Name Input */}
        <div className="flex flex-col gap-xs animate-reveal-sequential stagger-4">
          <label className="font-label-mono text-[11px] uppercase tracking-widest text-[#94A39E]" htmlFor="email">
            User Name
          </label>
          <div className="relative group input-glow">
            <span className="material-symbols-outlined absolute left-sm top-1/2 transform -translate-y-1/2 text-[#94A39E] transition-colors duration-300 group-focus-within:text-primary">
              terminal
            </span>
            <input
              className="w-full bg-[#00120b] border border-[#0F4032] text-on-surface font-label-mono text-sm rounded pl-xl py-3 focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all duration-300 placeholder:text-[#3C4A46]"
              id="email"
              placeholder="User Name"
              type="text"
              value={username}
              disabled={isSubmitting}
              onChange={(e) => {
                setUsername(e.target.value);
                setFormError('');
              }}
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-xs animate-reveal-sequential stagger-5">
          <label className="font-label-mono text-[11px] uppercase tracking-widest text-[#94A39E]" htmlFor="password">
            Password
          </label>
          <div className="relative group input-glow">
            <span className="material-symbols-outlined absolute left-sm top-1/2 transform -translate-y-1/2 text-[#94A39E] transition-colors duration-300 group-focus-within:text-primary">
              key
            </span>
            <input
              className="w-full bg-[#00120b] border border-[#0F4032] text-on-surface font-body-md text-sm rounded pl-xl py-3 focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all duration-300 placeholder:text-[#3C4A46]"
              id="password"
              placeholder="Password"
              type="password"
              value={password}
              disabled={isSubmitting}
              onChange={(e) => {
                setPassword(e.target.value);
                setFormError('');
              }}
            />
          </div>
        </div>

        {/* Primary Action */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-sm bg-primary text-[#00120b] font-bold text-sm py-3 rounded-lg hover:brightness-110 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(195,255,146,0.4)] transition-all duration-300 animate-reveal-sequential stagger-5 flex justify-center items-center gap-sm active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting ? 'PROVISIONING…' : 'PROVISION WORKSPACE'}
          <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
        </button>

        <div className="text-center mt-md animate-reveal-sequential stagger-5">
          <span className="font-body-sm text-[11px] text-[#94A39E] mr-xs">Already have an account?</span>
          <button
            type="button"
            onClick={onToggleLogin}
            className="font-label-mono text-[11px] text-primary hover:text-primary-fixed-dim transition-colors duration-300 cursor-pointer bg-transparent border-none uppercase tracking-widest outline-none"
          >
            Access Terminal
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
