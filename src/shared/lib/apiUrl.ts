/**
 * Safely constructs a clean API URL by combining the base URL and endpoint path,
 * normalizing trailing and leading slashes to prevent double-slash URLs.
 *
 * @param endpoint - The endpoint path (e.g., '/refresh', '/google/login')
 * @param overrideBaseUrl - Optional base URL override; defaults to `import.meta.env.VITE_API_BASE_URL`
 * @returns Clean, normalized URL string
 */
export function buildApiUrl(endpoint: string, overrideBaseUrl?: string): string {
    const rawBase = overrideBaseUrl ?? (import.meta.env.VITE_API_BASE_URL || '');
    const cleanBase = rawBase.replace(/\/+$/, '');
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    return `${cleanBase}${cleanEndpoint}`;
}
