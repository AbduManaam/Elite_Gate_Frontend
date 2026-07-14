import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPlatformHealth, getPlatformMetrics } from '../../features/observability/api/metricsApi';
import {
    listAllTenants, deleteTenant, suspendTenant, reactivateTenant,
} from '../api/projectsApi';

export function usePlatformHealthQuery() {
    return useQuery({ queryKey: ['platform', 'health'], queryFn: getPlatformHealth, refetchInterval: 30_000 });
}

export function usePlatformMetricsQuery() {
    return useQuery({ queryKey: ['platform', 'metrics'], queryFn: getPlatformMetrics, refetchInterval: 30_000 });
}

export function useTenantsQuery(limit = 50, offset = 0) {
    return useQuery({ queryKey: ['platform', 'tenants', limit, offset], queryFn: () => listAllTenants(limit, offset) });
}

function useTenantMutation(fn: (id: string) => Promise<void>) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: fn,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['platform', 'tenants'] }),
    });
}

export const useSuspendTenantMutation = () => useTenantMutation(suspendTenant);
export const useReactivateTenantMutation = () => useTenantMutation(reactivateTenant);
export const useDeleteTenantMutation = () => useTenantMutation(deleteTenant);
