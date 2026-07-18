import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';

export const OAuthCallbackPage: React.FC = () => {
    const navigate = useNavigate();
    const setSession = useAuthStore((s) => s.setSession);
    const ranOnce = useRef(false);

    useEffect(() => {
        if (ranOnce.current) return;
        ranOnce.current = true;

        const params = new URLSearchParams(window.location.hash.slice(1));
        const accessToken = params.get('access_token');

        // Clear the fragment immediately so tokens never sit in browser history.
        window.history.replaceState(null, '', window.location.pathname);

        if (!accessToken) {
            navigate('/login?oauth_error=missing_tokens', { replace: true });
            return;
        }

        setSession(accessToken);
        navigate('/', { replace: true });
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