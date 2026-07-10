import React from 'react';
import { createPortal } from 'react-dom';
import { PolicyRecord } from '../api/policiesApi';
import { StatusBadge, AuthenticationBadge, RateLimitBadge } from './shared/Badges';

interface PolicyRowProps {
  readonly policy: PolicyRecord;
  readonly isSelected: boolean;
  readonly onSelect: () => void;
  readonly onEdit: () => void;
  readonly onDelete: () => void;
  readonly onDuplicate: () => void;
  readonly canManage: boolean;
}

export const PolicyRow: React.FC<PolicyRowProps> = ({
  policy,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  canManage,
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [triggerRect, setTriggerRect] = React.useState<DOMRect | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (buttonRef.current) {
      setTriggerRect(buttonRef.current.getBoundingClientRect());
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const formatList = (list: string[] | undefined, maxItems = 1) => {
    if (!list || list.length === 0) return <span className="text-outline">—</span>;
    if (list.length === 1 && list[0] === '*') return <span className="font-mono font-medium">*</span>;

    const visible = list.slice(0, maxItems);
    const extraCount = list.length - maxItems;

    return (
      <div className="flex flex-col gap-0.5">
        <span className="font-medium text-on-surface truncate max-w-[150px] inline-block font-mono">
          {visible.join(', ')}
        </span>
        {extraCount > 0 && (
          <span className="text-[10px] text-[#587c94] font-sans font-bold">+{extraCount} more</span>
        )}
      </div>
    );
  };

  const timeAgo = (iso?: string) => {
    if (!iso) return '';
    const date = new Date(iso);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return `Updated ${Math.floor(interval)}y ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `Updated ${Math.floor(interval)}mo ago`;
    interval = seconds / 86400;
    if (interval > 1) return `Updated ${Math.floor(interval)}d ago`;
    interval = seconds / 3600;
    if (interval > 1) return `Updated ${Math.floor(interval)}h ago`;
    interval = seconds / 60;
    if (interval > 1) return `Updated ${Math.floor(interval)}m ago`;
    return 'Updated just now';
  };

  return (
    <tr
      onClick={onSelect}
      className={`transition-colors border-b border-outline-variant/60 cursor-pointer text-left text-xs ${
        isSelected ? 'bg-[#587c94]/10 hover:bg-[#587c94]/15' : 'hover:bg-surface-container-low'
      }`}
    >
      <td className="py-4 px-md">
        <StatusBadge authRequired={policy.auth_required} />
      </td>
      <td className="py-4 px-md">
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-on-surface font-sans text-sm">{policy.name}</span>
          <span className="text-[10px] text-outline font-sans">{timeAgo(policy.updated_at || policy.created_at)}</span>
        </div>
      </td>
      <td className="py-4 px-md">
        <AuthenticationBadge authRequired={policy.auth_required} />
      </td>
      <td className="py-4 px-md">
        <RateLimitBadge rpm={policy.rate_limit_rpm} />
      </td>
      <td className="py-4 px-md text-on-surface-variant font-mono">{formatList(policy.allowed_origins)}</td>
      <td className="py-4 px-md text-on-surface-variant font-mono">{formatList(policy.allowed_roles)}</td>
      <td className="py-4 px-md text-on-surface-variant font-mono">{formatList(policy.allowed_scopes)}</td>
      <td className="py-4 px-md text-right" onClick={(e) => e.stopPropagation()}>
        <div className="relative inline-block text-left">
          <button
            ref={buttonRef}
            onClick={handleMenuToggle}
            className="p-1 hover:bg-surface-container rounded cursor-pointer text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">more_vert</span>
          </button>

          {isMenuOpen && triggerRect && (
            <>
              {/* Backdrop that closes the menu on click */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsMenuOpen(false)} 
              />
              {createPortal(
                <div 
                  style={{
                    position: 'absolute',
                    top: `${triggerRect.bottom + window.scrollY + 4}px`,
                    left: `${triggerRect.right + window.scrollX - 128}px`, // w-32 is 8rem = 128px
                  }}
                  className="w-32 bg-white border border-outline-variant rounded-lg shadow-lg z-50 overflow-hidden py-1"
                >
                  <button
                    onClick={() => {
                      onSelect();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 w-full text-left hover:bg-slate-50 transition-colors text-xs text-on-surface cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">visibility</span>
                    Details
                  </button>
                  {canManage && (
                    <>
                      <button
                        onClick={() => {
                          onEdit();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 w-full text-left hover:bg-slate-50 transition-colors text-xs text-on-surface cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          onDuplicate();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 w-full text-left hover:bg-slate-50 transition-colors text-xs text-on-surface cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">content_copy</span>
                        Duplicate
                      </button>
                      <button
                        onClick={() => {
                          onDelete();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 w-full text-left hover:bg-slate-50 transition-colors text-xs text-error cursor-pointer border-t border-outline-variant/60 mt-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                        Delete
                      </button>
                    </>
                  )}
                </div>,
                document.body
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  );
};
