import React from 'react';
import { useProjectsQuery } from '../../../shared/hooks/useProjects';
import { useNavigate } from 'react-router-dom';

export const AllProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: projectsData } = useProjectsQuery();

  const projects = projectsData?.items || [];

  const handleOpenProject = (id: string) => {
    navigate(`/projects/${id}/connectivity`);
  };

  return (
    <div className="flex flex-col gap-md text-left">
      <div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">All Projects</h2>
        <p className="text-sm text-on-surface-variant mt-0.5">Directory overview of all configurations and workspaces.</p>
      </div>

      <div className="bg-white border border-outline-variant rounded-xl overflow-x-auto shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-container-low border-b border-outline-variant text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            <tr>
              <th className="py-3 px-lg">Project Name</th>
              <th className="py-3 px-lg">Slug</th>
              <th className="py-3 px-lg">Subscription Tier</th>
              <th className="py-3 px-lg">Status</th>
              <th className="py-3 px-lg text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-md bg-[#113346] text-white flex items-center justify-center font-bold text-xs">
                      {p.name[0]?.toUpperCase()}
                    </span>
                    <span className="font-semibold text-on-surface">{p.name}</span>
                  </div>
                </td>
                <td className="py-4 px-lg font-mono text-xs text-outline">{p.slug}</td>
                <td className="py-4 px-lg capitalize text-xs font-semibold text-on-surface-variant">{p.plan || 'Free'}</td>
                <td className="py-4 px-lg">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    p.is_active
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${p.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                    {p.is_active ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td className="py-4 px-lg text-right">
                  <button
                    onClick={() => handleOpenProject(p.id, (p as any).role)}
                    className="px-3 py-1.5 border border-outline-variant text-xs font-semibold rounded-lg hover:bg-[#113346] hover:text-white transition-colors cursor-pointer"
                  >
                    Open Workspace
                  </button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-on-surface-variant">
                  No projects available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllProjectsPage;
