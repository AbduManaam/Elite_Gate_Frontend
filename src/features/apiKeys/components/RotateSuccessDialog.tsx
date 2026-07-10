import React from 'react';
import CopyKeyInput from './CopyKeyInput';

interface RotateSuccessDialogProps {
    readonly apiKeyName: string;
    readonly newRawKey: string;
    readonly onClose: () => void;
}

export const RotateSuccessDialog: React.FC<RotateSuccessDialogProps> = ({
    apiKeyName,
    newRawKey,
    onClose,
}) => {
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-md backdrop-blur-xs select-none">
            <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-2xl w-[440px] max-w-full flex flex-col gap-md text-left">
                <div className="flex items-center gap-2 border-b border-outline-variant pb-md mb-xs">
                    <span className="material-symbols-outlined text-[24px] text-emerald-600 leading-none">autorenew</span>
                    <div>
                        <h3 className="font-headline-md text-headline-md text-on-surface">API Key Rotated</h3>
                        <p className="text-[11px] text-on-surface-variant mt-1">The previous key has been immediately revoked.</p>
                    </div>
                </div>

                <div className="text-xs text-on-surface-variant flex flex-col gap-1">
                    <span className="font-semibold">Key Name</span>
                    <span className="text-on-surface text-sm font-medium">{apiKeyName}</span>
                </div>

                <div className="text-xs text-on-surface-variant flex flex-col gap-1">
                    <span className="font-semibold">New Raw API Key</span>
                    <CopyKeyInput value={newRawKey} />
                </div>

                <div className="bg-amber-50 border border-amber-200/50 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] text-amber-700 leading-none mt-0.5 shrink-0 select-none">warning</span>
                    <div className="flex flex-col gap-0.5 font-sans">
                        <span className="font-bold">Security Action Required</span>
                        <span>Make sure to copy the new API key and update your client applications. This raw key is shown only once and will never be displayed again.</span>
                    </div>
                </div>

                <div className="flex justify-end gap-sm mt-sm border-t border-outline-variant pt-md">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-[#113346] hover:bg-[#123749] text-white px-4 py-2 rounded text-xs font-semibold cursor-pointer outline-none transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RotateSuccessDialog;
