import { apiClient } from '../../../lib/api/client';
import {
  CustomDomain,
  CreateCustomDomainInput,
  ListCustomDomainsResponse,
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
): Promise<CustomDomain> {
  const { data } = await apiClient.post<
    CustomDomain | { custom_domain: CustomDomain }
  >(`${projectDomainsPath(projectId)}/${domainId}/activate`);

  if ('custom_domain' in data && data.custom_domain) {
    return data.custom_domain;
  }

  return data as CustomDomain;
}

export async function deleteCustomDomain(
  projectId: string,
  domainId: string
): Promise<void> {
  await apiClient.delete(
    `${projectDomainsPath(projectId)}/${domainId}`
  );
}