import { AxiosError } from 'axios';

export interface ApiErrorInfo {
    status: number | null;
    message: string;
    kind: 'unauthorized' | 'forbidden' | 'not_found' | 'rate_limited' | 'server' | 'network' | 'unknown';
}

export function toApiError(error: unknown): ApiErrorInfo {
    if (!(error instanceof AxiosError)) {
        return { status: null, message: 'Unexpected error', kind: 'unknown' };
    }
    if (!error.response) {
        return { status: null, message: 'Network error — check your connection', kind: 'network' };
    }
    const status = error.response.status;
    const message = (error.response.data as { error?: string })?.error ?? error.message;
    const kind =
        status === 401 ? 'unauthorized' :
            status === 403 ? 'forbidden' :
                status === 404 ? 'not_found' :
                    status === 429 ? 'rate_limited' :
                        status >= 500 ? 'server' : 'unknown';
    return { status, message, kind };
}