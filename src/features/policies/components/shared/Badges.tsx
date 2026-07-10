import React from 'react';

export const StatusBadge: React.FC<{ readonly authRequired: boolean }> = ({ authRequired }) => {
  return authRequired ? (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 font-sans">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
      Protected
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-sans">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      Public
    </span>
  );
};

export const AuthenticationBadge: React.FC<{ readonly authRequired: boolean }> = ({ authRequired }) => {
  return authRequired ? (
    <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant font-sans">
      <span className="material-symbols-outlined text-[16px] text-green-600">lock</span>
      JWT Required
    </span>
  ) : (
    <span className="text-xs text-outline font-sans">—</span>
  );
};

export const RateLimitBadge: React.FC<{ readonly rpm: number }> = ({ rpm }) => {
  return rpm > 0 ? (
    <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant font-sans">
      <span className="material-symbols-outlined text-[16px] text-[#587c94]">speed</span>
      {rpm} RPM
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs text-outline font-sans">
      <span className="material-symbols-outlined text-[16px] text-outline">speed</span>
      Unlimited
    </span>
  );
};
