import React, { useState } from 'react';
import { useActiveProject } from '../../../shared/hooks/useActiveProject';
import { useRoles } from '../../../shared/hooks/useRoles';
import { useProjectsQuery, useCreateProjectMutation, useDeleteProjectMutation } from '../../../shared/hooks/useProjects';
import {
  useGatewaysQuery,
  useProvisionGatewayMutation,
  useDecommissionGatewayMutation,
  useReloadConfigMutation,
  useRestartGatewayMutation
} from '../hooks/useGateways';

interface GatewaysOverviewProps {
  readonly showOnlyProject?: boolean;
  readonly showOnlyGateways?: boolean;
}

export const GatewaysOverview: React.FC<GatewaysOverviewProps> = ({
  showOnlyProject = false,
  showOnlyGateways = false,
}) => {
  const showProject = !showOnlyGateways;
  const showGateways = !showOnlyProject;
  
  const { projectId, setActiveProjectId } = useActiveProject();
  const { can } = useRoles();

  const { data: projectsData } = useProjectsQuery();
  const { data: gateways, isLoading: isGatewaysLoading } = useGatewaysQuery(projectId ?? '');

  const createProject = useCreateProjectMutation();
  const deleteProject = useDeleteProjectMutation();

  const provisionGateway = useProvisionGatewayMutation(projectId ?? '');
  const decommissionGateway = useDecommissionGatewayMutation(projectId ?? '');
  const reloadConfig = useReloadConfigMutation(projectId ?? '');
  const restartGateway = useRestartGatewayMutation(projectId ?? '');

  const [isCreateProjOpen, setIsCreateProjOpen] = useState(false);
  const [projForm, setProjForm] = useState({ name: '', slug: '', description: '', plan: '' });

  const [isProvisionOpen, setIsProvisionOpen] = useState(false);
  const [gatewayPlan, setGatewayPlan] = useState('developer');

  const projects = projectsData?.items ?? [];
  const currentProject = projects.find((p) => p.id === projectId);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    createProject.mutate(projForm, {
      onSuccess: (newProj) => {
        setActiveProjectId(newProj.id);
        setIsCreateProjOpen(false);
        setProjForm({ name: '', slug: '', description: '', plan: '' });
      },
    });
  };

  const handleDeleteProject = () => {
    if (!projectId) return;
    if (window.confirm(`Are you absolutely sure you want to delete project "${currentProject?.name}"? This action is permanent.`)) {
      deleteProject.mutate(projectId, {
        onSuccess: () => {
          setActiveProjectId(null);
        },
      });
    }
  };

  const handleProvisionGateway = (e: React.FormEvent) => {
    e.preventDefault();
    provisionGateway.mutate(gatewayPlan, {
      onSuccess: () => {
        setIsProvisionOpen(false);
      },
    });
  };

  return (
    <div className="flex flex-col gap-lg text-left">
      {/* Project Control Panel */}
      {showProject && (
        <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-sm">
          <div className="flex justify-between items-start mb-md border-b border-outline-variant pb-sm">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Project Workspace</h3>
              <p className="text-xs text-on-surface-variant mt-1">Configure active gateway tenant workspace.</p>
            </div>
            <div className="flex gap-sm">
              <button
                onClick={() => setIsCreateProjOpen(true)}
                className="px-3 py-1.5 border border-outline-variant text-on-surface font-semibold text-xs rounded hover:bg-surface-container transition-colors cursor-pointer"
              >
                New Project
              </button>
              {can('owner') && projectId && (
                <button
                  onClick={handleDeleteProject}
                  disabled={deleteProject.isPending}
                  className="px-3 py-1.5 bg-error text-white font-semibold text-xs rounded hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Delete Project
                </button>
              )}
            </div>
          </div>

          {currentProject ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-md text-xs font-mono">
              <div>
                <span className="block text-on-surface-variant font-sans font-semibold mb-1">Project Name</span>
                <span className="text-on-surface font-semibold text-sm">{currentProject.name}</span>
              </div>
              <div>
                <span className="block text-on-surface-variant font-sans font-semibold mb-1">Project Slug</span>
                <span className="bg-surface-container px-2 py-0.5 rounded border border-outline-variant text-on-surface">{currentProject.slug}</span>
              </div>
              <div>
                <span className="block text-on-surface-variant font-sans font-semibold mb-1">Project ID</span>
                <span className="text-on-surface select-all">{currentProject.id}</span>
              </div>
              <div>
                <span className="block text-on-surface-variant font-sans font-semibold mb-1">Active Plan</span>
                <span className="capitalize font-sans font-bold text-primary">{currentProject.plan}</span>
              </div>
            </div>
          ) : (
          <div className="flex flex-col items-start gap-md py-sm">
            <p className="text-sm text-on-surface-variant">No project selected. Click "New Project" to get started.</p>
            <button
              onClick={() => setIsCreateProjOpen(true)}
              className="bg-[#113346] text-white px-4 py-2 rounded font-semibold text-xs hover:bg-[#123749] transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Create New Project
            </button>
          </div>
          )}
        </div>
      )}

      {/* Gateway Service Nodes Panel */}
      {showGateways && (
        <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-white">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Gateway Nodes</h3>
              <p className="text-xs text-on-surface-variant mt-1">Active proxy/routing docker container instances.</p>
            </div>
            <div className="flex gap-sm">
              {can('editor') && projectId && (
                <>
                  <button
                    onClick={() => reloadConfig.mutate()}
                    disabled={reloadConfig.isPending}
                    className="px-3 py-1.5 border border-outline-variant text-on-surface font-semibold text-xs rounded hover:bg-surface-container transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {reloadConfig.isPending ? 'Reloading...' : 'Hot Reload'}
                  </button>
                  <button
                    onClick={() => setIsProvisionOpen(true)}
                    className="px-3 py-1.5 bg-[#113346] text-white font-semibold text-xs rounded hover:bg-[#123749] transition-colors cursor-pointer"
                  >
                    Provision Gateway
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            {isGatewaysLoading && <p className="p-lg text-center text-sm text-on-surface-variant">Loading gateway nodes...</p>}
            
            {!isGatewaysLoading && (!gateways || gateways.length === 0) && (
              <p className="p-xl text-center text-sm text-on-surface-variant">No gateway nodes provisioned for this project.</p>
            )}

            {!isGatewaysLoading && gateways && gateways.length > 0 && (
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low border-b border-outline-variant text-xs font-semibold text-on-surface-variant">
                  <tr>
                    <th className="py-2.5 px-md">Status</th>
                    <th className="py-2.5 px-md">Gateway ID</th>
                    <th className="py-2.5 px-md">Endpoint</th>
                    <th className="py-2.5 px-md">Plan</th>
                    {can('editor') && <th className="py-2.5 px-md text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="font-mono text-xs text-on-surface divide-y divide-outline-variant">
                  {gateways.map((gw) => (
                    <tr key={gw.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-md">
                        <div className="flex items-center gap-1.5 font-sans font-medium">
                          <span className={`w-2 h-2 rounded-full ${
                            gw.status === 'active' ? 'bg-green-600' : gw.status === 'provisioning' ? 'bg-yellow-500' : 'bg-red-600'
                          }`} />
                          <span className="capitalize">{gw.status}</span>
                        </div>
                      </td>
                      <td className="py-3 px-md font-semibold text-[#587c94]">{gw.external_id}</td>
                      <td className="py-3 px-md">{gw.endpoint_ip}:{gw.gateway_port}</td>
                      <td className="py-3 px-md capitalize font-sans">{gw.plan}</td>
                      {can('editor') && (
                        <td className="py-3 px-md text-right font-sans">
                          <div className="flex justify-end gap-sm">
                            <button
                              onClick={() => restartGateway.mutate(gw.external_id)}
                              disabled={restartGateway.isPending}
                              className="px-2 py-1 text-xs border border-outline-variant rounded hover:bg-surface-container cursor-pointer transition-colors"
                            >
                              Restart
                            </button>
                            <button
                              onClick={() => decommissionGateway.mutate(gw.external_id)}
                              disabled={decommissionGateway.isPending}
                              className="px-2 py-1 text-xs bg-error/10 hover:bg-error text-error hover:text-white border border-error/20 rounded cursor-pointer transition-all"
                            >
                              Decommission
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {isCreateProjOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-md">
          <form onSubmit={handleCreateProject} className="bg-white border border-outline-variant rounded-xl p-lg shadow-2xl w-[400px] max-w-full flex flex-col gap-md">
            <h3 className="font-headline-md text-headline-md">New Project</h3>
            
            <label className="flex flex-col gap-xs text-xs">
              Project Name
              <input
                required
                value={projForm.name}
                onChange={(e) => setProjForm((f) => ({ ...f, name: e.target.value }))}
                className="border border-outline-variant rounded px-2.5 py-1.5 text-sm outline-none"
              />
            </label>
            <label className="flex flex-col gap-xs text-xs">
              Project Slug
              <input
                required
                value={projForm.slug}
                onChange={(e) => setProjForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '') }))}
                className="border border-outline-variant rounded px-2.5 py-1.5 text-sm font-mono outline-none"
              />
            </label>
            <label className="flex flex-col gap-xs text-xs">
              Description
              <textarea
                value={projForm.description}
                onChange={(e) => setProjForm((f) => ({ ...f, description: e.target.value }))}
                className="border border-outline-variant rounded px-2.5 py-1.5 text-sm outline-none resize-none h-16"
              />
            </label>

            {createProject.error && <p className="text-error text-xs">{(createProject.error as any).message}</p>}

            <div className="flex justify-end gap-sm mt-sm">
              <button type="button" onClick={() => setIsCreateProjOpen(false)} className="px-3 py-1.5 text-xs text-on-surface-variant">
                Cancel
              </button>
              <button
                type="submit"
                disabled={createProject.isPending}
                className="bg-[#113346] text-white px-3 py-1.5 rounded text-xs font-semibold disabled:opacity-50"
              >
                {createProject.isPending ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Provision Gateway Modal */}
      {isProvisionOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-md">
          <form onSubmit={handleProvisionGateway} className="bg-white border border-outline-variant rounded-xl p-lg shadow-2xl w-[400px] max-w-full flex flex-col gap-md">
            <h3 className="font-headline-md text-headline-md">Provision Gateway Node</h3>
            
            <label className="flex flex-col gap-xs text-xs">
              Sizing Plan
              <select
                value={gatewayPlan}
                onChange={(e) => setGatewayPlan(e.target.value)}
                className="border border-outline-variant rounded px-2.5 py-1.5 text-sm outline-none"
              >
                <option value="developer">Developer (Shared node, 500 RPM limit)</option>
                <option value="production">Production (Dedicated cluster, unlimited RPM)</option>
              </select>
            </label>

            {provisionGateway.error && <p className="text-error text-xs">{(provisionGateway.error as any).message}</p>}

            <div className="flex justify-end gap-sm mt-sm">
              <button type="button" onClick={() => setIsProvisionOpen(false)} className="px-3 py-1.5 text-xs text-on-surface-variant">
                Cancel
              </button>
              <button
                type="submit"
                disabled={provisionGateway.isPending}
                className="bg-[#113346] text-white px-3 py-1.5 rounded text-xs font-semibold disabled:opacity-50"
              >
                {provisionGateway.isPending ? 'Provisioning...' : 'Provision'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
