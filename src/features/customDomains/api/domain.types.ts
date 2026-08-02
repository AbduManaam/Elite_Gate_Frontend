export type DomainStatus = 'pending_verification' | 'verified' | 'active';
export type RoutingStatus = 'pending' | 'ready' | 'failed';

export type ProvisioningStatus =
  | 'not_started'
  | 'requesting_certificate'
  | 'waiting_for_validation_record'
  | 'waiting_for_dns'
  | 'waiting_for_certificate'
  | 'attaching_certificate'
  | 'completed'
  | 'failed'
  | 'deprovisioning'
  | 'deprovisioned'
  | 'deprovision_failed';

export interface DNSVerificationRecord {
  type: 'TXT';
  name: string;
  value: string;
}

export interface CustomDomain {
  id: string;
  project_id: string;
  hostname: string;
  status: DomainStatus;
  verification_record?: DNSVerificationRecord;
  verification_record_name?: string;
  verified_at?: string;
  activated_at?: string;
  last_checked_at?: string;
  created_at: string;
  updated_at: string;
  routing_target?: string;
  routing_status?: RoutingStatus;
  routing_checked_at?: string;
  routing_error?: string;
}

export interface ProvisioningStatusResponse {
  id: string;
  hostname: string;
  status: DomainStatus;
  routingStatus: RoutingStatus;
  provisioningStatus: ProvisioningStatus;
  certificateStatus?: 'pending_validation' | 'issued' | 'failed';
  certificateValidationName?: string;
  lastError?: string;
  attempts: number;
  nextRetryAt?: string;
  certificateIssuedAt?: string;
  certificateAttachedAt?: string;
  activatedAt?: string;
}

export interface ActivateDomainResponse {
  message: string;
  status?: string;
  provisioningStatus?: ProvisioningStatus;
  custom_domain: CustomDomain;
}

export interface CreateCustomDomainInput {
  hostname: string;
}

export interface ListCustomDomainsResponse {
  custom_domains: CustomDomain[];
}
