import React from 'react';

interface ApiKeyStatusBadgeProps {
    readonly status: string;
}

export const ApiKeyStatusBadge: React.FC<ApiKeyStatusBadgeProps> = ({ status }) => {
    const normStatus = status.toLowerCase();

    let bgClass = 'bg-gray-100 text-gray-800 border-gray-200';
    let dotClass = 'bg-gray-500';
    let displayLabel = 'Unknown';

    if (normStatus === 'active') {
        bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-200/50';
        dotClass = 'bg-emerald-500';
        displayLabel = 'Active';
    } else if (normStatus === 'revoked') {
        bgClass = 'bg-red-50 text-red-700 border-red-200/50';
        dotClass = 'bg-red-500';
        displayLabel = 'Revoked';
    } else if (normStatus === 'expired') {
        bgClass = 'bg-slate-100 text-slate-600 border-slate-200/80';
        dotClass = 'bg-slate-400';
        displayLabel = 'Expired';
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wider ${bgClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
            {displayLabel}
        </span>
    );
};

export default ApiKeyStatusBadge;
