import React from 'react';
import { UpstreamRecord } from '../api/types';
import { UpstreamRow } from './UpstreamRow';
import { UpstreamExpandedRow } from './UpstreamExpandedRow';

interface UpstreamTableProps {
    readonly projectId: string | null;
    readonly upstreams: UpstreamRecord[];
    readonly expandedRowId: string | null;
    readonly onToggleExpand: (id: string) => void;
    readonly onEdit: (upstream: UpstreamRecord) => void;
    readonly onToggleEnabled: (upstream: UpstreamRecord) => void;
    readonly onViewTargets: (upstream: UpstreamRecord) => void;
    readonly onDelete: (upstream: UpstreamRecord) => void;
}

export const UpstreamTable: React.FC<UpstreamTableProps> = ({
    projectId,
    upstreams,
    expandedRowId,
    onToggleExpand,
    onEdit,
    onToggleEnabled,
    onViewTargets,
    onDelete,
}) => {
    return (
        <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-surface-container-low border-b border-outline-variant">

                            <th className="py-3 px-md font-bold text-[10px] uppercase tracking-wider text-on-surface-variant w-[120px]">
                                Status
                            </th>
                            <th className="py-3 px-md font-bold text-[10px] uppercase tracking-wider text-on-surface-variant">
                                Upstream
                            </th>
                            <th className="py-3 px-md font-bold text-[10px] uppercase tracking-wider text-on-surface-variant">
                                Target URL
                            </th>
                            <th className="py-3 px-md font-bold text-[10px] uppercase tracking-wider text-on-surface-variant">
                                Protocol
                            </th>
                            <th className="py-3 px-md font-bold text-[10px] uppercase tracking-wider text-on-surface-variant">
                                Load Balancer
                            </th>
                            <th className="py-3 px-md font-bold text-[10px] uppercase tracking-wider text-on-surface-variant">
                                Health
                            </th>
                            <th className="py-3 px-md font-bold text-[10px] uppercase tracking-wider text-on-surface-variant text-right w-[150px]">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                        {upstreams.map((upstream) => {
                            const isExpanded = expandedRowId === upstream.id;
                            return (
                                <React.Fragment key={upstream.id}>
                                    <UpstreamRow
                                        projectId={projectId}
                                        upstream={upstream}
                                        isExpanded={isExpanded}
                                        onToggleExpand={() => onToggleExpand(upstream.id)}
                                        onEdit={() => onEdit(upstream)}
                                        onViewTargets={() => onViewTargets(upstream)}
                                        onDelete={() => onDelete(upstream)}
                                    />
                                    {isExpanded && (
                                        <UpstreamExpandedRow
                                            upstream={upstream}
                                            onEdit={() => onEdit(upstream)}
                                            onToggleEnabled={() => onToggleEnabled(upstream)}
                                            onViewTargets={() => onViewTargets(upstream)}
                                            onDelete={() => onDelete(upstream)}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            
            {/* Table Footer */}
            <div className="bg-surface-container-low border-t border-outline-variant p-sm px-md flex justify-between items-center text-xs">
                <p className="text-on-surface-variant font-medium">
                    Showing {upstreams.length} of {upstreams.length} upstreams
                </p>
                <div className="flex gap-xs">
                    <button
                        type="button"
                        disabled
                        className="px-2.5 py-1 border border-outline-variant rounded bg-white text-on-surface-variant disabled:opacity-40 text-xs font-semibold"
                    >
                        Previous
                    </button>
                    <button
                        type="button"
                        disabled
                        className="px-2.5 py-1 border border-outline-variant rounded bg-white text-on-surface-variant disabled:opacity-40 text-xs font-semibold"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};
