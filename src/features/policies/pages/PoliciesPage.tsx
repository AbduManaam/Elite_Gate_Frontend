import React, { useState } from 'react';

interface PluginCard {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly icon: string;
  readonly isInitiallyActive: boolean;
}

export const PoliciesPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'Plugins' | string>('Plugins');
  
  const [plugins, setPlugins] = useState<readonly PluginCard[]>([
    {
      id: 'key-auth',
      name: 'Key Authentication',
      description: 'Require clients to authenticate via API Keys.',
      icon: 'security',
      isInitiallyActive: true
    },
    {
      id: 'rate-limiting',
      name: 'Rate Limiting',
      description: 'Limit incoming requests per client IP.',
      icon: 'traffic',
      isInitiallyActive: true
    },
    {
      id: 'cors',
      name: 'CORS',
      description: 'Configure Cross-Origin Resource Sharing headers.',
      icon: 'lock_open',
      isInitiallyActive: false
    },
    {
      id: 'datadog-logs',
      name: 'Datadog Logs',
      description: 'Export detailed analytics and logs to Datadog.',
      icon: 'visibility',
      isInitiallyActive: false
    }
  ]);

  const [toggledStates, setToggledStates] = useState<Record<string, boolean>>(
    plugins.reduce((acc, plugin) => ({ ...acc, [plugin.id]: plugin.isInitiallyActive }), {})
  );

  const handleToggle = (id: string) => {
    setToggledStates((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-xl">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface mb-2">Plugins &amp; Policies</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Choose and configure plugins to enhance your gateway.</p>
        </div>
        <button className="bg-[#113346] hover:bg-[#123749] text-white px-lg py-2 rounded font-medium transition-colors flex items-center gap-2 cursor-pointer text-sm">
          <span className="material-symbols-outlined text-[18px]">add</span> Add Plugin
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-outline-variant mb-xl gap-lg">
        <button
          onClick={() => setActiveSubTab('Overview')}
          className={`px-lg py-sm font-semibold text-sm transition-colors cursor-pointer border-b-2 ${
            activeSubTab === 'Overview'
              ? 'text-[#587c94] border-[#587c94]'
              : 'text-on-surface-variant hover:text-[#587c94] border-transparent'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveSubTab('Plugins')}
          className={`px-lg py-sm font-semibold text-sm transition-colors cursor-pointer border-b-2 ${
            activeSubTab === 'Plugins'
              ? 'text-[#587c94] border-[#587c94]'
              : 'text-on-surface-variant hover:text-[#587c94] border-transparent'
          }`}
        >
          Plugins
        </button>
        <button
          onClick={() => setActiveSubTab('Consumers')}
          className={`px-lg py-sm font-semibold text-sm transition-colors cursor-pointer border-b-2 ${
            activeSubTab === 'Consumers'
              ? 'text-[#587c94] border-[#587c94]'
              : 'text-on-surface-variant hover:text-[#587c94] border-transparent'
          }`}
        >
          Consumers
        </button>
      </div>

      {/* Plugins Grid */}
      {activeSubTab === 'Plugins' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
          {plugins.map((plugin) => {
            const isActive = toggledStates[plugin.id];
            return (
              <div
                key={plugin.id}
                className={`bg-white border rounded-xl p-lg transition-all duration-300 shadow-sm relative ${
                  isActive ? 'border-l-4 border-l-[#587c94] border-outline-variant' : 'border-outline-variant border-l-1'
                }`}
              >
                <div className="flex justify-between items-start mb-md">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-[#587c94]/10 text-[#587c94]' : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[24px]"
                      style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {plugin.icon}
                    </span>
                  </div>
                  
                  {/* Slider Toggle */}
                  <label className="relative inline-block w-10 h-5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => handleToggle(plugin.id)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-[#e3e7eb] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[14px] after:w-[14px] after:transition-all peer-checked:bg-[#587c94]"></div>
                  </label>
                </div>
                
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">{plugin.name}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{plugin.description}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-xl border border-dashed border-outline-variant rounded-xl text-center text-on-surface-variant font-medium bg-white shadow-sm">
          <span className="material-symbols-outlined text-[48px] text-outline mb-sm block">hourglass_empty</span>
          {activeSubTab} Screen is under active backend development.
        </div>
      )}
    </div>
  );
};

export default PoliciesPage;
