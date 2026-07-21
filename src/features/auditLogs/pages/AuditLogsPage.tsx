import React, { useState } from 'react';
import { useActiveProject } from '../../../shared/hooks/useActiveProject';
import { useAuditLogsQuery } from '../hooks/useAuditLogs';
import { AuditLog } from '../api/auditLogsApi';

export const AuditLogsPage: React.FC = () => {
  const { projectId } = useActiveProject();

  const [actor, setActor] = useState('');
  const [action, setAction] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 20;

  const filters = {
    actor: actor || undefined,
    action: action || undefined,
    dateFrom: startDate || undefined,
    dateTo: endDate || undefined,
    limit: pageSize,
    offset: pageIndex * pageSize,
  };

  const { data, isLoading, refetch } = useAuditLogsQuery(projectId, filters);
  const logs = data?.audit_logs || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  const [selectedLogDetails, setSelectedLogDetails] = useState<AuditLog | null>(null);

  const handleClearFilters = () => {
    setActor('');
    setAction('');
    setStartDate('');
    setEndDate('');
    setPageIndex(0);
  };

  const parseChanges = (changesStr: string) => {
    try {
      return JSON.parse(changesStr);
    } catch {
      return changesStr;
    }
  };

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
          <p className="font-body-md text-body-md text-on-surface-variant">System-wide record of administrative actions.</p>
        </div>
        <div className="flex items-center gap-stack-sm">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-stack-xs px-stack-md py-1.5 bg-[#113346] text-on-primary rounded font-body-sm hover:bg-brand-hover transition-colors shadow-sm cursor-pointer text-xs font-semibold text-white"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Filter Bar Card */}
      <div className="bg-white border border-outline-variant rounded p-stack-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-stack-md items-end shadow-sm">

        {/* Actor (Username) */}
        <div className="sm:col-span-2 lg:col-span-3 min-w-0">
          <label className="block text-xs font-semibold text-on-surface-variant mb-stack-xs">Actor (Username)</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">
              person
            </span>
            <input
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-outline-variant rounded text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-outline-variant outline-none"
              placeholder="Filter by username..."
              type="text"
              value={actor}
              onChange={(e) => {
                setActor(e.target.value);
                setPageIndex(0);
              }}
            />
          </div>
        </div>

        {/* Action Type */}
        <div className="sm:col-span-2 lg:col-span-3 min-w-0">
          <label className="block text-xs font-semibold text-on-surface-variant mb-stack-xs">Action Type</label>
          <div className="relative">
            <select
              className="w-full pl-3 pr-8 py-1.5 bg-white border border-outline-variant rounded text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
              value={action}
              onChange={(e) => {
                setAction(e.target.value);
                setPageIndex(0);
              }}
            >
              <option value="">All Actions</option>
              <optgroup label="Routes">
                <option value="route.create">Route Create</option>
                <option value="route.update">Route Update</option>
                <option value="route.delete">Route Delete</option>
              </optgroup>
              <optgroup label="Policies">
                <option value="policy.create">Policy Create</option>
                <option value="policy.update">Policy Update</option>
                <option value="policy.delete">Policy Delete</option>
              </optgroup>
              <optgroup label="Upstreams">
                <option value="upstream.create">Upstream Create</option>
                <option value="upstream.update">Upstream Update</option>
                <option value="upstream.delete">Upstream Delete</option>
              </optgroup>
              <optgroup label="API Keys">
                <option value="api_key.create">API Key Create</option>
                <option value="api_key.update">API Key Rotate</option>
                <option value="api_key.revoke">API Key Revoke</option>
              </optgroup>
              <optgroup label="Team Collaboration">
                <option value="member.invite">Invite Member</option>
                <option value="member.role_change">Member Role Change</option>
                <option value="member.remove">Remove Member</option>
              </optgroup>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline-variant text-[18px] pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        {/* Start Date */}
        <div className="sm:col-span-1 lg:col-span-2 min-w-0">
          <label className="block text-xs font-semibold text-on-surface-variant mb-stack-xs">Start Date</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">
              calendar_today
            </span>
            <input
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-outline-variant rounded text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-on-surface-variant outline-none"
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPageIndex(0);
              }}
            />
          </div>
        </div>

        {/* End Date */}
        <div className="sm:col-span-1 lg:col-span-2 min-w-0">
          <label className="block text-xs font-semibold text-on-surface-variant mb-stack-xs">End Date</label>
          <input
            className="w-full px-3 py-1.5 bg-white border border-outline-variant rounded text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-on-surface-variant outline-none"
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPageIndex(0);
            }}
          />
        </div>

        {/* Clear Filters */}
        <div className="sm:col-span-2 lg:col-span-2">
          <button
            onClick={handleClearFilters}
            className="w-full px-stack-md py-1.5 bg-surface-container-low border border-outline-variant rounded text-on-surface hover:bg-surface-variant transition-colors h-[38px] flex items-center justify-center whitespace-nowrap text-xs cursor-pointer font-semibold"
          >
            Clear Filters
          </button>
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
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-on-surface-variant font-sans">
                    Loading audit logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-on-surface-variant font-sans">
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-container-lowest transition-colors group cursor-pointer">
                    <td className="px-stack-md py-4 text-on-surface-variant">
                      {log.created_at && !Number.isNaN(new Date(log.created_at).getTime())
                        ? new Date(log.created_at).toLocaleString()
                        : '—'}
                    </td>
                    <td className="px-stack-md py-4 font-sans text-sm font-medium">{log.actor}</td>
                    <td className="px-stack-md py-4">
                      <span className="bg-[#587c94]/10 text-[#587c94] px-2 py-1 rounded font-bold text-[10px]">
                        {(log.action || '').toUpperCase().replace('.', '_')}
                      </span>
                    </td>
                    <td className="px-stack-md py-4 text-on-surface-variant">
                      {(() => {
                        const label = log.entity_label || log.entity_id;
                        const separator = label.startsWith('/') ? '' : '/';
                        return `${log.entity_type}s${separator}${label}`;
                      })()}
                    </td>
                    <td className="px-stack-md py-4">
                      <div className="flex items-center gap-stack-xs text-sm">
                        <div className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                        <span className={`font-medium ${log.status === 'success' ? 'text-emerald-700' : 'text-red-700'}`}>{log.status}</span>
                      </div>
                    </td>
                    <td className="px-stack-md py-4 text-on-surface-variant">{log.ip_address || '—'}</td>
                    <td className="px-stack-md py-4 text-right">
                      <button
                        onClick={() => setSelectedLogDetails(log)}
                        className="text-[#587c94] hover:text-[#113346] font-sans font-semibold flex items-center justify-end gap-stack-xs ml-auto opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity cursor-pointer text-xs"
                      >
                        <span className="material-symbols-outlined text-[16px]">data_object</span>
                        View JSON
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-auto border-t border-outline-variant bg-surface-bright px-stack-lg py-stack-sm flex items-center justify-between text-xs text-on-surface-variant">
          <span>Showing {logs.length} of {total} entries</span>
          <div className="flex items-center gap-stack-xs">
            <button
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              disabled={pageIndex === 0}
              className="p-1 text-outline hover:text-on-surface disabled:opacity-50 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] text-[#587c94]">chevron_left</span>
            </button>
            <span className="font-semibold text-on-surface">Page {pageIndex + 1} of {totalPages || 1}</span>
            <button
              onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
              disabled={pageIndex >= totalPages - 1}
              className="p-1 text-outline hover:text-on-surface disabled:opacity-50 transition-colors cursor-pointer"
            >
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
              <pre className="whitespace-pre-wrap">{JSON.stringify(parseChanges(selectedLogDetails.changes), null, 2)}</pre>
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
