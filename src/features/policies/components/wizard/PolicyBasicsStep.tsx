import React from 'react';

interface PolicyBasicsStepProps {
  readonly name: string;
  readonly authRequired: boolean;
  readonly enableRateLimiting: boolean;
  readonly onChange: (fields: Partial<{ name: string; authRequired: boolean; enableRateLimiting: boolean }>) => void;
}

export const PolicyBasicsStep: React.FC<PolicyBasicsStepProps> = ({
  name,
  authRequired,
  enableRateLimiting,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-lg text-left">
      <div className="mb-md">
        <span className="text-[10px] font-bold text-[#587c94] uppercase tracking-wider">Step 1 of 3</span>
        <h3 className="font-headline-sm text-headline-sm text-on-surface mt-0.5">Policy Basics</h3>
        <p className="text-xs text-on-surface-variant mt-1">
          Define the basic name and authentication settings for the policy template.
        </p>
      </div>

      <label className="flex flex-col gap-xs text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
        Policy Name *
        <input
          required
          value={name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Enter policy name"
          className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface font-normal outline-none focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94] transition-all bg-white"
        />
      </label>

      <div className="flex flex-col gap-sm">
        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Authentication</span>
        <label className="flex items-center gap-sm p-md border border-outline-variant/60 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
          <input
            type="checkbox"
            checked={authRequired}
            onChange={(e) => onChange({ authRequired: e.target.checked })}
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
            onChange={(e) => onChange({ enableRateLimiting: e.target.checked })}
            className="w-4 h-4 rounded text-[#113346] accent-[#113346] cursor-pointer shrink-0"
          />
          <div className="flex flex-col select-none">
            <span className="text-xs font-semibold text-on-surface">Enable Rate Limiting</span>
            <span className="text-[10px] text-on-surface-variant mt-0.5">Limit the number of requests per minute allowed on matching routes.</span>
          </div>
        </label>
      </div>
    </div>
  );
};
