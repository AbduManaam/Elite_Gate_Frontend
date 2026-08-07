import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useActiveProject } from '../../../shared/hooks/useActiveProject';
import { useRoles } from '../../../shared/hooks/useRoles';
import { PageHeaderActions } from '../../../shared/components/PageHeaderActions';
import {
    useUpstreamsQuery,
    useDeleteUpstreamMutation,
    useDisableUpstreamMutation,
    useUpdateUpstreamMutation,
} from '../hooks/useUpstreams';
import { UpstreamSummaryCards } from './UpstreamSummaryCards';
import { UpstreamFilters } from './UpstreamFilters';
import { UpstreamTable } from './UpstreamTable';
import { UpstreamEmptyState } from './UpstreamEmptyState';
import { UpstreamDeleteDialog } from './UpstreamDeleteDialog';
import { UpstreamFormDrawer } from './UpstreamFormDrawer';
import { UpstreamTargetsDrawer } from './UpstreamTargetsDrawer';
import { UpstreamRecord } from '../api/types';
import { toApiError } from '../../../shared/api/apiError';

type FilterType = 'all' | 'http' | 'grpc' | 'enabled' | 'disabled';

export const UpstreamsList: React.FC = () => {
    const { projectId } = useActiveProject();
    const { can } = useRoles();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Local UI states
    const [upstreamSearchQuery, setUpstreamSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
    const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
    const [formDrawer, setFormDrawer] = useState<{
        isOpen: boolean;
        mode: 'create' | 'edit';
        upstream?: UpstreamRecord;
    }>({
        isOpen: false,
        mode: 'create',
    });

    const isCreateFromUrl = searchParams.get('action') === 'create-upstream';
    const effectiveFormDrawer = formDrawer.isOpen
        ? formDrawer
        : { isOpen: isCreateFromUrl, mode: 'create' as const };

    const handleCloseFormDrawer = () => {
        setFormDrawer({ isOpen: false, mode: 'create' });
        if (searchParams.get('action') === 'create-upstream') {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('action');
            setSearchParams(newParams, { replace: true });
        }
    };
    const [deleteTarget, setDeleteTarget] = useState<UpstreamRecord | null>(null);
    const [selectedUpstreamForTargets, setSelectedUpstreamForTargets] = useState<UpstreamRecord | null>(null);

    const queryClient = useQueryClient();

    // Queries & Mutations
    const { data: upstreams, isLoading, error } = useUpstreamsQuery(projectId);
    const deleteUpstream = useDeleteUpstreamMutation(projectId ?? '');
    const disableUpstream = useDisableUpstreamMutation(projectId ?? '');
    const updateUpstream = useUpdateUpstreamMutation(projectId ?? '');

    const handleRefreshHealth = () => {
        if (!projectId) return;
        queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'upstreams'] });
    };

    const canManage = can('editor');

    // Toggle Enabled (Disables via PATCH, Enables via PUT update)
    const handleToggleEnabled = (u: UpstreamRecord) => {
        if (u.enabled) {
            disableUpstream.mutate(u.id);
        } else {
            updateUpstream.mutate({
                id: u.id,
                input: {
                    name: u.name,
                    target_url: u.target_url,
                    protocol: u.protocol,
                    health_path: u.health_path,
                    enabled: true,
                    lb_strategy: u.lb_strategy,
                },
            });
        }
    };

    // Confirm Deletion
    const handleConfirmDelete = () => {
        if (!deleteTarget) return;
        deleteUpstream.mutate(deleteTarget.id, {
            onSuccess: () => {
                setDeleteTarget(null);
            },
        });
    };

    // Row expansion toggle
    const handleToggleExpand = (id: string) => {
        setExpandedRowId((prev) => (prev === id ? null : id));
    };

    // Client-side filtering logic
    const filteredUpstreams = (upstreams ?? []).filter((u) => {
        // Search filter
        const matchesSearch =
            u.name.toLowerCase().includes(upstreamSearchQuery.toLowerCase()) ||
            u.target_url.toLowerCase().includes(upstreamSearchQuery.toLowerCase()) ||
            u.protocol.toLowerCase().includes(upstreamSearchQuery.toLowerCase());

        if (!matchesSearch) return false;

        // Filter chips
        if (selectedFilter === 'http') return u.protocol === 'http';
        if (selectedFilter === 'grpc') return u.protocol === 'grpc';
        if (selectedFilter === 'enabled') return u.enabled;
        if (selectedFilter === 'disabled') return !u.enabled;

        return true;
    });

    const apiError = error ? toApiError(error) : null;
    const hasNoUpstreams = !isLoading && !apiError && (upstreams ?? []).length === 0;

    return (
        <div className="flex flex-col gap-lg text-left">
            {/* Header section */}
            <PageHeaderActions
                title="Upstreams"
                description="Manage backend routing destinations and load balancing configurations."
                titleScale="display"
                actions={
                    !hasNoUpstreams && (
                        <div className="flex items-center gap-sm">
                            <button
                                type="button"
                                onClick={handleRefreshHealth}
                                className="bg-white border border-outline-variant text-on-surface font-semibold px-md py-sm rounded-lg hover:bg-surface-container transition-colors flex items-center justify-center gap-xs h-[36px] cursor-pointer text-xs whitespace-nowrap shadow-xs"
                                title="Re-check health across all upstreams"
                            >
                                <span className="material-symbols-outlined text-[16px] text-outline">refresh</span>
                                Refresh Health
                            </button>
                            {canManage && (
                                <button
                                    onClick={() => setFormDrawer({ isOpen: true, mode: 'create' })}
                                    className="bg-[#113346] text-white font-bold px-md py-sm rounded-lg hover:bg-[#123749] transition-colors flex items-center justify-center gap-sm h-[36px] cursor-pointer whitespace-nowrap shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-[18px]">add</span>
                                    New Upstream
                                </button>
                            )}
                        </div>
                    )
                }
            />

            {/* Error state */}
            {apiError && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-lg text-center text-sm text-error">
                    {apiError.kind === 'forbidden'
                        ? "You don't have permission to view upstreams for this project."
                        : apiError.kind === 'network'
                        ? "Can't reach the server — check your connection."
                        : apiError.message}
                </div>
            )}

            {/* Loading state */}
            {isLoading && (
                <div className="p-xl text-center text-on-surface-variant text-sm bg-white border border-outline-variant rounded-xl shadow-sm">
                    Loading upstreams…
                </div>
            )}

            {/* Main content grid */}
            {!isLoading && !apiError && (
                <>
                    {hasNoUpstreams ? (
                        <UpstreamEmptyState
                            onCreateClick={() => setFormDrawer({ isOpen: true, mode: 'create' })}
                        />
                    ) : (
                        <div className="flex flex-col gap-lg">
                            {/* Summary Metric Cards */}
                            <UpstreamSummaryCards upstreams={upstreams ?? []} />

                            {/* Search + Filter control bar */}
                            <UpstreamFilters
                                searchText={upstreamSearchQuery}
                                onSearchChange={setUpstreamSearchQuery}
                                selectedFilter={selectedFilter}
                                onFilterChange={setSelectedFilter}
                            />

                            {/* Data Table */}
                            <UpstreamTable
                                projectId={projectId}
                                upstreams={filteredUpstreams}
                                expandedRowId={expandedRowId}
                                onToggleExpand={handleToggleExpand}
                                onEdit={(u) => setFormDrawer({ isOpen: true, mode: 'edit', upstream: u })}
                                onToggleEnabled={handleToggleEnabled}
                                onViewTargets={(u) => setSelectedUpstreamForTargets(u)}
                                onDelete={(u) => setDeleteTarget(u)}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Target Instances Side Drawer */}
            {selectedUpstreamForTargets && (
                <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
                    <div className="bg-white h-full shadow-2xl border-l border-outline-variant animate-slide-in overflow-y-auto">
                        <UpstreamTargetsDrawer
                            projectId={projectId ?? ''}
                            upstreamId={selectedUpstreamForTargets.id}
                            upstreamName={selectedUpstreamForTargets.name}
                            onClose={() => setSelectedUpstreamForTargets(null)}
                        />
                    </div>
                </div>
            )}

            {/* Upstream Form Drawer (Create Stepper / Edit Form) */}
            {effectiveFormDrawer.isOpen && (
                <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
                    <div className="bg-white h-full shadow-2xl border-l border-outline-variant animate-slide-in overflow-y-auto">
                        <UpstreamFormDrawer
                            projectId={projectId ?? ''}
                            mode={effectiveFormDrawer.mode}
                            upstream={effectiveFormDrawer.upstream}
                            onClose={handleCloseFormDrawer}
                        />
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <UpstreamDeleteDialog
                    upstream={deleteTarget}
                    isOpen={!!deleteTarget}
                    isDeleting={deleteUpstream.isPending}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </div>
    );
};

export default UpstreamsList;