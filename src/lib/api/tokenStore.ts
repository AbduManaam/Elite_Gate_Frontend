let memoryAccessToken: string | null = null;

export const tokenStore = {
    getAccessToken: (): string | null => memoryAccessToken,
    setAccessToken: (access: string): void => {
        memoryAccessToken = access;
    },
    clear: (): void => {
        memoryAccessToken = null;
    },
};