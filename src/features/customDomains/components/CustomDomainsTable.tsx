import React, { useState } from 'react';
import { CustomDomain } from '../api/domain.types';
import { DomainStatusBadge, RoutingStatusBadge } from './DomainStatusBadge';
import { CopyableText } from '../../../shared/components/ui/CopyableText';

interface CustomDomainsTableProps {
  domains: CustomDomain[];
  canVerify: boolean;
  canCheckRouting: boolean;
  canActivate: boolean;
  canDelete: boolean;
  onVerify: (domain: CustomDomain) => void;
  onCheckRouting: (domain: CustomDomain) => void;
  onActivate: (domain: CustomDomain) => void;
  onDelete: (domain: CustomDomain) => void;
  pendingActionId: string | null;
}

function formatRoutingError(error?: string): string {
  if (!error) return '';
  if (error.includes('dial tcp') || error.includes('lookup') || error.includes('no such host')) {
    return 'CNAME record target does not resolve or match the expected gateway.';
  }
  return error;
}

export const CustomDomainsTable: React.FC<CustomDomainsTableProps> = ({
  domains,
  canVerify,
  canCheckRouting,
  canActivate,
  canDelete,
  onVerify,
  onCheckRouting,
  onActivate,
  onDelete,
  pendingActionId,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full overflow-x-auto border border-outline-variant rounded-xl bg-white shadow-xs">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-outline-variant text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            <th className="py-3 px-4">Hostname</th>
            <th className="py-3 px-4">Ownership Status</th>
            <th className="py-3 px-4">Routing Status</th>
            <th className="py-3 px-4">Created Date</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant">
          {domains.map((domain) => {
            const isExpanded = expandedId === domain.id;
            const isPendingThis = pendingActionId === domain.id;

            return (
              <React.Fragment key={domain.id}>
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-on-surface">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleExpand(domain.id)}
                        type="button"
                        className="material-symbols-outlined text-[18px] text-outline hover:text-on-surface cursor-pointer"
                        title="Toggle Details"
                      >
                        {isExpanded ? 'expand_more' : 'chevron_right'}
                      </button>
                      <span>{domain.hostname}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <DomainStatusBadge status={domain.status} />
                  </td>
                  <td className="py-3.5 px-4">
                    <RoutingStatusBadge status={domain.routing_status} />
                  </td>
                  <td className="py-3.5 px-4 text-xs text-on-surface-variant">
                    {new Date(domain.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {canVerify && domain.status === 'pending_verification' && (
                        <button
                          onClick={() => onVerify(domain)}
                          disabled={isPendingThis}
                          type="button"
                          className="px-3 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {isPendingThis ? 'Verifying...' : 'Verify Ownership'}
                        </button>
                      )}

                      {canCheckRouting &&
                        domain.status === 'verified' &&
                        (!domain.routing_status || domain.routing_status === 'pending' || domain.routing_status === 'failed') && (
                          <button
                            onClick={() => onCheckRouting(domain)}
                            disabled={isPendingThis}
                            type="button"
                            className="px-3 py-1.5 text-xs font-semibold bg-[#113346] hover:bg-brand-hover text-white rounded-lg transition-all disabled:opacity-50 cursor-pointer"
                          >
                            {isPendingThis ? 'Checking...' : 'Check Routing'}
                          </button>
                        )}

                      {canActivate &&
                        domain.status === 'verified' &&
                        domain.routing_status === 'ready' && (
                          <button
                            onClick={() => onActivate(domain)}
                            disabled={isPendingThis}
                            type="button"
                            className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all disabled:opacity-50 cursor-pointer"
                          >
                            {isPendingThis ? 'Activating...' : 'Activate'}
                          </button>
                        )}

                      {canDelete && (
                        <button
                          onClick={() => onDelete(domain)}
                          disabled={isPendingThis}
                          type="button"
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete domain"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>

                {/* Expandable row */}
                {isExpanded && (
                  <tr className="bg-slate-50/50">
                    <td colSpan={5} className="py-4 px-6 border-t border-b border-outline-variant/60">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                        {/* Left column: DNS Instructions */}
                        <div className="flex flex-col gap-3">
                          {domain.status === 'pending_verification' && (
                            <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-3 flex flex-col gap-2">
                              <span className="font-semibold text-amber-900 font-sans">Ownership Verification (TXT)</span>
                              <div className="flex items-center justify-between">
                                <span className="text-on-surface-variant font-sans">Record Type:</span>
                                <span className="font-mono font-bold">TXT</span>
                              </div>
                              {domain.verification_record_name && (
                                <div className="flex items-center justify-between">
                                  <span className="text-on-surface-variant font-sans">Record Name:</span>
                                  <CopyableText value={domain.verification_record_name} />
                                </div>
                              )}
                              <span className="text-[11px] text-amber-700 italic font-sans mt-1">
                                Secret TXT token was provided during domain creation.
                              </span>
                            </div>
                          )}

                          {(domain.status === 'verified' || domain.status === 'active') && domain.routing_target && (
                            <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-3 flex flex-col gap-2">
                              <span className="font-semibold text-blue-900 font-sans">CNAME Routing Record</span>
                              <div className="flex items-center justify-between">
                                <span className="text-on-surface-variant font-sans">Record Type:</span>
                                <span className="font-mono font-bold">CNAME</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-on-surface-variant font-sans">Record Name:</span>
                                <CopyableText value={domain.hostname} />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-on-surface-variant font-sans">Record Target:</span>
                                <CopyableText value={domain.routing_target} />
                              </div>
                            </div>
                          )}

                          {domain.routing_error && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-[11px]">
                              <strong>Routing Issue:</strong> {formatRoutingError(domain.routing_error)}
                            </div>
                          )}
                        </div>

                        {/* Right column: Domain Details */}
                        <div className="flex flex-col gap-2 bg-white border border-outline-variant p-3 rounded-lg">
                          <span className="font-semibold text-[#113346] border-b pb-1 font-sans">Domain Details</span>
                          <div className="flex justify-between py-1 border-b border-slate-100 font-mono">
                            <span className="text-on-surface-variant font-sans">ID:</span>
                            <span className="text-on-surface">{domain.id}</span>
                          </div>
                          {domain.verified_at && (
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span className="text-on-surface-variant">Verified At:</span>
                              <span>{new Date(domain.verified_at).toLocaleString()}</span>
                            </div>
                          )}
                          {domain.routing_checked_at && (
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span className="text-on-surface-variant">Routing Checked At:</span>
                              <span>{new Date(domain.routing_checked_at).toLocaleString()}</span>
                            </div>
                          )}
                          {domain.activated_at && (
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span className="text-on-surface-variant">Activated At:</span>
                              <span>{new Date(domain.activated_at).toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between py-1">
                            <span className="text-on-surface-variant">Updated At:</span>
                            <span>{new Date(domain.updated_at).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
