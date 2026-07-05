import React, { useState } from 'react';
import { ProfileSettings } from '../../auth';

export const ProjectSettings: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'Workspace Settings' | 'User Profile'>('Workspace Settings');
  
  // Workspace Settings States
  const [region, setRegion] = useState('us-east-1');
  const [probeTimeout, setProbeTimeout] = useState(2000);
  const [checkFrequency, setCheckFrequency] = useState(30);
  const [isSlackEnabled, setIsSlackEnabled] = useState(true);
  const [slackUrl, setSlackUrl] = useState('https://hooks.slack.com/services/YOUR_WORKSPACE_WEBHOOK');

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Sub-tab Navigation */}
      <div className="flex border-b border-outline-variant mb-xl gap-lg">
        <button
          onClick={() => setActiveSubTab('Workspace Settings')}
          className={`px-lg py-sm font-semibold text-sm transition-colors cursor-pointer border-b-2 ${
            activeSubTab === 'Workspace Settings'
              ? 'text-[#587c94] border-[#587c94]'
              : 'text-on-surface-variant hover:text-[#587c94] border-transparent'
          }`}
        >
          Workspace Settings
        </button>
        <button
          onClick={() => setActiveSubTab('User Profile')}
          className={`px-lg py-sm font-semibold text-sm transition-colors cursor-pointer border-b-2 ${
            activeSubTab === 'User Profile'
              ? 'text-[#587c94] border-[#587c94]'
              : 'text-on-surface-variant hover:text-[#587c94] border-transparent'
          }`}
        >
          User Profile
        </button>
      </div>

      {activeSubTab === 'Workspace Settings' ? (
        <div className="w-full max-w-4xl flex flex-col gap-stack-lg mx-auto text-left">
          {/* Breadcrumbs & Title */}
          <div className="flex flex-col gap-stack-sm mb-stack-md">
            <nav className="flex items-center gap-stack-xs font-mono text-[11px] text-on-surface-variant">
              <a className="hover:text-primary transition-colors cursor-pointer text-[#587c94]">Workspaces</a>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <a className="hover:text-primary transition-colors cursor-pointer text-[#587c94]">default</a>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface font-semibold">Settings</span>
            </nav>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mt-stack-xs">Workspace Settings</h2>
          </div>

          <div className="flex flex-col gap-stack-lg">
            {/* Core Card */}
            <section className="bg-white border border-outline-variant rounded-xl p-stack-lg flex flex-col gap-stack-md shadow-sm">
              <div className="border-b border-outline-variant pb-stack-sm mb-stack-xs">
                <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-stack-xs">
                  <span className="material-symbols-outlined text-outline">tune</span>
                  Core Configuration
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
                <div className="flex flex-col gap-stack-xs">
                  <label className="font-mono text-xs text-on-surface-variant font-semibold">Identifier</label>
                  <input
                    className="bg-surface-container-low border border-outline-variant rounded px-stack-sm py-1.5 font-mono text-xs text-on-surface-variant focus:outline-none cursor-not-allowed"
                    readOnly
                    type="text"
                    value="default"
                  />
                  <p className="text-xs text-outline mt-1">The system identifier cannot be changed after creation.</p>
                </div>
                <div className="flex flex-col gap-stack-xs">
                  <label className="font-mono text-xs text-on-surface-variant font-semibold">Region Deployment</label>
                  <div className="relative">
                    <select
                      className="appearance-none w-full bg-white border border-outline-variant rounded px-stack-sm py-1.5 font-body-md text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                    >
                      <option value="us-east-1">US-East-1 (N. Virginia)</option>
                      <option value="us-west-2">US-West-2 (Oregon)</option>
                      <option value="eu-central-1">EU-Central-1 (Frankfurt)</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-outline">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Health checks card */}
            <section className="bg-white border border-outline-variant rounded-xl p-stack-lg flex flex-col gap-stack-md shadow-sm">
              <div className="border-b border-outline-variant pb-stack-sm mb-stack-xs">
                <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-stack-xs">
                  <span className="material-symbols-outlined text-outline">favorite</span>
                  Health Checks
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
                <div className="flex flex-col gap-stack-xs">
                  <label className="font-mono text-xs text-on-surface-variant font-semibold">Probe Timeout (ms)</label>
                  <div className="relative flex items-center">
                    <input
                      className="w-full bg-white border border-outline-variant rounded pl-stack-sm pr-[40px] py-1.5 font-body-md text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
                      type="number"
                      value={probeTimeout}
                      onChange={(e) => setProbeTimeout(parseInt(e.target.value))}
                    />
                    <span className="absolute right-3 text-outline font-mono text-xs select-none">ms</span>
                  </div>
                </div>
                <div className="flex flex-col gap-stack-xs">
                  <label className="font-mono text-xs text-on-surface-variant font-semibold">Check Frequency (sec)</label>
                  <div className="relative flex items-center">
                    <input
                      className="w-full bg-white border border-outline-variant rounded pl-stack-sm pr-[40px] py-1.5 font-body-md text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
                      type="number"
                      value={checkFrequency}
                      onChange={(e) => setCheckFrequency(parseInt(e.target.value))}
                    />
                    <span className="absolute right-3 text-outline font-mono text-xs select-none">sec</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Integrations card */}
            <section className="bg-white border border-outline-variant rounded-xl p-stack-lg flex flex-col gap-stack-md shadow-sm">
              <div className="border-b border-outline-variant pb-stack-sm mb-stack-xs">
                <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-stack-xs">
                  <span className="material-symbols-outlined text-outline">integration_instructions</span>
                  Integrations
                </h3>
              </div>
              <div className="flex flex-col gap-stack-md">
                <div className="flex items-center justify-between p-stack-md border border-outline-variant rounded bg-surface-container-low">
                  <div className="flex items-center gap-stack-md">
                    <div className="w-10 h-10 rounded bg-[#4A154B] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                        tag
                      </span>
                    </div>
                    <div>
                      <h4 className="font-headline-sm text-headline-sm text-on-surface">Slack Webhook</h4>
                      <p className="text-xs text-on-surface-variant">Send alerts directly to a designated Slack channel.</p>
                    </div>
                  </div>
                  
                  {/* Slider Toggle */}
                  <label className="relative inline-block w-10 h-5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSlackEnabled}
                      onChange={() => setIsSlackEnabled(!isSlackEnabled)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-[#e3e7eb] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[14px] after:w-[14px] after:transition-all peer-checked:bg-[#587c94]"></div>
                  </label>
                </div>

                {isSlackEnabled && (
                  <div className="flex flex-col gap-stack-xs mt-stack-sm transition-opacity duration-300">
                    <label className="font-mono text-xs text-on-surface-variant font-semibold">Webhook URL</label>
                    <input
                      className="w-full bg-white border border-outline-variant rounded px-stack-sm py-1.5 font-mono text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
                      type="password"
                      value={slackUrl}
                      onChange={(e) => setSlackUrl(e.target.value)}
                    />
                    <p className="text-xs text-outline mt-1">Requires standard Slack Incoming Webhook format.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Footer Actions */}
          <div className="mt-stack-lg pt-stack-lg border-t border-outline-variant flex justify-end gap-stack-md items-center">
            <button className="px-stack-lg py-1.5 rounded border border-outline-variant bg-white text-on-surface hover:bg-surface-container-low transition-colors duration-200 cursor-pointer text-sm">
              Cancel Changes
            </button>
            <button className="px-stack-lg py-1.5 rounded bg-[#113346] text-white hover:brightness-110 transition-all duration-200 shadow-sm flex items-center gap-stack-xs cursor-pointer text-sm font-semibold">
              <span className="material-symbols-outlined text-[18px]">save</span>
              Save Configuration
            </button>
          </div>
        </div>
      ) : (
        <ProfileSettings />
      )}
    </div>
  );
};

export default ProjectSettings;
