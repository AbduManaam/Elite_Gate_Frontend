import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRoute, updateRoute, enableRoute, assignPolicy, removePolicy, RouteInput } from '../api/routesApi';
import { queryKeys } from '../../../shared/api/queryKeys';

export function useCreateRouteMutation(projectId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: RouteInput) => createRoute(projectId, input),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.routes(projectId) }),
    });
}

export function useUpdateRouteMutation(projectId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: RouteInput }) => updateRoute(projectId, id, input),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.routes(projectId) }),
    });
}

export function useEnableRouteMutation(projectId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => enableRoute(projectId, id),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.routes(projectId) }),
    });
}

export function useAssignPolicyMutation(projectId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ routeId, policyId }: { routeId: string; policyId: string }) =>
            assignPolicy(projectId, routeId, policyId),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.routes(projectId) }),
    });
}

export function useRemovePolicyMutation(projectId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (routeId: string) => removePolicy(projectId, routeId),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.routes(projectId) }),
    });
}