import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/queryKeys';
import { listApiKeys } from '../api/apiKeysApi';

export function useApiKeysQuery(projectId: string, page: number = 1, limit: number = 10, search?: string) {
    return useQuery({
        queryKey: [...queryKeys.apiKeys(projectId), page, limit, search],
        queryFn: () => listApiKeys(projectId, page, limit, search),
        enabled: !!projectId,
    });
}
