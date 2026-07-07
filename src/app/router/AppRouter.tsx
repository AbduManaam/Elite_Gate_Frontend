// It defines the main layout of the application after the user logs in.
// It displays the Sidebar, Header, and the currently selected page, and handles
// navigation-related UI such as logout and analytics tabs.

import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../shared/layouts/Sidebar/Sidebar';
import { useAuthGate } from './AuthGate';

export const AppRouter: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthGate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isAnalytics = location.pathname.startsWith('/analytics');

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
      <div className="flex-1 flex flex-col ml-[240px] relative">

        {/* TopNavBar matching the layout height */}
        <header className="bg-white fixed top-0 right-0 w-[calc(100%-240px)] h-[56px] border-b border-outline-variant flex justify-between items-center px-lg z-10 text-left">

          {/* Left Controls: Search bar or Sub-Navigation tabs for Analytics */}
          <div className="flex items-center flex-1 max-w-lg gap-lg">
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
              <div className="relative w-full max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                  search
                </span>
                <input
                  className="w-full h-8 pl-9 pr-12 text-sm bg-surface-container-low border border-outline-variant rounded focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-outline text-on-surface"
                  placeholder="Search resources..."
                  type="text"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <span className="text-[10px] text-outline font-mono bg-surface-container px-1 rounded border border-outline-variant">
                    Ctrl
                  </span>
                  <span className="text-[10px] text-outline font-mono bg-surface-container px-1 rounded border border-outline-variant">
                    K
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Controls: Trial, Upgrade, Notifications, Profile */}
          <div className="flex items-center gap-lg">
            <div className="flex items-center gap-sm">
              <span className="px-2 py-1 bg-surface-container text-on-surface-variant rounded-full text-[11px] font-semibold border border-outline-variant">
                Trial: 28 days left
              </span>
              <button
                type="button"
                className="bg-[#113346] text-white px-3 py-1.5 rounded font-semibold text-xs hover:bg-[#123749] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add</span> Upgrade
              </button>
            </div>

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
        <main className="flex-1 overflow-y-auto mt-[56px] p-margin-desktop bg-[#fefefe]">
          <div className="max-w-[1600px] mx-auto pb-xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppRouter;