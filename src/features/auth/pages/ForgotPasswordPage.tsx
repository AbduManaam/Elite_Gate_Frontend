import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForgotPasswordMutation } from '../hooks/useForgotPasswordMutation';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const forgotMutation = useForgotPasswordMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedMessage('');
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    forgotMutation.mutate(
      { email: email.trim() },
      {
        onSuccess: (data) => {
          setSubmittedMessage(data.message);
        },
        onError: () => {
          // Always present generic success message to prevent user enumeration
          setSubmittedMessage(
            'If an account exists for that email address, password reset instructions have been sent.'
          );
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#0a1821] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold text-[#171c1f] mb-2">Forgot Password</h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter your registered email address to receive password reset instructions.
        </p>

        {submittedMessage ? (
          <div className="flex flex-col gap-4">
            <div className="bg-blue-50 text-blue-900 border border-blue-200 text-sm p-4 rounded-2xl">
              {submittedMessage}
            </div>
            <Link
              to="/login"
              className="w-full text-center bg-[#0a1821] text-white font-bold text-sm py-3.5 rounded-full hover:bg-[#123749] transition-all"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {errorMessage && (
              <div className="text-[#C03E48] text-xs font-semibold border border-[#C03E48]/20 bg-[#C03E48]/5 px-4 py-3 rounded-2xl">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700" htmlFor="forgot-email">
                Email Address
              </label>
              <input
                id="forgot-email"
                type="email"
                required
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="admin@company.com"
                value={email}
                disabled={forgotMutation.isPending}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#f6f8fa] border border-gray-200 text-sm rounded-2xl px-4 py-3.5 focus:border-[#0a1821] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={forgotMutation.isPending}
              className="w-full bg-[#0a1821] text-white font-bold text-sm py-4 rounded-full hover:bg-[#123749] transition-all cursor-pointer disabled:opacity-50"
            >
              {forgotMutation.isPending ? 'Sending...' : 'Send Reset Instructions'}
            </button>

            <div className="text-center mt-2">
              <Link to="/login" className="text-xs text-gray-500 hover:text-gray-800">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
