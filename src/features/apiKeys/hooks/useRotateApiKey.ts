import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/queryKeys';
import { rotateApiKey } from '../api/apiKeysApi';

export function useRotateApiKeyMutation(projectId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => rotateApiKey(projectId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys(projectId) });
        },
    });
}
