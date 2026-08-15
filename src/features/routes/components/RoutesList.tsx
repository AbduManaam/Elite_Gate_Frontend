import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRoles } from '../../../shared/hooks/useRoles';
import { PageHeaderActions } from '../../../shared/components/PageHeaderActions';
import { useRoutesQuery, useDeleteRouteMutation, useDisableRouteMutation } from '../hooks/useRoutes';
import {
  useEnableRouteMutation,
  useAssignPolicyMutation,
  useRemovePolicyMutation
} from '../hooks/useRouteMutations';
import { RouteRecord } from '../api/routesApi';
import { usePoliciesQuery } from '../../policies/hooks/usePolicies';
import { RouteFormDrawer } from './RouteFormDrawer';
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal';
import { toApiError } from '../../../shared/api/apiError';
import { useActiveProject } from '../../../shared/hooks/useActiveProject';
import { useGatewaysQuery } from '../../gateways/hooks/useGateways';
import { buildRouteUrl } from '../../gateways/utils/gatewayUrl';
import { CopyableUrl } from '../../../shared/components/ui/CopyableUrl';

export const RoutesList: React.FC = () => {
  const { projectId } = useActiveProject();
  const { can } = useRoles();
  const [searchParams, setSearchParams] = useSearchParams();
  const [routeSearchQuery, setRouteSearchQuery] = useState('');
  const [routeMethodFilter, setRouteMethodFilter] = useState('Method: All');

  const [drawerState, setDrawerState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    route?: RouteRecord;
  }>({ isOpen: false, mode: 'create' });

  const [routeToDelete, setRouteToDelete] = useState<RouteRecord | null>(null);

  const canManageRoutes = can('editor');

  const isCreateFromUrl =
    canManageRoutes &&
    searchParams.get('action') === 'create-route';
  const effectiveDrawerState = drawerState.isOpen
    ? drawerState
    : { isOpen: isCreateFromUrl, mode: 'create' as const };

  const handleCloseDrawer = () => {
    setDrawerState({ isOpen: false, mode: 'create' });
    if (searchParams.get('action') === 'create-route') {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('action');
      setSearchParams(newParams, { replace: true });
    }
  };

  const { data: routes, isLoading, error } = useRoutesQuery(projectId);
  const { data: policies } = usePoliciesQuery(projectId);
  const { data: gateways } = useGatewaysQuery(projectId ?? '');
  const activeGateway = gateways?.find((gw) => gw.status !== 'decommissioned');

  const deleteRoute = useDeleteRouteMutation(projectId ?? '');
  const disableRoute = useDisableRouteMutation(projectId ?? '');
  const enableRoute = useEnableRouteMutation(projectId ?? '');

  const assignPolicy = useAssignPolicyMutation(projectId ?? '');
  const removePolicy = useRemovePolicyMutation(projectId ?? '');

  const handleToggleRoute = (route: RouteRecord) => {
    if (route.enabled) {
      disableRoute.mutate(route.id);
    } else {
      enableRoute.mutate(route.id);
    }
  };

  const handlePolicyChange = (routeId: string, policyId: string) => {
    if (policyId === '') {
      removePolicy.mutate(routeId);
    } else {
      assignPolicy.mutate({ routeId, policyId });
    }
  };

  const filteredRoutes = (routes ?? []).filter((route) => {
    const matchesSearch =
      route.path.toLowerCase().includes(routeSearchQuery.toLowerCase()) ||
      (route.upstream_url && route.upstream_url.toLowerCase().includes(routeSearchQuery.toLowerCase()));
    const matchesMethod =
      routeMethodFilter === 'Method: All' || route.methods.includes(routeMethodFilter.replace('Method: ', ''));
    return matchesSearch && matchesMethod;
  });

  const apiError = error ? toApiError(error) : null;

  return (
    <div className="flex flex-col gap-lg text-left">
      <PageHeaderActions
        title="Routes"
        description="Manage API ingress routing rules and policies."
        actions={
          canManageRoutes && (
            <button
              onClick={() => setDrawerState({ isOpen: true, mode: 'create' })}
              className="bg-[#113346] text-white px-4 py-2 rounded font-semibold text-xs hover:bg-[#123749] transition-colors flex items-center justify-center gap-1 shadow-sm cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Route
            </button>
          )
        }
      />

      <div className="bg-white border border-outline-variant rounded-xl flex flex-col overflow-hidden shadow-sm">
        <div className="p-4 border-b border-outline-variant flex flex-wrap gap-4 items-center bg-white">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-outline-variant rounded focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94] transition-all outline-none"
              placeholder="Search routes..."
              value={routeSearchQuery}
              onChange={(e) => setRouteSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="border border-outline-variant rounded font-body-sm text-sm py-1.5 pl-2 pr-6 bg-transparent"
            value={routeMethodFilter}
            onChange={(e) => setRouteMethodFilter(e.target.value)}
          >
            <option>Method: All</option>
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>PATCH</option>
            <option>DELETE</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          {isLoading && (
            <div className="p-lg text-center text-on-surface-variant text-sm">Loading routes…</div>
          )}

          {apiError && (
            <div className="p-lg text-center text-sm">
              {apiError.kind === 'forbidden' ? (
                <span className="text-on-surface-variant">You don't have permission to view routes for this project.</span>
              ) : apiError.kind === 'network' ? (
                <span className="text-error">Can't reach the server — check your connection.</span>
              ) : (
                <span className="text-error">{apiError.message}</span>
              )}
            </div>
          )}

          {!isLoading && !apiError && filteredRoutes.length === 0 && (
            <div className="p-xl text-center text-on-surface-variant text-sm">
              {routes?.length === 0
                ? 'No routes yet. Create one to start routing traffic.'
                : 'No routes match your filters.'}
            </div>
          )}

          {!isLoading && !apiError && filteredRoutes.length > 0 && (
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low font-semibold text-xs text-on-surface-variant sticky top-0 z-10 border-b border-outline-variant">
                <tr>
                  <th className="py-3 px-md font-medium">Path</th>
                  <th className="py-3 px-md font-medium">Callable URL</th>
                  <th className="py-3 px-md font-medium">Upstream</th>
                  <th className="py-3 px-md font-medium">Methods</th>
                  <th className="py-3 px-md font-medium">Protocol</th>
                  <th className="py-3 px-md font-medium">Policy</th>
                  <th className="py-3 px-md font-medium">Status</th>
                  {canManageRoutes && <th className="py-3 px-md w-[48px]" />}
                </tr>
              </thead>
              <tbody className="font-mono text-xs text-on-surface divide-y divide-outline-variant">
                {filteredRoutes.map((route) => (
                  <tr
                    key={route.id}
                    onClick={() => canManageRoutes && setDrawerState({ isOpen: true, mode: 'edit', route })}
                    className={`transition-colors group ${canManageRoutes ? 'hover:bg-surface-container-low cursor-pointer' : ''}`}
                  >
                    <td className="py-4 px-md font-medium text-[#587c94]">{route.path}</td>
                    <td className="py-4 px-md" onClick={(e) => e.stopPropagation()}>
                      {(() => {
                        const url = buildRouteUrl(activeGateway, route.path);
                        return url ? (
                          <CopyableUrl url={url} />
                        ) : (
                          <span className="text-outline text-[11px] italic">No active gateway</span>
                        );
                      })()}
                    </td>
                    <td className="py-4 px-md text-on-surface-variant">{route.upstream_url || '—'}</td>
                    <td className="py-4 px-md">
                      <div className="flex gap-1 flex-wrap">
                        {route.methods.map((m) => (
                          <span key={m} className="bg-[#587c94] text-white px-1 py-0.5 rounded font-bold text-[9px]">{m}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-md text-on-surface-variant">{route.protocol}</td>
                    <td className="py-4 px-md" onClick={(e) => e.stopPropagation()}>
                      {canManageRoutes ? (
                        <select
                          className="border border-outline-variant rounded font-body-sm text-xs py-1 px-2 bg-transparent focus:ring-1 focus:ring-[#587c94] outline-none"
                          value={route.policy_id ?? ''}
                          onChange={(e) => handlePolicyChange(route.id, e.target.value)}
                        >
                          <option value="">No Policy</option>

                          {policies?.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span>
                          {policies?.find((p) => p.id === route.policy_id)?.name ?? '—'}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-md" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        {canManageRoutes ? (
                          <label className="relative inline-block w-10 h-5 cursor-pointer shrink-0">
                            <input
                              type="checkbox"
                              checked={route.enabled}
                              onChange={() => handleToggleRoute(route)}
                              disabled={disableRoute.isPending || enableRoute.isPending}
                              className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-[#e3e7eb] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[14px] after:w-[14px] after:transition-all peer-checked:bg-[#587c94] opacity-80 hover:opacity-100 transition-opacity"></div>
                          </label>
                        ) : null}
                        <span className={route.enabled ? 'text-green-600 font-medium' : 'text-outline'}>
                          {route.enabled ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                    </td>
                    {canManageRoutes && (
                      <td className="py-4 px-md text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setRouteToDelete(route)}
                          disabled={deleteRoute.isPending}
                          className="text-outline hover:text-error opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity disabled:opacity-40"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t border-outline-variant bg-white rounded-b-xl flex justify-between items-center text-on-surface-variant text-xs">
          <span>Showing {filteredRoutes.length} routes</span>
        </div>
      </div>

      {canManageRoutes && effectiveDrawerState.isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="bg-white h-full shadow-2xl border-l border-outline-variant animate-slide-in overflow-y-auto">
            <RouteFormDrawer
              projectId={projectId ?? ''}
              mode={effectiveDrawerState.mode}
              route={effectiveDrawerState.route}
              onClose={handleCloseDrawer}
            />
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={routeToDelete !== null}
        title="Delete Route"
        isDanger
        message={
          <span>
            Are you sure you want to delete route <span className="font-bold">"{routeToDelete?.path}"</span>?
          </span>
        }
        description="Deleting this route will immediately stop routing API traffic to its upstream target. This action cannot be undone."
        confirmLabel="Delete Route"
        cancelLabel="Cancel"
        onConfirm={() => {
          if (routeToDelete) {
            deleteRoute.mutate(routeToDelete.id, {
              onSuccess: () => setRouteToDelete(null),
            });
          }
        }}
        onClose={() => setRouteToDelete(null)}
        isPending={deleteRoute.isPending}
        requireConfirmText="delete"
      />
    </div>
  );
};

export default RoutesList;