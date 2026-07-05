import React, { useState } from 'react';
import { MOCK_AUDIT_LOGS, AuditLogData } from '../../../shared/mocks/logsMock';

export const AuditLogsPage: React.FC = () => {
  const [actorEmail, setActorEmail] = useState('');
  const [actionType, setActionType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [selectedLogDetails, setSelectedLogDetails] = useState<AuditLogData | null>(null);

  const handleClearFilters = () => {
    setActorEmail('');
    setActionType('');
    setStartDate('');
    setEndDate('');
  };

  const filteredLogs = MOCK_AUDIT_LOGS.filter((log) => {
    const matchesActor = log.actor.toLowerCase().includes(actorEmail.toLowerCase());
    const matchesAction = actionType === '' || log.action.includes(actionType);
    
    // Simplistic date filtering (matching date string prefix)
    let matchesDate = true;
    if (startDate) {
      matchesDate = matchesDate && log.timestamp >= startDate;
    }
    if (endDate) {
      matchesDate = matchesDate && log.timestamp <= endDate;
    }
    
    return matchesActor && matchesAction && matchesDate;
  });

  return (
    <div className="flex-1 flex flex-col w-full gap-stack-lg relative">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-stack-md">
        <div>
          <nav className="flex items-center gap-stack-sm font-body-sm text-xs text-on-surface-variant mb-sm">
            <span className="hover:text-primary cursor-pointer transition-colors">System</span>
            <span className="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Diagnostics</span>
            <span className="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
            <span className="text-on-surface font-semibold">Audit Logs</span>
          </nav>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-stack-xs">Audit Logs</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">System-wide record of administrative and automated actions.</p>
        </div>
        <div className="flex items-center gap-stack-sm">
          <button className="flex items-center gap-stack-xs px-stack-md py-1.5 bg-white border border-outline-variant rounded text-on-surface font-body-sm hover:bg-surface-container-low transition-colors cursor-pointer text-xs font-semibold">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export CSV
          </button>
          <button className="flex items-center gap-stack-xs px-stack-md py-1.5 bg-[#113346] text-on-primary rounded font-body-sm hover:bg-brand-hover transition-colors shadow-sm cursor-pointer text-xs font-semibold text-white">
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Filter Bar Card */}
      <div className="bg-white border border-outline-variant rounded p-stack-md flex flex-col md:flex-row gap-stack-md items-end shadow-sm">
        <div className="w-full md:w-1/4">
          <label className="block text-xs font-semibold text-on-surface-variant mb-stack-xs">Actor Email</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">
              person
            </span>
            <input
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-outline-variant rounded text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-outline-variant outline-none"
              placeholder="Filter by email..."
              type="text"
              value={actorEmail}
              onChange={(e) => setActorEmail(e.target.value)}
            />
          </div>
        </div>
        
        <div className="w-full md:w-1/4">
          <label className="block text-xs font-semibold text-on-surface-variant mb-stack-xs">Action Type</label>
          <div className="relative">
            <select
              className="w-full pl-3 pr-8 py-1.5 bg-white border border-outline-variant rounded text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
            >
              <option value="">All Actions</option>
              <option value="CREATE">CREATE</option>
              <option value="DISABLE">DISABLE</option>
              <option value="REVOKE">REVOKE</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline-variant text-[18px] pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        <div className="w-full md:w-2/4 flex gap-stack-md">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-on-surface-variant mb-stack-xs">Date Range</label>
            <div className="flex items-center gap-stack-sm">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">
                  calendar_today
                </span>
                <input
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-outline-variant rounded text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-on-surface-variant outline-none"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <span className="text-on-surface-variant text-sm">-</span>
              <div className="relative flex-1">
                <input
                  className="w-full px-3 py-1.5 bg-white border border-outline-variant rounded text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-on-surface-variant outline-none"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleClearFilters}
              className="px-stack-md py-1.5 bg-surface-container-low border border-outline-variant rounded text-on-surface hover:bg-surface-variant transition-colors h-[38px] flex items-center justify-center whitespace-nowrap text-xs cursor-pointer font-semibold"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-white border border-outline-variant rounded overflow-hidden flex flex-col flex-1 min-h-[300px] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface-bright border-b border-outline-variant font-semibold text-xs text-on-surface-variant">
                <th className="px-stack-md py-3">Timestamp</th>
                <th className="px-stack-md py-3">Actor</th>
                <th className="px-stack-md py-3">Action</th>
                <th className="px-stack-md py-3">Resource</th>
                <th className="px-stack-md py-3">Status</th>
                <th className="px-stack-md py-3">IP Address</th>
                <th className="px-stack-md py-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs text-on-surface divide-y divide-outline-variant">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-container-lowest transition-colors group cursor-pointer">
                  <td className="px-stack-md py-4 text-on-surface-variant">{log.timestamp}</td>
                  <td className="px-stack-md py-4 font-sans text-sm font-medium">{log.actor}</td>
                  <td className="px-stack-md py-4">
                    <span className="bg-[#587c94]/10 text-[#587c94] px-2 py-1 rounded font-bold text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-stack-md py-4 text-on-surface-variant">{log.resource}</td>
                  <td className="px-stack-md py-4">
                    <div className="flex items-center gap-stack-xs text-sm">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="font-medium text-emerald-700">{log.status}</span>
                    </div>
                  </td>
                  <td className="px-stack-md py-4 text-on-surface-variant">{log.ipAddress}</td>
                  <td className="px-stack-md py-4 text-right">
                    <button
                      onClick={() => setSelectedLogDetails(log)}
                      className="text-[#587c94] hover:text-[#113346] font-sans font-semibold flex items-center justify-end gap-stack-xs ml-auto opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">data_object</span>
                      View JSON
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-auto border-t border-outline-variant bg-surface-bright px-stack-lg py-stack-sm flex items-center justify-between text-xs text-on-surface-variant">
          <span>Showing {filteredLogs.length} of {MOCK_AUDIT_LOGS.length} entries</span>
          <div className="flex items-center gap-stack-xs">
            <button className="p-1 text-outline hover:text-on-surface disabled:opacity-50 transition-colors" disabled>
              <span className="material-symbols-outlined text-[20px] text-[#587c94]">chevron_left</span>
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded bg-[#113346] text-white">1</button>
            <button className="p-1 text-outline hover:text-on-surface transition-colors" disabled>
              <span className="material-symbols-outlined text-[20px] text-[#587c94]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* JSON Inspector Modal */}
      {selectedLogDetails && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-lg backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-outline-variant rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Log Details</h3>
              <button
                onClick={() => setSelectedLogDetails(null)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1 hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-lg overflow-y-auto bg-slate-50 flex-1 font-mono text-xs text-slate-800">
              <pre className="whitespace-pre-wrap">{JSON.stringify(selectedLogDetails.details, null, 2)}</pre>
            </div>
            <div className="p-lg border-t border-outline-variant flex justify-end bg-surface">
              <button
                onClick={() => setSelectedLogDetails(null)}
                className="px-lg py-1.5 rounded bg-[#113346] text-white hover:bg-opacity-90 transition-colors text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogsPage;
