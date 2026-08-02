import { ProvisioningStatus } from '../api/domain.types';

export const PROVISIONING_POLL_INTERVAL_MS = 10_000;

export const ACTIVE_PROVISIONING_STATES: ReadonlySet<ProvisioningStatus> = new Set([
  'requesting_certificate',
  'waiting_for_validation_record',
  'waiting_for_dns',
  'waiting_for_certificate',
  'attaching_certificate',
  'deprovisioning',
]);

export interface StatusUIConfig {
  title: string;
  description: string;
  icon: string;
  color: 'blue' | 'emerald' | 'red' | 'slate';
  isInProgress: boolean;
}

export function mapProvisioningStatusUI(status?: ProvisioningStatus): StatusUIConfig {
  switch (status) {
    case 'requesting_certificate':
      return {
        title: 'Requesting Certificate',
        description: 'Requesting SSL certificate from AWS ACM...',
        icon: 'progress_activity',
        color: 'blue',
        isInProgress: true,
      };
    case 'waiting_for_validation_record':
      return {
        title: 'Preparing Validation',
        description: 'Preparing DNS CNAME validation record...',
        icon: 'progress_activity',
        color: 'blue',
        isInProgress: true,
      };
    case 'waiting_for_dns':
      return {
        title: 'DNS Validation Pending',
        description: 'Waiting for DNS CNAME verification to propagate...',
        icon: 'progress_activity',
        color: 'blue',
        isInProgress: true,
      };
    case 'waiting_for_certificate':
      return {
        title: 'Issuing Certificate',
        description: 'AWS is validating and issuing the SSL certificate...',
        icon: 'progress_activity',
        color: 'blue',
        isInProgress: true,
      };
    case 'attaching_certificate':
      return {
        title: 'Attaching HTTPS Certificate',
        description: 'Attaching HTTPS certificate to Load Balancer...',
        icon: 'progress_activity',
        color: 'blue',
        isInProgress: true,
      };
    case 'deprovisioning':
      return {
        title: 'Removing Custom Domain',
        description: 'Removing HTTPS configuration and ACM certificate...',
        icon: 'progress_activity',
        color: 'blue',
        isInProgress: true,
      };
    case 'deprovisioned':
      return {
        title: 'Domain Removed',
        description: 'The custom domain was removed successfully.',
        icon: 'check_circle',
        color: 'emerald',
        isInProgress: false,
      };
    case 'deprovision_failed':
      return {
        title: 'Removal Failed',
        description: 'The custom domain could not be fully removed.',
        icon: 'error',
        color: 'red',
        isInProgress: false,
      };
    case 'completed':
      return {
        title: 'Active & Secured',
        description: 'Custom domain is active and SSL certificate attached.',
        icon: 'check_circle',
        color: 'emerald',
        isInProgress: false,
      };
    case 'failed':
      return {
        title: 'Provisioning Failed',
        description: 'Certificate provisioning encountered an issue.',
        icon: 'error',
        color: 'red',
        isInProgress: false,
      };
    default:
      return {
        title: 'Not Started',
        description: 'Certificate provisioning has not been initiated.',
        icon: 'info',
        color: 'slate',
        isInProgress: false,
      };
  }
}
