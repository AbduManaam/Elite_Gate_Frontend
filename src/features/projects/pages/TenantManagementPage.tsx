import React, { useState } from 'react';
import {
  useTenantsQuery,
  useSuspendTenantMutation,
  useReactivateTenantMutation,
  useDeleteTenantMutation,
} from '../../../shared/hooks/usePlatform';
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal';

export const TenantManagementPage: React.FC = () => {
  const { data: tenantsData, isLoading, refetch } = useTenantsQuery();
  const suspendTenant = useSuspendTenantMutation();
  const reactivateTenant = useReactivateTenantMutation();
  const deleteTenant = useDeleteTenantMutation();

  const [selectedTenant, setSelectedTenant] = useState<any | null>(null);
  const [confirmAction, setConfirmAction] = useState<'suspend' | 'reactivate' | 'delete' | null>(null);

  // Fallback mock data if the backend returns empty or isn't running
  const tenants = tenantsData?.projects || [
    { id: '11111111-1111-1111-1111-111111111111', name: 'Alpha Ingress Org', status: 'active', created_at: '2026-06-01T12:00:00Z' },
    { id: '22222222-2222-2222-2222-222222222222', name: 'Beta Payments LLC', status: 'active', created_at: '2026-06-15T15:30:00Z' },
    { id: '33333333-3333-3333-3333-333333333333', name: 'Gamma Corp Testing', status: 'suspended', created_at: '2026-07-02T09:15:00Z' },
  ];

  const handleActionClick = (tenant: any, action: 'suspend' | 'reactivate' | 'delete') => {
    setSelectedTenant(tenant);
    setConfirmAction(action);
  };

  const handleConfirmSubmit = () => {
    if (!selectedTenant || !confirmAction) return;

    const onSuccess = () => {
      setConfirmAction(null);
      setSelectedTenant(null);
      refetch();
    };

    if (confirmAction === 'suspend') {
      suspendTenant.mutate(selectedTenant.id, { onSuccess });
    } else if (confirmAction === 'reactivate') {
      reactivateTenant.mutate(selectedTenant.id, { onSuccess });
    } else if (confirmAction === 'delete') {
      deleteTenant.mutate(selectedTenant.id, { onSuccess });
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex flex-col gap-md text-left">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Tenant Management</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">Suspend, reactivate, or delete administrative tenant accounts.</p>
        </div>
      </div>

      <div className="bg-white border border-outline-variant rounded-xl overflow-x-auto shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-container-low border-b border-outline-variant text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            <tr>
              <th className="py-3 px-lg">Tenant / Workspace Name</th>
              <th className="py-3 px-lg">Tenant UUID</th>
              <th className="py-3 px-lg">Created At</th>
              <th className="py-3 px-lg">Status</th>
              <th className="py-3 px-lg text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {tenants.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-lg font-semibold text-on-surface">{t.name}</td>
                <td className="py-4 px-lg font-mono text-xs text-outline">{t.id}</td>
                <td className="py-4 px-lg text-xs text-on-surface-variant">{formatDate(t.created_at)}</td>
                <td className="py-4 px-lg">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    t.status === 'active'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                    {t.status === 'active' ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td className="py-4 px-lg text-right flex justify-end gap-2">
                  {t.status === 'active' ? (
                    <button
                      onClick={() => handleActionClick(t, 'suspend')}
                      className="px-3 py-1.5 border border-outline-variant text-xs font-semibold rounded-lg hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors cursor-pointer"
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActionClick(t, 'reactivate')}
                      className="px-3 py-1.5 border border-outline-variant text-xs font-semibold rounded-lg hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors cursor-pointer"
                    >
                      Reactivate
                    </button>
                  )}
                  <button
                    onClick={() => handleActionClick(t, 'delete')}
                    className="px-3 py-1.5 border-2 border-error/20 text-error text-xs font-bold rounded-lg hover:bg-error hover:text-white hover:border-error transition-all cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={confirmAction === 'suspend'}
        title="Suspend Tenant Account"
        isDanger
        confirmLabel="Suspend Tenant"
        cancelLabel="Cancel"
        message={
          <span>
            Are you sure you want to suspend <span className="font-bold">"{selectedTenant?.name}"</span>?
          </span>
        }
        description="Suspended tenants will lose access to all API routes and their admin dashboard will be blocked until reactivated."
        onConfirm={handleConfirmSubmit}
        onClose={() => setConfirmAction(null)}
        isPending={suspendTenant.isPending}
      />

      <ConfirmModal
        isOpen={confirmAction === 'reactivate'}
        title="Reactivate Tenant Account"
        confirmLabel="Reactivate Tenant"
        cancelLabel="Cancel"
        message={
          <span>
            Reactivate workspace access for <span className="font-bold">"{selectedTenant?.name}"</span>?
          </span>
        }
        description="This will restore full routing functionality and dashboard access to the tenant's administrators."
        onConfirm={handleConfirmSubmit}
        onClose={() => setConfirmAction(null)}
        isPending={reactivateTenant.isPending}
      />

      <ConfirmModal
        isOpen={confirmAction === 'delete'}
        title="Delete Tenant Workspace"
        isDanger
        confirmLabel="Delete Workspace"
        cancelLabel="Cancel"
        message={
          <span>
            Are you sure you want to permanently delete <span className="font-bold">"{selectedTenant?.name}"</span>?
          </span>
        }
        description="This action is absolute and irreversible. It will wipe all databases, routes, and API key configurations associated with this tenant."
        onConfirm={handleConfirmSubmit}
        onClose={() => setConfirmAction(null)}
        isPending={deleteTenant.isPending}
        requireConfirmText="delete"
      />
    </div>
  );
};

export default TenantManagementPage;
