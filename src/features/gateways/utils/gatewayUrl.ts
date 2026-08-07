import type { GatewayRecord } from '../api/gatewaysApi';

/** Only active/running gateways have reachable endpoints. */
export function isGatewayReachable(gw?: GatewayRecord | null): gw is GatewayRecord {
    if (!gw) return false;
    const isReachableStatus = gw.status === 'active' || gw.status === 'running';
    if (!isReachableStatus) return false;

    const hasEndpoint = !!gw.public_endpoint && gw.public_endpoint.trim().length > 0;
    const hasHost = !!gw.public_host && gw.public_host.trim().length > 0;
    return hasEndpoint || hasHost;
}

export function buildGatewayBaseUrl(gw?: GatewayRecord | null): string | null {
    if (!isGatewayReachable(gw)) return null;

    // 1. Prefer public_endpoint if supplied
    if (gw.public_endpoint && gw.public_endpoint.trim().length > 0) {
        const rawEndpoint = gw.public_endpoint.trim();
        try {
            const urlObj = new URL(rawEndpoint);
            const scheme = urlObj.protocol.toLowerCase().replace(':', '');
            const hostname = urlObj.hostname;
            const port = urlObj.port;

            let portSuffix = '';
            if (port) {
                const isDefaultPort = (scheme === 'https' && port === '443') || (scheme === 'http' && port === '80');
                if (!isDefaultPort) {
                    portSuffix = `:${port}`;
                }
            }
            return `${scheme}://${hostname}${portSuffix}`;
        } catch {
            return rawEndpoint.replace(/\/+$/, '');
        }
    }

    // 2. Build from public_host, public_port (or gateway_port), and protocol
    const rawHost = (gw.public_host ?? '').trim();
    if (!rawHost) return null;

    const host = rawHost.replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
    const portStr = String(gw.public_port ?? gw.gateway_port ?? '').trim();

    let scheme = 'http';
    if (gw.protocol && gw.protocol.trim().length > 0) {
        scheme = gw.protocol.trim().toLowerCase();
    } else if (portStr === '443') {
        scheme = 'https';
    }

    let portSuffix = '';
    if (portStr && portStr !== '') {
        const isDefaultPort = (scheme === 'https' && portStr === '443') || (scheme === 'http' && portStr === '80');
        if (!isDefaultPort) {
            portSuffix = `:${portStr}`;
        }
    }

    return `${scheme}://${host}${portSuffix}`;
}

export function buildRouteUrl(gw: GatewayRecord | null | undefined, path: string): string | null {
    const base = buildGatewayBaseUrl(gw);
    if (!base) return null;
    const cleanBase = base.replace(/\/+$/, '');
    const cleanPath = path ? path.replace(/^\/+/, '') : '';
    return cleanPath ? `${cleanBase}/${cleanPath}` : `${cleanBase}/`;
}
