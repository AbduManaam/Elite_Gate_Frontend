import { apiClient } from '../../../lib/api/client';
import { CustomDomain, CreateCustomDomainInput, ListCustomDomainsResponse } from './domain.types';

export * from './domain.types';

export async function listCustomDomains(projectId: string): Promise<CustomDomain[]> {
  const { data } = await apiClient.get<ListCustomDomainsResponse>(
    `/admin/v1/projects/${projectId}/custom-domains`
  );
  return data.custom_domains;
}

export async function getCustomDomain(projectId: string, domainId: string): Promise<CustomDomain> {
  const { data } = await apiClient.get<CustomDomain | { custom_domain: CustomDomain }>(
    `/admin/v1/projects/${projectId}/custom-domains/${domainId}`
  );
  if ('custom_domain' in data && data.custom_domain) return data.custom_domain;
  return data as CustomDomain;
}

export async function createCustomDomain(
  projectId: string,
  input: CreateCustomDomainInput
): Promise<CustomDomain> {
  const { data } = await apiClient.post<CustomDomain | { custom_domain: CustomDomain }>(
    `/admin/v1/projects/${projectId}/custom-domains`,
    input
  );
  if ('custom_domain' in data && data.custom_domain) return data.custom_domain;
  return data as CustomDomain;
}

export async function verifyDomainOwnership(projectId: string, domainId: string): Promise<CustomDomain> {
  const { data } = await apiClient.post<CustomDomain | { custom_domain: CustomDomain }>(
    `/admin/v1/projects/${projectId}/custom-domains/${domainId}/verify`
  );
  if ('custom_domain' in data && data.custom_domain) return data.custom_domain;
  return data as CustomDomain;
}

export async function checkDomainRouting(projectId: string, domainId: string): Promise<CustomDomain> {
  const { data } = await apiClient.post<CustomDomain | { custom_domain: CustomDomain }>(
    `/admin/v1/projects/${projectId}/custom-domains/${domainId}/check-routing`
  );
  if ('custom_domain' in data && data.custom_domain) return data.custom_domain;
  return data as CustomDomain;
}

export async function activateCustomDomain(projectId: string, domainId: string): Promise<CustomDomain> {
  const { data } = await apiClient.post<CustomDomain | { custom_domain: CustomDomain }>(
    `/admin/v1/projects/${projectId}/custom-domains/${domainId}/activate`
  );
  if ('custom_domain' in data && data.custom_domain) return data.custom_domain;
  return data as CustomDomain;
}

export async function deleteCustomDomain(projectId: string, domainId: string): Promise<void> {
  await apiClient.delete(`/admin/v1/projects/${projectId}/custom-domains/${domainId}`);
}
