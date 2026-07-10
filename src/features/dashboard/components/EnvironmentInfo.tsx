import React from 'react';
import { useActiveProject } from '../../../shared/hooks/useActiveProject';

interface EnvironmentInfoProps {
  readonly projectId: string;
  readonly region?: string;
  readonly createdAt?: string;
  readonly role?: string;
}

export const EnvironmentInfo: React.FC<EnvironmentInfoProps> = ({
  projectId,
  region = 'ap-south-1',
  createdAt = 'May 10, 2025',
  role = 'owner',
}) => {
  const formatRole = (r: string) => {
    if (!r) return 'Viewer';
    return r.charAt(0).toUpperCase() + r.slice(1).toLowerCase();
  };

  const formatProjectId = (id: string) => {
    if (!id) return 'N/A';
    if (id.length > 12) return id.substring(0, 12) + '...';
    return id;
  };

  return (
    <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col gap-md shadow-xs text-left h-full">
      <div className="flex items-center gap-xs border-b border-outline-variant pb-xs">
        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
          info
        </span>
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
          Environment
        </h3>
      </div>

      <div className="flex flex-col gap-sm text-xs font-semibold text-on-surface-variant">
        <div className="flex justify-between items-center py-1">
          <span>Project ID</span>
          <span className="font-mono bg-surface-container px-2 py-0.5 rounded border border-outline-variant text-[11px] text-on-surface">
            {formatProjectId(projectId)}
          </span>
        </div>
        <div className="flex justify-between items-center py-1 border-t border-outline-variant/40">
          <span>Region</span>
          <span className="text-on-surface font-mono text-[11px]">{region}</span>
        </div>
        <div className="flex justify-between items-center py-1 border-t border-outline-variant/40">
          <span>Created On</span>
          <span className="text-on-surface">{createdAt}</span>
        </div>
        <div className="flex justify-between items-center py-1 border-t border-outline-variant/40">
          <span>Role</span>
          <span className="text-on-surface font-bold text-[#113346] bg-[#113346]/5 px-2 py-0.5 rounded border border-[#113346]/10">
            {formatRole(role)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentInfo;
