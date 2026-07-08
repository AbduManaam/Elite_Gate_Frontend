import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/queryKeys';
import { createUpstream, updateUpstream, UpstreamInput } from '../api/upstreamsApi';

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