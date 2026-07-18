import React from 'react';
import { ShortcutCard } from './ShortcutCard';
import { useWorkspacePath } from '../../../shared/hooks/useWorkspacePath';

export const ProjectShortcuts: React.FC = () => {
  const getPath = useWorkspacePath();

  return (
    <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col gap-md shadow-xs text-left h-full">
      <div className="flex items-center gap-xs border-b border-outline-variant pb-xs">
        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
          quick_reference_all
        </span>
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
          Project Shortcuts
        </h3>
      </div>

      <div className="flex flex-col gap-sm">
        <ShortcutCard
          label="Connectivity"
          description="Manage routes, upstreams and policies"
          icon="hub"
          iconBg="bg-[#e8eaf6]"
          iconColor="text-[#3f51b5]"
          path={getPath('/connectivity')}
        />
        <ShortcutCard
          label="Analytics"
          description="View gateway metrics and insights"
          icon="monitoring"
          iconBg="bg-[#e8f5e9]"
          iconColor="text-[#2e7d32]"
          path={getPath('/analytics')}
        />
        <ShortcutCard
          label="Logs"
          description="Audit logs and access logs"
          icon="history"
          iconBg="bg-[#f3e5f5]"
          iconColor="text-[#7b1fa2]"
          path={getPath('/logs')}
        />
        <ShortcutCard
          label="Settings"
          description="Project and team settings"
          icon="settings"
          iconBg="bg-[#eceff1]"
          iconColor="text-[#455a64]"
          path={getPath('/settings')}
        />
      </div>
    </div>
  );
};

export default ProjectShortcuts;
