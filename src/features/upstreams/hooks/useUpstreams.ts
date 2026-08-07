import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/queryKeys';
import {
    listUpstreams,
    disableUpstream,
    deleteUpstream,
    createUpstream,
    updateUpstream,
    checkUpstreamHealth,
    UpstreamRecord,
    UpstreamInput,
} from '../api/upstreamsApi';
import { toApiError } from '../../../shared/api/apiError';

export function useUpstreamsQuery(projectId: string | null) {
    return useQuery({
        queryKey: projectId ? queryKeys.upstreams(projectId) : ['upstreams', 'idle'],
        queryFn: () => listUpstreams(projectId as string),
        enabled: !!projectId,
        staleTime: 30_000,
    });
}

/**
 * Fetches real-time health for a single upstream target.
 * Automatically polls every 30 seconds while the component is mounted and enabled.
 */
export function useUpstreamHealthQuery(
    projectId: string | null,
    upstreamId: string,
    upstreamEnabled: boolean
) {
    return useQuery({
        queryKey:
            projectId && upstreamId
                ? queryKeys.upstreamHealth(projectId, upstreamId)
                : ['upstreams', 'health', 'idle'],
        queryFn: () => checkUpstreamHealth(projectId as string, upstreamId),
        enabled: !!projectId && !!upstreamId && upstreamEnabled,
        staleTime: 5_000,
        refetchInterval: 30_000,
        refetchIntervalInBackground: false,
    });
}

export function useCreateUpstreamMutation(projectId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: UpstreamInput) => createUpstream(projectId, input),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.upstreams(projectId) }),
    });
}

export function useUpdateUpstreamMutation(projectId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpstreamInput }) => updateUpstream(projectId, id, input),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.upstreams(projectId) }),
    });
}

export function useDeleteUpstreamMutation(projectId: string) {
    const qc = useQueryClient();
    const key = queryKeys.upstreams(projectId);

    return useMutation({
        mutationFn: (id: string) => deleteUpstream(projectId, id),
        onMutate: async (id: string) => {
            await qc.cancelQueries({ queryKey: key });
            const previous = qc.getQueryData<UpstreamRecord[]>(key);
            qc.setQueryData<UpstreamRecord[]>(key, (old) => old?.filter((u) => u.id !== id));
            return { previous };
        },
        onError: (_err, _id, context) => {
            if (context?.previous) qc.setQueryData(key, context.previous);
        },
        onSettled: () => qc.invalidateQueries({ queryKey: key }),
    });
}

export function useDisableUpstreamMutation(projectId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => disableUpstream(projectId, id),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.upstreams(projectId) }),
    });
}

export function useUpstreamMutationError(error: unknown) {
    return error ? toApiError(error) : null;
}