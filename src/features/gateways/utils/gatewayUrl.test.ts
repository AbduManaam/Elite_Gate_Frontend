import { describe, expect, it } from 'vitest';
import { buildGatewayBaseUrl, buildRouteUrl, isGatewayReachable } from './gatewayUrl';
import type { GatewayRecord } from '../api/gatewaysApi';

describe('gatewayUrl utils', () => {
    describe('isGatewayReachable', () => {
        it('returns true for active gateways with public_host or public_endpoint', () => {
            const gw: Partial<GatewayRecord> = { status: 'active', public_host: 'gw.example.com', public_port: '443' };
            expect(isGatewayReachable(gw as GatewayRecord)).toBe(true);
        });

        it('returns true for running gateways', () => {
            const gw: Partial<GatewayRecord> = { status: 'running', public_host: 'gw.example.com', public_port: '80' };
            expect(isGatewayReachable(gw as GatewayRecord)).toBe(true);
        });

        it('returns false for provisioning, stopped, or decommissioned gateways', () => {
            expect(isGatewayReachable({ status: 'provisioning', public_host: 'gw.example.com' } as GatewayRecord)).toBe(false);
            expect(isGatewayReachable({ status: 'stopped', public_host: 'gw.example.com' } as GatewayRecord)).toBe(false);
            expect(isGatewayReachable({ status: 'decommissioned', public_host: 'gw.example.com' } as GatewayRecord)).toBe(false);
            expect(isGatewayReachable(null)).toBe(false);
            expect(isGatewayReachable(undefined)).toBe(false);
        });
    });

    describe('buildGatewayBaseUrl & buildRouteUrl', () => {
        it('meets primary acceptance criterion: gw-da443dc4.elitegateway.site + port 443 + /health', () => {
            const gw: Partial<GatewayRecord> = {
                status: 'active',
                public_host: 'gw-da443dc4.elitegateway.site',
                public_port: '443',
            };
            const baseUrl = buildGatewayBaseUrl(gw as GatewayRecord);
            const routeUrl = buildRouteUrl(gw as GatewayRecord, '/health');

            expect(baseUrl).toBe('https://gw-da443dc4.elitegateway.site');
            expect(routeUrl).toBe('https://gw-da443dc4.elitegateway.site/health');
            expect(routeUrl).not.toContain('http://');
            expect(routeUrl).not.toContain(':443');
        });

        it('formats HTTPS with port 443 (omits port 443)', () => {
            const gw: Partial<GatewayRecord> = {
                status: 'active',
                public_host: 'gw-da443dc4.elitegateway.site',
                public_port: '443',
            };
            expect(buildRouteUrl(gw as GatewayRecord, '/health')).toBe('https://gw-da443dc4.elitegateway.site/health');
        });

        it('formats HTTP with port 80 (omits port 80)', () => {
            const gw: Partial<GatewayRecord> = {
                status: 'active',
                public_host: 'gw-da443dc4.elitegateway.site',
                public_port: '80',
            };
            expect(buildRouteUrl(gw as GatewayRecord, '/health')).toBe('http://gw-da443dc4.elitegateway.site/health');
        });

        it('preserves HTTPS with a non-default port', () => {
            const gw: Partial<GatewayRecord> = {
                status: 'active',
                public_host: 'gw-da443dc4.elitegateway.site',
                public_port: '8443',
                protocol: 'https',
            };
            expect(buildRouteUrl(gw as GatewayRecord, '/health')).toBe('https://gw-da443dc4.elitegateway.site:8443/health');
        });

        it('preserves HTTP with a non-default port', () => {
            const gw: Partial<GatewayRecord> = {
                status: 'active',
                public_host: 'localhost',
                public_port: '8080',
            };
            expect(buildRouteUrl(gw as GatewayRecord, '/health')).toBe('http://localhost:8080/health');
        });

        it('handles public_port as a number', () => {
            const gwNum443: Partial<GatewayRecord> = {
                status: 'active',
                public_host: 'gw-da443dc4.elitegateway.site',
                public_port: 443 as unknown as string,
            };
            expect(buildRouteUrl(gwNum443 as GatewayRecord, '/health')).toBe('https://gw-da443dc4.elitegateway.site/health');

            const gwNum8080: Partial<GatewayRecord> = {
                status: 'active',
                public_host: 'localhost',
                public_port: 8080 as unknown as string,
            };
            expect(buildRouteUrl(gwNum8080 as GatewayRecord, '/health')).toBe('http://localhost:8080/health');
        });

        it('prefers backend public_endpoint when provided and normalizes default ports and trailing slashes', () => {
            const gw1: Partial<GatewayRecord> = {
                status: 'active',
                public_endpoint: 'https://gw-da443dc4.elitegateway.site/',
            };
            expect(buildRouteUrl(gw1 as GatewayRecord, '/health')).toBe('https://gw-da443dc4.elitegateway.site/health');

            const gw2: Partial<GatewayRecord> = {
                status: 'active',
                public_endpoint: 'https://gw-da443dc4.elitegateway.site:443/',
            };
            expect(buildRouteUrl(gw2 as GatewayRecord, '/health')).toBe('https://gw-da443dc4.elitegateway.site/health');
        });

        it('handles missing public_port gracefully', () => {
            const gw: Partial<GatewayRecord> = {
                status: 'active',
                public_host: 'gw-da443dc4.elitegateway.site',
            };
            expect(buildRouteUrl(gw as GatewayRecord, '/health')).toBe('http://gw-da443dc4.elitegateway.site/health');
        });

        it('handles uppercase protocols such as HTTPS or HTTP', () => {
            const gwHttps: Partial<GatewayRecord> = {
                status: 'active',
                public_host: 'gw.example.com',
                public_port: '8443',
                protocol: 'HTTPS',
            };
            expect(buildRouteUrl(gwHttps as GatewayRecord, '/health')).toBe('https://gw.example.com:8443/health');

            const gwHttp: Partial<GatewayRecord> = {
                status: 'active',
                public_host: 'gw.example.com',
                public_port: '80',
                protocol: 'HTTP',
            };
            expect(buildRouteUrl(gwHttp as GatewayRecord, '/health')).toBe('http://gw.example.com/health');
        });

        it('does not override an explicit protocol', () => {
            const gwExplicitHttp: Partial<GatewayRecord> = {
                status: 'active',
                public_host: 'gw.example.com',
                public_port: '443',
                protocol: 'http',
            };
            // Explicit protocol 'http' with port 443 is preserved
            expect(buildRouteUrl(gwExplicitHttp as GatewayRecord, '/health')).toBe('http://gw.example.com:443/health');
        });

        it('falls back gracefully on invalid public_endpoint strings', () => {
            const gwInvalid: Partial<GatewayRecord> = {
                status: 'active',
                public_endpoint: 'custom-endpoint-string/',
            };
            expect(buildRouteUrl(gwInvalid as GatewayRecord, '/health')).toBe('custom-endpoint-string/health');
        });

        it('returns null for inactive or provisioning gateways', () => {
            const gwProv: Partial<GatewayRecord> = {
                status: 'provisioning',
                public_host: 'gw-da443dc4.elitegateway.site',
                public_port: '443',
            };
            expect(buildRouteUrl(gwProv as GatewayRecord, '/health')).toBeNull();
        });

        it('joins route paths safely without missing or duplicate slashes', () => {
            const gw: Partial<GatewayRecord> = {
                status: 'active',
                public_host: 'gw-da443dc4.elitegateway.site',
                public_port: '443',
            };

            expect(buildRouteUrl(gw as GatewayRecord, '/health')).toBe('https://gw-da443dc4.elitegateway.site/health');
            expect(buildRouteUrl(gw as GatewayRecord, 'health')).toBe('https://gw-da443dc4.elitegateway.site/health');
            expect(buildRouteUrl(gw as GatewayRecord, '///health')).toBe('https://gw-da443dc4.elitegateway.site/health');
            expect(buildRouteUrl(gw as GatewayRecord, '/v1/users/active')).toBe('https://gw-da443dc4.elitegateway.site/v1/users/active');
            expect(buildRouteUrl(gw as GatewayRecord, '/')).toBe('https://gw-da443dc4.elitegateway.site/');
            expect(buildRouteUrl(gw as GatewayRecord, '')).toBe('https://gw-da443dc4.elitegateway.site/');
        });
    });
});
