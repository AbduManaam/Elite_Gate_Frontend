// queryKeys.ts is a file that stores all TanStack Query cache keys in
//  one place, so the same key is always used when fetching data and refreshing the cache.

export const queryKeys = {
    routes: (projectId: string) => ['projects', projectId, 'routes'] as const,
    upstreams: (projectId: string) => ['projects', projectId, 'upstreams'] as const,
    upstreamTargets: (projectId: string, upstreamId: string) =>
        ['projects', projectId, 'upstreams', upstreamId, 'targets'] as const,
    policies: (projectId: string) => ['projects', projectId, 'policies'] as const,
    gateways: (projectId: string) => ['projects', projectId, 'gateways'] as const,
    allGateways: () => ['gateways'] as const,
    members: (projectId: string) => ['projects', projectId, 'members'] as const,
    apiKeys: (projectId: string) => ['projects', projectId, 'apiKeys'] as const,
    customDomains: (projectId: string) => ['projects', projectId, 'customDomains'] as const,
    customDomain: (projectId: string, domainId: string) => ['projects', projectId, 'customDomains', domainId] as const,
    provisioningStatus: (projectId: string, domainId: string) =>
        ['projects', projectId, 'customDomains', domainId, 'provisioningStatus'] as const,
};