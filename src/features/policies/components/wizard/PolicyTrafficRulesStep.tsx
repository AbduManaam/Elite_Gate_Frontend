import React from 'react';
import { ChipInput } from '../shared/ChipInput';
import { PolicyInput } from '../../api/policiesApi';

interface PolicyTrafficRulesStepProps {
  readonly rate_limit_rpm: number;
  readonly enableRateLimiting: boolean;
  readonly allowed_origins: string[];
  readonly allowed_roles: string[];
  readonly allowed_scopes: string[];
  readonly ip_allowlist: string[];
  readonly ip_blocklist: string[];
  readonly onChange: (fields: Partial<PolicyInput>) => void;
}

export const PolicyTrafficRulesStep: React.FC<PolicyTrafficRulesStepProps> = ({
  rate_limit_rpm,
  enableRateLimiting,
  allowed_origins,
  allowed_roles,
  allowed_scopes,
  ip_allowlist,
  ip_blocklist,
  onChange,
}) => {
  const handleAddOrigin = (origin: string) => {
    onChange({ allowed_origins: [...allowed_origins, origin] });
  };

  const handleRemoveOrigin = (origin: string) => {
    onChange({ allowed_origins: allowed_origins.filter((o) => o !== origin) });
  };

  const handleAddRole = (role: string) => {
    onChange({ allowed_roles: [...allowed_roles, role] });
  };

  const handleRemoveRole = (role: string) => {
    onChange({ allowed_roles: allowed_roles.filter((r) => r !== role) });
  };

  const handleAddScope = (scope: string) => {
    onChange({ allowed_scopes: [...allowed_scopes, scope] });
  };

  const handleRemoveScope = (scope: string) => {
    onChange({ allowed_scopes: allowed_scopes.filter((s) => s !== scope) });
  };

  const handleAddAllowedIP = (ip: string) => {
    onChange({ ip_allowlist: [...ip_allowlist, ip] });
  };

  const handleRemoveAllowedIP = (ip: string) => {
    onChange({ ip_allowlist: ip_allowlist.filter((x) => x !== ip) });
  };

  const handleAddBlockedIP = (ip: string) => {
    onChange({ ip_blocklist: [...ip_blocklist, ip] });
  };

  const handleRemoveBlockedIP = (ip: string) => {
    onChange({ ip_blocklist: ip_blocklist.filter((x) => x !== ip) });
  };

  // Validator for allowed origin (supporting wildcards, protocols, hosts, etc.)
  const validateOrigin = (val: string): string | null => {
    if (val === '*') return null;
    try {
      new URL(val);
      return null;
    } catch (_) {
      return 'Must be "*" or a valid absolute URL (e.g. https://admin.example.com).';
    }
  };

  // Mirrors validateOrigin below it exactly — reuses ipfilter's own
  // acceptance rules conceptually (single IP or CIDR), giving instant
  // feedback instead of waiting for the backend's 400 response.
  const validateIPOrCIDR = (val: string): string | null => {
    const cidrOrIpPattern =
      /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$|^([0-9a-fA-F:]+)(\/\d{1,3})?$/;
    if (!cidrOrIpPattern.test(val)) {
      return 'Must be a valid IP address or CIDR range (e.g. 192.168.1.50 or 10.0.0.0/24).';
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-lg text-left">
      <div className="mb-md">
        <span className="text-[10px] font-bold text-[#587c94] uppercase tracking-wider">Step 2 of 3</span>
        <h3 className="font-headline-sm text-headline-sm text-on-surface mt-0.5">Traffic Rules</h3>
        <p className="text-xs text-on-surface-variant mt-1">
          Configure rate limits, CORS origins, authorized roles, scopes, and IP restrictions.
        </p>
      </div>

      {enableRateLimiting ? (
        <label className="flex flex-col gap-xs text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
          Rate Limit (Requests per minute) *
          <input
            type="number"
            min={1}
            required
            value={rate_limit_rpm || ''}
            onChange={(e) => onChange({ rate_limit_rpm: Math.max(1, parseInt(e.target.value) || 0) })}
            placeholder="e.g. 100"
            className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm font-mono text-on-surface outline-none focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94] transition-all bg-white"
          />
        </label>
      ) : null}

      <ChipInput
        label="Allowed Origins"
        placeholder='e.g. https://admin.example.com (or "*")'
        chips={allowed_origins}
        onAdd={handleAddOrigin}
        onRemove={handleRemoveOrigin}
        validation={validateOrigin}
      />

      <ChipInput
        label="IP Allowlist"
        placeholder="e.g. 192.168.1.50 or 10.0.0.0/24"
        chips={ip_allowlist}
        onAdd={handleAddAllowedIP}
        onRemove={handleRemoveAllowedIP}
        validation={validateIPOrCIDR}
      />

      <ChipInput
        label="IP Blocklist"
        placeholder="e.g. 203.0.113.1"
        chips={ip_blocklist}
        onAdd={handleAddBlockedIP}
        onRemove={handleRemoveBlockedIP}
        validation={validateIPOrCIDR}
      />

      <ChipInput
        label="Allowed Roles"
        placeholder="e.g. admin"
        chips={allowed_roles}
        onAdd={handleAddRole}
        onRemove={handleRemoveRole}
      />

      <ChipInput
        label="Allowed Scopes"
        placeholder="e.g. read"
        chips={allowed_scopes}
        onAdd={handleAddScope}
        onRemove={handleRemoveScope}
      />
    </div>
  );
};
