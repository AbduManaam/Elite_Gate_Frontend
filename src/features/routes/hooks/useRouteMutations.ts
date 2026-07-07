import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/queryKeys';
import { createRoute, updateRoute, enableRoute, RouteInput } from '../api/routesApi';
import { RouteRecord } from '../api/types';

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
        mutationFn: (route: RouteRecord) => enableRoute(projectId, route),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.routes(projectId) }),
    });
}