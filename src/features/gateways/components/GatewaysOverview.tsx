import React, { useState, useEffect, useMemo } from 'react';
import { useActiveProject } from '../../../shared/hooks/useActiveProject';
import { useRoles } from '../../../shared/hooks/useRoles';
import { useProjectsQuery, useCreateProjectMutation, useDeleteProjectMutation } from '../../../shared/hooks/useProjects';
import {
  useGatewaysQuery,
  useProvisionGatewayMutation,
  useDecommissionGatewayMutation,
  useReloadConfigMutation,
} from '../hooks/useGateways';
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal';
import { buildGatewayBaseUrl } from '../utils/gatewayUrl';
import { CopyableUrl } from '../../../shared/components/ui/CopyableUrl';
import { toApiError } from '../../../shared/api/apiError';

interface GatewaysOverviewProps {
  readonly showOnlyProject?: boolean;
  readonly showOnlyGateways?: boolean;
  readonly onViewAllGateways?: () => void;
  /** Shared with the page header blue reload button so Last Reload stays in sync. */
  readonly lastReloadTime?: Date;
  readonly onReloadConfig?: () => void;
  readonly reloadPending?: boolean;
  readonly reloadError?: Error | null;
}

export const GatewaysOverview: React.FC<GatewaysOverviewProps> = ({
  showOnlyProject = false,
  showOnlyGateways = false,
  onViewAllGateways,
  lastReloadTime: lastReloadTimeProp,
  onReloadConfig: onReloadConfigProp,
  reloadPending: reloadPendingProp,
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

  const [isCreateProjOpen, setIsCreateProjOpen] = useState(false);
  const [projForm, setProjForm] = useState({ name: '', slug: '', description: '', plan: '' });
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);
  const [isDecommissionGatewayOpen, setIsDecommissionGatewayOpen] = useState(false);

  // Clipboard copy state
  const [isCopied, setIsCopied] = useState(false);

  // Local fallback when parent does not own reload state (standalone usage).
  const [localLastReloadTime, setLocalLastReloadTime] = useState<Date>(
    () => new Date(Date.now() - 3 * 60 * 1000),
  );
  const lastReloadTime = lastReloadTimeProp ?? localLastReloadTime;
  const reloadPending = reloadPendingProp ?? reloadConfig.isPending;

  const formatGatewayCreatedAt = (dateStr?: string) => {
    if (!dateStr) return 'Just now';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return (
      d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
      ', ' +
      d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    );
  };

  const projects = projectsData?.items ?? [];
  const currentProject = projects.find((p) => p.id === projectId);

  // Find the active/running dedicated gateway for the project
  const activeGateway = gateways?.find((gw) => gw.status !== 'decommissioned');
  const gatewayBaseUrl = buildGatewayBaseUrl(activeGateway);

  const fallbackCreatedAt = useMemo(() => new Date().toISOString(), []);

  const gatewayCreatedAt = useMemo(() => {
    if (activeGateway?.created_at) {
      return formatGatewayCreatedAt(activeGateway.created_at);
    }
    if (currentProject?.created_at) {
      return formatGatewayCreatedAt(currentProject.created_at);
    }
    return formatGatewayCreatedAt(fallbackCreatedAt);
  }, [activeGateway?.created_at, currentProject?.created_at, fallbackCreatedAt]);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

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
    setIsDeleteProjectOpen(true);
  };

  const handleDeleteProjectConfirm = () => {
    if (!projectId) return;
    deleteProject.mutate(projectId, {
      onSuccess: () => {
        setIsDeleteProjectOpen(false);
        setActiveProjectId(null);
      },
    });
  };

  const handleProvisionGateway = () => {
    provisionGateway.mutate('dedicated');
  };

  const handleDecommissionGateway = () => {
    if (!activeGateway) return;
    setIsDecommissionGatewayOpen(true);
  };

  const handleDecommissionGatewayConfirm = () => {
    if (!activeGateway) return;
    decommissionGateway.mutate(activeGateway.external_id, {
      onSuccess: () => {
        setIsDecommissionGatewayOpen(false);
      },
    });
  };

  const handleReloadConfig = () => {
    if (onReloadConfigProp) {
      onReloadConfigProp();
      return;
    }
    reloadConfig.mutate(undefined, {
      onSuccess: () => {
        setLocalLastReloadTime(new Date());
      }
    });
  };

  const getRelativeTimeString = (date: Date, currentNow = now) => {
    const diffMs = Math.max(0, currentNow - date.getTime());
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);

    if (diffSec < 5) return 'Just now';
    if (diffSec < 60) return `${diffSec} seconds ago`;
    if (diffMin === 1) return '1 minute ago';
    if (diffMin < 60) return `${diffMin} minutes ago`;
    if (diffHour === 1) return '1 hour ago';
    return `${diffHour} hours ago`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Running
          </span>
        );
      case 'provisioning':
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Provisioning
          </span>
        );
      case 'failed':
        return (
          <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Failed
          </span>
        );
      default:
        return (
          <span className="bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-lg text-left">
      {/* Project Workspace - compatible with older usage if showProject is true */}
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
            </div>
          )}
        </div>
      )}

      {/* Gateway Service Nodes Panel */}
      {showGateways && (
        <div className="flex flex-col gap-lg">
          {/* Header Block (static title & subtitle matching design) */}
          <div className="pb-sm">
            <h2 className="font-display-lg text-display-lg text-on-surface">Gateway Services</h2>
            <p className="text-xs text-on-surface-variant mt-1">Manage the dedicated gateway assigned to this project.</p>
          </div>

          {/* Body Content */}
          {isGatewaysLoading ? (
            <div className="bg-white border border-outline-variant rounded-xl p-xl shadow-sm text-center">
              <p className="text-sm text-on-surface-variant animate-pulse">Loading gateway service nodes...</p>
            </div>
          ) : !activeGateway ? (
            /* STATE A: Empty State ("No Dedicated Gateway") */
            <div className="bg-white border border-outline-variant rounded-xl p-xl shadow-sm flex flex-col items-center justify-center min-h-[360px] text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-[#587c94] flex items-center justify-center mb-md border border-blue-100">
                <span className="material-symbols-outlined text-[32px]">dns</span>
              </div>
              <h3 className="font-bold text-base text-on-surface mb-xs">No Dedicated Gateway</h3>
              <p className="text-sm text-on-surface-variant max-w-[460px] mb-xs font-medium">
                No dedicated gateway has been provisioned for this project.
              </p>
              <p className="text-xs text-outline max-w-[540px] mb-lg leading-relaxed">
                A dedicated gateway provides isolated routing, policies, API keys, and runtime configuration for your APIs.
              </p>
              {can('editor') && (
                <button
                  onClick={handleProvisionGateway}
                  disabled={provisionGateway.isPending}
                  className="bg-[#113346] hover:bg-brand-hover text-white px-5 py-2.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 shadow-md disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
                  {provisionGateway.isPending ? 'Provisioning...' : 'Provision Dedicated Gateway'}
                </button>
              )}
              {provisionGateway.error && (
                <p className="text-error text-xs font-semibold mt-sm">
                  {toApiError(provisionGateway.error).message || 'Failed to provision gateway.'}
                </p>
              )}
            </div>
          ) : (
            /* STATE B: Active State ("Gateway Services Details") */
            <div className="flex flex-col gap-lg animate-fade-in-up">
              {/* Error messages if any */}
              {reloadConfig.error && (
                <div className="p-sm bg-red-50 border border-red-200 text-error text-xs font-semibold rounded-lg">
                  {toApiError(reloadConfig.error).message || 'Failed to reload gateway configuration.'}
                </div>
              )}
              {decommissionGateway.error && (
                <div className="p-sm bg-red-50 border border-red-200 text-error text-xs font-semibold rounded-lg">
                  {toApiError(decommissionGateway.error).message || 'Failed to delete gateway.'}
                </div>
              )}

              {/* Three Column Cards Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
                
                {/* CARD 1: Dedicated Gateway Info */}
                <div className="bg-white border border-outline-variant rounded-xl p-md shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-md border-b border-outline-variant/60 pb-sm">
                      <h3 className="font-bold text-sm text-[#113346]">Dedicated Gateway</h3>
                      {getStatusBadge(activeGateway.status)}
                    </div>

                    <div className="flex flex-col gap-sm">
                      <div className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/40">
                        <span className="text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">terminal</span>
                          Gateway ID
                        </span>
                        <span className="font-mono text-on-surface font-semibold flex items-center gap-1.5">
                          {activeGateway.external_id}
                          <button
                            onClick={() => handleCopyId(activeGateway.external_id)}
                            className="cursor-pointer text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
                            title="Copy ID"
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              {isCopied ? 'check' : 'content_copy'}
                            </span>
                          </button>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/40">
                        <span className="text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">sell</span>
                          Plan
                        </span>
                        <span className="capitalize font-semibold text-on-surface">
                          {activeGateway.plan}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/40">
                        <span className="text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">folder</span>
                          Project
                        </span>
                        <span className="font-semibold text-on-surface truncate max-w-[150px]">
                          {currentProject?.name ?? 'Company zz'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/40">
                        <span className="text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                          Created At
                        </span>
                        <span className="font-semibold text-on-surface">
                          {gatewayCreatedAt}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs py-1">
                        <span className="text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">history</span>
                          Last Reload
                        </span>
                        <span className="font-semibold text-on-surface">
                          {reloadConfig.isPending ? 'Reloading...' : getRelativeTimeString(lastReloadTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 2: Gateway Runtime */}
                <div className="bg-white border border-outline-variant rounded-xl p-md shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-md border-b border-outline-variant/60 pb-sm">
                      <h3 className="font-bold text-sm text-[#113346]">Gateway Runtime</h3>
                    </div>

                    <div className="flex flex-col gap-sm">
                      <div className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/40">
                        <span className="text-on-surface-variant flex items-center gap-1">
                          Status
                        </span>
                        <span className="font-sans font-medium flex items-center gap-1 text-on-surface">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            activeGateway.status === 'active' ? 'bg-green-500 animate-pulse' : activeGateway.status === 'provisioning' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
                          }`} />
                          <span className="capitalize">{activeGateway.status === 'active' ? 'Running' : activeGateway.status}</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/40 gap-md">
                        <span className="text-on-surface-variant flex items-center gap-1 shrink-0">
                          <span className="material-symbols-outlined text-[14px]">link</span>
                          Endpoint
                        </span>
                        {gatewayBaseUrl ? (
                          <CopyableUrl url={gatewayBaseUrl} />
                        ) : (
                          <span className="text-outline text-[11px] italic">
                            {activeGateway.status === 'provisioning' ? 'Assigning port...' : 'Unavailable'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/40">
                        <span className="text-on-surface-variant flex items-center gap-1">
                          Configuration
                        </span>
                        <span className="font-semibold text-on-surface">
                          {reloadConfig.isPending ? 'Syncing...' : 'Loaded'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/40">
                        <span className="text-on-surface-variant flex items-center gap-1">
                          Version
                        </span>
                        <span className="font-semibold text-on-surface">v2.4.1-stable</span>
                      </div>

                      <div className="flex items-center justify-between text-xs py-1">
                        <span className="text-on-surface-variant flex items-center gap-1">
                          Last Reload
                        </span>
                        <span className="font-semibold text-on-surface">
                          {reloadConfig.isPending ? 'Reloading...' : getRelativeTimeString(lastReloadTime)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {can('editor') && (
                    <button
                      onClick={handleReloadConfig}
                      disabled={reloadPending || activeGateway.status !== 'active'}
                      className="mt-md w-full border border-outline-variant hover:bg-[#587c94]/5 hover:border-[#587c94] text-on-surface-variant hover:text-[#587c94] px-4 py-2 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 disabled:opacity-50"
                    >
                      <span className={`material-symbols-outlined text-[16px] ${reloadPending ? 'animate-spin' : ''}`}>refresh</span>
                      {reloadPending ? 'Reloading...' : 'Reload Configuration'}
                    </button>
                  )}
                </div>

                {/* CARD 3: Overview / All Gateways Promotion */}
                <div className="bg-white border border-outline-variant rounded-xl p-md shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-md border-b border-outline-variant/60 pb-sm">
                      <h3 className="font-bold text-sm text-[#113346]">Overview</h3>
                    </div>

                    <div className="bg-blue-50/40 border border-blue-100/60 rounded-xl p-md flex items-start gap-md">
                      <div className="w-10 h-10 rounded-full bg-blue-100/60 text-[#587c94] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">group</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-xs text-[#113346]">All Gateways</span>
                        <span className="text-[10px] text-on-surface-variant mt-0.5 leading-relaxed">
                          View and manage all dedicated gateways across projects.
                        </span>
                        <button
                          onClick={onViewAllGateways}
                          className="text-[#587c94] hover:text-[#113346] hover:underline font-bold text-xs mt-3 flex items-center gap-1 cursor-pointer transition-colors focus:outline-none"
                        >
                          View All Gateways
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* DANGER ZONE */}
              {can('editor') && (
                <div className="bg-red-50/50 border border-red-200 rounded-xl p-md flex flex-col md:flex-row justify-between items-center gap-md">
                  <div className="flex items-start gap-md w-full">
                    <div className="w-10 h-10 rounded-full bg-red-100/50 text-red-600 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">warning</span>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-xs text-red-800 uppercase tracking-wider">Danger Zone</span>
                      <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                        Deleting this gateway will permanently remove the runtime instance and all associated configurations, routes, and downstream connections.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleDecommissionGateway}
                    disabled={decommissionGateway.isPending}
                    className="border-2 border-red-200 text-red-600 hover:bg-red-600 hover:text-white px-5 py-2 rounded-lg font-bold text-xs flex items-center gap-2 cursor-pointer transition-all duration-200 shrink-0 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    {decommissionGateway.isPending ? 'Deleting...' : 'Delete Gateway'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}



      {/* Create Project Modal (Hidden by default, used if showProject is true) */}
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

            {createProject.error && <p className="text-error text-xs">{toApiError(createProject.error).message}</p>}

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

      <ConfirmModal
        isOpen={isDeleteProjectOpen}
        title="Delete Project"
        isDanger
        message={
          <span>
            Are you sure you want to delete <span className="font-bold">"{currentProject?.name}"</span>?
          </span>
        }
        description="This action is permanent and irreversible. It will immediately remove all routes, upstreams, and credentials linked to this project."
        confirmLabel="Delete Permanently"
        cancelLabel="Cancel"
        onConfirm={handleDeleteProjectConfirm}
        onClose={() => setIsDeleteProjectOpen(false)}
        isPending={deleteProject.isPending}
        requireConfirmText="delete"
      />

      <ConfirmModal
        isOpen={isDecommissionGatewayOpen}
        title="Delete Gateway"
        isDanger
        message="Are you sure you want to delete this dedicated gateway?"
        description="This action is permanent and irreversible. The running gateway container and its configuration will be decommissioned immediately."
        confirmLabel="Delete Gateway"
        cancelLabel="Cancel"
        onConfirm={handleDecommissionGatewayConfirm}
        onClose={() => setIsDecommissionGatewayOpen(false)}
        isPending={decommissionGateway.isPending}
        requireConfirmText="delete"
      />
    </div>
  );
};
