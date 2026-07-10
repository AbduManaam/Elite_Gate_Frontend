import React from 'react';
import { UpstreamRecord } from '../api/types';

interface UpstreamDeleteDialogProps {
    readonly upstream: UpstreamRecord;
    readonly isOpen: boolean;
    readonly isDeleting: boolean;
    readonly onConfirm: () => void;
    readonly onCancel: () => void;
}

export const UpstreamDeleteDialog: React.FC<UpstreamDeleteDialogProps> = ({
    upstream,
    isOpen,
    isDeleting,
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-md animate-fade-in">
            {/* Dialog Container */}
            <div className="bg-white border border-outline-variant rounded-xl shadow-2xl w-full max-w-[440px] overflow-hidden text-left p-lg flex flex-col gap-md animate-scale-up">
                {/* Warning Header */}
                <div className="flex items-start gap-md">
                    <div className="p-sm bg-error/10 text-error rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[24px]">warning</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-on-surface">
                            Delete Upstream
                        </h3>
                        <p className="text-sm font-semibold text-on-surface-variant mt-1">
                            {upstream.name}
                        </p>
                    </div>
                </div>

                {/* Warning message */}
                <p className="text-xs text-on-surface-variant leading-relaxed">
                    Are you sure you want to delete this upstream service? This action cannot be undone. Any API Gateway routes currently referencing this upstream may stop working.
                </p>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-sm mt-sm border-t border-outline-variant/60 pt-md">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="px-md py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="bg-error text-white px-md py-1.5 text-xs font-semibold rounded-lg hover:bg-error-container hover:text-error transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center gap-xs"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Upstream'}
                    </button>
                </div>
            </div>
        </div>
    );
};
