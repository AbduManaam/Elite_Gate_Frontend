import React from 'react';
import { UpstreamRecord } from '../api/types';

interface UpstreamSummaryCardsProps {
    readonly upstreams: UpstreamRecord[];
}

export const UpstreamSummaryCards: React.FC<UpstreamSummaryCardsProps> = ({ upstreams }) => {
    const total = upstreams.length;
    const enabled = upstreams.filter((u) => u.enabled).length;
    const httpCount = upstreams.filter((u) => u.protocol === 'http').length;
    const grpcCount = upstreams.filter((u) => u.protocol === 'grpc').length;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-md w-full">
            {/* Total Upstreams Card */}
            <div className="bg-white border border-outline-variant rounded-xl p-md flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                        Total Upstreams
                    </span>
                    <span className="text-display-sm font-bold text-on-surface mt-1">
                        {total}
                    </span>
                </div>
                <div className="p-md rounded-xl bg-surface-container-high text-[#113346] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">hub</span>
                </div>
            </div>

            {/* Enabled Card */}
            <div className="bg-white border border-outline-variant rounded-xl p-md flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                        Enabled
                    </span>
                    <span className="text-display-sm font-bold text-[#10b981] mt-1">
                        {enabled}
                    </span>
                </div>
                <div className="p-md rounded-xl bg-green-50 text-[#10b981] border border-green-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">toggle_on</span>
                </div>
            </div>

            {/* HTTP Card */}
            <div className="bg-white border border-outline-variant rounded-xl p-md flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                        HTTP Services
                    </span>
                    <span className="text-display-sm font-bold text-[#3b82f6] mt-1">
                        {httpCount}
                    </span>
                </div>
                <div className="p-md rounded-xl bg-blue-50 text-[#3b82f6] border border-blue-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">language</span>
                </div>
            </div>

            {/* gRPC Card */}
            <div className="bg-white border border-outline-variant rounded-xl p-md flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                        gRPC Services
                    </span>
                    <span className="text-display-sm font-bold text-[#8b5cf6] mt-1">
                        {grpcCount}
                    </span>
                </div>
                <div className="p-md rounded-xl bg-purple-50 text-[#8b5cf6] border border-purple-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">deployed_code</span>
                </div>
            </div>
        </div>
    );
};
