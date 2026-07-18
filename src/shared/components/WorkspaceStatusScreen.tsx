import React from 'react';

interface WorkspaceStatusScreenProps {
  readonly message: string;
}

export const WorkspaceStatusScreen: React.FC<WorkspaceStatusScreenProps> = ({ message }) => (
  <div className="flex h-screen items-center justify-center bg-background text-on-background">
    <div className="flex flex-col items-center gap-3">
      <span className="material-symbols-outlined text-[36px] animate-spin text-[#587c94]">
        progress_activity
      </span>
      <span className="text-xs font-semibold uppercase tracking-widest text-outline">
        {message}
      </span>
    </div>
  </div>
);

export default WorkspaceStatusScreen;
