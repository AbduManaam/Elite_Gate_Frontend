import React from 'react';
import { PolicyRecord } from '../api/policiesApi';

interface PolicyDetailsPanelProps {
  readonly policy: PolicyRecord | null;
  readonly onClose: () => void;
  readonly onEdit: () => void;
  readonly onDelete: () => void;
  readonly onDuplicate: () => void;
  readonly canManage: boolean;
}

export const PolicyDetailsPanel: React.FC<PolicyDetailsPanelProps> = ({
  policy,
  onClose,
  onEdit,
  onDelete,
  onDuplicate,
  canManage,
}) => {
  if (!policy) return null;

  const formatDate = (iso?: string) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const renderChipList = (list: string[] | undefined, emptyMsg = 'No restrictions') => {
    if (!list || list.length === 0) return <span className="text-outline italic text-[11px]">{emptyMsg}</span>;
    return (
      <div className="flex flex-wrap gap-xs font-mono text-[10.5px]">
        {list.map((item, idx) => (
          <span key={idx} className="bg-surface-container border border-outline-variant px-2 py-0.5 rounded text-on-surface font-semibold">
            {item}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-sm flex flex-col gap-lg text-left h-fit sticky top-[20px] animate-reveal-sequential">
      {/* Title */}
      <div className="flex justify-between items-start border-b border-outline-variant pb-sm">
        <div>
          <h3 className="font-semibold text-base text-on-surface">Policy Details</h3>
          <p className="text-[10px] text-outline font-semibold uppercase tracking-wider mt-0.5">Template Settings</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-surface-container rounded cursor-pointer text-on-surface-variant transition-colors" title="Close Panel">
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* Info fields */}
      <div className="flex flex-col gap-md text-xs">
        <div>
          <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Policy Name</span>
          <span className="font-semibold text-on-surface text-sm">{policy.name}</span>
        </div>

        <div>
          <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Authentication Required</span>
          <span className="font-semibold text-on-surface">
            {policy.auth_required ? 'Yes (JWT Bearer Token)' : 'No (Public Access)'}
          </span>
        </div>

        <div>
          <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Rate Limit</span>
          <span className="font-semibold text-on-surface">
            {policy.rate_limit_rpm > 0 ? `${policy.rate_limit_rpm} RPM` : 'Unlimited'}
          </span>
        </div>

        <div>
          <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Allowed Origins</span>
          {renderChipList(policy.allowed_origins, 'No origins restriction (all CORS requests allowed)')}
        </div>

        <div>
          <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Allowed Roles</span>
          {renderChipList(policy.allowed_roles, 'No roles restriction (all authenticated users allowed)')}
        </div>

        <div>
          <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5">Allowed Scopes</span>
          {renderChipList(policy.allowed_scopes, 'No scopes restriction')}
        </div>

        <div className="grid grid-cols-2 gap-sm border-t border-outline-variant/60 pt-md text-[11px]">
          <div>
            <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">Created</span>
            <span className="text-on-surface font-medium">{formatDate(policy.created_at)}</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">Last Updated</span>
            <span className="text-on-surface font-medium">{formatDate(policy.updated_at)}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {canManage && (
        <div className="grid grid-cols-3 gap-xs border-t border-outline-variant/60 pt-md">
          <button
            onClick={onEdit}
            className="flex items-center justify-center gap-1 py-2 border border-outline-variant rounded-lg text-xs font-semibold text-on-surface hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">edit</span>
            Edit
          </button>
          <button
            onClick={onDuplicate}
            className="flex items-center justify-center gap-1 py-2 border border-outline-variant rounded-lg text-xs font-semibold text-on-surface hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">content_copy</span>
            Duplicate
          </button>
          <button
            onClick={onDelete}
            className="flex items-center justify-center gap-1 py-2 border border-error/30 rounded-lg text-xs font-semibold text-error hover:bg-red-50/50 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">delete</span>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
