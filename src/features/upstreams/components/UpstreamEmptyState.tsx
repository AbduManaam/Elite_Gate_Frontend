import React from 'react';

interface UpstreamEmptyStateProps {
    readonly onCreateClick: () => void;
}

export const UpstreamEmptyState: React.FC<UpstreamEmptyStateProps> = ({ onCreateClick }) => {
    return (
        <div className="flex flex-col items-center justify-center p-xl border border-dashed border-outline-variant bg-white rounded-xl text-center max-w-2xl mx-auto my-lg shadow-sm">
            {/* Hub Icon Container */}
            <div className="w-16 h-16 rounded-full bg-[#113346]/5 text-[#113346] flex items-center justify-center mb-md border border-[#113346]/10">
                <span className="material-symbols-outlined text-[36px]">hub</span>
            </div>

            {/* Content */}
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-sm">
                No Upstreams Yet
            </h3>
            <p className="text-xs text-on-surface-variant max-w-md leading-relaxed mb-lg">
                You haven't created any upstreams for this project. Upstreams define your backend services and specify how traffic is distributed across them.
            </p>

            {/* CTA Button */}
            <button
                type="button"
                onClick={onCreateClick}
                className="bg-[#113346] text-white font-bold px-lg py-sm rounded-lg hover:bg-[#123749] transition-colors flex items-center gap-sm cursor-pointer shadow-sm"
            >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Create Upstream
            </button>
        </div>
    );
};
