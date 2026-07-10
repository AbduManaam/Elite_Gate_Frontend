import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ActivityItem } from './ActivityItem';
import { AuditLogData } from '../../../shared/mocks/logsMock';

interface RecentActivityProps {
  readonly logs?: AuditLogData[];
}

const FALLBACK_ACTIVITIES = [
  {
    action: 'Updated route',
    description: 'Route /api/users was updated',
    time: '2 minutes ago',
    icon: 'share',
    iconBg: 'bg-[#e3f2fd]',
    iconColor: 'text-[#0d47a1]',
  },
  {
    action: 'Created policy',
    description: 'Policy Admin Policy was created',
    time: '5 minutes ago',
    icon: 'security',
    iconBg: 'bg-[#f3e5f5]',
    iconColor: 'text-[#4a148c]',
  },
  {
    action: 'Created upstream',
    description: 'Upstream user-service was created',
    time: '12 minutes ago',
    icon: 'dns',
    iconBg: 'bg-[#e8f5e9]',
    iconColor: 'text-[#1b5e20]',
  },
  {
    action: 'Generated API key',
    description: 'API key generated for service mobile-app',
    time: '18 minutes ago',
    icon: 'key',
    iconBg: 'bg-[#fff3e0]',
    iconColor: 'text-[#e65100]',
  },
  {
    action: 'Deleted API key',
    description: 'API key key_8f3d... was deleted',
    time: '32 minutes ago',
    icon: 'delete',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
  },
];

export const RecentActivity: React.FC<RecentActivityProps> = ({ logs = [] }) => {
  const navigate = useNavigate();

  // Helper to format timestamps to relative/readable time
  const formatTime = (ts: string) => {
    try {
      const date = new Date(ts.replace(' ', 'T') + 'Z');
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins} minutes ago`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} hours ago`;
      
      return date.toLocaleDateString();
    } catch {
      return ts;
    }
  };

  // Map API logs to UI display items
  const parseLogs = (logList: AuditLogData[]) => {
    if (logList.length === 0) return FALLBACK_ACTIVITIES;

    return logList.slice(0, 5).map((log) => {
      let actionName = log.action.replace('_', ' ').toLowerCase();
      actionName = actionName.charAt(0).toUpperCase() + actionName.slice(1);

      let icon = 'history';
      let iconBg = 'bg-slate-50';
      let iconColor = 'text-slate-600';

      if (log.action.includes('ROUTE')) {
        icon = 'share';
        iconBg = 'bg-[#e3f2fd]';
        iconColor = 'text-[#0d47a1]';
      } else if (log.action.includes('UPSTREAM')) {
        icon = 'dns';
        iconBg = 'bg-[#e8f5e9]';
        iconColor = 'text-[#1b5e20]';
      } else if (log.action.includes('POLICY')) {
        icon = 'security';
        iconBg = 'bg-[#f3e5f5]';
        iconColor = 'text-[#4a148c]';
      } else if (log.action.includes('KEY') || log.action.includes('API')) {
        icon = 'key';
        iconBg = 'bg-[#fff3e0]';
        iconColor = 'text-[#e65100]';
      }

      if (log.action.includes('DELETE') || log.action.includes('REVOKE')) {
        icon = 'delete';
        iconBg = 'bg-red-50';
        iconColor = 'text-red-600';
      }

      return {
        action: actionName,
        description: `${log.resource} was ${log.action.toLowerCase().split('_')[1] || 'modified'} by ${log.actor}`,
        time: formatTime(log.timestamp),
        icon,
        iconBg,
        iconColor,
      };
    });
  };

  const displayActivities = parseLogs(logs);

  return (
    <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col gap-md shadow-xs text-left h-full">
      <div className="flex items-center justify-between border-b border-outline-variant pb-xs">
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
          Recent Activity
        </h3>
        <button
          onClick={() => navigate('/logs')}
          className="text-xs font-semibold text-[#587c94] hover:text-[#113346] flex items-center gap-0.5 transition-colors cursor-pointer"
          type="button"
        >
          View all logs
          <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span>
        </button>
      </div>

      <div className="flex flex-col gap-sm">
        {displayActivities.map((act, index) => (
          <ActivityItem
            key={index}
            action={act.action}
            description={act.description}
            time={act.time}
            icon={act.icon}
            iconBg={act.iconBg}
            iconColor={act.iconColor}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
