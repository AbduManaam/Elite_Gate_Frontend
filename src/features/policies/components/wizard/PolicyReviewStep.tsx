import React from 'react';
import { PolicyInput } from '../../api/policiesApi';

interface PolicyReviewStepProps {
  readonly form: PolicyInput;
}

export const PolicyReviewStep: React.FC<PolicyReviewStepProps> = ({ form }) => {
  return (
    <div className="flex flex-col gap-lg text-left">
      <div className="mb-md">
        <span className="text-[10px] font-bold text-[#587c94] uppercase tracking-wider">Step 3 of 3</span>
        <h3 className="font-headline-sm text-headline-sm text-on-surface mt-0.5">Review Policy</h3>
        <p className="text-xs text-on-surface-variant mt-1">
          Review your policy configuration settings before creating it.
        </p>
      </div>

      <div className="flex flex-col border border-outline-variant rounded-xl overflow-hidden bg-slate-50/30 text-xs">
        <div className="p-md border-b border-outline-variant/60 flex justify-between items-center">
          <span className="font-bold text-on-surface-variant uppercase tracking-wider text-[10px]">Policy Name</span>
          <span className="font-semibold text-on-surface font-sans text-sm">{form.name}</span>
        </div>

        <div className="p-md border-b border-outline-variant/60 flex justify-between items-center">
          <span className="font-bold text-on-surface-variant uppercase tracking-wider text-[10px]">Authentication</span>
          <span className="font-semibold text-on-surface">
            {form.auth_required ? 'JWT Required (Bearer Token)' : 'None (Public access)'}
          </span>
        </div>

        <div className="p-md border-b border-outline-variant/60 flex justify-between items-center">
          <span className="font-bold text-on-surface-variant uppercase tracking-wider text-[10px]">Rate Limit</span>
          <span className="font-semibold text-on-surface">
            {form.rate_limit_rpm > 0 ? `${form.rate_limit_rpm} Requests Per Minute (RPM)` : 'Unlimited'}
          </span>
        </div>

        <div className="p-md border-b border-outline-variant/60 flex flex-col gap-xs">
          <span className="font-bold text-on-surface-variant uppercase tracking-wider text-[10px] mb-1">Allowed Origins</span>
          {(form.allowed_origins ?? []).length === 0 ? (
            <span className="text-outline italic">No origins configured (will reject all requests if CORS checks trigger)</span>
          ) : (
            <div className="flex flex-wrap gap-xs font-mono text-[10.5px]">
              {(form.allowed_origins ?? []).map((o, idx) => (
                <span key={idx} className="bg-white border border-outline-variant px-2 py-0.5 rounded text-on-surface font-semibold">
                  {o}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="p-md border-b border-outline-variant/60 flex flex-col gap-xs">
          <span className="font-bold text-on-surface-variant uppercase tracking-wider text-[10px] mb-1">Allowed Roles</span>
          {(form.allowed_roles ?? []).length === 0 ? (
            <span className="text-outline italic">No role restrictions (any user can access if authenticated)</span>
          ) : (
            <div className="flex flex-wrap gap-xs font-mono text-[10.5px]">
              {(form.allowed_roles ?? []).map((r, idx) => (
                <span key={idx} className="bg-white border border-outline-variant px-2 py-0.5 rounded text-on-surface font-semibold">
                  {r}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="p-md flex flex-col gap-xs">
          <span className="font-bold text-on-surface-variant uppercase tracking-wider text-[10px] mb-1">Allowed Scopes</span>
          {(form.allowed_scopes ?? []).length === 0 ? (
            <span className="text-outline italic">No scope restrictions</span>
          ) : (
            <div className="flex flex-wrap gap-xs font-mono text-[10.5px]">
              {(form.allowed_scopes ?? []).map((s, idx) => (
                <span key={idx} className="bg-white border border-outline-variant px-2 py-0.5 rounded text-on-surface font-semibold">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
