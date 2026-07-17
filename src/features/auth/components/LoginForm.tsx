import React, { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { useLoginMutation } from '../hooks/useLoginMutation';

export interface LoginFormProps {
  readonly onLoginSuccess: () => void;
  readonly onToggleSignup: () => void;
}

function describeLoginError(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response) {
      return 'Could not reach the server. Check your connection and try again.';
    }

    const status = error.response.status;
    const backendMessage = (error.response.data as { error?: string } | undefined)?.error;

    if (status === 429) {
      return 'Too many login attempts. Please wait a minute before trying again.';
    }
    if (status === 423) {
      return 'This account is temporarily locked due to repeated failed attempts.';
    }
    return backendMessage ?? 'Login failed. Please try again.';
  }
  return 'An unexpected error occurred. Please try again.';
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onToggleSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const loginMutation = useLoginMutation();

  useEffect(() => {
    const err = new URLSearchParams(window.location.search).get("oauth_error");

    if (err) {
      setFormError(decodeURIComponent(err));
    }
  }, []);

  const isSubmitting = loginMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!username.trim() || !password.trim()) {
      setFormError('Please enter both your email address and password.');
      return;
    }

    loginMutation.mutate(
      { username: username.trim(), password },
      {
        onSuccess: () => {
          console.log('[LoginForm] Login successful!');
          onLoginSuccess();
        },
        onError: (error) => {
          console.error('[LoginForm] Login failed:', error);
          setFormError(describeLoginError(error));
        },
      }
    );
  };

  return (
    <div className="w-full flex flex-col justify-center px-8 md:px-16 py-10 text-left select-none animate-fade-in-up stagger-2">

      {/* Title Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#171c1f] mb-1 tracking-tight">Sign In</h2>
        <p className="text-sm text-gray-500">Access the Elite Gate Control Center</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {formError && (
          <div className="text-[#C03E48] text-xs font-semibold border border-[#C03E48]/20 bg-[#C03E48]/5 px-4 py-3 rounded-2xl">
            {formError}
          </div>
        )}

        {/* Email Address Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <input
              className="w-full bg-[#f6f8fa] border border-gray-200 text-[#171c1f] text-sm rounded-2xl pl-4 pr-12 py-3.5 focus:border-[#0a1821] focus:ring-1 focus:ring-[#0a1821]/20 focus:outline-none transition-all duration-300 placeholder:text-gray-300"
              id="email"
              placeholder="admin@elitegate.com"
              type="text"
              value={username}
              disabled={isSubmitting}
              onChange={(e) => {
                setUsername(e.target.value);
                setFormError('');
              }}
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium text-lg pointer-events-none select-none">
              @
            </span>
          </div>
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-gray-700" htmlFor="password">
              Password
            </label>
            <a
              className="text-xs font-semibold text-[#C03E48] hover:text-[#a03038] transition-colors duration-300"
              href="#recover"
              onClick={(e) => {
                e.preventDefault();
                alert('Password recovery is handled by your system administrator.');
              }}
            >
              Forgot password?
            </a>
          </div>
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
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
          {isSubmitting ? 'Authenticating...' : 'Login'}
        </button>

        {/* Divider */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-xs text-gray-400 font-normal">or</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={() => {
            window.location.href = `${import.meta.env.VITE_API_BASE_URL}/admin/google/login`;
          }}
          className="w-full bg-white border border-gray-200 text-gray-700 font-semibold text-sm py-3.5 rounded-full flex justify-center items-center gap-2 hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Footer text */}
        <div className="text-center mt-4">
          <span className="text-xs text-gray-500 mr-1.5">Don't have an account?</span>
          <button
            type="button"
            onClick={onToggleSignup}
            className="text-xs font-semibold text-[#C03E48] hover:underline cursor-pointer bg-transparent border-none outline-none"
          >
            Sign Up
          </button>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center items-center gap-4 mt-2">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5 text-gray-600 hover:text-gray-900 transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5 text-gray-600 hover:text-gray-900 transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5 text-gray-600 hover:text-gray-900 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
        </div>

        {/* Contact Administrator Link */}
        <div className="text-center mt-2">
          <a
            href="mailto:admin@elitegate.com"
            className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
          >
            Contact Administrator
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;