// import React, { useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import { useActiveProject } from '../../hooks/useActiveProject';
// import { useWorkspacePath } from '../../hooks/useWorkspacePath';
// import { useProjectsQuery } from '../../hooks/useProjects';
// import { Project } from '../../api/projectsApi';
// import { useUIStore } from '../../../store/uiStore';
// import { useRoles } from '../../hooks/useRoles';
// import { resolveProjectRole } from '../../lib/projectRole';
// import { PLATFORM, ADMIN, abs } from '../../lib/platformPaths';

// const ELITE_GATE_LOGO_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMNMzsutofipclMtCLx10yT0XijWcwH3yQMT11UYckObcnqyeOYysEx4zjtw9zJQ158vHgc3HSYbK5ifhbqL23KyYFY0E8jgOfjLd-dxrla8yjIHCGdfPjS4OONSGJThGqbujzvytpQlUT_UCkln-dlOicqsVaATzo9K8LAKzLK4enKvtX_zqaRZ2bA7porNygVc6rCZVtkt2Td5QCZNDrY0MlvNokPc7_a07FLSuUa6E9lilI0xciZ5VcX-RAZdRt-0Bxgo9EvTmt';


// export interface SidebarProps {
//   readonly className?: string;
// }

// export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
//   const { projectId, projectRole, setActiveProjectId, setActiveProjectRole } = useActiveProject();
//   const { data: projectsData } = useProjectsQuery();
//   const isSidebarCollapsed = useUIStore((s) => s.isSidebarCollapsed);
//   const toggleSidebar = useUIStore((s) => s.toggleSidebar);
//   const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
//   const getPath = useWorkspacePath();

//   const projects = projectsData?.items ?? [];
//   const selectedProject = projects.find((p) => p.id === projectId) ?? null;

//   // Selection ownership: RootRedirect (create/pick-first) + ProjectLayout
//   // (URL sync). Sidebar only reflects state and handles manual switches.

//   const handleProjectSelect = (project: Project) => {
//     setActiveProjectId(project.id); // persists to storage + navigates
//     setActiveProjectRole(resolveProjectRole(project));
//     setIsProjectDropdownOpen(false);
//   };

//   const { isSuperAdmin } = useRoles();

//   const sections: { title?: string; items: { label: string; path: string; icon: string }[] }[] = [];

//   if (isSuperAdmin) {
//     const projectItems = [
//       { label: 'All Projects', path: abs(PLATFORM.projects), icon: 'folder_open' },
//       { label: 'Gateway Management', path: abs(PLATFORM.gateways), icon: 'dns' },
//     ];
//     if (projectId) {
//       projectItems.push({ label: 'Custom Domains', path: getPath('/custom-domains'), icon: 'language' });
//       if (projectRole === 'owner') {
//         projectItems.push({ label: 'Security', path: getPath('/security'), icon: 'shield_lock' });
//       }
//     }

//     sections.push(
//       { items: [{ label: 'Dashboard', path: getPath('/'), icon: 'dashboard' }] },
//       {
//         title: 'Platform',
//         items: [
//           { label: 'Platform Health', path: abs(PLATFORM.health), icon: 'health_and_safety' },
//           { label: 'Platform Metrics', path: abs(PLATFORM.metrics), icon: 'monitoring' },
//           { label: 'Tenant Management', path: abs(PLATFORM.tenants), icon: 'corporate_fare' },
//         ],
//       },
//       {
//         title: 'Projects',
//         items: projectItems,
//       },
//       {
//         title: 'Administration',
//         items: [
//           { label: 'Team Members', path: abs(ADMIN.members), icon: 'group' },
//           { label: 'Roles & Permissions', path: abs(ADMIN.roles), icon: 'rule' },
//         ],
//       }
//     );
//   } else if (projectRole === 'owner' || projectRole === 'editor') {
//     const projectConfigurationItems = [
//       {
//         label: 'Configuration',
//         path: getPath('/connectivity'),
//         icon: 'settings',
//       },
//       {
//         label: 'Custom Domains',
//         path: getPath('/custom-domains'),
//         icon: 'language',
//       },
//       {
//         label: 'Analytics',
//         path: getPath('/analytics'),
//         icon: 'monitoring',
//       },
//       {
//         label: 'Audit log',
//         path: getPath('/logs'),
//         icon: 'history',
//       },
//     ];

//     if (projectRole === 'owner') {
//       projectConfigurationItems.push({
//         label: 'Security',
//         path: getPath('/security'),
//         icon: 'shield_lock',
//       });
//     }

//     sections.push(
//       { items: [{ label: 'Dashboard', path: getPath('/'), icon: 'dashboard' }] },
//       {
//         title: 'Projects',
//         items: projectConfigurationItems,
//       }
//     );
//   } else {
//     sections.push(
//       { items: [{ label: 'Dashboard', path: getPath('/'), icon: 'dashboard' }] },
//       {
//         title: 'Gateway',
//         items: [
//           { label: 'Status', path: getPath('/gateway/status'), icon: 'dns' },
//           { label: 'Monitoring', path: getPath('/gateway/monitoring'), icon: 'monitoring' },
//           { label: 'Custom Domains', path: getPath('/custom-domains'), icon: 'language' },
//           { label: 'Logs', path: getPath('/logs'), icon: 'history' },
//         ],
//       }
//     );
//   }

//   return (
//     <>
//       {!isSidebarCollapsed && (
//         <div onClick={toggleSidebar} className="fixed inset-0 bg-black/45 z-20 lg:hidden" />
//       )}
//       <aside
//         className={`bg-brand-dark fixed left-0 top-0 h-screen w-[240px] border-r border-white/10 flex flex-col py-md z-30 transition-transform duration-300 ${
//           isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
//         } ${className}`}
//       >
//         <div className="px-md mb-lg flex items-center gap-sm">
//           <img src={ELITE_GATE_LOGO_URL} alt="Elite Gate Logo" className="h-10 w-auto object-contain" />
//           <span className="text-white font-bold text-[18px] tracking-tight">Elite Gateway</span>
//         </div>

//         <div className="px-md mb-md relative">
//           <button
//             onClick={() => setIsProjectDropdownOpen((prev) => !prev)}
//             className="w-full flex items-center gap-sm py-sm px-sm bg-white/5 border border-white/10 rounded-lg text-left cursor-pointer hover:bg-white/10 transition-colors"
//             type="button"
//             aria-haspopup="listbox"
//             aria-expanded={isProjectDropdownOpen}
//           >
//             <span className="w-6 h-6 rounded bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
//               {selectedProject ? (selectedProject.name[0]?.toUpperCase() || 'P') : 'P'}
//             </span>
//             <span className="font-label-md text-label-md font-bold text-white uppercase truncate flex-1">
//               {selectedProject ? selectedProject.name : (projectsData ? 'No Project' : 'Loading...')}
//             </span>
//             <span className="material-symbols-outlined ml-auto text-white/40 text-[18px]" style={{ fontVariationSettings: '"FILL" 0' }}>
//               unfold_more
//             </span>
//           </button>

//           {isProjectDropdownOpen && (
//             <ul className="absolute left-md right-md mt-1 bg-brand-dark border border-white/10 rounded-lg shadow-lg py-1 z-30 max-h-60 overflow-y-auto" role="listbox">
//               {projects.map((project) => (
//                 <li key={project.id}>
//                   <button
//                     onClick={() => handleProjectSelect(project)}
//                     className="w-full flex items-center gap-sm py-2 px-3 hover:bg-brand-hover text-white text-sm transition-colors text-left"
//                     type="button"
//                     role="option"
//                     aria-selected={selectedProject?.id === project.id}
//                   >
//                     <span className="w-6 h-6 rounded bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
//                       {project.name[0]?.toUpperCase() || 'P'}
//                     </span>
//                     <span className="font-semibold truncate">{project.name}</span>
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         <nav className="flex-1 overflow-y-auto px-sm flex flex-col gap-5">
//           {sections.map((section, sIdx) => (
//             <div key={sIdx} className="flex flex-col gap-1">
//               {section.title && (
//                 <span className="px-md text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 select-none">
//                   {section.title}
//                 </span>
//               )}
//               <ul className="space-y-1">
//                 {section.items.map((item) => (
//                   <li key={item.label}>
//                     <NavLink
//                       to={item.path}
//                       end={item.path === '/' || item.path.includes('?')}
//                       onClick={() => { if (window.innerWidth < 1024) toggleSidebar(); }}
//                       className={({ isActive }) =>
//                         `flex items-center gap-md px-md py-sm rounded-lg transition-colors duration-200 ${
//                           isActive ? 'text-white font-bold' : 'text-white/70 hover:text-white hover:bg-brand-hover'
//                         }`
//                       }
//                       style={({ isActive }) =>
//                         isActive
//                           ? { borderLeft: '4px solid #587c94', color: '#ffffff', backgroundColor: 'rgba(255, 255, 255, 0.08)' }
//                           : undefined
//                       }
//                     >
//                       {({ isActive }) => (
//                         <>
//                           <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0' }}>
//                             {item.icon}
//                           </span>
//                           <span>{item.label}</span>
//                         </>
//                       )}
//                     </NavLink>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </nav>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;


// -----------------------------------------------------------------


import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useActiveProject } from '../../hooks/useActiveProject';
import { useWorkspacePath } from '../../hooks/useWorkspacePath';
import { useProjectsQuery } from '../../hooks/useProjects';
import { Project } from '../../api/projectsApi';
import { useUIStore } from '../../../store/uiStore';
import { useRoles } from '../../hooks/useRoles';
import { resolveProjectRole } from '../../lib/projectRole';
import { PLATFORM, ADMIN, abs } from '../../lib/platformPaths';

const ELITE_GATE_LOGO_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBMNMzsutofipclMtCLx10yT0XijWcwH3yQMT11UYckObcnqyeOYysEx4zjtw9zJQ158vHgc3HSYbK5ifhbqL23KyYFY0E8jgOfjLd-dxrla8yjIHCGdfPjS4OONSGJThGqbujzvytpQlUT_UCkln-dlOicqsVaATzo9K8LAKzLK4enKvtX_zqaRZ2bA7porNygVc6rCZVtkt2Td5QCZNDrY0MlvNokPc7_a07FLSuUa6E9lilI0xciZ5VcX-RAZdRt-0Bxgo9EvTmt';

export interface SidebarProps {
  readonly className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const {
    projectId,
    projectRole,
    setActiveProjectId,
    setActiveProjectRole,
  } = useActiveProject();

  const { data: projectsData } = useProjectsQuery();

  const isSidebarCollapsed = useUIStore((s) => s.isSidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);

  const getPath = useWorkspacePath();

  const projects = projectsData?.items ?? [];

  const selectedProject =
    projects.find((p) => p.id === projectId) ?? null;

  // Selection ownership:
  // RootRedirect handles create/pick-first.
  // ProjectLayout handles URL sync.
  // Sidebar only reflects state and handles manual switches.
  const handleProjectSelect = (project: Project) => {
    setActiveProjectId(project.id);
    setActiveProjectRole(resolveProjectRole(project));
    setIsProjectDropdownOpen(false);
  };

  const { isSuperAdmin } = useRoles();

  const sections: {
    title?: string;
    items: {
      label: string;
      path: string;
      icon: string;
    }[];
  }[] = [];

  // ============================================================
  // SUPER ADMIN SIDEBAR
  // ============================================================
  if (isSuperAdmin) {
    const projectItems = [
      {
        label: 'All Projects',
        path: abs(PLATFORM.projects),
        icon: 'folder_open',
      },
      {
        label: 'Gateway Management',
        path: abs(PLATFORM.gateways),
        icon: 'dns',
      },
    ];

    if (projectId) {
      // Security is owner-only.
      if (projectRole === 'owner') {
        projectItems.push({
          label: 'Security',
          path: getPath('/security'),
          icon: 'shield_lock',
        });
      }

      projectItems.push({
        label: 'Custom Domains',
        path: getPath('/custom-domains'),
        icon: 'language',
      });
    }

    sections.push(
      {
        items: [
          {
            label: 'Dashboard',
            path: getPath('/'),
            icon: 'dashboard',
          },
        ],
      },
      {
        title: 'Platform',
        items: [
          {
            label: 'Platform Health',
            path: abs(PLATFORM.health),
            icon: 'health_and_safety',
          },
          {
            label: 'Platform Metrics',
            path: abs(PLATFORM.metrics),
            icon: 'monitoring',
          },
          {
            label: 'Tenant Management',
            path: abs(PLATFORM.tenants),
            icon: 'corporate_fare',
          },
        ],
      },
      {
        title: 'Projects',
        items: projectItems,
      },
      {
        title: 'Administration',
        items: [
          {
            label: 'Team Members',
            path: abs(ADMIN.members),
            icon: 'group',
          },
          {
            label: 'Roles & Permissions',
            path: abs(ADMIN.roles),
            icon: 'rule',
          },
        ],
      }
    );
  }

  // ============================================================
  // PROJECT OWNER / EDITOR SIDEBAR
  // ============================================================
  else if (projectRole === 'owner' || projectRole === 'editor') {
    const projectConfigurationItems = [
      {
        label: 'Configuration',
        path: getPath('/connectivity'),
        icon: 'settings',
      },

      // Security appears directly after Configuration
      // and only for project owners.
      ...(projectRole === 'owner'
        ? [
          {
            label: 'Security',
            path: getPath('/security'),
            icon: 'shield_lock',
          },
        ]
        : []),

      {
        label: 'Custom Domains',
        path: getPath('/custom-domains'),
        icon: 'language',
      },
      {
        label: 'Analytics',
        path: getPath('/analytics'),
        icon: 'monitoring',
      },
      {
        label: 'Audit log',
        path: getPath('/logs'),
        icon: 'history',
      },
    ];

    sections.push(
      {
        items: [
          {
            label: 'Dashboard',
            path: getPath('/'),
            icon: 'dashboard',
          },
        ],
      },
      {
        title: 'Projects',
        items: projectConfigurationItems,
      }
    );
  }

  // ============================================================
  // VIEWER SIDEBAR
  // ============================================================
  else {
    sections.push(
      {
        items: [
          {
            label: 'Dashboard',
            path: getPath('/'),
            icon: 'dashboard',
          },
        ],
      },
      {
        title: 'Gateway',
        items: [
          {
            label: 'Status',
            path: getPath('/gateway/status'),
            icon: 'dns',
          },
          {
            label: 'Monitoring',
            path: getPath('/gateway/monitoring'),
            icon: 'monitoring',
          },
          {
            label: 'Custom Domains',
            path: getPath('/custom-domains'),
            icon: 'language',
          },
          {
            label: 'Logs',
            path: getPath('/logs'),
            icon: 'history',
          },
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
        className={`bg-brand-dark fixed left-0 top-0 h-screen w-[240px] border-r border-white/10 flex flex-col py-md z-30 transition-transform duration-300 ${isSidebarCollapsed
            ? '-translate-x-full'
            : 'translate-x-0'
          } ${className}`}
      >
        {/* Logo */}
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
            onClick={() =>
              setIsProjectDropdownOpen((prev) => !prev)
            }
            className="w-full flex items-center gap-sm py-sm px-sm bg-white/5 border border-white/10 rounded-lg text-left cursor-pointer hover:bg-white/10 transition-colors"
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isProjectDropdownOpen}
          >
            <span className="w-6 h-6 rounded bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
              {selectedProject
                ? selectedProject.name[0]?.toUpperCase() || 'P'
                : 'P'}
            </span>

            <span className="font-label-md text-label-md font-bold text-white uppercase truncate flex-1">
              {selectedProject
                ? selectedProject.name
                : projectsData
                  ? 'No Project'
                  : 'Loading...'}
            </span>

            <span
              className="material-symbols-outlined ml-auto text-white/40 text-[18px]"
              style={{
                fontVariationSettings: '"FILL" 0',
              }}
            >
              unfold_more
            </span>
          </button>

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
                    aria-selected={
                      selectedProject?.id === project.id
                    }
                  >
                    <span className="w-6 h-6 rounded bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
                      {project.name[0]?.toUpperCase() || 'P'}
                    </span>

                    <span className="font-semibold truncate">
                      {project.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-sm flex flex-col gap-5">
          {sections.map((section, sIdx) => (
            <div
              key={sIdx}
              className="flex flex-col gap-1"
            >
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
                      end={
                        item.path === '/' ||
                        item.path.includes('?')
                      }
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
                            borderLeft:
                              '4px solid #587c94',
                            color: '#ffffff',
                            backgroundColor:
                              'rgba(255, 255, 255, 0.08)',
                          }
                          : undefined
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className="material-symbols-outlined text-[20px]"
                            style={{
                              fontVariationSettings:
                                isActive
                                  ? '"FILL" 1'
                                  : '"FILL" 0',
                            }}
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