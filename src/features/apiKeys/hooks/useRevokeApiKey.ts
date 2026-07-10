import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/queryKeys';
import { revokeApiKey } from '../api/apiKeysApi';

export function useRevokeApiKeyMutation(projectId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => revokeApiKey(projectId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys(projectId) });
        },
    });
}
