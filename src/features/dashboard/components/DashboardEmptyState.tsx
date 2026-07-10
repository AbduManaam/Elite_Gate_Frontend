import React from 'react';
import { useNavigate } from 'react-router-dom';

export const DashboardEmptyState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-outline-variant rounded-xl p-2xl flex flex-col items-center text-center shadow-sm max-w-2xl mx-auto my-xl text-left">
      {/* Decorative Icon */}
      <div className="w-16 h-16 rounded-full bg-[#e3f2fd] text-[#0d47a1] flex items-center justify-center mb-lg shadow-sm">
        <span className="material-symbols-outlined text-[36px]">
          rocket_launch
        </span>
      </div>

      {/* Main text */}
      <h2 className="font-display-md text-display-md font-bold text-on-surface mb-sm">
        Welcome to Elite Gateway
      </h2>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-xl text-center">
        Get started by routing your first incoming API request. Deploy upstreams, configure routing rules, and enforce policies.
      </p>

      {/* Primary Action */}
      <button
        onClick={() => navigate('/connectivity?tab=Routes&action=create-route')}
        className="bg-[#113346] hover:bg-brand-hover text-white px-xl py-2.5 rounded-lg font-bold text-sm flex items-center gap-xs cursor-pointer transition-all shadow-md mb-xl"
        type="button"
      >
        <span className="material-symbols-outlined text-[20px]">add</span>
        Create Your First Route
      </button>

      {/* Secondary Information */}
      <div className="w-full border-t border-outline-variant pt-lg mt-sm flex flex-col items-center">
        <span className="text-xs text-outline font-semibold uppercase tracking-wider mb-md">
          Next Steps & Extensions
        </span>
        <div className="grid grid-cols-3 gap-lg text-center w-full max-w-lg">
          <button
            onClick={() => navigate('/connectivity?tab=Upstreams&action=create-upstream')}
            className="flex flex-col items-center gap-xs text-xs font-semibold text-[#587c94] hover:text-[#113346] cursor-pointer group"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px] bg-slate-50 p-2 rounded-lg border border-outline-variant group-hover:bg-slate-100 transition-colors">
              dns
            </span>
            Add Upstreams
          </button>
          <button
            onClick={() => navigate('/connectivity?tab=Policies&action=create-policy')}
            className="flex flex-col items-center gap-xs text-xs font-semibold text-[#587c94] hover:text-[#113346] cursor-pointer group"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px] bg-slate-50 p-2 rounded-lg border border-outline-variant group-hover:bg-slate-100 transition-colors">
              security
            </span>
            Enforce Policies
          </button>
          <button
            onClick={() => navigate('/connectivity?tab=API Credentials&action=create-apikey')}
            className="flex flex-col items-center gap-xs text-xs font-semibold text-[#587c94] hover:text-[#113346] cursor-pointer group"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px] bg-slate-50 p-2 rounded-lg border border-outline-variant group-hover:bg-slate-100 transition-colors">
              key
            </span>
            Generate Keys
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardEmptyState;
