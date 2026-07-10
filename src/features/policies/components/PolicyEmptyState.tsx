import React from 'react';

interface PolicyEmptyStateProps {
  readonly onCreateClick: () => void;
}

export const PolicyEmptyState: React.FC<PolicyEmptyStateProps> = ({ onCreateClick }) => {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-outline-variant rounded-xl p-xl py-[72px] text-center bg-white shadow-sm w-full">
      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-outline-variant mb-md text-on-surface-variant">
        <span className="material-symbols-outlined text-[36px] text-[#587c94]">shield</span>
      </div>
      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">No Policies Created</h3>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-lg leading-relaxed">
        Policies define authentication, rate limits, CORS origins, roles, and scopes that can be attached to ingress gateway routes.
      </p>
      <button
        onClick={onCreateClick}
        className="bg-[#113346] text-white px-lg py-2 rounded-lg font-bold text-xs hover:bg-[#123749] transition-colors flex items-center gap-1 cursor-pointer shadow-sm animate-fade-in-up"
      >
        <span className="material-symbols-outlined text-[16px]">add</span>
        Create Policy
      </button>
    </div>
  );
};
