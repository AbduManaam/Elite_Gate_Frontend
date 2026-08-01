import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/queryKeys';
import {
  createCustomDomain,
  verifyDomainOwnership,
  checkDomainRouting,
  activateCustomDomain,
  deleteCustomDomain,
  CreateCustomDomainInput,
} from '../api/customDomainsApi';

export function useCreateDomainMutation(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCustomDomainInput) => createCustomDomain(projectId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.customDomains(projectId) });
    },
  });
}

export function useVerifyDomainMutation(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (domainId: string) => verifyDomainOwnership(projectId, domainId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.customDomains(projectId) });
    },
  });
}

export function useCheckRoutingMutation(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (domainId: string) => checkDomainRouting(projectId, domainId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.customDomains(projectId) });
    },
  });
}

export function useActivateDomainMutation(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (domainId: string) => activateCustomDomain(projectId, domainId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.customDomains(projectId) });
    },
  });
}

export function useDeleteDomainMutation(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (domainId: string) => deleteCustomDomain(projectId, domainId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.customDomains(projectId) });
    },
  });
}
