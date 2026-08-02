import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { queryKeys } from '../../../shared/api/queryKeys';
import { listCustomDomains, getProvisioningStatus } from '../api/customDomainsApi';
import { CustomDomain, ProvisioningStatus } from '../api/domain.types';
import {
  ACTIVE_PROVISIONING_STATES,
  PROVISIONING_POLL_INTERVAL_MS,
} from '../utils/statusMapper';

export function useCustomDomainsQuery(projectId: string | null) {
  return useQuery({
    queryKey: queryKeys.customDomains(projectId ?? ''),
    queryFn: () => listCustomDomains(projectId ?? ''),
    enabled: Boolean(projectId),
  });
}

export function useProvisioningStatusQuery(
  projectId: string | null,
  domainId: string | null,
  isExpanded: boolean = false
) {
  const queryClient = useQueryClient();
  const prevStatusRef = useRef<ProvisioningStatus | undefined>(undefined);

  const query = useQuery({
    queryKey: queryKeys.provisioningStatus(projectId ?? '', domainId ?? ''),
    queryFn: () => getProvisioningStatus(projectId ?? '', domainId ?? ''),
    enabled: Boolean(projectId && domainId && isExpanded),
    refetchInterval: (queryState) => {
      const currentStatus = queryState.state.data?.provisioningStatus;
      if (currentStatus && ACTIVE_PROVISIONING_STATES.has(currentStatus)) {
        return PROVISIONING_POLL_INTERVAL_MS;
      }
      return false;
    },
  });

  // Smooth optimistic update of custom domains table cache upon completion or deprovisioning
  useEffect(() => {
    const currentStatus = query.data?.provisioningStatus;
    if (
      currentStatus === 'completed' &&
      prevStatusRef.current !== 'completed' &&
      projectId &&
      domainId
    ) {
      queryClient.setQueryData<CustomDomain[]>(
        queryKeys.customDomains(projectId),
        (old) =>
          old?.map((d) =>
            d.id === domainId ? { ...d, status: 'active' } : d
          ) ?? []
      );
    } else if (
      currentStatus === 'deprovisioned' &&
      prevStatusRef.current !== 'deprovisioned' &&
      projectId &&
      domainId
    ) {
      queryClient.setQueryData<CustomDomain[]>(
        queryKeys.customDomains(projectId),
        (old) => old?.filter((d) => d.id !== domainId) ?? []
      );
    }
    prevStatusRef.current = currentStatus;
  }, [query.data?.provisioningStatus, projectId, domainId, queryClient]);

  return query;
}
