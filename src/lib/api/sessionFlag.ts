const LOGGED_IN_KEY = 'eg_logged_in';

export const sessionFlag = {
    isSet(): boolean {
        try {
            return localStorage.getItem(LOGGED_IN_KEY) === 'true';
        } catch {
            return false;
        }
    },
    set(): void {
        try {
            localStorage.setItem(LOGGED_IN_KEY, 'true');
        } catch {
            /* best-effort */
        }
    },
    clear(): void {
        try {
            localStorage.removeItem(LOGGED_IN_KEY);
        } catch {
            /* no-op */
        }
    },
};
