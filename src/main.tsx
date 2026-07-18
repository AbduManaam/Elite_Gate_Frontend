import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App'
import { registerSessionExpiredHandler } from './lib/api/interceptors'
import { useAuthStore } from './store/authStore'

import { sessionFlag } from './lib/api/sessionFlag'
import { refresh } from './features/auth/api/authApi'

registerSessionExpiredHandler(() => {
  useAuthStore.getState().clearSession();
  window.location.assign('/login');
});

// On boot, the refresh token itself is invisible to JS (HttpOnly cookie).
// sessionFlag is just "were we logged in last time" — if set, attempt a
// silent refresh; the server decides if the cookie is actually still valid.
const initAuth = async () => {
  if (!sessionFlag.isSet()) {
    useAuthStore.getState().finishRehydrating();
    return;
  }

  try {
    const tokens = await refresh();
    useAuthStore.getState().setSession(tokens.access_token);
  } catch {
    useAuthStore.getState().clearSession();
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