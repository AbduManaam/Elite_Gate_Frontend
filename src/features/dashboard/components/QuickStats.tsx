import React from 'react';
import { MOCK_STATS, QuickStatItem } from '../../../shared/mocks/dashboardMock';

export interface QuickStatsProps {
  readonly stats?: readonly QuickStatItem[];
  readonly className?: string;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  stats = MOCK_STATS,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-md ${className}`}>
      {stats.map((stat, idx) => {
        const { label, value, status, icon, isOnlineIndicator } = stat;
        return (
          <div
            key={`${label}-${idx}`}
            className="surface-level-1 rounded-lg p-md flex items-center justify-between text-left"
          >
            <div>
              <p className="font-label-md text-label-md text-outline uppercase tracking-tight mb-1">
                {label}
              </p>
              <p className="font-headline-md text-headline-md text-on-surface font-bold">
                {value}
              </p>
            </div>
            {isOnlineIndicator && (
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            )}
            {!isOnlineIndicator && icon && (
              <span
                className={`material-symbols-outlined text-[16px] ${
                  status === 'up' ? 'text-green-500' : 'text-outline'
                }`}
              >
                {icon}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default QuickStats;
