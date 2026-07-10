import React from 'react';
import { UpstreamRecord } from '../api/types';

interface UpstreamExpandedRowProps {
    readonly upstream: UpstreamRecord;
    readonly onEdit: () => void;
    readonly onToggleEnabled: () => void;
    readonly onViewTargets: () => void;
    readonly onDelete: () => void;
}

export const UpstreamExpandedRow: React.FC<UpstreamExpandedRowProps> = ({
    upstream,
    onEdit,
    onToggleEnabled,
    onViewTargets,
    onDelete,
}) => {
    const formatDate = (dStr: string) => {
        try {
            return new Date(dStr).toLocaleString();
        } catch {
            return dStr;
        }
    };

    const getStrategyLabel = (strategy?: string) => {
        if (strategy === 'least_conn') return 'Least Connections';
        return 'Round Robin';
    };

    return (
        <tr className="bg-slate-50/70">
            <td colSpan={7} className="p-0 border-b border-outline-variant">
                <div className="px-lg py-md border-l-4 border-[#113346] flex flex-col md:flex-row gap-lg justify-between items-start text-left">
                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-md gap-x-lg flex-1">
                        {/* Target URL */}
                        <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                                Target URL
                            </span>
                            <span className="text-xs font-mono font-medium text-on-surface truncate">
                                {upstream.target_url}
                            </span>
                        </div>

                        {/* Health Path */}
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                                Health Path
                            </span>
                            <span className="text-xs font-mono font-medium text-on-surface">
                                {upstream.health_path || '—'}
                            </span>
                        </div>

                        {/* Protocol */}
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                                Protocol
                            </span>
                            <span className="text-xs font-semibold text-on-surface uppercase">
                                {upstream.protocol}
                            </span>
                        </div>

                        {/* Strategy */}
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                                LB Strategy
                            </span>
                            <span className="text-xs font-semibold text-on-surface">
                                {getStrategyLabel(upstream.lb_strategy)}
                            </span>
                        </div>

                        {/* Created At */}
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                                Created At
                            </span>
                            <span className="text-xs font-medium text-on-surface">
                                {formatDate(upstream.created_at)}
                            </span>
                        </div>

                        {/* Updated At */}
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                                Last Updated
                            </span>
                            <span className="text-xs font-medium text-on-surface">
                                {formatDate(upstream.updated_at)}
                            </span>
                        </div>
                    </div>

                    {/* Quick Inline Actions */}
                    <div className="flex flex-wrap items-center gap-sm md:self-center border-t md:border-t-0 border-outline-variant/60 pt-sm md:pt-0 w-full md:w-auto justify-end">
                        {/* View Targets */}
                        <button
                            type="button"
                            onClick={onViewTargets}
                            className="bg-white hover:bg-surface-container border border-outline-variant text-on-surface px-md py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                            <span className="material-symbols-outlined text-[16px]">list</span>
                            View Targets
                        </button>

                        {/* Edit */}
                        <button
                            type="button"
                            onClick={onEdit}
                            className="bg-white hover:bg-surface-container border border-outline-variant text-on-surface px-md py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                            Edit Config
                        </button>

                        {/* Enable / Disable */}
                        <button
                            type="button"
                            onClick={onToggleEnabled}
                            className={`px-md py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1 cursor-pointer transition-colors ${
                                upstream.enabled
                                    ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                                    : 'bg-[#113346] border-[#113346] text-white hover:bg-[#123749]'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[16px]">
                                {upstream.enabled ? 'pause_circle' : 'play_circle'}
                            </span>
                            {upstream.enabled ? 'Disable' : 'Enable'}
                        </button>

                        {/* Delete */}
                        <button
                            type="button"
                            onClick={onDelete}
                            className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-md py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                            Delete
                        </button>
                    </div>
                </div>
            </td>
        </tr>
    );
};
