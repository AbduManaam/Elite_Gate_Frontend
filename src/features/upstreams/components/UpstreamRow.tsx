import React from 'react';
import { UpstreamRecord } from '../api/types';

interface UpstreamRowProps {
    readonly upstream: UpstreamRecord;
    readonly isExpanded: boolean;
    readonly onToggleExpand: () => void;
    readonly onEdit: () => void;
    readonly onViewTargets: () => void;
    readonly onDelete: () => void;
}

export const UpstreamRow: React.FC<UpstreamRowProps> = ({
    upstream,
    isExpanded,
    onToggleExpand,
    onEdit,
    onViewTargets,
    onDelete,
}) => {
    const getLBStrategyName = (s?: string) => {
        if (s === 'least_conn') return 'Least Connections';
        return 'Round Robin';
    };

    return (
        <tr
            onClick={onToggleExpand}
            className={`transition-colors cursor-pointer border-b border-outline-variant hover:bg-slate-50/50 ${
                isExpanded ? 'bg-slate-50/50' : 'bg-white'
            }`}
        >


            {/* Status Dot Column */}
            <td className="py-4 px-md">
                <div className="flex items-center gap-1.5 font-medium text-xs">
                    <div
                        className={`w-2.5 h-2.5 rounded-full ${
                            upstream.enabled
                                ? 'bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                                : 'bg-outline-variant'
                        }`}
                    />
                    <span className={upstream.enabled ? 'text-on-surface' : 'text-on-surface-variant'}>
                        {upstream.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                </div>
            </td>

            {/* Name Column */}
            <td className="py-4 px-md font-semibold text-on-surface">
                <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-[#587c94] text-[18px]">dns</span>
                    <div className="flex flex-col text-left">
                        <span>{upstream.name}</span>
                        <span className="text-[10px] text-on-surface-variant font-normal leading-tight">
                            Gateway Service
                        </span>
                    </div>
                </div>
            </td>

            {/* Target URL Column */}
            <td className="py-4 px-md text-on-surface-variant font-mono text-xs max-w-[200px] truncate" title={upstream.target_url}>
                {upstream.target_url}
            </td>

            {/* Protocol Badge Column */}
            <td className="py-4 px-md">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                    upstream.protocol === 'grpc'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                    {upstream.protocol}
                </span>
            </td>

            {/* Load Balancer Column */}
            <td className="py-4 px-md text-xs font-semibold text-on-surface">
                <span className="bg-surface-container-high px-2.5 py-1 rounded-md text-[11px] text-[#113346]">
                    {getLBStrategyName(upstream.lb_strategy)}
                </span>
            </td>

            {/* Health Column */}
            <td className="py-4 px-md">
                <div className="flex items-center gap-1.5 font-medium text-xs">
                    <span className={`w-2 h-2 rounded-full ${upstream.enabled ? 'bg-green-600' : 'bg-outline-variant'}`} />
                    <span className={upstream.enabled ? 'text-green-700 font-semibold' : 'text-on-surface-variant'}>
                        {upstream.enabled ? 'Healthy' : 'Disabled'}
                    </span>
                </div>
            </td>

            {/* Quick Actions Column */}
            <td className="py-4 px-md text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end gap-sm opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity">
                    {/* Expand Arrow */}
                    <button
                        type="button"
                        onClick={onToggleExpand}
                        className="text-on-surface-variant hover:text-[#587c94] transition-colors p-xs cursor-pointer"
                        title={isExpanded ? 'Collapse row' : 'Expand row'}
                    >
                        <span className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                        }`}>
                            keyboard_arrow_down
                        </span>
                    </button>

                    {/* Edit */}
                    <button
                        type="button"
                        onClick={onEdit}
                        className="text-on-surface-variant hover:text-[#587c94] transition-colors p-xs cursor-pointer"
                        title="Edit config"
                    >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>

                    {/* Targets */}
                    <button
                        type="button"
                        onClick={onViewTargets}
                        className="text-on-surface-variant hover:text-[#587c94] transition-colors p-xs cursor-pointer"
                        title="View targets"
                    >
                        <span className="material-symbols-outlined text-[18px]">list</span>
                    </button>

                    {/* Delete */}
                    <button
                        type="button"
                        onClick={onDelete}
                        className="text-on-surface-variant hover:text-error transition-colors p-xs cursor-pointer"
                        title="Delete upstream"
                    >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                </div>
            </td>
        </tr>
    );
};
