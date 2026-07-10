import React from 'react';
import { ApiKeyRecord } from '../types/apiKey';

interface RotateApiKeyDialogProps {
    readonly apiKey: ApiKeyRecord;
    readonly onClose: () => void;
    readonly onConfirm: () => void;
    readonly isPending: boolean;
}

export const RotateApiKeyDialog: React.FC<RotateApiKeyDialogProps> = ({
    apiKey,
    onClose,
    onConfirm,
    isPending,
}) => {
    return (
        <div className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center p-md backdrop-blur-xs select-none">
            <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-2xl w-[420px] max-w-full flex flex-col gap-md text-left">
                <div className="flex items-center gap-2 border-b border-outline-variant pb-md mb-xs">
                    <span className="material-symbols-outlined text-[24px] text-amber-500 leading-none">sync</span>
                    <div>
                        <h3 className="font-headline-md text-headline-md text-on-surface">Rotate API Key</h3>
                        <p className="text-[11px] text-on-surface-variant mt-1">Generate a replacement API credential.</p>
                    </div>
                </div>

                <div className="text-xs text-on-surface-variant flex flex-col gap-2">
                    <p>
                        Are you sure you want to rotate the credential <span className="font-bold text-on-surface">"{apiKey.name}"</span>?
                    </p>
                    <p className="bg-amber-50 border border-amber-200/50 rounded-lg p-3 text-[11px] text-amber-800 font-sans">
                        This action <span className="font-bold">cannot be undone</span>. The current key will immediately become invalid, and any applications using it will fail to authenticate until they are updated with the new key.
                    </p>
                </div>

                <div className="flex justify-end gap-sm mt-sm border-t border-outline-variant pt-md">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded transition-colors cursor-pointer outline-none"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isPending}
                        className="bg-[#113346] hover:bg-[#123749] text-white px-4 py-2 rounded text-xs font-semibold disabled:opacity-50 cursor-pointer outline-none transition-colors"
                    >
                        {isPending ? 'Rotating...' : 'Rotate Key'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RotateApiKeyDialog;
