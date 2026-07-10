import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ShortcutCardProps {
  readonly label: string;
  readonly description: string;
  readonly icon: string;
  readonly iconBg: string;
  readonly iconColor: string;
  readonly path: string;
}

export const ShortcutCard: React.FC<ShortcutCardProps> = ({
  label,
  description,
  icon,
  iconBg,
  iconColor,
  path,
}) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className="w-full flex items-center justify-between p-sm border border-outline-variant rounded-lg hover:bg-surface-container-low transition-all duration-200 group text-left cursor-pointer"
      type="button"
    >
      <div className="flex items-center gap-md min-w-0">
        {/* Icon Circle */}
        <div className={`w-8 h-8 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center shrink-0 shadow-sm`}>
          <span className="material-symbols-outlined text-[18px]">
            {icon}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
            {label}
          </p>
          <p className="text-[11px] text-on-surface-variant font-medium mt-0.5 truncate">
            {description}
          </p>
        </div>
      </div>
      <span className="material-symbols-outlined text-outline group-hover:text-on-surface text-[16px] transition-colors">
        chevron_right
      </span>
    </button>
  );
};

export default ShortcutCard;
