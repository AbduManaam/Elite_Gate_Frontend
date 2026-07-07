import React, { useState } from 'react';
import { useActiveProject } from '../../../shared/hooks/useActiveProject';
import { useRoles } from '../../../shared/hooks/useRoles';
import { useRoutesQuery, useDeleteRouteMutation } from '../hooks/useRoutes';
import { toApiError } from '../../../shared/api/apiError';

export const RoutesList: React.FC = () => {
  const { projectId } = useActiveProject();
  const { can } = useRoles();
  const [routeSearchQuery, setRouteSearchQuery] = useState('');
  const [routeMethodFilter, setRouteMethodFilter] = useState('Method: All');

  const { data: routes, isLoading, error } = useRoutesQuery(projectId);
  const deleteRoute = useDeleteRouteMutation(projectId ?? '');

  // RBAC('editor') gates DELETE /routes/:id on the backend — mirror it here
  // so a viewer never sees a control they'd get a 403 clicking.
  const canManageRoutes = can('editor');

  const filteredRoutes = (routes ?? []).filter((route) => {
    const matchesSearch =
      route.path.toLowerCase().includes(routeSearchQuery.toLowerCase()) ||
      route.upstream_url.toLowerCase().includes(routeSearchQuery.toLowerCase());
    const matchesMethod =
      routeMethodFilter === 'Method: All' || route.methods.includes(routeMethodFilter.replace('Method: ', ''));
    return matchesSearch && matchesMethod;
  });

  const apiError = error ? toApiError(error) : null;

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-stack-xs">Routes</h2>
          <p className="font-body-md text-body-md text-[#587c94]">Manage API ingress routing rules and policies.</p>
        </div>
        {canManageRoutes && (
          <button className="bg-[#113346] text-white px-stack-md py-stack-sm rounded font-semibold text-xs hover:bg-[#123749] transition-colors flex items-center gap-stack-xs shadow-sm cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Route
          </button>
        )}
      </div>

      <div className="bg-white border border-outline-variant rounded-xl flex flex-col overflow-hidden shadow-sm">
        <div className="p-stack-md border-b border-outline-variant flex gap-stack-md items-center bg-white">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input
              className="w-full pl-9 pr-3 py-1 text-sm border border-outline-variant rounded focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94] transition-all outline-none"
              placeholder="Search routes..."
              value={routeSearchQuery}
              onChange={(e) => setRouteSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="border border-outline-variant rounded font-body-sm text-sm py-1 pl-2 pr-6 bg-transparent"
            value={routeMethodFilter}
            onChange={(e) => setRouteMethodFilter(e.target.value)}
          >
            <option>Method: All</option>
            <option>GET</option>
            <option>POST</option>
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
                  <th className="py-3 px-md font-medium">Upstream</th>
                  <th className="py-3 px-md font-medium">Methods</th>
                  <th className="py-3 px-md font-medium">Protocol</th>
                  <th className="py-3 px-md font-medium">Auth</th>
                  <th className="py-3 px-md font-medium">Status</th>
                  {canManageRoutes && <th className="py-3 px-md w-[48px]" />}
                </tr>
              </thead>
              <tbody className="font-mono text-xs text-on-surface divide-y divide-outline-variant">
                {filteredRoutes.map((route) => (
                  <tr key={route.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="py-4 px-md font-medium text-[#587c94]">{route.path}</td>
                    <td className="py-4 px-md text-on-surface-variant">{route.upstream_url || '—'}</td>
                    <td className="py-4 px-md">
                      <div className="flex gap-1">
                        {route.methods.map((m) => (
                          <span key={m} className="bg-[#587c94] text-white px-1 py-0.5 rounded font-bold text-[9px]">{m}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-md text-on-surface-variant">{route.protocol}</td>
                    <td className="py-4 px-md">{route.auth_required ? 'Required' : '—'}</td>
                    <td className="py-4 px-md">
                      <span className={route.enabled ? 'text-green-600' : 'text-outline'}>
                        {route.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    {canManageRoutes && (
                      <td className="py-4 px-md text-right">
                        <button
                          onClick={() => deleteRoute.mutate(route.id)}
                          disabled={deleteRoute.isPending}
                          className="text-outline hover:text-error opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-40"
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

        <div className="p-stack-sm px-stack-md border-t border-outline-variant bg-white rounded-b-xl flex justify-between items-center text-on-surface-variant text-xs">
          <span>Showing {filteredRoutes.length} routes</span>
          {routes && routes.length >= 500 && (
            <span className="text-error">
              Large result set — this endpoint has no server-side pagination yet.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoutesList;