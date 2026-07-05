export interface AuditLogData {
  readonly id: string;
  readonly timestamp: string;
  readonly actor: string;
  readonly action: string;
  readonly resource: string;
  readonly status: 'Success' | 'Failed';
  readonly ipAddress: string;
  readonly details: Record<string, any>;
}

export const MOCK_AUDIT_LOGS: readonly AuditLogData[] = [
  {
    id: '1',
    timestamp: '2026-07-04 10:14:02',
    actor: 'admin@elitegate.io',
    action: 'ROUTE_CREATE',
    resource: 'routes/v1-auth',
    status: 'Success',
    ipAddress: '192.168.1.14',
    details: {
      action: 'ROUTE_CREATE',
      actor: 'admin@elitegate.io',
      ip: '192.168.1.14',
      resource: 'routes/v1-auth',
      timestamp: '2026-07-04T10:14:02Z',
      payload: {
        path: '/v1/auth',
        protocols: ['HTTPS'],
        methods: ['GET', 'POST'],
        service: 'auth-service',
        strip_path: true
      }
    }
  },
  {
    id: '2',
    timestamp: '2026-07-04 09:45:11',
    actor: 'john@company.com',
    action: 'POLICY_DISABLE',
    resource: 'policies/rate-limiting',
    status: 'Success',
    ipAddress: '172.16.54.21',
    details: {
      action: 'POLICY_DISABLE',
      actor: 'john@company.com',
      ip: '172.16.54.21',
      resource: 'policies/rate-limiting',
      timestamp: '2026-07-04T09:45:11Z',
      payload: {
        policy_id: 'rate-limiting',
        enabled: false,
        scope: 'workspace/default'
      }
    }
  },
  {
    id: '3',
    timestamp: '2026-07-04 08:12:30',
    actor: 'sarah@company.com',
    action: 'API_KEY_REVOKE',
    resource: 'apikeys/legacy-monitor',
    status: 'Success',
    ipAddress: '10.0.4.152',
    details: {
      action: 'API_KEY_REVOKE',
      actor: 'sarah@company.com',
      ip: '10.0.4.152',
      resource: 'apikeys/legacy-monitor',
      timestamp: '2026-07-04T08:12:30Z',
      payload: {
        key_id: 'legacy-monitor',
        revocation_reason: 'Rotated secret'
      }
    }
  }
];
