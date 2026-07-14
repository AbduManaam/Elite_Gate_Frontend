import React, { useState, useEffect } from 'react';
import { useActiveProject } from '../../../shared/hooks/useActiveProject';
import { useRoles } from '../../../shared/hooks/useRoles';
import {
  useProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from '../../../shared/hooks/useProjects';
import { useRoutesQuery } from '../../routes/hooks/useRoutes';
import { useUpstreamsQuery } from '../../upstreams/hooks/useUpstreams';
import { useApiKeysQuery } from '../../apiKeys/hooks/useApiKeys';
import { toApiError } from '../../../shared/api/apiError';
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal';

/** Modal for creating a new project */
const NewProjectModal: React.FC<{
  onClose: () => void;
  onCreate: (name: string, slug: string, desc: string) => void;
  isPending: boolean;
  error?: string;
}> = ({ onClose, onCreate, isPending, error }) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [desc, setDesc] = useState('');

  const handleNameChange = (v: string) => {
    setName(v);
    setSlug(v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-md backdrop-blur-sm">
      <div className="bg-white rounded-xl border border-outline-variant shadow-2xl w-[420px] max-w-full flex flex-col gap-0 overflow-hidden">
        <div className="px-6 py-5 border-b border-outline-variant flex justify-between items-center">
          <h3 className="font-semibold text-base text-on-surface">New Project</h3>
          <button onClick={onClose} className="material-symbols-outlined text-outline hover:text-on-surface cursor-pointer text-[20px]">close</button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
            Project Name
            <input
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="My API Project"
              className="border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface font-normal outline-none focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94] transition-all"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
            Project Slug
            <input
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="my-api-project"
              className="border border-outline-variant rounded-lg px-3 py-2 text-sm font-mono text-on-surface outline-none focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94] transition-all"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
            Description (optional)
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Brief description of this project…"
              className="border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface font-normal outline-none resize-none h-20 focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94] transition-all"
            />
          </label>
          {error && <p className="text-error text-xs">{error}</p>}
        </div>
        <div className="px-6 py-4 border-t border-outline-variant flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors cursor-pointer">
            Cancel
          </button>
          <button
            onClick={() => onCreate(name, slug, desc)}
            disabled={!name || !slug || isPending}
            className="px-5 py-2 bg-[#113346] text-white text-xs font-semibold rounded-lg hover:bg-[#123749] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isPending ? 'Creating…' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
};

/** Main Projects tab component */
export const ProjectWorkspace: React.FC = () => {
  const { projectId, setActiveProjectId } = useActiveProject();
  const { can } = useRoles();

  const { data: projectsData } = useProjectsQuery();
  const updateProject = useUpdateProjectMutation();
  const createProject = useCreateProjectMutation();
  const deleteProject = useDeleteProjectMutation();

  const { data: routes } = useRoutesQuery(projectId ?? '');
  const { data: upstreams } = useUpstreamsQuery(projectId ?? '');
  const { data: apiKeysData } = useApiKeysQuery(projectId ?? '');
  const apiKeys = apiKeysData?.keys;

  const projects = projectsData?.items ?? [];
  const currentProject = projects.find((p) => p.id === projectId);

  // Editable form state
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const [activeView, setActiveView] = useState<'list' | 'summary'>('summary');
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [createError, setCreateError] = useState('');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Sync form when project changes
  useEffect(() => {
    if (currentProject) {
      setFormName(currentProject.name);
      setFormSlug(currentProject.slug);
      setFormDesc(currentProject.description ?? '');
      setIsDirty(false);
      setSaveMsg('');
      setSaveError('');
    }
  }, [currentProject?.id]);

  const handleFieldChange = (field: 'name' | 'slug' | 'desc', value: string) => {
    if (field === 'name') setFormName(value);
    if (field === 'slug') setFormSlug(value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
    if (field === 'desc') setFormDesc(value);
    setIsDirty(true);
    setSaveMsg('');
    setSaveError('');
  };

  const handleCancel = () => {
    if (currentProject) {
      setFormName(currentProject.name);
      setFormSlug(currentProject.slug);
      setFormDesc(currentProject.description ?? '');
      setIsDirty(false);
      setSaveMsg('');
      setSaveError('');
    }
  };

  const handleSave = () => {
    if (!projectId || !currentProject) return;
    setSaveError('');
    updateProject.mutate(
      { projectId, input: { name: formName, slug: formSlug, description: formDesc } },
      {
        onSuccess: () => {
          setIsDirty(false);
          setSaveMsg('Changes saved successfully.');
          setTimeout(() => setSaveMsg(''), 3000);
        },
        onError: (err) => {
          setSaveError(toApiError(err).message || 'Failed to save changes.');
        },
      }
    );
  };

  const handleDelete = () => {
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!projectId || !currentProject) return;
    deleteProject.mutate(projectId, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        setActiveProjectId(null);
      },
    });
  };

  const handleCopyId = () => {
    if (!currentProject) return;
    navigator.clipboard.writeText(currentProject.id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCreate = (name: string, slug: string, desc: string) => {
    setCreateError('');
    createProject.mutate({ name, slug, description: desc, plan: '' }, {
      onSuccess: (p) => {
        setActiveProjectId(p.id);
        setIsNewProjectOpen(false);
        setCreateError('');
      },
      onError: (err) => {
        setCreateError(toApiError(err).message || 'Failed to create project.');
      },
    });
  };

  const formatDate = (iso?: string) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ', ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' UTC';
  };

  const canEdit = can('editor');
  const canOwner = can('owner');

  // ── Project List view ───────────────────────────────────────────────────────
  if (activeView === 'list') {
    return (
      <div className="flex flex-col gap-md text-left">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Project Workspace</h2>
            <p className="text-sm text-on-surface-variant mt-0.5">Configure active gateway tenant workspace.</p>
          </div>
          <div className="flex items-center gap-sm">
            <div className="flex border border-outline-variant rounded-lg overflow-hidden text-xs font-semibold">
              <button
                onClick={() => setActiveView('list')}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#113346] text-white cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">list</span>
                Projects List
              </button>
              <button
                onClick={() => setActiveView('summary')}
                className="flex items-center gap-1 px-3 py-1.5 text-on-surface-variant hover:bg-surface-container cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">summarize</span>
                Project Summary
              </button>
            </div>
            <button
              onClick={() => setIsNewProjectOpen(true)}
              className="flex items-center gap-1 px-4 py-1.5 bg-[#113346] text-white text-xs font-semibold rounded-lg hover:bg-[#123749] transition-colors cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              New Project
            </button>
          </div>
        </div>

        {/* text-left table */}
        <div className="bg-white border border-outline-variant rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low border-b border-outline-variant text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
              <tr>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {projects.map((p) => (
                <tr
                  key={p.id}
                  className={`hover:bg-surface-container-low transition-colors cursor-pointer ${p.id === projectId ? 'bg-[#587c94]/5' : ''}`}
                  onClick={() => { setActiveProjectId(p.id); setActiveView('summary'); }}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-md bg-[#113346] text-white flex items-center justify-center font-bold text-xs">
                        {p.name[0]?.toUpperCase()}
                      </span>
                      <span className="font-semibold text-on-surface">{p.name}</span>
                      {p.id === projectId && (
                        <span className="text-[10px] bg-[#587c94]/10 text-[#587c94] px-1.5 py-0.5 rounded font-semibold">Active</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-on-surface-variant">{p.slug}</td>
                  <td className="py-3 px-4 capitalize text-xs font-semibold text-on-surface">{p.plan}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      p.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                      {p.is_active ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold capitalize text-[#587c94]">{(p as any).role ?? '—'}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveProjectId(p.id); setActiveView('summary'); }}
                      className="text-xs px-3 py-1 border border-outline-variant rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer font-semibold"
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-on-surface-variant">
                    No projects yet. Click "New Project" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {isNewProjectOpen && (
          <NewProjectModal
            onClose={() => { setIsNewProjectOpen(false); setCreateError(''); }}
            onCreate={handleCreate}
            isPending={createProject.isPending}
            error={createError}
          />
        )}
      </div>
    );
  }

  // ── Summary / detail view ───────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-md text-left">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Project Workspace</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">Configure active gateway tenant workspace.</p>
        </div>
        <div className="flex items-center gap-sm">
          <div className="flex border border-outline-variant rounded-lg overflow-hidden text-xs font-semibold">
            <button
              onClick={() => setActiveView('list')}
              className="flex items-center gap-1 px-3 py-1.5 text-on-surface-variant hover:bg-surface-container cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">list</span>
              Projects List
            </button>
            <button
              onClick={() => setActiveView('summary')}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#113346] text-white cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">summarize</span>
              Project Summary
            </button>
          </div>
          <button
            onClick={() => setIsNewProjectOpen(true)}
            className="flex items-center gap-1 px-4 py-1.5 bg-[#113346] text-white text-xs font-semibold rounded-lg hover:bg-[#123749] transition-colors cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            New Project
          </button>
        </div>
      </div>

      {/* No project fallback */}
      {!currentProject && (
        <div className="bg-white border border-outline-variant rounded-xl p-xl text-center text-sm text-on-surface-variant shadow-sm">
          No project selected. Choose one from the Projects List or create a new one.
        </div>
      )}

      {currentProject && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-md items-start">
          {/* ── Left column ── */}
          <div className="flex flex-col gap-md">
            {/* General Information */}
            <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-sm">
              <div className="flex items-center gap-2 mb-md">
                <span className="material-symbols-outlined text-[18px] text-[#587c94]">info</span>
                <h3 className="font-semibold text-sm text-on-surface">General Information</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md mb-md">
                <div>
                  <label className="block text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-1.5">Project Name</label>
                  <input
                    value={formName}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    disabled={!canEdit}
                    className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface outline-none focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94] transition-all disabled:bg-surface-container-low disabled:text-on-surface-variant"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-1.5">Project Slug</label>
                  <div className="relative">
                    <input
                      value={formSlug}
                      onChange={(e) => handleFieldChange('slug', e.target.value)}
                      disabled={!canEdit}
                      className="w-full border border-outline-variant rounded-lg px-3 py-2 pr-8 text-sm font-mono text-on-surface outline-none focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94] transition-all disabled:bg-surface-container-low disabled:text-on-surface-variant"
                    />
                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[16px]">lock</span>
                  </div>
                </div>
              </div>
              <div className="mb-lg">
                <label className="block text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-1.5">Description</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => handleFieldChange('desc', e.target.value)}
                  disabled={!canEdit}
                  rows={3}
                  placeholder="Describe the purpose of this project workspace…"
                  className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface resize-none outline-none focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94] transition-all disabled:bg-surface-container-low disabled:text-on-surface-variant"
                />
              </div>
              {saveMsg && <p className="text-green-600 text-xs font-semibold mb-sm">{saveMsg}</p>}
              {saveError && <p className="text-error text-xs font-semibold mb-sm">{saveError}</p>}
              {canEdit && (
                <div className="flex justify-end gap-3 pt-sm border-t border-outline-variant">
                  <button
                    onClick={handleCancel}
                    disabled={!isDirty}
                    className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!isDirty || updateProject.isPending}
                    className="px-5 py-2 bg-[#113346] text-white text-xs font-semibold rounded-lg hover:bg-[#123749] transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    {updateProject.isPending ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>

            {/* Project Statistics */}
            <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-sm">
              <div className="flex items-center justify-between mb-md">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#587c94]">monitoring</span>
                  <h3 className="font-semibold text-sm text-on-surface">Project Statistics</h3>
                </div>
                <span className="text-[10px] font-semibold px-2.5 py-1 bg-surface-container text-on-surface-variant rounded-full uppercase tracking-wide border border-outline-variant">
                  Live Data
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
                <div>
                  <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wide mb-1">Total Requests</p>
                  <p className="text-xl font-bold text-on-surface">—</p>
                  <p className="text-[11px] text-green-600 font-semibold mt-0.5">Last 24h</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wide mb-1">Error Rate</p>
                  <p className="text-xl font-bold text-on-surface">—</p>
                  <p className="text-[11px] text-on-surface-variant font-semibold mt-0.5">Stable</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wide mb-1">Active Upstreams</p>
                  <p className="text-xl font-bold text-on-surface">{upstreams?.length ?? '—'}</p>
                  <p className="text-[11px] text-on-surface-variant font-semibold mt-0.5">
                    {upstreams ? `${upstreams.length} total` : 'Loading…'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wide mb-1">API Credentials</p>
                  <p className="text-xl font-bold text-on-surface">{apiKeys?.length ?? '—'}</p>
                  <p className="text-[11px] text-on-surface-variant font-semibold mt-0.5">
                    {apiKeys ? `${apiKeys.filter(k => k.status?.toLowerCase() === 'active').length} Active` : 'Loading…'}
                  </p>
                </div>
              </div>
            </div>

            {/* Danger Zone — owners only */}
            {canOwner && (
              <div className="bg-white border border-[#f87171]/30 rounded-xl p-lg shadow-sm">
                <div className="flex items-center gap-2 mb-md">
                  <span className="material-symbols-outlined text-[18px] text-error">warning</span>
                  <h3 className="font-semibold text-sm text-error">Danger Zone</h3>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-on-surface mb-0.5">Delete Project</p>
                    <p className="text-xs text-on-surface-variant max-w-sm">
                      Permanently remove this project and all associated routes, upstreams, and credentials.
                    </p>
                  </div>
                  <button
                    onClick={handleDelete}
                    disabled={deleteProject.isPending}
                    className="shrink-0 ml-4 px-5 py-2 border-2 border-error text-error text-xs font-bold rounded-lg hover:bg-error hover:text-white transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {deleteProject.isPending ? 'Deleting…' : 'Delete\nProject'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Right column ── */}
          <div className="flex flex-col gap-md">
            {/* Project Identifiers */}
            <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-sm">
              <div className="flex items-center gap-2 mb-md">
                <span className="material-symbols-outlined text-[18px] text-[#587c94]">fingerprint</span>
                <h3 className="font-semibold text-sm text-on-surface">Project Identifiers</h3>
              </div>

              <div className="flex flex-col gap-md">
                <div>
                  <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-1.5">Project ID</p>
                  <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2">
                    <span className="font-mono text-[11px] text-on-surface flex-1 truncate">{currentProject.id.substring(0, 14)}…</span>
                    <button onClick={handleCopyId} title="Copy full ID" className="cursor-pointer text-on-surface-variant hover:text-on-surface transition-colors">
                      <span className="material-symbols-outlined text-[16px]">{isCopied ? 'check' : 'content_copy'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-1.5">Status</p>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    currentProject.is_active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${currentProject.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                    {currentProject.is_active ? 'Active' : 'Suspended'}
                  </span>
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-1">Created At</p>
                  <p className="text-xs text-on-surface">{formatDate(currentProject.created_at)}</p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-1">Last Updated</p>
                  <p className="text-xs text-on-surface">{formatDate(currentProject.updated_at)}</p>
                </div>

                {/* Integrations promo block */}
                <div className="mt-1 bg-[#587c94]/5 border border-[#587c94]/15 rounded-lg p-sm relative overflow-hidden">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#587c94] mb-1">Integrations</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Connect with Datadog or Prometheus for advanced monitoring.
                  </p>
                  <button className="mt-2 text-[11px] font-bold text-[#587c94] hover:underline flex items-center gap-0.5 cursor-pointer">
                    Setup Now
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                  <span className="material-symbols-outlined absolute bottom-2 right-2 text-[36px] text-[#587c94]/10">integration_instructions</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-sm">
              <div className="flex items-center justify-between mb-md">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Recent Activity</p>
                <button className="text-[11px] font-semibold text-[#587c94] hover:underline cursor-pointer">View All</button>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { icon: 'edit', text: 'Project updated', detail: `Slug changed to ${currentProject.slug}`, time: 'Just now' },
                  { icon: 'add_circle', text: `${routes?.length ?? 0} routes configured`, detail: 'Routing rules updated', time: '2h ago' },
                  { icon: 'link', text: `${upstreams?.length ?? 0} upstreams active`, detail: 'Service backends registered', time: '3h ago' },
                ].map((a, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#587c94]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[13px] text-[#587c94]">{a.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-on-surface">{a.text}</p>
                      <p className="text-[11px] text-on-surface-variant truncate">{a.detail}</p>
                      <p className="text-[10px] text-outline mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isNewProjectOpen && (
        <NewProjectModal
          onClose={() => { setIsNewProjectOpen(false); setCreateError(''); }}
          onCreate={handleCreate}
          isPending={createProject.isPending}
          error={createError}
        />
      )}

      <ConfirmModal
        isOpen={isDeleteOpen}
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
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsDeleteOpen(false)}
        isPending={deleteProject.isPending}
        requireConfirmText="delete"
      />
    </div>
  );
};

export default ProjectWorkspace;
