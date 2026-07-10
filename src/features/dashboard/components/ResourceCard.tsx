import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ResourceCardProps {
  readonly title: string;
  readonly count: number;
  readonly icon: string;
  readonly iconBg: string;
  readonly iconColor: string;
  readonly linkText: string;
  readonly path: string;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  count,
  icon,
  iconBg,
  iconColor,
  linkText,
  path,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-outline-variant rounded-xl p-md flex items-center gap-md shadow-xs hover:shadow-md transition-all duration-200 text-left">
      {/* Icon Circle */}
      <div className={`w-12 h-12 rounded-full ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
        <span className="material-symbols-outlined text-[22px]">
          {icon}
        </span>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <span className="text-xs text-on-surface-variant font-semibold tracking-wide uppercase">
          {title}
        </span>
        <h4 className="text-display-sm font-display-sm font-bold text-on-surface leading-none mt-0.5 mb-1">
          {count}
        </h4>
        <button
          onClick={() => navigate(path)}
          className="text-xs font-semibold text-[#587c94] hover:text-[#113346] flex items-center gap-0.5 transition-colors cursor-pointer"
          type="button"
        >
          {linkText}
          <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span>
        </button>
      </div>
    </div>
  );
};

export default ResourceCard;
