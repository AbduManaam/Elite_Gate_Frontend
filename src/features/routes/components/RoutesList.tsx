import React, { useState } from 'react';
import { MOCK_ROUTES } from '../../../shared/mocks/connectivityMock';

export const RoutesList: React.FC = () => {
  const [routeSearchQuery, setRouteSearchQuery] = useState('');
  const [routeStatusFilter, setRouteStatusFilter] = useState('Status: All');
  const [routeMethodFilter, setRouteMethodFilter] = useState('Method: All');

  // Filtering Routes
  const filteredRoutes = MOCK_ROUTES.filter((route) => {
    const matchesSearch = route.path.toLowerCase().includes(routeSearchQuery.toLowerCase()) ||
                          route.service.toLowerCase().includes(routeSearchQuery.toLowerCase());
    
    // Status filtering placeholder as status is not fully in model but for UX structure
    const matchesStatus = true; 
    
    const matchesMethod = routeMethodFilter === 'Method: All' || 
                          route.methods.includes(routeMethodFilter);
                          
    return matchesSearch && matchesStatus && matchesMethod;
  });

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-stack-xs">Routes</h2>
          <p className="font-body-md text-body-md text-[#587c94]">Manage API ingress routing rules and policies.</p>
        </div>
        <button className="bg-[#113346] text-white px-stack-md py-stack-sm rounded font-semibold text-xs hover:bg-[#123749] transition-colors flex items-center gap-stack-xs shadow-sm cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Route
        </button>
      </div>

      <div className="bg-white border border-outline-variant rounded-xl flex flex-col overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="p-stack-md border-b border-outline-variant flex gap-stack-md items-center bg-white">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              className="w-full pl-9 pr-3 py-1 text-sm border border-outline-variant rounded focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94] transition-all outline-none"
              placeholder="Search routes..."
              type="text"
              value={routeSearchQuery}
              onChange={(e) => setRouteSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="border border-outline-variant rounded font-body-sm text-sm py-1 pl-2 pr-6 bg-transparent focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94]"
            value={routeStatusFilter}
            onChange={(e) => setRouteStatusFilter(e.target.value)}
          >
            <option>Status: All</option>
            <option>Active</option>
            <option>Disabled</option>
          </select>
          <select
            className="border border-outline-variant rounded font-body-sm text-sm py-1 pl-2 pr-6 bg-transparent focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94]"
            value={routeMethodFilter}
            onChange={(e) => setRouteMethodFilter(e.target.value)}
          >
            <option>Method: All</option>
            <option>GET</option>
            <option>POST</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low font-semibold text-xs text-on-surface-variant sticky top-0 z-10 border-b border-outline-variant">
              <tr>
                <th className="py-3 px-md font-medium">Path</th>
                <th className="py-3 px-md font-medium">Service</th>
                <th className="py-3 px-md font-medium">Methods</th>
                <th className="py-3 px-md font-medium">Protocols</th>
                <th className="py-3 px-md font-medium">Plugins</th>
                <th className="py-3 px-md font-medium text-right">Traffic (24h)</th>
                <th className="py-3 px-md w-[48px]"></th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs text-on-surface divide-y divide-outline-variant">
              {filteredRoutes.map((route) => (
                <tr key={route.path} className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                  <td className="py-4 px-md font-medium text-[#587c94]">{route.path}</td>
                  <td className="py-4 px-md text-on-surface-variant">{route.service}</td>
                  <td className="py-4 px-md">
                    <div className="flex gap-1">
                      {route.methods.map((method) => (
                        <span key={method} className="bg-[#587c94] text-white px-1 py-0.5 rounded font-bold text-[9px]">
                          {method}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-md text-on-surface-variant">{route.protocols.join(', ')}</td>
                  <td className="py-4 px-md">
                    <div className="flex gap-1">
                      {route.plugins.length > 0 ? (
                        route.plugins.map((plugin) => (
                          <span key={plugin} className="border border-outline-variant text-on-surface-variant px-1 py-0.5 rounded text-[9px]">
                            {plugin}
                          </span>
                        ))
                      ) : (
                        <span className="text-outline italic text-[10px]">—</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-md text-right text-on-surface-variant">{route.traffic}</td>
                  <td className="py-4 px-md text-right">
                    <button className="text-outline hover:text-on-surface opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <span className="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-stack-sm px-stack-md border-t border-outline-variant bg-white rounded-b-xl flex justify-between items-center text-on-surface-variant text-xs">
          <span>Showing {filteredRoutes.length} routes</span>
          <div className="flex gap-1">
            <button className="p-1 text-outline cursor-not-allowed" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="p-1 text-outline cursor-not-allowed" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutesList;
