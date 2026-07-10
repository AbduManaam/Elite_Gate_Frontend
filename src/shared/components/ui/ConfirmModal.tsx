import React from 'react';

export interface ConfirmModalProps {
  readonly isOpen: boolean;
  readonly title: string;
  readonly message: string | React.ReactNode;
  readonly description?: string | React.ReactNode;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly onConfirm: () => void;
  readonly onClose: () => void;
  readonly isPending?: boolean;
  readonly isDanger?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onClose,
  isPending = false,
  isDanger = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-md backdrop-blur-xs select-none">
      {/* Dim backdrop click to close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-white rounded-xl border border-outline-variant shadow-2xl w-[420px] max-w-full flex flex-col gap-0 overflow-hidden text-left animate-fade-in-scale">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-outline-variant flex justify-between items-center">
          <h3 className={`font-semibold text-base flex items-center gap-xs ${isDanger ? 'text-error' : 'text-[#113346]'}`}>
            <span className="material-symbols-outlined text-[20px] align-middle select-none leading-none">
              {isDanger ? 'warning' : 'info'}
            </span>
            {title}
          </h3>
          <button 
            onClick={onClose} 
            className="material-symbols-outlined text-outline hover:text-on-surface cursor-pointer text-[20px] outline-none leading-none select-none transition-colors"
            type="button"
            aria-label="Close dialog"
          >
            close
          </button>
        </div>

        {/* Content Body */}
        <div className="px-6 py-5 flex flex-col gap-sm font-sans">
          <div className="text-sm text-on-surface leading-relaxed">
            {message}
          </div>
          {description && (
            <div className={`text-xs leading-relaxed border rounded-lg p-3 ${
              isDanger 
                ? 'bg-red-50 text-red-700 border-red-200/60' 
                : 'bg-slate-50 text-on-surface-variant border-outline-variant/60'
            }`}>
              {description}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-outline-variant flex justify-end gap-3 bg-slate-50/50">
          <button 
            onClick={onClose} 
            disabled={isPending}
            className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors cursor-pointer outline-none disabled:opacity-50"
            type="button"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1 shadow-sm outline-none ${
              isDanger 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-[#113346] hover:bg-brand-hover text-white'
            }`}
            type="button"
          >
            {isPending ? 'Processing...' : confirmLabel}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmModal;
