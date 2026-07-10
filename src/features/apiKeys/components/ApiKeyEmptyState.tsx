import React from 'react';

interface ApiKeyEmptyStateProps {
    readonly onCreateClick: () => void;
    readonly hasPermission: boolean;
}

export const ApiKeyEmptyState: React.FC<ApiKeyEmptyStateProps> = ({ onCreateClick, hasPermission }) => {
    return (
        <div className="flex flex-col items-center justify-center p-xl border border-dashed border-outline-variant rounded-xl text-center bg-white shadow-sm my-md w-full">
            <span className="material-symbols-outlined text-[48px] text-[#587c94] mb-md select-none">
                vpn_key
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-xs text-center w-full">No API Keys Yet</h3>
            <p className="font-body-md text-body-md text-on-surface-variant w-full max-w-sm mb-lg text-center mx-auto">
                Generate your first API Key to authorize and authenticate client applications against the gateway.
            </p>
            {hasPermission && (
                <button
                    onClick={onCreateClick}
                    className="bg-[#113346] hover:bg-[#123749] text-white px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Create API Key
                </button>
            )}
        </div>
    );
};

export default ApiKeyEmptyState;
