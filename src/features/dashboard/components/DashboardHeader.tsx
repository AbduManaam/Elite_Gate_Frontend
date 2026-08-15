import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { useWorkspacePath } from '../../../shared/hooks/useWorkspacePath';
import { useRoles } from '../../../shared/hooks/useRoles';

export const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const getPath = useWorkspacePath();
  const { can } = useRoles();

  const canManage = can(`editor`);

  const displayName = user?.username
    ? user.username.split('@')[0].split('_')[0].replace(/^\w/, (c) => c.toUpperCase())
    : 'Anas';

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-md text-left pb-md border-b border-outline-variant">
      <div>
        <h1 className="font-display-lg text-display-lg text-on-surface flex items-center gap-xs">
          Welcome back, {displayName} <span className="animate-bounce">👋</span>
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Manage your API Gateway from one place.
        </p>
      </div>
      {canManage && (
        <button
          onClick={() => navigate(getPath('/connectivity?tab=Routes&action=create-route'))}
          className="self-start md:self-auto bg-[#113346] hover:bg-brand-hover text-white px-lg py-2 rounded-lg font-bold text-xs flex items-center gap-xs cursor-pointer transition-all duration-200 shadow-sm"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create Route
        </button>
      )}
    </div>
  );
};

export default DashboardHeader;
