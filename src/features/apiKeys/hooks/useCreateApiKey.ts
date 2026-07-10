import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/queryKeys';
import { createApiKey } from '../api/apiKeysApi';
import { CreateApiKeyInput } from '../types/apiKey';

export function useCreateApiKeyMutation(projectId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateApiKeyInput) => createApiKey(projectId, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys(projectId) });
        },
    });
}
