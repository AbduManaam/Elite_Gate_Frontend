import React from 'react';

interface ActivityItemProps {
  readonly action: string;
  readonly description: string;
  readonly time: string;
  readonly icon: string;
  readonly iconBg: string;
  readonly iconColor: string;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  action,
  description,
  time,
  icon,
  iconBg,
  iconColor,
}) => {
  return (
    <div className="flex items-center justify-between py-sm border-b border-outline-variant last:border-b-0 last:pb-0 text-left">
      <div className="flex items-start gap-md min-w-0">
        {/* Icon Circle */}
        <div className={`w-8 h-8 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center shrink-0 shadow-sm mt-0.5`}>
          <span className="material-symbols-outlined text-[16px]">
            {icon}
          </span>
        </div>

        {/* Text Details */}
        <div className="min-w-0">
          <p className="text-xs font-bold text-on-surface truncate">
            {action}
          </p>
          <p className="text-[11px] text-on-surface-variant font-medium mt-0.5 truncate max-w-sm sm:max-w-md">
            {description}
          </p>
        </div>
      </div>

      {/* Timestamp */}
      <span className="text-[11px] text-outline font-medium shrink-0 ml-md">
        {time}
      </span>
    </div>
  );
};

export default ActivityItem;
