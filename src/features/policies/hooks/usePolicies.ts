import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/queryKeys';
import { listPolicies, createPolicy, updatePolicy, deletePolicy, PolicyInput, PolicyRecord } from '../api/policiesApi';
import { toApiError } from '../../../shared/api/apiError';

export function usePoliciesQuery(projectId: string | null) {
    return useQuery({
        queryKey: projectId ? queryKeys.policies(projectId) : ['policies', 'idle'],
        queryFn: () => listPolicies(projectId as string),
        enabled: !!projectId,
        staleTime: 30_000,
    });
}

export function useCreatePolicyMutation(projectId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: PolicyInput) => createPolicy(projectId, input),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.policies(projectId) }),
    });
}

export function useUpdatePolicyMutation(projectId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: PolicyInput }) => updatePolicy(projectId, id, input),
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.policies(projectId) }),
    });
}

export function useDeletePolicyMutation(projectId: string) {
    const qc = useQueryClient();
    const key = queryKeys.policies(projectId);

    return useMutation({
        mutationFn: (id: string) => deletePolicy(projectId, id),
        onMutate: async (id: string) => {
            await qc.cancelQueries({ queryKey: key });
            const previous = qc.getQueryData<PolicyRecord[]>(key);
            qc.setQueryData<PolicyRecord[]>(key, (old) => old?.filter((p) => p.id !== id));
            return { previous };
        },
        onError: (_err, _id, context) => {
            if (context?.previous) qc.setQueryData(key, context.previous);
        },
        onSettled: () => qc.invalidateQueries({ queryKey: key }),
    });
}

export function usePolicyMutationError(error: unknown) {
    return error ? toApiError(error) : null;
}