// It defines the main layout of the application after the user logs in.
// It displays the Sidebar, Header, and the currently selected page, and handles
// navigation-related UI such as logout and analytics tabs.

import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../shared/layouts/Sidebar/Sidebar';
import { useAuthGate } from './AuthGate';
import { useProjectSummaryQuery } from '../../shared/hooks/useProjectSummary';
import { useUIStore } from '../../store/uiStore';

interface SearchItem {
  category: string;
  title: string;
  path: string;
  icon: string;
}

export const AppRouter: React.FC = () => {
  useProjectSummaryQuery();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthGate();
  const isSidebarCollapsed = useUIStore((s) => s.isSidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        useUIStore.setState({ isSidebarCollapsed: true });
      } else {
        useUIStore.setState({ isSidebarCollapsed: false });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const isAnalytics = location.pathname.startsWith('/analytics');

  const searchItems: SearchItem[] = [
    { category: 'Pages', title: 'Welcome Dashboard', path: '/', icon: 'dashboard' },
    { category: 'Pages', title: 'Connectivity Workspace', path: '/connectivity', icon: 'settings_ethernet' },
    { category: 'Pages', title: 'Analytics Summary', path: '/analytics', icon: 'monitoring' },
    { category: 'Pages', title: 'Analytics Explorer', path: '/analytics/explorer', icon: 'explore' },
    { category: 'Pages', title: 'Audit Logs', path: '/logs', icon: 'receipt_long' },
    { category: 'Pages', title: 'Profile Settings', path: '/settings', icon: 'settings' },

    { category: 'Workspace Tabs', title: 'Overview tab', path: '/connectivity?tab=Overview', icon: 'rocket_launch' },
    { category: 'Workspace Tabs', title: 'Projects tab', path: '/connectivity?tab=Projects', icon: 'folder' },
    { category: 'Workspace Tabs', title: 'Gateway services tab', path: '/connectivity?tab=Gateway services', icon: 'dns' },
    { category: 'Workspace Tabs', title: 'Routes tab', path: '/connectivity?tab=Routes', icon: 'route' },
    { category: 'Workspace Tabs', title: 'Upstreams tab', path: '/connectivity?tab=Upstreams', icon: 'link' },
    { category: 'Workspace Tabs', title: 'Policies tab', path: '/connectivity?tab=Policies', icon: 'security' },
    { category: 'Workspace Tabs', title: 'API Credentials tab', path: '/connectivity?tab=API Credentials', icon: 'key' },
    { category: 'Workspace Tabs', title: 'Team Collaboration tab', path: '/connectivity?tab=Team Collaboration', icon: 'group' },
  ];

  const filteredItems = searchItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleNavigate(filteredItems[selectedIndex].path);
      }
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsSearchOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <div className="font-body-md text-body-md bg-background text-on-background antialiased flex h-screen overflow-hidden select-none">
      {/* Sidebar Layout */}
      <Sidebar />

      {/* Main Content Area Wrapper */}
      <div className={`flex-1 flex flex-col min-h-screen relative transition-all duration-300 ${isSidebarCollapsed ? 'ml-0' : 'ml-0 lg:ml-[240px]'}`}>

        {/* TopNavBar matching the layout height */}
        <header className={`bg-white fixed top-0 right-0 h-[56px] border-b border-outline-variant flex justify-between items-center px-lg z-10 text-left transition-all duration-300 ${isSidebarCollapsed ? 'w-full' : 'w-full lg:w-[calc(100%-240px)]'}`}>

          {/* Left Controls: Search bar or Sub-Navigation tabs for Analytics */}
          <div className="flex items-center flex-1 max-w-lg gap-lg">
            <button
              onClick={toggleSidebar}
              className="text-on-surface-variant hover:bg-surface-container rounded p-1 cursor-pointer transition-colors duration-200"
              type="button"
              aria-label="Toggle Sidebar"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
            {isAnalytics ? (
              <nav className="flex gap-md border-b-2 border-transparent h-full items-center">
                <NavLink
                  to="/analytics"
                  end
                  className={({ isActive }) =>
                    `font-semibold text-sm px-sm py-1 rounded transition-colors cursor-pointer ${isActive
                      ? 'text-[#113346] bg-[#113346]/10'
                      : 'text-on-surface-variant hover:text-[#113346]'
                    }`
                  }
                >
                  Summary
                </NavLink>
                <NavLink
                  to="/analytics/explorer"
                  className={({ isActive }) =>
                    `font-semibold text-sm px-sm py-1 rounded transition-colors cursor-pointer ${isActive
                      ? 'text-[#113346] bg-[#113346]/10'
                      : 'text-on-surface-variant hover:text-[#113346]'
                    }`
                  }
                >
                  Explorer
                </NavLink>
              </nav>
            ) : (
              <div className="relative w-80 md:w-96 flex-shrink-0">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                  search
                </span>
                <input
                  readOnly
                  onClick={() => setIsSearchOpen(true)}
                  className="w-full h-8 pl-9 pr-16 text-sm bg-surface-container-low border border-outline-variant rounded focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94] outline-none transition-all placeholder:text-outline text-on-surface cursor-pointer"
                  placeholder="Search..."
                  type="text"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 select-none">
                  <kbd className="text-[9px] text-outline font-mono bg-white px-1.5 py-0.5 rounded border border-outline-variant/60 shadow-sm">
                    Ctrl
                  </kbd>
                  <kbd className="text-[9px] text-outline font-mono bg-white px-1.5 py-0.5 rounded border border-outline-variant/60 shadow-sm">
                    K
                  </kbd>
                </div>
              </div>
            )}
          </div>

          {/* Right Controls: Notifications, Profile */}
          <div className="flex items-center gap-lg">
            <div className="flex items-center gap-md relative">
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:bg-surface-container transition-all rounded p-1">
                notifications
              </span>
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:bg-surface-container transition-all rounded p-1">
                help_outline
              </span>

              {/* User Avatar & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs cursor-pointer border border-outline-variant hover:brightness-95 transition-all outline-none"
                  type="button"
                >
                  AM
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-outline-variant rounded-lg shadow-lg py-1 z-30">
                    <div className="px-4 py-2 border-b border-outline-variant">
                      <p className="text-sm font-semibold text-on-surface">Abdu Manaam</p>
                      <p className="text-xs text-on-surface-variant">System Administrator</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/5 flex items-center gap-sm transition-colors cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Canvas — routed pages render here */}
        <main className="flex-1 overflow-y-auto mt-[56px] p-margin-mobile lg:p-margin-desktop bg-[#fefefe]">
          <div className="max-w-[1600px] mx-auto pb-xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Command Palette Search Modal */}
      {isSearchOpen && (
        <div 
          onClick={() => setIsSearchOpen(false)}
          className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-[15vh] px-md backdrop-blur-xs"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-outline-variant rounded-xl shadow-2xl w-[512px] max-w-full flex flex-col overflow-hidden max-h-[50vh] flex-shrink-0"
          >
            {/* Search Input */}
            <div className="relative p-md border-b border-outline-variant flex items-center">
              <span className="material-symbols-outlined text-outline text-[20px] absolute left-6">
                search
              </span>
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDownList}
                className="w-full pl-10 pr-4 py-2 bg-transparent text-sm text-on-surface outline-none placeholder:text-outline"
                placeholder="Search tabs, pages, and actions..."
                type="text"
              />
            </div>

            {/* Search Results */}
            <div className="overflow-y-auto p-2 flex flex-col gap-0.5 text-left">
              {filteredItems.length === 0 ? (
                <div className="p-lg text-center text-xs text-on-surface-variant font-sans">
                  No matching resources or navigation paths found.
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <button
                      key={item.title + item.path}
                      onClick={() => handleNavigate(item.path)}
                      className={`w-full flex items-center justify-between px-md py-2.5 rounded-lg text-xs font-sans transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[#113346] text-white' 
                          : 'text-on-surface-variant hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-sm">
                        <span className={`material-symbols-outlined text-[18px] ${isSelected ? 'text-white' : 'text-outline'}`}>
                          {item.icon}
                        </span>
                        <span>{item.title}</span>
                      </div>
                      <span className={`text-[10px] uppercase font-semibold ${isSelected ? 'text-white/80' : 'text-outline/70'}`}>
                        {item.category}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Help */}
            <div className="bg-slate-50 border-t border-outline-variant p-2.5 px-md flex justify-between items-center text-[10px] text-outline select-none font-sans">
              <div className="flex gap-md">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
              </div>
              <span>esc close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppRouter;