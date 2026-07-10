import React from 'react';
import { ChipInput } from '../shared/ChipInput';
import { PolicyInput } from '../../api/policiesApi';

interface PolicyTrafficRulesStepProps {
  readonly rate_limit_rpm: number;
  readonly enableRateLimiting: boolean;
  readonly allowed_origins: string[];
  readonly allowed_roles: string[];
  readonly allowed_scopes: string[];
  readonly onChange: (fields: Partial<PolicyInput>) => void;
}

export const PolicyTrafficRulesStep: React.FC<PolicyTrafficRulesStepProps> = ({
  rate_limit_rpm,
  enableRateLimiting,
  allowed_origins,
  allowed_roles,
  allowed_scopes,
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

  return (
    <div className="flex flex-col gap-lg text-left">
      <div className="mb-md">
        <span className="text-[10px] font-bold text-[#587c94] uppercase tracking-wider">Step 2 of 3</span>
        <h3 className="font-headline-sm text-headline-sm text-on-surface mt-0.5">Traffic Rules</h3>
        <p className="text-xs text-on-surface-variant mt-1">
          Configure rate limits, CORS origins, authorized roles, and scopes.
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
