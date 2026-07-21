import { describe, expect, it } from 'vitest';
import { buildApiUrl } from './apiUrl';

describe('buildApiUrl', () => {
    it('normalizes base URL with a trailing slash and endpoint with a leading slash', () => {
        const url = buildApiUrl('/refresh', 'https://api.example.com/admin/');
        expect(url).toBe('https://api.example.com/admin/refresh');
    });

    it('normalizes base URL without a trailing slash and endpoint with a leading slash', () => {
        const url = buildApiUrl('/google/login', 'https://api.example.com/admin');
        expect(url).toBe('https://api.example.com/admin/google/login');
    });

    it('normalizes base URL with a trailing slash and endpoint without a leading slash', () => {
        const url = buildApiUrl('google/login', 'https://api.example.com/admin/');
        expect(url).toBe('https://api.example.com/admin/google/login');
    });

    it('preserves local proxy path /api/admin correctly', () => {
        const url = buildApiUrl('/refresh', '/api/admin');
        expect(url).toBe('/api/admin/refresh');
    });

    it('handles default import.meta.env.VITE_API_BASE_URL when override is omitted', () => {
        const url = buildApiUrl('/refresh');
        expect(url).toBe('/api/admin/refresh');
    });
});
