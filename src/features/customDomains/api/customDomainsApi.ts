import { apiClient } from '../../../lib/api/client';
import {
  CustomDomain,
  CreateCustomDomainInput,
  ListCustomDomainsResponse,
  ProvisioningStatusResponse,
  ActivateDomainResponse,
} from './domain.types';

export * from './domain.types';

const projectDomainsPath = (projectId: string) =>
  `/v1/projects/${projectId}/custom-domains`;

export async function listCustomDomains(
  projectId: string
): Promise<CustomDomain[]> {
  const { data } = await apiClient.get<ListCustomDomainsResponse>(
    projectDomainsPath(projectId)
  );

  return data.custom_domains;
}

export async function getCustomDomain(
  projectId: string,
  domainId: string
): Promise<CustomDomain> {
  const { data } = await apiClient.get<
    CustomDomain | { custom_domain: CustomDomain }
  >(`${projectDomainsPath(projectId)}/${domainId}`);

  if ('custom_domain' in data && data.custom_domain) {
    return data.custom_domain;
  }

  return data as CustomDomain;
}

export async function createCustomDomain(
  projectId: string,
  input: CreateCustomDomainInput
): Promise<CustomDomain> {
  const { data } = await apiClient.post<
    CustomDomain | { custom_domain: CustomDomain }
  >(projectDomainsPath(projectId), input);

  if ('custom_domain' in data && data.custom_domain) {
    return data.custom_domain;
  }

  return data as CustomDomain;
}

export async function verifyDomainOwnership(
  projectId: string,
  domainId: string
): Promise<CustomDomain> {
  const { data } = await apiClient.post<
    CustomDomain | { custom_domain: CustomDomain }
  >(`${projectDomainsPath(projectId)}/${domainId}/verify`);

  if ('custom_domain' in data && data.custom_domain) {
    return data.custom_domain;
  }

  return data as CustomDomain;
}

export async function checkDomainRouting(
  projectId: string,
  domainId: string
): Promise<CustomDomain> {
  const { data } = await apiClient.post<
    CustomDomain | { custom_domain: CustomDomain }
  >(`${projectDomainsPath(projectId)}/${domainId}/check-routing`);

  if ('custom_domain' in data && data.custom_domain) {
    return data.custom_domain;
  }

  return data as CustomDomain;
}

export async function activateCustomDomain(
  projectId: string,
  domainId: string
): Promise<ActivateDomainResponse> {
  const { data } = await apiClient.post<ActivateDomainResponse>(
    `${projectDomainsPath(projectId)}/${domainId}/activate`
  );
  return data;
}

export async function getProvisioningStatus(
  projectId: string,
  domainId: string
): Promise<ProvisioningStatusResponse> {
  const { data } = await apiClient.get<ProvisioningStatusResponse>(
    `${projectDomainsPath(projectId)}/${domainId}/provisioning-status`
  );
  return data;
}

export async function retryProvisioning(
  projectId: string,
  domainId: string
): Promise<ActivateDomainResponse> {
  const { data } = await apiClient.post<ActivateDomainResponse>(
    `${projectDomainsPath(projectId)}/${domainId}/retry-provisioning`
  );
  return data;
}

export async function retryDeprovisioning(
  projectId: string,
  domainId: string
): Promise<ActivateDomainResponse> {
  const { data } = await apiClient.post<ActivateDomainResponse>(
    `${projectDomainsPath(projectId)}/${domainId}/retry-deprovisioning`
  );
  return data;
}

export async function deleteCustomDomain(
  projectId: string,
  domainId: string
): Promise<ActivateDomainResponse> {
  const { data } = await apiClient.delete<ActivateDomainResponse>(
    `${projectDomainsPath(projectId)}/${domainId}`
  );
  return data;
}