import React, { useState, useRef, useEffect } from 'react';
import { useActiveProject } from '../../../shared/hooks/useActiveProject';
import { useRoles } from '../../../shared/hooks/useRoles';
import { toApiError } from '../../../shared/api/apiError';
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal';
import { useCustomDomainsQuery } from '../hooks/useCustomDomains';
import {
  useCreateDomainMutation,
  useVerifyDomainMutation,
  useCheckRoutingMutation,
  useActivateDomainMutation,
  useDeleteDomainMutation,
} from '../hooks/useDomainMutations';
import { CustomDomain } from '../api/domain.types';
import { CustomDomainsTable } from '../components/CustomDomainsTable';
import { CreateDomainModal } from '../components/CreateDomainModal';

export const CustomDomainsPage: React.FC = () => {
  const { projectId } = useActiveProject();
  const { can } = useRoles();

  // Strict backend RBAC rules
  const canCreate = can('owner');
  const canVerify = can('owner');
  const canCheckRouting = can('owner');
  const canActivate = can('owner');
  const canDelete = can('owner');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [domainToDelete, setDomainToDelete] = useState<CustomDomain | null>(null);
  const [toastMsg, setToastMsg] = useState<{ text: string; isError?: boolean } | null>(null);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const { data: domains = [], isLoading, isRefetching, error, refetch } = useCustomDomainsQuery(projectId);

  const createMutation = useCreateDomainMutation(projectId ?? '');
  const verifyMutation = useVerifyDomainMutation(projectId ?? '');
  const checkRoutingMutation = useCheckRoutingMutation(projectId ?? '');
  const activateMutation = useActivateDomainMutation(projectId ?? '');
  const deleteMutation = useDeleteDomainMutation(projectId ?? '');

  const triggerToast = (text: string, isError = false) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMsg({ text, isError });
    toastTimerRef.current = setTimeout(() => setToastMsg(null), 3500);
  };

  const handleOpenCreateModal = () => {
    setCreateError(null);
    setIsAddModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateError(null);
    setIsAddModalOpen(false);
  };

  const handleCreateSubmit = async (hostname: string): Promise<CustomDomain> => {
    setCreateError(null);
    try {
      const res = await createMutation.mutateAsync({ hostname });
      triggerToast(`Custom domain "${hostname}" added.`);
      return res;
    } catch (err) {
      const apiErr = toApiError(err);
      setCreateError(apiErr.message);
      throw err;
    }
  };

  const handleVerify = (domain: CustomDomain) => {
    setPendingActionId(domain.id);
    verifyMutation.mutate(domain.id, {
      onSuccess: () => {
        triggerToast(`Ownership for "${domain.hostname}" verified successfully.`);
      },
      onError: (err) => {
        triggerToast(`Verification failed: ${toApiError(err).message}`, true);
      },
      onSettled: () => {
        setPendingActionId(null);
      },
    });
  };

  const handleCheckRouting = (domain: CustomDomain) => {
    setPendingActionId(domain.id);
    checkRoutingMutation.mutate(domain.id, {
      onSuccess: () => {
        triggerToast(`CNAME routing for "${domain.hostname}" is ready.`);
      },
      onError: (err) => {
        triggerToast(`Routing check failed: ${toApiError(err).message}`, true);
      },
      onSettled: () => {
        setPendingActionId(null);
      },
    });
  };

  const handleActivate = (domain: CustomDomain) => {
    setPendingActionId(domain.id);
    activateMutation.mutate(domain.id, {
      onSuccess: (res) => {
        if (res.status === 'provisioning_started' || res.status === 'provisioning_in_progress') {
          triggerToast(`Certificate provisioning initiated for "${domain.hostname}".`);
        } else {
          triggerToast(`Domain "${domain.hostname}" is active.`);
        }
      },
      onError: (err) => {
        triggerToast(`Activation failed: ${toApiError(err).message}`, true);
      },
      onSettled: () => {
        setPendingActionId(null);
      },
    });
  };

  const handleDeleteConfirm = () => {
    if (!domainToDelete) return;
    setPendingActionId(domainToDelete.id);
    deleteMutation.mutate(domainToDelete.id, {
      onSuccess: () => {
        triggerToast(`Domain "${domainToDelete.hostname}" deleted.`);
        setDomainToDelete(null);
      },
      onError: (err) => {
        triggerToast(`Failed to delete domain: ${toApiError(err).message}`, true);
        setDomainToDelete(null);
      },
      onSettled: () => {
        setPendingActionId(null);
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      {toastMsg && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border text-xs font-semibold flex items-center gap-2 animate-fade-in ${
            toastMsg.isError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {toastMsg.isError ? 'error' : 'check_circle'}
          </span>
          {toastMsg.text}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface">Custom Domains</h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Configure custom branded hostnames for your gateway project, verify DNS ownership, and set up CNAME routing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            type="button"
            className="border border-outline-variant hover:bg-surface-container text-on-surface-variant px-3 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[16px] ${isRefetching ? 'animate-spin' : ''}`}>refresh</span>
            Refresh
          </button>
          {canCreate && (
            <button
              onClick={handleOpenCreateModal}
              type="button"
              className="bg-[#113346] hover:bg-brand-hover text-white px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Custom Domain
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-xs text-on-surface-variant flex flex-col items-center gap-2">
          <span className="material-symbols-outlined text-[24px] animate-spin">progress_activity</span>
          Loading custom domains...
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">error</span>
          Failed to load domains: {toApiError(error).message}
        </div>
      ) : domains.length === 0 ? (
        <div className="border border-dashed border-outline-variant rounded-xl p-12 text-center bg-white flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[48px] text-outline">language</span>
          <h3 className="font-semibold text-sm text-on-surface">No Custom Domains Configured</h3>
          <p className="text-xs text-on-surface-variant max-w-sm">
            Add a custom hostname to map your brand's API domain to EliteGate.
          </p>
          {canCreate && (
            <button
              onClick={handleOpenCreateModal}
              type="button"
              className="mt-2 bg-[#113346] hover:bg-brand-hover text-white px-4 py-2 rounded-lg font-semibold text-xs cursor-pointer"
            >
              Add Custom Domain
            </button>
          )}
        </div>
      ) : (
        <CustomDomainsTable
          projectId={projectId ?? ''}
          domains={domains}
          canVerify={canVerify}
          canCheckRouting={canCheckRouting}
          canActivate={canActivate}
          canDelete={canDelete}
          onVerify={handleVerify}
          onCheckRouting={handleCheckRouting}
          onActivate={handleActivate}
          onDelete={(d) => setDomainToDelete(d)}
          onToast={triggerToast}
          pendingActionId={pendingActionId}
        />
      )}

      <CreateDomainModal
        isOpen={isAddModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateSubmit}
        isPending={createMutation.isPending}
        error={createError}
      />

      <ConfirmModal
        isOpen={Boolean(domainToDelete)}
        title="Delete Custom Domain"
        isDanger={true}
        message={`Are you sure you want to delete the custom domain "${domainToDelete?.hostname}"?`}
        description="The domain will stop appearing in EliteGate and may immediately stop serving network traffic for your gateway."
        confirmLabel="Delete Domain"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDomainToDelete(null)}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
};

export default CustomDomainsPage;
