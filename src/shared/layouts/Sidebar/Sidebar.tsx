import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useActiveProject } from '../../hooks/useActiveProject';
import { useProjectsQuery, useCreateProjectMutation } from '../../hooks/useProjects';
import { Project } from '../../api/projectsApi';
import { useAuthStore } from '../../../store/authStore';
import { useUIStore } from '../../../store/uiStore';
import { useRoles } from '../../hooks/useRoles';
import {
  SIDEBAR_NAV_ITEMS,
  ELITE_GATE_LOGO_URL
} from '../../mocks/sidebarMock';

export interface SidebarProps {
  readonly className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const { projectId, setActiveProjectId, setActiveProjectRole } = useActiveProject();
  const { data: projectsData } = useProjectsQuery();
  const createProject = useCreateProjectMutation();
  const user = useAuthStore((s) => s.user);
  const isSidebarCollapsed = useUIStore((s) => s.isSidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const hasAttemptedCreation = useRef(false);
  // Stable random suffix — generated once per mount, never changes
  const slugSuffix = useRef(Math.random().toString(36).substring(2, 6));

  const projects = projectsData?.items ?? [];
  const selectedProject = projects.find((p) => p.id === projectId) ?? null;

  // Auto-select a project and sync the role as soon as the project list loads
  useEffect(() => {
    if (!projectsData) return;

    if (projects.length === 0 && !hasAttemptedCreation.current) {
      // No projects exist yet — create a default one for this user
      hasAttemptedCreation.current = true;
      const prefix = user?.username
        ? `${user.username.replace(/_admin$/, '').replace(/_/g, '-')}-default`
        : 'serverless-default';
      const defaultProjSlug = `${prefix}-${slugSuffix.current}`;
      const defaultProjName = user?.username
        ? `${user.username.replace(/_admin$/, '').replace(/_/g, ' ')} default`.trim()
        : 'Serverless Default';
      createProject.mutate(
        { name: defaultProjName, slug: defaultProjSlug, description: 'Default workspace', plan: '' },
        {
          onSuccess: (newProj) => {
            setActiveProjectId(newProj.id);
            setActiveProjectRole((newProj as any).role ?? 'owner');
          },
        }
      );
      return;
    }

    // Projects exist — if none is selected yet, auto-pick the first one
    if (!projectId && projects.length > 0) {
      const first = projects[0];
      setActiveProjectId(first.id);
      // Default to 'owner' when the API doesn't return a role (e.g. the user
      // created this project and is implicitly the owner).
      setActiveProjectRole((first as any).role ?? 'owner');
      return;
    }

    // Keep role in sync whenever the selected project changes
    if (projectId && !selectedProject) {
      // Selected project was deleted; fall back to first available
      const first = projects[0];
      if (first) {
        setActiveProjectId(first.id);
        setActiveProjectRole((first as any).role ?? 'owner');
      }
      return;
    }

    // Always sync role when the selected project is known
    if (selectedProject) {
      setActiveProjectRole((selectedProject as any).role ?? 'owner');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, projectsData]);

  const toggleProjectDropdown = () => {
    setIsProjectDropdownOpen((prev) => !prev);
  };

  const handleProjectSelect = (project: Project) => {
    setActiveProjectId(project.id);
    setActiveProjectRole((project as any).role ?? 'owner');
    setIsProjectDropdownOpen(false);
  };

  const { isSuperAdmin, role: activeProjectRole } = useRoles();

  // Define sections based on role
  const sections: { title?: string; items: { label: string; path: string; icon: string }[] }[] = [];

  if (isSuperAdmin) {
    sections.push(
      {
        items: [{ label: 'Dashboard', path: '/', icon: 'dashboard' }],
      },
      {
        title: 'Platform',
        items: [
          { label: 'Platform Health', path: '/platform/health', icon: 'health_and_safety' },
          { label: 'Platform Metrics', path: '/platform/metrics', icon: 'monitoring' },
          { label: 'Tenant Management', path: '/platform/tenants', icon: 'corporate_fare' },
        ],
      },
      {
        title: 'Projects',
        items: [
          { label: 'All Projects', path: '/projects', icon: 'folder_open' },
          { label: 'Gateway Management', path: '/platform/gateways', icon: 'dns' },
        ],
      },
      {
        title: 'Administration',
        items: [
          { label: 'Team Members', path: '/administration/members', icon: 'group' },
          { label: 'Roles & Permissions', path: '/administration/roles', icon: 'rule' },
        ],
      }
    );
  } else if (activeProjectRole === 'owner' || activeProjectRole === 'editor') {
    sections.push(
      {
        items: [{ label: 'Dashboard', path: '/', icon: 'dashboard' }],
      },
      {
        title: 'Projects',
        items: [
          { label: 'Configuration', path: '/connectivity', icon: 'settings' },
          { label: 'Analytics', path: '/analytics', icon: 'monitoring' },
          { label: 'Audit log', path: '/logs', icon: 'history' },
        ],
      }
    );
  } else {
    // Team Member / Operator / Viewer
    sections.push(
      {
        items: [{ label: 'Dashboard', path: '/', icon: 'dashboard' }],
      },
      {
        title: 'Gateway',
        items: [
          { label: 'Status', path: '/gateway/status', icon: 'dns' },
          { label: 'Monitoring', path: '/gateway/monitoring', icon: 'monitoring' },
          { label: 'Logs', path: '/logs', icon: 'history' },
        ],
      }
    );
  }

  return (
    <>
      {!isSidebarCollapsed && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/45 z-20 lg:hidden"
        />
      )}
      <aside
        className={`bg-brand-dark fixed left-0 top-0 h-screen w-[240px] border-r border-white/10 flex flex-col py-md z-30 transition-transform duration-300 ${
          isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
        } ${className}`}
      >
        {/* Logo Section */}
        <div className="px-md mb-lg flex items-center gap-sm">
          <img
            src={ELITE_GATE_LOGO_URL}
            alt="Elite Gate Logo"
            className="h-10 w-auto object-contain"
          />
          <span className="text-white font-bold text-[18px] tracking-tight">
            Elite Gateway
          </span>
        </div>

        {/* Project Selector */}
        <div className="px-md mb-md relative">
          <button
            onClick={toggleProjectDropdown}
            className="w-full flex items-center gap-sm py-sm px-sm bg-white/5 border border-white/10 rounded-lg text-left cursor-pointer hover:bg-white/10 transition-colors"
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isProjectDropdownOpen}
          >
            <span className="w-6 h-6 rounded bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
              {selectedProject ? (selectedProject.name[0]?.toUpperCase() || 'P') : 'P'}
            </span>
            <span className="font-label-md text-label-md font-bold text-white uppercase truncate flex-1">
              {selectedProject ? selectedProject.name : (projectsData ? 'No Project' : 'Loading...')}
            </span>
            <span
              className="material-symbols-outlined ml-auto text-white/40 text-[18px]"
              style={{ fontVariationSettings: '"FILL" 0' }}
            >
              unfold_more
            </span>
          </button>

          {/* Dropdown Menu */}
          {isProjectDropdownOpen && (
            <ul
              className="absolute left-md right-md mt-1 bg-brand-dark border border-white/10 rounded-lg shadow-lg py-1 z-30 max-h-60 overflow-y-auto"
              role="listbox"
            >
              {projects.map((project) => (
                <li key={project.id}>
                  <button
                    onClick={() => handleProjectSelect(project)}
                    className="w-full flex items-center gap-sm py-2 px-3 hover:bg-brand-hover text-white text-sm transition-colors text-left"
                    type="button"
                    role="option"
                    aria-selected={selectedProject?.id === project.id}
                  >
                    <span className="w-6 h-6 rounded bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
                      {project.name[0]?.toUpperCase() || 'P'}
                    </span>
                    <span className="font-semibold truncate">{project.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Navigation Links — dynamically built from computed sections */}
        <nav className="flex-1 overflow-y-auto px-sm flex flex-col gap-5">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="flex flex-col gap-1">
              {section.title && (
                <span className="px-md text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 select-none">
                  {section.title}
                </span>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <NavLink
                      to={item.path}
                      end={item.path === '/' || item.path.includes('?')}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          toggleSidebar();
                        }
                      }}
                      className={({ isActive }) =>
                        `flex items-center gap-md px-md py-sm rounded-lg transition-colors duration-200 ${isActive
                          ? 'text-white font-bold'
                          : 'text-white/70 hover:text-white hover:bg-brand-hover'
                        }`
                      }
                      style={({ isActive }) =>
                        isActive
                          ? {
                            borderLeft: '4px solid #587c94',
                            color: '#ffffff',
                            backgroundColor: 'rgba(255, 255, 255, 0.08)'
                          }
                          : undefined
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className="material-symbols-outlined text-[20px]"
                            style={{ fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0' }}
                          >
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;