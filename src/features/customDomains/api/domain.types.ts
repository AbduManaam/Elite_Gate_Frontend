export type DomainStatus = 'pending_verification' | 'verified' | 'active';
export type RoutingStatus = 'pending' | 'ready' | 'failed';

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

export interface CreateCustomDomainInput {
  hostname: string;
}

export interface ListCustomDomainsResponse {
  custom_domains: CustomDomain[];
}
