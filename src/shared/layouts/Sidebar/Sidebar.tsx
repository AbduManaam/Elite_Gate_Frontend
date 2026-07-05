import React, { useState } from 'react';
import {
  SIDEBAR_NAV_ITEMS,
  MOCK_PROJECTS,
  ELITE_GATE_LOGO_URL,
  SidebarProject,
  SidebarNavItem
} from '../../mocks/sidebarMock';

export interface SidebarProps {
  readonly activeItem?: string;
  readonly onItemClick?: (label: string) => void;
  readonly className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeItem = 'Welcome',
  onItemClick,
  className = ''
}) => {
  const [selectedProject, setSelectedProject] = useState<SidebarProject>(MOCK_PROJECTS[0]);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);

  const handleItemClick = (label: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onItemClick) {
      onItemClick(label);
    }
  };

  const toggleProjectDropdown = () => {
    setIsProjectDropdownOpen((prev) => !prev);
  };

  const handleProjectSelect = (project: SidebarProject) => {
    setSelectedProject(project);
    setIsProjectDropdownOpen(false);
  };

  return (
    <aside
      className={`bg-brand-dark fixed left-0 top-0 h-screen w-[240px] border-r border-white/10 flex flex-col py-md z-20 ${className}`}
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
            {selectedProject.initials}
          </span>
          <span className="font-label-md text-label-md font-bold text-white uppercase">
            {selectedProject.name}
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
            className="absolute left-md right-md mt-1 bg-brand-dark border border-white/10 rounded-lg shadow-lg py-1 z-30"
            role="listbox"
          >
            {MOCK_PROJECTS.map((project) => (
              <li key={project.id}>
                <button
                  onClick={() => handleProjectSelect(project)}
                  className="w-full flex items-center gap-sm py-2 px-3 hover:bg-brand-hover text-white text-sm transition-colors text-left"
                  type="button"
                  role="option"
                  aria-selected={selectedProject.id === project.id}
                >
                  <span className="w-6 h-6 rounded bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
                    {project.initials}
                  </span>
                  <span className="font-semibold">{project.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-sm">
        <ul className="space-y-1">
          {SIDEBAR_NAV_ITEMS.map((item: SidebarNavItem) => {
            const isActive = activeItem.toLowerCase() === item.label.toLowerCase();
            return (
              <li key={item.label}>
                <a
                  href={`#${item.label.toLowerCase()}`}
                  onClick={(e) => handleItemClick(item.label, e)}
                  className={`flex items-center gap-md px-md py-sm rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'text-white font-bold'
                      : 'text-white/70 hover:text-white hover:bg-brand-hover'
                  }`}
                  style={
                    isActive
                      ? {
                          borderLeft: '4px solid #113346',
                          color: '#113346', // Keeping faithful to HTML export's exact inline styles
                          backgroundColor: 'rgba(255, 255, 255, 0.05)'
                        }
                      : undefined
                  }
                >
                  {item.isImage && item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="w-5 h-5 object-contain"
                    />
                  ) : (
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0' }}
                    >
                      {item.icon}
                    </span>
                  )}
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
