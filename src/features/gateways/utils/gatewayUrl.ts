import type { GatewayRecord } from '../api/gatewaysApi';

/** Only "active" gateways have a real, reachable port bound by Docker. */
export function isGatewayReachable(gw?: GatewayRecord | null): gw is GatewayRecord {
    return !!gw && gw.status === 'active' && !!gw.public_host && !!gw.public_port;
}

export function buildGatewayBaseUrl(gw?: GatewayRecord | null): string | null {
    if (!isGatewayReachable(gw)) return null;
    return `http://${gw.public_host}:${gw.public_port}`;
}

export function buildRouteUrl(gw: GatewayRecord | null | undefined, path: string): string | null {
    const base = buildGatewayBaseUrl(gw);
    if (!base) return null;
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
