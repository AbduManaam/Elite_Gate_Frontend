import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useResetPasswordMutation } from '../hooks/useResetPasswordMutation';

export const ResetPasswordPage: React.FC = () => {
  const [token] = useState<string | null>(() => {
    const value = new URLSearchParams(window.location.search).get('token');
    if (value) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    return value;
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const resetMutation = useResetPasswordMutation();

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'referrer';
    meta.content = 'no-referrer';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0a1821] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
          <h2 className="text-2xl font-bold text-[#171c1f] mb-2">Invalid Link</h2>
          <p className="text-sm text-gray-500 mb-6">
            This password reset link is invalid or incomplete.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block bg-[#0a1821] text-white font-bold text-sm px-6 py-3.5 rounded-full hover:bg-[#123749]"
          >
            Request a New Link
          </Link>
        </div>
      </div>
    );
  }

  const validatePasswordRequirements = (pwd: string): string | null => {
    if (pwd.length < 8) return 'Password must be at least 8 characters long.';
    if (pwd.length > 72) return 'Password must not exceed 72 characters.';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain at least one uppercase letter (A-Z).';
    if (!/[a-z]/.test(pwd)) return 'Password must contain at least one lowercase letter (a-z).';
    if (!/[0-9]/.test(pwd)) return 'Password must contain at least one digit (0-9).';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return 'Password must contain at least one special character.';
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    const validationError = validatePasswordRequirements(newPassword);
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    resetMutation.mutate(
      { token, newPassword },
      {
        onSuccess: (data) => {
          setSuccessMessage(data.message);
          setNewPassword('');
          setConfirmPassword('');
        },
        onError: (error: unknown) => {
          if (axios.isAxiosError<{ error?: string }>(error)) {
            setErrorMsg(error.response?.data?.error ?? 'Failed to reset password. Link may be expired.');
            return;
          }
          setErrorMsg('Failed to reset password. Link may be expired.');
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#0a1821] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold text-[#171c1f] mb-2">Reset Password</h2>
        <p className="text-sm text-gray-500 mb-6">Enter your new password below.</p>

        {successMessage ? (
          <div className="flex flex-col gap-4">
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm p-4 rounded-2xl">
              {successMessage}
            </div>
            <Link
              to="/login"
              className="w-full text-center bg-[#0a1821] text-white font-bold text-sm py-3.5 rounded-full hover:bg-[#123749] transition-all"
            >
              Sign In with New Password
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {errorMsg && (
              <div className="text-[#C03E48] text-xs font-semibold border border-[#C03E48]/20 bg-[#C03E48]/5 px-4 py-3 rounded-2xl">
                {errorMsg}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700" htmlFor="newPassword">
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={72}
                  disabled={resetMutation.isPending}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#f6f8fa] border border-gray-200 text-sm rounded-2xl pl-4 pr-12 py-3.5 focus:border-[#0a1821] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                  aria-pressed={showNewPassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showNewPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={72}
                  disabled={resetMutation.isPending}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#f6f8fa] border border-gray-200 text-sm rounded-2xl pl-4 pr-12 py-3.5 focus:border-[#0a1821] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  aria-pressed={showConfirmPassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showConfirmPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={resetMutation.isPending}
              className="w-full bg-[#0a1821] text-white font-bold text-sm py-4 rounded-full hover:bg-[#123749] transition-all cursor-pointer disabled:opacity-50"
            >
              {resetMutation.isPending ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
