import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/queryKeys';
import {
    listUpstreamTargets,
    addUpstreamTarget,
    removeUpstreamTarget,
    UpstreamTargetInput
} from '../api/upstreamsApi';

export function useUpstreamTargetsQuery(projectId: string, upstreamId: string) {
    return useQuery({
        queryKey: queryKeys.upstreamTargets(projectId, upstreamId),
        queryFn: () => listUpstreamTargets(projectId, upstreamId),
        enabled: !!projectId && !!upstreamId,
    });
}

export function useAddUpstreamTargetMutation(projectId: string, upstreamId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: UpstreamTargetInput) => addUpstreamTarget(projectId, upstreamId, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.upstreamTargets(projectId, upstreamId) });
        },
    });
}

export function useRemoveUpstreamTargetMutation(projectId: string, upstreamId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (targetId: string) => removeUpstreamTarget(projectId, upstreamId, targetId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.upstreamTargets(projectId, upstreamId) });
        },
    });
}
