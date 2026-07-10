import React from 'react';
import { PolicyRecord } from '../api/policiesApi';

interface PolicySummaryCardsProps {
  readonly policies: PolicyRecord[];
}

export const PolicySummaryCards: React.FC<PolicySummaryCardsProps> = ({ policies }) => {
  const total = policies.length;
  const auth = policies.filter((p) => p.auth_required).length;
  const rateLimit = policies.filter((p) => p.rate_limit_rpm > 0).length;
  const cors = policies.filter((p) => p.allowed_origins && p.allowed_origins.length > 0).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md w-full">
      {/* Total Policies */}
      <div className="bg-white border border-outline-variant rounded-xl p-md flex items-center gap-md shadow-sm">
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#587c94] flex items-center justify-center border border-blue-100 shrink-0">
          <span className="material-symbols-outlined text-[22px]">policy</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Total Policies</span>
          <span className="text-xl font-bold text-on-surface">{total}</span>
        </div>
      </div>

      {/* Authentication Required */}
      <div className="bg-white border border-outline-variant rounded-xl p-md flex items-center gap-md shadow-sm">
        <div className="w-10 h-10 rounded-lg bg-green-50 text-green-700 flex items-center justify-center border border-green-100 shrink-0">
          <span className="material-symbols-outlined text-[22px]">lock</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Authentication Required</span>
          <span className="text-xl font-bold text-on-surface">{auth}</span>
        </div>
      </div>

      {/* Rate Limited */}
      <div className="bg-white border border-outline-variant rounded-xl p-md flex items-center gap-md shadow-sm">
        <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center border border-orange-100 shrink-0">
          <span className="material-symbols-outlined text-[22px]">speed</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Rate Limited</span>
          <span className="text-xl font-bold text-on-surface">{rateLimit}</span>
        </div>
      </div>

      {/* CORS Enabled */}
      <div className="bg-white border border-outline-variant rounded-xl p-md flex items-center gap-md shadow-sm">
        <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100 shrink-0">
          <span className="material-symbols-outlined text-[22px]">language</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">CORS Enabled</span>
          <span className="text-xl font-bold text-on-surface">{cors}</span>
        </div>
      </div>
    </div>
  );
};
