import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App'
import { registerSessionExpiredHandler } from './lib/api/interceptors'
import { useAuthStore } from './store/authStore'

import { tokenStore } from './lib/api/tokenStore'
import { refresh } from './features/auth/api/authApi'

registerSessionExpiredHandler(() => {
  useAuthStore.getState().clearSession();
  window.location.assign('/login');
});

// Run startup authentication check to recover in-memory access token
const initAuth = async () => {
  const hasRefreshToken = !!tokenStore.getRefreshToken();
  if (hasRefreshToken) {
    try {
      const tokens = await refresh(tokenStore.getRefreshToken()!);
      useAuthStore.getState().setSession({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token
      });
    } catch {
      useAuthStore.getState().clearSession();
    }
  } else {
    useAuthStore.getState().finishRehydrating();
  }
};

initAuth();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)