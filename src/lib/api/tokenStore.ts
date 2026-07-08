let memoryAccessToken: string | null = null;
const REFRESH_COOKIE_NAME = 'eg_refresh_token';

function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
    return null;
}

function setCookie(name: string, value: string, days = 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    // SameSite=Strict and Secure for security (even though HttpOnly is server-only)
    document.cookie = `${name}=${value}; expires=${expires}; path=/; Secure; SameSite=Strict`;
}

function deleteCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict`;
}

export const tokenStore = {
    getAccessToken: (): string | null => memoryAccessToken,
    getRefreshToken: (): string | null => getCookie(REFRESH_COOKIE_NAME),
    setTokens: (access: string, refresh: string): void => {
        memoryAccessToken = access;
        setCookie(REFRESH_COOKIE_NAME, refresh);
    },
    clear: (): void => {
        memoryAccessToken = null;
        deleteCookie(REFRESH_COOKIE_NAME);
    },
};