let accessToken: string | null = null;
let refreshTokenValue: string | null = null;

export const tokenStore = {
    getAccessToken: (): string | null => accessToken,
    getRefreshToken: (): string | null => refreshTokenValue,
    setTokens: (access: string, refresh: string): void => {
        accessToken = access;
        refreshTokenValue = refresh;
    },
    clear: (): void => {
        accessToken = null;
        refreshTokenValue = null;
    },
};