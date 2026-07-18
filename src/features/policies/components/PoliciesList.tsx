import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useActiveProject } from '../../../shared/hooks/useActiveProject';
import { useRoles } from '../../../shared/hooks/useRoles';
import { PageHeaderActions } from '../../../shared/components/PageHeaderActions';
import {
  usePoliciesQuery,
  useDeletePolicyMutation,
  useCreatePolicyMutation,
} from '../hooks/usePolicies';
import { PolicySummaryCards } from './PolicySummaryCards';
import { PolicyFilters, PolicyFilterType } from './PolicyFilters';
import { PoliciesTable } from './PoliciesTable';
import { PolicyDetailsPanel } from './PolicyDetailsPanel';
import { PolicyEmptyState } from './PolicyEmptyState';
import { PolicyDeleteDialog } from './PolicyDeleteDialog';
import { PolicyWizardDrawer } from './PolicyWizardDrawer';
import { PolicyEditDrawer } from './PolicyEditDrawer';
import { PolicyRecord } from '../api/policiesApi';
import { toApiError } from '../../../shared/api/apiError';

export const PoliciesList: React.FC = () => {
  const { projectId } = useActiveProject();
  const { can } = useRoles();
  const [searchParams, setSearchParams] = useSearchParams();

  // Local UI states
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<PolicyFilterType>('all');
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyRecord | null>(null);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | null>(null);

  useEffect(() => {
    if (searchParams.get('action') === 'create-policy') {
      setDrawerMode('create');
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('action');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const [deleteTarget, setDeleteTarget] = useState<PolicyRecord | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Queries & Mutations
  const { data: policies = [], isLoading, error } = usePoliciesQuery(projectId);
  const deletePolicy = useDeletePolicyMutation(projectId ?? '');
  const createPolicy = useCreatePolicyMutation(projectId ?? '');

  const canManage = can('editor');

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Duplicate handler
  const handleDuplicate = (policy: PolicyRecord) => {
    const payload = {
      name: `Copy of ${policy.name}`,
      auth_required: policy.auth_required,
      rate_limit_rpm: policy.rate_limit_rpm,
      allowed_origins: policy.allowed_origins || [],
      allowed_roles: policy.allowed_roles || [],
      allowed_scopes: policy.allowed_scopes || [],
    };

    createPolicy.mutate(payload, {
      onSuccess: (newPolicy) => {
        triggerToast(`Policy "${payload.name}" created successfully.`);
        setSelectedPolicy(newPolicy);
      },
      onError: (err) => {
        triggerToast(`Failed to duplicate policy: ${toApiError(err).message}`);
      },
    });
  };

  // Confirm delete
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deletePolicy.mutate(deleteTarget.id, {
      onSuccess: () => {
        triggerToast(`Policy "${deleteTarget.name}" deleted successfully.`);
        if (selectedPolicy?.id === deleteTarget.id) {
          setSelectedPolicy(null);
        }
        setDeleteTarget(null);
      },
      onError: (err) => {
        triggerToast(`Failed to delete policy: ${toApiError(err).message}`);
        setDeleteTarget(null);
      },
    });
  };

  // Client-side search and filters
  const filteredPolicies = policies.filter((p) => {
    // Search keyword match
    const term = searchText.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(term);
    const originsMatch = (p.allowed_origins || []).some((o) => o.toLowerCase().includes(term));
    const rolesMatch = (p.allowed_roles || []).some((r) => r.toLowerCase().includes(term));
    const scopesMatch = (p.allowed_scopes || []).some((s) => s.toLowerCase().includes(term));
    const matchesSearch = nameMatch || originsMatch || rolesMatch || scopesMatch;

    if (!matchesSearch) return false;

    // Chip filters
    if (selectedFilter === 'auth_required') return p.auth_required;
    if (selectedFilter === 'public') return !p.auth_required;
    if (selectedFilter === 'rate_limited') return p.rate_limit_rpm > 0;
    if (selectedFilter === 'no_rate_limit') return p.rate_limit_rpm === 0;
    if (selectedFilter === 'cors_enabled') return p.allowed_origins && p.allowed_origins.length > 0;

    return true;
  });

  const apiError = error ? toApiError(error) : null;
  const hasNoPolicies = !isLoading && !apiError && policies.length === 0;

  return (
    <div className="flex flex-col gap-lg text-left w-full relative">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-[#113346] text-white px-md py-sm rounded-lg shadow-xl text-xs font-semibold animate-slide-in">
          <span className="material-symbols-outlined text-[16px] text-green-400">check_circle</span>
          {toastMsg}
        </div>
      )}

      {/* Header section */}
      <PageHeaderActions
        title="Policies"
        description="Configure rate limits, authentication, and access control templates."
        actions={
          canManage && !hasNoPolicies && (
            <button
              type="button"
              onClick={() => setDrawerMode('create')}
              className="bg-[#113346] text-white px-4 py-2 rounded-lg font-semibold text-xs hover:bg-[#123749] transition-colors flex items-center justify-center gap-1 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Create Policy
            </button>
          )
        }
      />

      {/* API Error state */}
      {apiError && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-lg text-center text-sm text-error font-semibold flex flex-col items-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-[36px] text-error mb-1">warning</span>
          {apiError.kind === 'forbidden'
            ? "You don't have permission to view policies for this project."
            : apiError.kind === 'network'
            ? "Can't reach the server — check your connection."
            : apiError.message}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="p-xl text-center text-on-surface-variant text-sm bg-white border border-outline-variant rounded-xl shadow-sm">
          Loading policies…
        </div>
      )}

      {/* Main dashboard content */}
      {!isLoading && !apiError && (
        <>
          {hasNoPolicies ? (
            <PolicyEmptyState onCreateClick={() => setDrawerMode('create')} />
          ) : (
            <div className="flex flex-col gap-lg w-full">
              {/* Summary operational statistics cards */}
              <PolicySummaryCards policies={policies} />

              {/* Filters & Search Controls */}
              <PolicyFilters
                searchText={searchText}
                onSearchChange={setSearchText}
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
              />

              {/* Table + Side Panel Grid Layout */}
              <div className={`grid grid-cols-1 gap-md items-start w-full ${selectedPolicy ? 'lg:grid-cols-[1fr_340px]' : 'grid-cols-1'}`}>
                <div className="w-full overflow-hidden">
                  <PoliciesTable
                    policies={filteredPolicies}
                    selectedPolicyId={selectedPolicy?.id ?? null}
                    onSelectPolicy={(p) => setSelectedPolicy((prev) => (prev?.id === p.id ? null : p))}
                    onEditPolicy={(p) => {
                      setSelectedPolicy(p);
                      setDrawerMode('edit');
                    }}
                    onDeletePolicy={(p) => setDeleteTarget(p)}
                    onDuplicatePolicy={handleDuplicate}
                    canManage={canManage}
                  />
                </div>

                {selectedPolicy && (
                  <div className="w-full lg:w-[340px]">
                    <PolicyDetailsPanel
                      policy={selectedPolicy}
                      onClose={() => setSelectedPolicy(null)}
                      onEdit={() => setDrawerMode('edit')}
                      onDelete={() => setDeleteTarget(selectedPolicy)}
                      onDuplicate={() => handleDuplicate(selectedPolicy)}
                      canManage={canManage}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Stepper Wizard Drawer for Creating Policy */}
      {drawerMode === 'create' && (
        <PolicyWizardDrawer
          projectId={projectId ?? ''}
          onClose={() => setDrawerMode(null)}
          onSuccess={() => {
            setDrawerMode(null);
            triggerToast('Policy created successfully.');
          }}
        />
      )}

      {/* Edit Drawer for Modifying Policy */}
      {drawerMode === 'edit' && selectedPolicy && (
        <PolicyEditDrawer
          projectId={projectId ?? ''}
          policy={selectedPolicy}
          onClose={() => setDrawerMode(null)}
          onSuccess={() => {
            setDrawerMode(null);
            triggerToast('Policy changes saved successfully.');
          }}
        />
      )}

      {/* Delete confirmation dialog */}
      {deleteTarget && (
        <PolicyDeleteDialog
          isOpen={deleteTarget !== null}
          policy={deleteTarget}
          isDeleting={deletePolicy.isPending}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};
