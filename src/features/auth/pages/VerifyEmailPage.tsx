import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useVerifyEmailMutation } from '../hooks/useVerifyEmailMutation';

type VerificationState =
  | 'verifying'
  | 'success'
  | 'error'
  | 'missing-token';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [token] = useState<string | null>(() => {
    const value = searchParams.get('token')?.trim();

    if (value && typeof window !== 'undefined' && window.history?.replaceState) {
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname,
      );
    }

    return value || null;
  });

  const [state, setState] = useState<VerificationState>(
    token ? 'verifying' : 'missing-token',
  );

  const verificationStarted = useRef(false);
  const { mutate } = useVerifyEmailMutation();

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'referrer';
    meta.content = 'no-referrer';

    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  useEffect(() => {
    if (!token || verificationStarted.current) {
      return;
    }

    verificationStarted.current = true;

    mutate(token, {
      onSuccess: () => {
        setState('success');
      },
      onError: () => {
        setState('error');
      },
    });
  }, [token, mutate]);

  return (
    <div className="min-h-screen bg-[#0a1821] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">

        {state === 'verifying' && (
          <>
            <h2 className="text-2xl font-bold text-[#171c1f] mb-2">
              Verifying your email
            </h2>

            <p className="text-sm text-gray-500">
              Please wait while we verify your account.
            </p>
          </>
        )}

        {state === 'success' && (
          <>
            <h2 className="text-2xl font-bold text-[#171c1f] mb-2">
              Email verified successfully
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              Your email has been verified. You can now sign in to your
              EliteGate account.
            </p>

            <Link
              to="/login"
              className="inline-block bg-[#0a1821] text-white font-bold text-sm px-6 py-3.5 rounded-full hover:bg-[#123749] transition-all"
            >
              Go to Login
            </Link>
          </>
        )}

        {(state === 'error' || state === 'missing-token') && (
          <>
            <h2 className="text-2xl font-bold text-[#171c1f] mb-2">
              Invalid verification link
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              This verification link is invalid, expired, or has already
              been used.
            </p>

            <Link
              to="/login"
              className="inline-block bg-[#0a1821] text-white font-bold text-sm px-6 py-3.5 rounded-full hover:bg-[#123749] transition-all"
            >
              Go to Login
            </Link>
          </>
        )}

      </div>
    </div>
  );
};

export default VerifyEmailPage;
