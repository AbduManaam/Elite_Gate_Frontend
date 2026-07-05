import React, { useState } from 'react';
import { RoutesList } from '../../routes';
import { UpstreamsList } from '../../upstreams';

export const GatewaysPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'Overview' | 'Routes' | 'Upstreams' | string>('Overview');

  const subTabs = [
    'Overview',
    'Control plane logs',
    'Custom domains',
    'Gateway services',
    'Routes',
    'Consumers',
    'Plugins',
    'Upstreams',
    'Certificates',
    'Keys'
  ];

  return (
    <div className="flex flex-col w-full text-left">
      {/* Page Header Section */}
      <div className="bg-white border-b border-outline-variant pt-lg px-margin-desktop -mx-margin-desktop -mt-margin-desktop mb-margin-desktop">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-xs font-label-md text-label-md text-on-surface-variant mb-md">
          <a className="hover:text-primary transition-colors cursor-pointer">API Gateway</a>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <a className="hover:text-primary transition-colors cursor-pointer">Control planes</a>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface font-semibold">serverless-default</span>
        </nav>
        
        {/* Title & Actions */}
        <div className="flex justify-between items-center mb-lg">
          <div className="flex items-center gap-sm">
            <h1 className="font-display-lg text-display-lg text-on-surface">serverless-default</h1>
            <span className="px-sm py-xs bg-surface-container rounded text-on-surface-variant font-mono text-[11px] ml-sm border border-outline-variant">
              Control Plane
            </span>
          </div>
          
          <div className="flex items-center gap-sm">
            <button className="px-md py-sm bg-white border border-outline-variant text-on-surface font-semibold text-xs rounded hover:bg-surface-container-low transition-colors flex items-center gap-xs cursor-pointer">
              Connect
            </button>
            <button className="px-md py-sm bg-[#113346] text-white font-semibold text-xs rounded hover:bg-opacity-90 transition-colors flex items-center gap-xs cursor-pointer">
              Actions
              <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
            </button>
          </div>
        </div>

        {/* Sub-nav Tabs */}
        <div className="flex items-center gap-xl overflow-x-auto border-b border-transparent">
          {subTabs.map((tab) => {
            const isActive = activeSubTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`font-semibold text-sm pb-sm whitespace-nowrap transition-all cursor-pointer border-b-2 border-transparent ${
                  isActive
                    ? 'text-[#587c94] border-[#587c94]'
                    : 'text-on-surface-variant hover:text-[#587c94]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Render sub-tab content */}
      <div className="w-full">
        {activeSubTab === 'Overview' && (
          <div className="flex flex-col gap-lg">
            {/* Define and route traffic card */}
            <div className="bg-white border border-outline-variant rounded-lg overflow-hidden shadow-sm">
              <div className="p-lg border-b border-outline-variant">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">
                  Define and route traffic to your services
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Configure your gateway to manage incoming API requests and route them to your backend services securely.
                </p>
              </div>

              {/* Stepper */}
              <div className="flex items-center gap-0 border-b border-outline-variant bg-surface-container-low">
                <div className="flex-1 p-md flex items-center gap-sm relative bg-white">
                  <div className="w-6 h-6 rounded-full bg-[#113346] text-white flex items-center justify-center font-semibold text-xs">
                    1
                  </div>
                  <span className="font-semibold text-sm text-on-surface">Add configuration</span>
                  <div className="absolute right-0 top-0 bottom-0 w-px bg-outline-variant"></div>
                </div>
                <div className="flex-1 p-md flex items-center gap-sm relative opacity-60 bg-white/40">
                  <div className="w-6 h-6 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-semibold text-xs border border-outline-variant">
                    2
                  </div>
                  <span className="text-sm text-on-surface-variant">Add plugins</span>
                  <div className="absolute right-0 top-0 bottom-0 w-px bg-outline-variant"></div>
                </div>
                <div className="flex-1 p-md flex items-center gap-sm opacity-60 bg-white/40">
                  <div className="w-6 h-6 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-semibold text-xs border border-outline-variant">
                    3
                  </div>
                  <span className="text-sm text-on-surface-variant">Next steps</span>
                </div>
              </div>

              {/* Interactive Diagram Area */}
              <div className="p-xl bg-background flex flex-col items-center justify-center min-h-[300px] border-b border-outline-variant">
                <div className="flex items-center justify-center w-full max-w-4xl gap-md relative">
                  {/* Node: Client */}
                  <div className="flex flex-col items-center gap-sm z-10">
                    <div className="w-16 h-16 bg-white border border-outline-variant rounded-full flex items-center justify-center text-on-surface-variant shadow-sm">
                      <span className="material-symbols-outlined text-[32px]">devices</span>
                    </div>
                    <span className="font-semibold text-xs text-on-surface">Client</span>
                  </div>
                  {/* Connector */}
                  <div className="flex-1 flex flex-col items-center justify-center relative">
                    <span className="font-mono text-[10px] text-on-surface-variant mb-xs bg-background px-sm">Request</span>
                    <div className="w-full border-t-2 border-dashed border-outline-variant relative">
                      <span className="material-symbols-outlined absolute right-[-8px] top-[-13px] text-outline-variant text-[24px]">
                        play_arrow
                      </span>
                    </div>
                  </div>
                  {/* Node: Route */}
                  <div className="flex flex-col items-center gap-sm z-10">
                    <div className="w-16 h-16 bg-[#587c94] border border-[#113346] rounded-lg flex items-center justify-center text-white shadow-sm">
                      <span className="material-symbols-outlined text-[32px]">alt_route</span>
                    </div>
                    <span className="font-semibold text-xs text-on-surface">Route</span>
                  </div>
                  {/* Connector */}
                  <div className="w-12 border-t-2 border-outline-variant relative">
                    <span className="material-symbols-outlined absolute right-[-8px] top-[-13px] text-outline-variant text-[24px]">
                      play_arrow
                    </span>
                  </div>
                  {/* Node: Service */}
                  <div className="flex flex-col items-center gap-sm z-10">
                    <div className="w-16 h-16 bg-secondary-container border border-secondary-fixed-dim rounded-lg flex items-center justify-center text-on-secondary-container shadow-sm">
                      <span className="material-symbols-outlined text-[32px]">settings_ethernet</span>
                    </div>
                    <span className="font-semibold text-xs text-on-surface">Service</span>
                  </div>
                  {/* Connector */}
                  <div className="flex-1 flex flex-col items-center justify-center relative">
                    <span className="font-mono text-[10px] text-on-surface-variant mb-xs bg-background px-sm">Response</span>
                    <div className="w-full border-t-2 border-dashed border-outline-variant relative">
                      <span className="material-symbols-outlined absolute right-[-8px] top-[-13px] text-outline-variant text-[24px]">
                        play_arrow
                      </span>
                    </div>
                  </div>
                  {/* Node: Backend API */}
                  <div className="flex flex-col items-center gap-sm z-10">
                    <div className="w-16 h-16 bg-white border border-outline-variant rounded-full flex items-center justify-center text-on-surface-variant shadow-sm">
                      <span className="material-symbols-outlined text-[32px]">storage</span>
                    </div>
                    <span className="font-semibold text-xs text-on-surface">Backend API</span>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-lg bg-white flex items-center gap-md">
                <button className="px-md py-sm bg-[#113346] text-white font-semibold text-xs rounded hover:bg-opacity-90 transition-colors flex items-center gap-xs shadow-sm cursor-pointer">
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Add a service and route
                </button>
                <button className="px-md py-sm bg-white border border-outline-variant text-on-surface font-semibold text-xs rounded hover:bg-surface-container-low transition-colors flex items-center gap-xs cursor-pointer">
                  <span className="material-symbols-outlined text-[16px]">upload_file</span>
                  Import via OAS spec
                </button>
              </div>
            </div>

            {/* Recent Activity filler */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md opacity-70">
              <div className="bg-white border border-outline-variant rounded-lg p-md flex items-center gap-md">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined">receipt_long</span>
                </div>
                <div>
                  <div className="font-semibold text-sm text-on-surface">Recent Activity</div>
                  <div className="text-xs text-on-surface-variant">No logs today</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'Routes' && (
          <RoutesList />
        )}

        {activeSubTab === 'Upstreams' && (
          <UpstreamsList />
        )}

        {/* Fallback for coming soon sub-tabs */}
        {activeSubTab !== 'Overview' && activeSubTab !== 'Routes' && activeSubTab !== 'Upstreams' && (
          <div className="p-xl border border-dashed border-outline-variant rounded-xl text-center text-on-surface-variant font-medium bg-white shadow-sm mt-md">
            <span className="material-symbols-outlined text-[48px] text-outline mb-sm block">hourglass_empty</span>
            {activeSubTab} Screen is under active backend development.
          </div>
        )}
      </div>
    </div>
  );
};

export default GatewaysPage;
