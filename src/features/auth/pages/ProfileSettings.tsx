import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useActiveProject } from '../../../shared/hooks/useActiveProject';
import { useProjectsQuery } from '../../../shared/hooks/useProjects';

export const ProfileSettings: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const { projectId, projectRole } = useActiveProject();
  const { data: projectsData } = useProjectsQuery();

  const projects = projectsData?.items ?? [];
  const selectedProject = projects.find((p) => p.id === projectId) ?? null;

  const defaultName = user?.username
    ? user.username.split('@')[0].split('_')[0].replace(/^\w/, (c) => c.toUpperCase())
    : 'Abdu Manaam';

  const [profileName, setProfileName] = useState(defaultName);

  useEffect(() => {
    if (user?.username) {
      const name = user.username.split('@')[0].split('_')[0].replace(/^\w/, (c) => c.toUpperCase());
      setProfileName(name);
    }
  }, [user]);

  const emailAddress = user?.username
    ? user.username.includes('@')
      ? user.username
      : `${user.username}@elitegate.local`
    : 'admin@elitegate.io';
  const roleName = projectRole
    ? projectRole.charAt(0).toUpperCase() + projectRole.slice(1)
    : 'Owner';

  const initials = profileName
    ? profileName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'AM';

  return (
    <div className="w-full max-w-2xl mx-auto text-left flex flex-col gap-stack-lg">
      {/* Header */}
      <div className="mb-md">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">User Profile</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
          Manage your personal details and active tenant workspace configuration.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-sm flex flex-col gap-lg">
        {/* Top Info Banner */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-md pb-lg border-b border-outline-variant">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-container p-[2px]">
              <div className="w-full h-full rounded-full overflow-hidden bg-surface-container flex items-center justify-center font-bold text-2xl text-[#587c94] select-none">
                {initials}
              </div>
            </div>
            <button className="absolute bottom-0 right-0 bg-[#587c94] text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#123749] transition-colors border-2 border-white cursor-pointer shadow-sm">
              <span className="material-symbols-outlined text-[16px]">edit</span>
            </button>
          </div>
          <div className="flex-1 text-center sm:text-left mt-sm sm:mt-0">
            <h3 className="font-headline-md text-headline-md text-on-surface">{profileName}</h3>
            <p className="text-sm text-on-surface-variant mt-xs">{emailAddress}</p>
            <div className="mt-sm flex flex-wrap gap-xs justify-center sm:justify-start">
              <span className="inline-flex items-center gap-xs px-2.5 py-1 rounded bg-[#587c94]/10 text-[#587c94] font-semibold text-xs border border-[#587c94]/20">
                <span className="material-symbols-outlined text-[14px]">shield_person</span> {roleName}
              </span>
            </div>
          </div>
        </div>

        {/* Details Form */}
        <div className="flex flex-col gap-md">
          <div>
            <label className="font-mono text-xs text-on-surface-variant block mb-xs font-semibold">Full Name</label>
            <input
              className="w-full bg-white border border-outline-variant rounded-lg px-md py-2 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-outline"
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
            />
          </div>
          <div>
            <label className="font-mono text-xs text-on-surface-variant block mb-xs font-semibold">Email Address</label>
            <div className="relative">
              <input
                className="w-full bg-slate-50 border border-outline-variant rounded-lg pl-md pr-10 py-2 text-sm text-outline cursor-not-allowed"
                disabled
                type="email"
                value={emailAddress}
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px] select-none">
                lock
              </span>
            </div>
          </div>
        </div>

        {/* Tenant Information Section */}
        <div className="bg-surface-container-low/40 border border-outline-variant rounded-lg p-md">
          <h4 className="font-mono text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-sm flex items-center gap-xs">
            <span className="material-symbols-outlined text-[16px] text-[#587c94]">workspaces</span> Active Tenant Workspace
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-on-surface-variant">Tenant Name</span>
              <span className="font-semibold text-on-surface">
                {selectedProject ? selectedProject.name : 'No Active Tenant Selected'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-on-surface-variant">Membership Role</span>
              <span className="font-semibold text-on-surface flex items-center gap-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-success"></span> {roleName}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-sm border-t border-outline-variant flex flex-col sm:flex-row justify-end gap-sm">
          <button className="w-full sm:w-auto bg-white border border-outline-variant text-on-surface px-md py-2 rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-sm cursor-pointer text-sm font-semibold">
            <span className="material-symbols-outlined text-[18px]">key</span>
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
