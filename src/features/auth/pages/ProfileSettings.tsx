import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { useActiveProject } from '../../../shared/hooks/useActiveProject';
import { useProjectsQuery } from '../../../shared/hooks/useProjects';
import type { ProjectRole } from '../../../shared/api/projectsApi';

function deriveDisplayNameFromUsername(username?: string): string {
  if (!username) return 'User';
  const part = username.split('@')[0].split('_')[0].split('.')[0];
  return part.charAt(0).toUpperCase() + part.slice(1);
}

interface ProfileSettingsFormProps {
  readonly user: { username: string };
  readonly isSuperAdmin: boolean;
  readonly projectRole?: ProjectRole | null;
  readonly selectedProjectName?: string;
}

const ProfileSettingsForm: React.FC<ProfileSettingsFormProps> = ({
  user,
  isSuperAdmin,
  projectRole,
  selectedProjectName,
}) => {
  const navigate = useNavigate();
  const defaultName = deriveDisplayNameFromUsername(user.username);
  const [profileName, setProfileName] = useState(defaultName);

  const emailAddress = user.username.includes('@')
    ? user.username
    : `${user.username}@elitegate.local`;

  const roleName = isSuperAdmin
    ? 'Super Admin'
    : projectRole
    ? projectRole.charAt(0).toUpperCase() + projectRole.slice(1)
    : 'Owner';

  const initials = profileName
    ? profileName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'U';

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
            <button className="absolute bottom-0 right-0 bg-[#587c94] text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#123749] transition-colors border-2 border-white cursor-pointer shadow-sm" type="button">
              <span className="material-symbols-outlined text-[16px]">edit</span>
            </button>
          </div>
          <div className="flex-1 text-center sm:text-left mt-sm sm:mt-0">
            <h3 className="font-headline-md text-headline-md text-on-surface">{profileName}</h3>
            <p className="text-sm text-on-surface-variant mt-xs">{emailAddress}</p>
            <div className="mt-sm flex flex-wrap gap-xs justify-center sm:justify-start">
              {isSuperAdmin ? (
                <span className="inline-flex items-center gap-xs px-2.5 py-1 rounded bg-amber-500/10 text-amber-600 font-semibold text-xs border border-amber-500/20 shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">shield_person</span> Super Admin
                </span>
              ) : (
                <span className="inline-flex items-center gap-xs px-2.5 py-1 rounded bg-[#587c94]/10 text-[#587c94] font-semibold text-xs border border-[#587c94]/20">
                  <span className="material-symbols-outlined text-[14px]">shield_person</span> {roleName}
                </span>
              )}
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
                {selectedProjectName || 'No Active Tenant Selected'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-on-surface-variant">Membership Role</span>
              <span className="font-semibold text-on-surface flex items-center gap-xs">
                <span className={`w-1.5 h-1.5 rounded-full ${isSuperAdmin ? 'bg-amber-500 animate-pulse' : 'bg-success'}`}></span>{' '}
                {isSuperAdmin ? 'Super Admin (Owner Bypass)' : roleName}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-sm border-t border-outline-variant flex flex-col sm:flex-row justify-end gap-sm">
          <button
            className="w-full sm:w-auto bg-white border border-outline-variant text-on-surface px-md py-2 rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-sm cursor-pointer text-sm font-semibold"
            type="button"
            onClick={() => navigate('/forgot-password')}
          >
            <span className="material-symbols-outlined text-[18px]">key</span>
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProfileSettings: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const isSuperAdmin = useAuthStore((s) => s.isSuperAdmin);
  const { projectId, projectRole } = useActiveProject();
  const { data: projectsData } = useProjectsQuery();

  const projects = projectsData?.items ?? [];
  const selectedProject = projects.find((p) => p.id === projectId) ?? null;

  if (!user) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-sm">
          <div className="w-8 h-8 border-4 border-[#587c94]/20 border-t-[#587c94] rounded-full animate-spin" />
          <span className="text-on-surface-variant text-xs font-semibold">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <ProfileSettingsForm
      key={user.username}
      user={user}
      isSuperAdmin={isSuperAdmin ?? false}
      projectRole={projectRole}
      selectedProjectName={selectedProject?.name}
    />
  );
};

export default ProfileSettings;
