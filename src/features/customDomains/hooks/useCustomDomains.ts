import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/queryKeys';
import { listCustomDomains } from '../api/customDomainsApi';

export function useCustomDomainsQuery(projectId: string | null) {
  return useQuery({
    queryKey: queryKeys.customDomains(projectId ?? ''),
    queryFn: () => listCustomDomains(projectId ?? ''),
    enabled: Boolean(projectId),
  });
}
