import React, { useState } from 'react';
import { MOCK_UPSTREAMS } from '../../../shared/mocks/connectivityMock';

export const UpstreamsList: React.FC = () => {
  const [upstreamSearchQuery, setUpstreamSearchQuery] = useState('');

  // Filtering Upstreams
  const filteredUpstreams = MOCK_UPSTREAMS.filter((upstream) => {
    return upstream.name.toLowerCase().includes(upstreamSearchQuery.toLowerCase()) ||
           upstream.algorithm.toLowerCase().includes(upstreamSearchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">Upstreams</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Manage backend routing destinations and load balancing configurations.
          </p>
        </div>
        <div className="flex gap-md">
          <div className="relative w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              filter_list
            </span>
            <input
              className="w-full pl-9 pr-3 py-1.5 rounded border border-outline-variant bg-white focus:border-[#587c94] focus:ring-2 focus:ring-[#587c94]/10 text-sm outline-none placeholder-on-surface-variant transition-all h-[36px]"
              placeholder="Search upstreams..."
              type="text"
              value={upstreamSearchQuery}
              onChange={(e) => setUpstreamSearchQuery(e.target.value)}
            />
          </div>
          <button className="bg-[#113346] text-white font-bold px-md py-sm rounded hover:bg-[#123749] transition-colors flex items-center gap-sm h-[36px] cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Upstream
          </button>
        </div>
      </div>

      <div className="bg-white border border-outline-variant rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="py-3 px-md font-bold text-[10px] uppercase tracking-wider text-on-surface-variant w-[60px]">Status</th>
              <th className="py-3 px-md font-bold text-[10px] uppercase tracking-wider text-on-surface-variant">Name</th>
              <th className="py-3 px-md font-bold text-[10px] uppercase tracking-wider text-on-surface-variant">Algorithm</th>
              <th className="py-3 px-md font-bold text-[10px] uppercase tracking-wider text-on-surface-variant">Targets</th>
              <th className="py-3 px-md font-bold text-[10px] uppercase tracking-wider text-on-surface-variant">Healthchecks</th>
              <th className="py-3 px-md font-bold text-[10px] uppercase tracking-wider text-on-surface-variant">Latency</th>
              <th className="py-3 px-md font-bold text-[10px] uppercase tracking-wider text-on-surface-variant text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-on-surface divide-y divide-outline-variant">
            {filteredUpstreams.map((upstream) => {
              const statusColorMap = {
                active: 'bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.4)]',
                warning: 'bg-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.4)]',
                error: 'bg-error shadow-[0_0_8px_rgba(186,26,26,0.4)]',
                passive: 'bg-outline-variant'
              };
              
              return (
                <tr key={upstream.name} className="hover:bg-surface-container-low transition-colors group">
                  <td className="py-4 px-md">
                    <div className={`w-2.5 h-2.5 rounded-full ${statusColorMap[upstream.status] || 'bg-slate-400'}`}></div>
                  </td>
                  <td className="py-4 px-md font-medium text-on-surface flex items-center gap-sm">
                    <span className="material-symbols-outlined text-[#587c94] text-[18px]">route</span>
                    {upstream.name}
                  </td>
                  <td className="py-4 px-md text-on-surface-variant">{upstream.algorithm}</td>
                  <td className="py-4 px-md">
                    <span className="inline-flex items-center gap-xs px-2 py-0.5 rounded bg-surface-container text-[#587c94] font-medium border border-[#587c94] text-xs">
                      {upstream.targetsActive} / {upstream.targetsTotal} targets
                    </span>
                  </td>
                  <td className="py-4 px-md text-on-surface-variant">
                    <div className="flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[16px]">
                        {upstream.status === 'warning' ? 'visibility' : 'monitor_heart'}
                      </span>
                      {upstream.healthchecks}
                    </div>
                  </td>
                  <td className={`py-4 px-md font-medium ${upstream.status === 'warning' ? 'text-error' : 'text-on-surface-variant'}`}>
                    {upstream.latency}
                  </td>
                  <td className="py-4 px-md text-right">
                    <button className="text-on-surface-variant hover:text-[#587c94] transition-colors opacity-0 group-hover:opacity-100 p-xs cursor-pointer">
                      <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Table Footer */}
        <div className="bg-surface-container-low border-t border-outline-variant p-sm px-md flex justify-between items-center text-xs">
          <p className="text-on-surface-variant">Showing {filteredUpstreams.length} upstreams</p>
          <div className="flex gap-xs">
            <button className="h-8 w-8 flex items-center justify-center rounded border border-outline-variant bg-white text-outline cursor-not-allowed" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="h-8 w-8 flex items-center justify-center rounded border border-outline-variant bg-white text-outline cursor-not-allowed" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpstreamsList;
