import React, { useState } from 'react';
import { useCreateUpstreamMutation } from '../../upstreams/hooks/useUpstreams';
import { useCreateRouteMutation } from '../../routes/hooks/useRouteMutations';
import { useActiveProject } from '../../../shared/hooks/useActiveProject';
import { useProjectsQuery, useCreateProjectMutation } from '../../../shared/hooks/useProjects';
import { toApiError } from '../../../shared/api/apiError';
import { useGatewaysQuery, useProvisionGatewayMutation } from '../hooks/useGateways';
import { buildRouteUrl } from '../utils/gatewayUrl';
import { CopyableUrl } from '../../../shared/components/ui/CopyableUrl';

interface ConfigureApiModalProps {
    projectId: string;
    onClose: () => void;
}

export const ConfigureApiModal: React.FC<ConfigureApiModalProps> = ({ projectId, onClose }) => {
    const { projectId: activeProjectId, setActiveProjectId } = useActiveProject();
    const { data: projectsData } = useProjectsQuery();
    const createProject = useCreateProjectMutation();

    const resolvedProjectId = projectId || activeProjectId;
    const projects = projectsData?.items ?? [];

    const createUpstream = useCreateUpstreamMutation(resolvedProjectId || '');
    const createRoute = useCreateRouteMutation(resolvedProjectId || '');

    const [serviceName, setServiceName] = useState('first-serverless-service');
    const [serviceUrl, setServiceUrl] = useState('');
    const [routeName, setRouteName] = useState('first-serverless-route');
    const [routePath, setRoutePath] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [createdRoutePath, setCreatedRoutePath] = useState<string | null>(null);

    const { data: gateways } = useGatewaysQuery(resolvedProjectId || '');
    const activeGateway = gateways?.find((gw) => gw.status !== 'decommissioned');
    const provisionGateway = useProvisionGatewayMutation(resolvedProjectId || '');
    const finalUrl = createdRoutePath ? buildRouteUrl(activeGateway, createdRoutePath) : null;

    const [newProjectName, setNewProjectName] = useState('');
    const [projectError, setProjectError] = useState('');

    const handleSave = async () => {
        if (!resolvedProjectId) {
            setErrorMsg('Please select or create a project workspace first.');
            return;
        }
        if (!serviceName || !serviceUrl || !routeName || !routePath) {
            setErrorMsg('Please fill in all required fields.');
            return;
        }

        setIsSaving(true);
        setErrorMsg('');

        try {
            // 1. Create upstream (service)
            const upstream = await createUpstream.mutateAsync({
                name: serviceName,
                target_url: serviceUrl,
                protocol: 'http',
                enabled: true,
            });

            // 2. Create route attached to upstream
            await createRoute.mutateAsync({
                name: routeName,
                path: routePath,
                upstream_id: upstream.id,
                methods: ['GET', 'POST'],
                match_type: 'prefix',
                enabled: true,
            });

            setCreatedRoutePath(routePath);
        } catch (err: unknown) {
            const apiErr = toApiError(err);
            setErrorMsg(apiErr.message || 'Failed to configure new API.');
        } finally {
            setIsSaving(false);
        }
    };

    // Build YAML string in real time
    const yamlString = `_format_version: "3.0"
services:
  - name: ${serviceName || 'first-serverless-service'}
    url: ${serviceUrl || '""'}
    routes:
      - name: ${routeName || 'first-serverless-route'}
        paths:
          - ${routePath || '""'}
        protocols:
          - http
          - https
        strip_path: true`;

    const yamlLines = yamlString.split('\n');

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-md backdrop-blur-xs">
            <div className="bg-white border border-outline-variant rounded-xl shadow-2xl w-full max-w-[960px] flex flex-col overflow-hidden max-h-[85vh] animate-scale-up text-left">
                {/* Modal Header */}
                <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-white">
                    <h2 className="font-headline-md text-headline-md text-on-surface">Configure new API</h2>
                    <button
                        onClick={onClose}
                        className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[24px]">close</span>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Form (60%) */}
                    <div className={`${createdRoutePath ? 'w-full' : 'w-3/5 border-r border-outline-variant'} p-lg overflow-y-auto flex flex-col gap-lg`}>
                        {createdRoutePath ? (
                            <div className="w-full flex flex-col gap-lg items-start animate-scale-up">
                                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                    <span className="material-symbols-outlined text-[28px]">check_circle</span>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-on-surface">API configured</h3>
                                    <p className="text-xs text-on-surface-variant mt-1">
                                        Your route is live. Call it at the URL below.
                                    </p>
                                </div>

                                {!activeGateway ? (
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-md flex flex-col gap-sm w-full">
                                        <p className="text-xs text-amber-800">
                                            This project doesn't have a dedicated gateway yet, so there's no
                                            live port to call this route on.
                                        </p>
                                        <button
                                            onClick={() => provisionGateway.mutate('dedicated')}
                                            disabled={provisionGateway.isPending}
                                            className="self-start bg-[#113346] text-white px-3 py-1.5 rounded text-xs font-semibold disabled:opacity-50 cursor-pointer"
                                        >
                                            {provisionGateway.isPending ? 'Provisioning...' : 'Provision Dedicated Gateway'}
                                        </button>
                                    </div>
                                ) : finalUrl ? (
                                    <div className="bg-slate-50 border border-outline-variant rounded-lg p-md w-full">
                                        <CopyableUrl url={finalUrl} className="text-sm" />
                                        <p className="text-[11px] text-on-surface-variant mt-2">
                                            Try it: <code>curl {finalUrl}</code>
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-xs text-amber-700 font-medium">
                                        Gateway is still provisioning — the port will be assigned shortly.
                                        You can find it later under Gateway services → Endpoint.
                                    </p>
                                )}

                                <button
                                    onClick={onClose}
                                    className="bg-[#113346] text-white px-4 py-2 rounded text-sm font-semibold mt-sm cursor-pointer hover:bg-[#123749] transition-colors"
                                >
                                    Done
                                </button>
                            </div>
                        ) : !resolvedProjectId ? (
                            <div className="flex flex-col gap-lg">
                                <div>
                                    <h3 className="text-sm font-semibold text-on-surface">Active Workspace Required</h3>
                                    <p className="text-xs text-on-surface-variant mt-1">
                                        You need to select or create a project workspace before configuring a new API.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-md border border-outline-variant p-lg rounded-xl bg-slate-50/50">
                                    {projects.length > 0 && (
                                        <label className="flex flex-col gap-xs text-xs font-semibold">
                                            Select Existing Project Workspace
                                            <select
                                                onChange={(e) => setActiveProjectId(e.target.value)}
                                                value=""
                                                className="border border-outline-variant rounded px-3 py-1.5 bg-white font-sans outline-none focus:border-[#587c94] cursor-pointer"
                                            >
                                                <option value="">Choose a workspace...</option>
                                                {projects.map((p) => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </label>
                                    )}

                                    {projects.length > 0 && (
                                        <div className="text-center text-xs text-outline font-semibold uppercase relative flex justify-center items-center">
                                            <span className="bg-white px-2 z-10">Or</span>
                                            <div className="absolute w-full h-[1px] bg-outline-variant/60" />
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-xs">
                                        <label className="flex flex-col gap-xs text-xs font-semibold">
                                            Create New Workspace
                                            <input
                                                value={newProjectName}
                                                onChange={(e) => setNewProjectName(e.target.value)}
                                                placeholder="e.g. serverless-default"
                                                className="border border-outline-variant rounded px-3 py-1.5 bg-white font-sans outline-none focus:border-[#587c94]"
                                            />
                                        </label>

                                        <button
                                            type="button"
                                            onClick={async () => {
                                                if (!newProjectName.trim()) {
                                                    setProjectError('Please enter a project name.');
                                                    return;
                                                }
                                                try {
                                                    setProjectError('');
                                                    const slug = newProjectName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                                                    const newProj = await createProject.mutateAsync({
                                                        name: newProjectName,
                                                        slug,
                                                        description: '',
                                                        plan: '',
                                                    });
                                                    setActiveProjectId(newProj.id);
                                                } catch (err: unknown) {
                                                    const apiErr = toApiError(err);
                                                    setProjectError(apiErr.message || 'Failed to create project.');
                                                }
                                            }}
                                            disabled={createProject.isPending}
                                            className="bg-[#113346] text-white px-4 py-1.5 rounded text-xs font-semibold hover:bg-[#123749] transition-colors mt-2 cursor-pointer disabled:opacity-50"
                                        >
                                            {createProject.isPending ? 'Creating...' : 'Create and Continue'}
                                        </button>
                                        {projectError && (
                                            <p className="text-error text-xs font-semibold mt-1">{projectError}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-lg">
                                <div>
                                    <h3 className="text-sm font-semibold text-on-surface">Configuration</h3>
                                    <p className="text-xs text-on-surface-variant mt-1">
                                        Create a service and route to define how Kong forwards client requests.
                                    </p>
                                </div>

                                {/* Service configuration */}
                                <div className="flex flex-col gap-md">
                                    <div className="flex items-center gap-1.5 font-bold text-sm text-[#0c1830] select-none">
                                        <span>Service</span>
                                        <span className="material-symbols-outlined text-slate-400 text-[16px] select-none cursor-help" title="Service represents the backend URL/upstream API target">info</span>
                                    </div>

                                    <label className="flex flex-col gap-1.5 text-xs font-bold text-[#0c1830]">
                                        <span className="flex items-center">
                                            <span className="text-[#e12d39] font-bold text-lg leading-none mr-1 select-none">•</span>
                                            Service name
                                        </span>
                                        <input
                                            required
                                            value={serviceName}
                                            onChange={(e) => setServiceName(e.target.value)}
                                            placeholder="e.g. flight-service"
                                            className="w-full border border-slate-200 rounded-md px-3.5 py-2 text-sm font-sans outline-none transition-all focus:border-[#3b82f6] focus:ring-3 focus:ring-[#3b82f6]/10 text-slate-800 placeholder:text-slate-400 bg-white"
                                        />
                                    </label>

                                    <label className="flex flex-col gap-1.5 text-xs font-bold text-[#0c1830]">
                                        <span className="flex items-center gap-1">
                                            <span className="text-[#e12d39] font-bold text-lg leading-none mr-1 select-none">•</span>
                                            Service URL
                                            <span className="material-symbols-outlined text-slate-400 text-[15px] select-none cursor-help" title="Service URL points to your backend target service">info</span>
                                        </span>
                                        <input
                                            required
                                            value={serviceUrl}
                                            onChange={(e) => setServiceUrl(e.target.value)}
                                            placeholder="e.g. https://httpbin.konghq.com/get"
                                            className="w-full border border-slate-200 rounded-md px-3.5 py-2 text-sm font-sans outline-none transition-all focus:border-[#3b82f6] focus:ring-3 focus:ring-[#3b82f6]/10 text-slate-800 placeholder:text-slate-400 bg-white"
                                        />
                                    </label>
                                </div>

                                {/* Route configuration */}
                                <div className="flex flex-col gap-md">
                                    <div className="flex items-center gap-1.5 font-bold text-sm text-[#0c1830] select-none mt-2">
                                        <span>Route</span>
                                        <span className="material-symbols-outlined text-slate-400 text-[16px] select-none cursor-help" title="Route represents the frontend ingress path routing client requests">info</span>
                                    </div>

                                    <label className="flex flex-col gap-1.5 text-xs font-bold text-[#0c1830]">
                                        <span className="flex items-center">
                                            <span className="text-[#e12d39] font-bold text-lg leading-none mr-1 select-none">•</span>
                                            Route name
                                        </span>
                                        <input
                                            required
                                            value={routeName}
                                            onChange={(e) => setRouteName(e.target.value)}
                                            placeholder="e.g. flight-details-route"
                                            className="w-full border border-slate-200 rounded-md px-3.5 py-2 text-sm font-sans outline-none transition-all focus:border-[#3b82f6] focus:ring-3 focus:ring-[#3b82f6]/10 text-slate-800 placeholder:text-slate-400 bg-white"
                                        />
                                    </label>

                                    <label className="flex flex-col gap-1.5 text-xs font-bold text-[#0c1830]">
                                        <span className="flex items-center">
                                            <span className="text-[#e12d39] font-bold text-lg leading-none mr-1 select-none">•</span>
                                            Route path
                                        </span>
                                        <input
                                            required
                                            value={routePath}
                                            onChange={(e) => setRoutePath(e.target.value)}
                                            placeholder="e.g. /first-route-path"
                                            className="w-full border border-slate-200 rounded-md px-3.5 py-2 text-sm font-sans outline-none transition-all focus:border-[#3b82f6] focus:ring-3 focus:ring-[#3b82f6]/10 text-slate-800 placeholder:text-slate-400 bg-white"
                                        />
                                    </label>
                                </div>

                                {errorMsg && (
                                    <p className="text-error text-xs font-semibold">{errorMsg}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right YAML Preview (40%) */}
                    {!createdRoutePath && (
                        <div className="w-2/5 p-lg bg-slate-50 overflow-y-auto flex flex-col gap-md select-text">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-xs text-[#113346] flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px] text-green-600">terminal</span>
                                    decK <span className="text-outline font-normal text-[10px] lowercase">Kong's official CLI</span>
                                </span>
                                <span className="material-symbols-outlined text-outline text-[16px] cursor-pointer hover:text-on-surface" title="Show CLI guide">chevron_right</span>
                            </div>
                            <p className="text-[11px] text-on-surface-variant leading-relaxed">
                                You can also manage your gateway configuration declaratively using decK, enabling easy syncing with source control.
                            </p>

                            {/* YAML Code Container */}
                            <div className="bg-[#0b1928] text-white rounded-lg p-md font-mono text-[11px] shadow-inner overflow-x-auto flex-1 flex">
                                {/* Line numbers */}
                                <div className="text-slate-500 pr-3 border-r border-slate-700/50 text-right select-none w-8">
                                    {yamlLines.map((_, i) => (
                                        <div key={i}>{i + 1}</div>
                                    ))}
                                </div>
                                {/* YAML text */}
                                <div className="pl-3 text-slate-200 whitespace-pre">
                                    {yamlLines.map((line, i) => (
                                        <div key={i} className="hover:bg-slate-800/30 px-1 rounded transition-colors">
                                            {line}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <span className="text-[10px] text-primary hover:underline cursor-pointer font-semibold">
                                Want to manage gateways with decK? Learn more
                            </span>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                {!createdRoutePath && (
                    <div className="p-lg border-t border-outline-variant flex justify-end gap-sm bg-white select-none">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-slate-50 rounded transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        {resolvedProjectId && (
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="bg-[#113346] text-white px-5 py-2 rounded text-sm font-semibold hover:bg-[#123749] transition-colors cursor-pointer flex items-center gap-xs disabled:opacity-50"
                            >
                                {isSaving ? 'Configuring...' : 'Save'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
