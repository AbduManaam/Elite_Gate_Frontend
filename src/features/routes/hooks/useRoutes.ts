import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/queryKeys';
import { listRoutes, disableRoute, deleteRoute, RouteRecord } from '../api/routesApi';
import { toApiError } from '../../../shared/api/apiError';

export function useRoutesQuery(projectId: string | null) {
    return useQuery({
        queryKey: projectId ? queryKeys.routes(projectId) : ['routes', 'idle'],
        queryFn: () => listRoutes(projectId as string),
        enabled: !!projectId,
        staleTime: 30_000,
    });
}

export function useDeleteRouteMutation(projectId: string) {
    const qc = useQueryClient();
    const key = queryKeys.routes(projectId);

    return useMutation({
        mutationFn: (id: string) => deleteRoute(projectId, id),

        // optimistic delete 
        onMutate: async (id: string) => {
            await qc.cancelQueries({ queryKey: key });
            const previous = qc.getQueryData<RouteRecord[]>(key);
            qc.setQueryData<RouteRecord[]>(key, (old) => old?.filter((r) => r.id !== id));
            return { previous };
        },
        onError: (_err, _id, context) => {
            if (context?.previous) qc.setQueryData(key, context.previous);
        },
        onSettled: () => qc.invalidateQueries({ queryKey: key }),
    });
}

export function useRouteMutationError(error: unknown) {
    return error ? toApiError(error) : null;
}