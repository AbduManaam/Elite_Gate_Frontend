import React from 'react';

interface PageHeaderActionsProps {
  readonly title: string;
  readonly description?: string;
  readonly titleScale?: 'headline' | 'display';
  readonly actions?: React.ReactNode;
  readonly className?: string;
}

/**
 * Standard page/section header: title + description on the left, an
 * action slot on the right. Stacks vertically below `sm`, sits side by
 * side from `sm` up. This is the ONLY place this responsive behavior
 * should be implemented — don't hand-roll `flex justify-between` header
 * rows elsewhere, so a future page gets this fix automatically instead
 * of needing someone to remember to add it by hand again.
 */
export const PageHeaderActions: React.FC<PageHeaderActionsProps> = ({
  title,
  description,
  titleScale = 'headline',
  actions,
  className = '',
}) => {
  const titleClass =
    titleScale === 'display'
      ? 'font-display-lg text-display-lg text-on-surface'
      : 'font-headline-lg text-headline-lg text-on-surface mb-stack-xs';

  return (
    <div className={`flex flex-col items-start sm:flex-row sm:justify-between sm:items-end gap-md ${className}`}>
      <div className="min-w-0">
        <h2 className={titleClass}>{title}</h2>
        {description && (
          <p className="font-body-md text-body-md text-[#587c94] mt-1">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-sm shrink-0 w-full sm:w-auto [&>button]:w-full sm:[&>button]:w-auto">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeaderActions;
