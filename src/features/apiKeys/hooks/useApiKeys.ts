import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/queryKeys';
import {
    listApiKeys,
    createApiKey,
    rotateApiKey,
    revokeApiKey,
    CreateApiKeyInput
} from '../api/apiKeysApi';

export function useApiKeysQuery(projectId: string) {
    return useQuery({
        queryKey: queryKeys.apiKeys(projectId),
        queryFn: () => listApiKeys(projectId),
        enabled: !!projectId,
    });
}

export function useCreateApiKeyMutation(projectId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateApiKeyInput) => createApiKey(projectId, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys(projectId) });
        },
    });
}

export function useRotateApiKeyMutation(projectId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => rotateApiKey(projectId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys(projectId) });
        },
    });
}

export function useRevokeApiKeyMutation(projectId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => revokeApiKey(projectId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys(projectId) });
        },
    });
}
