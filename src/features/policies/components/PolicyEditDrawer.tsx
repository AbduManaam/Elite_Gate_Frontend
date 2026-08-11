import React, { useState } from 'react';
import { useUpdatePolicyMutation } from '../hooks/usePolicies';
import { PolicyRecord, PolicyInput } from '../api/policiesApi';
import { ChipInput } from './shared/ChipInput';
import { toApiError } from '../../../shared/api/apiError';

interface PolicyEditDrawerProps {
  readonly projectId: string;
  readonly policy: PolicyRecord;
  readonly onClose: () => void;
  readonly onSuccess?: () => void;
}

export const PolicyEditDrawer: React.FC<PolicyEditDrawerProps> = ({ projectId, policy, onClose, onSuccess }) => {
  const updatePolicy = useUpdatePolicyMutation(projectId);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState<PolicyInput>({
    name: policy.name,
    auth_required: policy.auth_required,
    rate_limit_rpm: policy.rate_limit_rpm,
    allowed_origins: policy.allowed_origins || [],
    allowed_roles: policy.allowed_roles || [],
    allowed_scopes: policy.allowed_scopes || [],
    ip_allowlist: policy.ip_allowlist || [],
    ip_blocklist: policy.ip_blocklist || [],
  });

  const [enableRateLimiting, setEnableRateLimiting] = useState(policy.rate_limit_rpm > 0);

  const handleFieldChange = (fields: Partial<PolicyInput>) => {
    setForm((f) => ({ ...f, ...fields }));
  };

  const handleToggleRateLimiting = (checked: boolean) => {
    setEnableRateLimiting(checked);
    if (!checked) {
      handleFieldChange({ rate_limit_rpm: 0 });
    } else if (form.rate_limit_rpm === 0) {
      handleFieldChange({ rate_limit_rpm: 100 });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!form.name.trim()) {
      setErrorMsg('Policy Name is required.');
      return;
    }

    const payload: PolicyInput = {
      ...form,
      rate_limit_rpm: enableRateLimiting ? form.rate_limit_rpm : 0,
    };

    updatePolicy.mutate(
      { id: policy.id, input: payload },
      {
        onSuccess: () => {
          if (onSuccess) onSuccess();
          else onClose();
        },
        onError: (err) => {
          setErrorMsg(toApiError(err).message || 'Failed to update policy.');
        },
      }
    );
  };

  // Validator for allowed origin (supporting wildcards, protocols, hosts, etc.)
  const validateOrigin = (val: string): string | null => {
    if (val === '*') return null;
    try {
      new URL(val);
      return null;
    } catch {
      return 'Must be "*" or a valid absolute URL (e.g. https://admin.example.com).';
    }
  };

  // Validator for IP addresses and CIDR ranges
  const validateIPOrCIDR = (val: string): string | null => {
    const cidrOrIpPattern =
      /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$|^([0-9a-fA-F:]+)(\/\d{1,3})?$/;
    if (!cidrOrIpPattern.test(val)) {
      return 'Must be a valid IP address or CIDR range (e.g. 192.168.1.50 or 10.0.0.0/24).';
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
      <form
        onSubmit={handleSubmit}
        className="bg-white h-full w-screen sm:w-[560px] max-w-full shadow-2xl border-l border-outline-variant animate-slide-in flex flex-col justify-between"
      >
        <div className="flex justify-between items-center p-lg border-b border-outline-variant">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Edit Policy</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">Update policy template configurations.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-surface-container rounded cursor-pointer text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-lg flex flex-col gap-md text-left">
          <label className="flex flex-col gap-xs text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
            Policy Name *
            <input
              required
              value={form.name}
              onChange={(e) => handleFieldChange({ name: e.target.value })}
              placeholder="e.g. Admin API Policy"
              className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface font-normal outline-none focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94] transition-all bg-white"
            />
          </label>

          <div className="flex flex-col gap-sm">
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Authentication</span>
            <label className="flex items-center gap-sm p-md border border-outline-variant/60 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={form.auth_required}
                onChange={(e) => handleFieldChange({ auth_required: e.target.checked })}
                className="w-4 h-4 rounded text-[#113346] accent-[#113346] cursor-pointer shrink-0"
              />
              <div className="flex flex-col select-none">
                <span className="text-xs font-semibold text-on-surface">Require JWT Authentication</span>
                <span className="text-[10px] text-on-surface-variant mt-0.5">Incoming requests must contain a valid JWT bearer token.</span>
              </div>
            </label>
          </div>

          <div className="flex flex-col gap-sm">
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Rate Limiting</span>
            <label className="flex items-center gap-sm p-md border border-outline-variant/60 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={enableRateLimiting}
                onChange={(e) => handleToggleRateLimiting(e.target.checked)}
                className="w-4 h-4 rounded text-[#113346] accent-[#113346] cursor-pointer shrink-0"
              />
              <div className="flex flex-col select-none">
                <span className="text-xs font-semibold text-on-surface">Enable Rate Limiting</span>
                <span className="text-[10px] text-on-surface-variant mt-0.5">Limit the number of requests per minute allowed on matching routes.</span>
              </div>
            </label>
          </div>

          {enableRateLimiting && (
            <label className="flex flex-col gap-xs text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
              Rate Limit (Requests per minute) *
              <input
                type="number"
                min={1}
                required
                value={form.rate_limit_rpm || ''}
                onChange={(e) => handleFieldChange({ rate_limit_rpm: Math.max(1, parseInt(e.target.value) || 0) })}
                placeholder="e.g. 100"
                className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm font-mono text-on-surface outline-none focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94] transition-all bg-white"
              />
            </label>
          )}

          <ChipInput
            label="Allowed Origins"
            placeholder='e.g. https://admin.example.com (or "*")'
            chips={form.allowed_origins ?? []}
            onAdd={(o) => handleFieldChange({ allowed_origins: [...(form.allowed_origins ?? []), o] })}
            onRemove={(o) => handleFieldChange({ allowed_origins: (form.allowed_origins ?? []).filter((x) => x !== o) })}
            validation={validateOrigin}
          />

          <ChipInput
            label="IP Allowlist"
            placeholder="e.g. 192.168.1.50 or 10.0.0.0/24"
            chips={form.ip_allowlist ?? []}
            onAdd={(ip) => handleFieldChange({ ip_allowlist: [...(form.ip_allowlist ?? []), ip] })}
            onRemove={(ip) => handleFieldChange({ ip_allowlist: (form.ip_allowlist ?? []).filter((x) => x !== ip) })}
            validation={validateIPOrCIDR}
          />

          <ChipInput
            label="IP Blocklist"
            placeholder="e.g. 203.0.113.1"
            chips={form.ip_blocklist ?? []}
            onAdd={(ip) => handleFieldChange({ ip_blocklist: [...(form.ip_blocklist ?? []), ip] })}
            onRemove={(ip) => handleFieldChange({ ip_blocklist: (form.ip_blocklist ?? []).filter((x) => x !== ip) })}
            validation={validateIPOrCIDR}
          />

          <ChipInput
            label="Allowed Roles"
            placeholder="e.g. admin"
            chips={form.allowed_roles ?? []}
            onAdd={(r) => handleFieldChange({ allowed_roles: [...(form.allowed_roles ?? []), r] })}
            onRemove={(r) => handleFieldChange({ allowed_roles: (form.allowed_roles ?? []).filter((x) => x !== r) })}
          />

          <ChipInput
            label="Allowed Scopes"
            placeholder="e.g. read"
            chips={form.allowed_scopes ?? []}
            onAdd={(s) => handleFieldChange({ allowed_scopes: [...(form.allowed_scopes ?? []), s] })}
            onRemove={(s) => handleFieldChange({ allowed_scopes: (form.allowed_scopes ?? []).filter((x) => x !== s) })}
          />

          {errorMsg && (
            <p className="text-error text-xs font-semibold bg-red-50 border border-red-100 rounded-lg p-md mt-sm">
              {errorMsg}
            </p>
          )}
        </div>

        {/* Footer controls */}
        <div className="border-t border-outline-variant p-lg flex justify-end gap-sm bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-md py-2 border border-outline-variant rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updatePolicy.isPending}
            className="bg-[#113346] text-white px-lg py-2 rounded-lg text-xs font-bold hover:bg-[#123749] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {updatePolicy.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
