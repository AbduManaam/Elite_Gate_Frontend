import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/queryKeys';
import {
  createCustomDomain,
  verifyDomainOwnership,
  checkDomainRouting,
  activateCustomDomain,
  retryProvisioning,
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
    onSuccess: (_, domainId) => {
      qc.invalidateQueries({ queryKey: queryKeys.customDomains(projectId) });
      qc.invalidateQueries({ queryKey: queryKeys.provisioningStatus(projectId, domainId) });
    },
  });
}

export function useRetryProvisioningMutation(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (domainId: string) => retryProvisioning(projectId, domainId),
    onSuccess: (_, domainId) => {
      qc.invalidateQueries({ queryKey: queryKeys.customDomains(projectId) });
      qc.invalidateQueries({ queryKey: queryKeys.provisioningStatus(projectId, domainId) });
    },
  });
}

export function useRetryDeprovisioningMutation(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (domainId: string) => retryDeprovisioning(projectId, domainId),
    onSuccess: (_, domainId) => {
      qc.invalidateQueries({ queryKey: queryKeys.customDomains(projectId) });
      qc.invalidateQueries({ queryKey: queryKeys.provisioningStatus(projectId, domainId) });
    },
  });
}

export function useDeleteDomainMutation(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (domainId: string) => deleteCustomDomain(projectId, domainId),
    onSuccess: (_, domainId) => {
      qc.invalidateQueries({ queryKey: queryKeys.customDomains(projectId) });
      qc.invalidateQueries({ queryKey: queryKeys.provisioningStatus(projectId, domainId) });
    },
  });
}
