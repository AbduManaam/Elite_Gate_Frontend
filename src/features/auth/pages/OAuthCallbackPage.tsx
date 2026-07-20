import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { refresh } from '../api/authApi';
import { useAuthStore } from '../../../store/authStore';

export const OAuthCallbackPage: React.FC = () => {
    const navigate = useNavigate();
    const setSession = useAuthStore((s) => s.setSession);
    const ranOnce = useRef(false);

    useEffect(() => {
        if (ranOnce.current) return;
        ranOnce.current = true;

        // 1. Check if token was passed in hash fragment (#access_token=...)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hashAccessToken = hashParams.get('access_token');

        if (hashAccessToken) {
            window.history.replaceState(null, '', window.location.pathname);
            setSession(hashAccessToken);
            navigate('/', { replace: true });
            return;
        }

        // 2. Check search query params (?oauth=success)
        const searchParams = new URLSearchParams(window.location.search);
        const oauthSuccess = searchParams.get('oauth') === 'success';

        window.history.replaceState(null, '', window.location.pathname);

        // 3. Try refreshing session via HttpOnly cookie (works for both ?oauth=success and fallback)
        let cancelled = false;

        refresh()
            .then((data) => {
                if (cancelled) return;
                setSession(data.access_token);
                navigate('/', { replace: true });
            })
            .catch(() => {
                if (cancelled) return;
                const errParam = searchParams.get('oauth_error') || (oauthSuccess ? 'session_expired' : 'missing_tokens');
                navigate(`/login?oauth_error=${encodeURIComponent(errParam)}`, { replace: true });
            });

        return () => {
            cancelled = true;
        };
    }, [navigate, setSession]);

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-[#f3f5f8]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-[#0a1821] rounded-full animate-spin" />
                <span className="text-sm text-gray-500 font-semibold">Completing sign-in…</span>
            </div>
        </div>
    );
};

export default OAuthCallbackPage;