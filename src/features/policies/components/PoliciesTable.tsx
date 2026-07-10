import React, { useState } from 'react';
import { PolicyRecord } from '../api/policiesApi';
import { PolicyRow } from './PolicyRow';

interface PoliciesTableProps {
  readonly policies: PolicyRecord[];
  readonly selectedPolicyId: string | null;
  readonly onSelectPolicy: (policy: PolicyRecord) => void;
  readonly onEditPolicy: (policy: PolicyRecord) => void;
  readonly onDeletePolicy: (policy: PolicyRecord) => void;
  readonly onDuplicatePolicy: (policy: PolicyRecord) => void;
  readonly canManage: boolean;
}

export const PoliciesTable: React.FC<PoliciesTableProps> = ({
  policies,
  selectedPolicyId,
  onSelectPolicy,
  onEditPolicy,
  onDeletePolicy,
  onDuplicatePolicy,
  canManage,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalPages = Math.ceil(policies.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = Math.min(startIdx + rowsPerPage, policies.length);
  const displayedPolicies = policies.slice(startIdx, endIdx);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(e.target.value) || 10);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((p) => p + 1);
    }
  };

  return (
    <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col w-full">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant font-semibold text-xs text-on-surface-variant uppercase tracking-wider">
              <th className="py-3 px-md w-[80px]">Status</th>
              <th className="py-3 px-md">Policy Name</th>
              <th className="py-3 px-md">Authentication</th>
              <th className="py-3 px-md">Rate Limit</th>
              <th className="py-3 px-md">Allowed Origins</th>
              <th className="py-3 px-md">Roles</th>
              <th className="py-3 px-md">Scopes</th>
              <th className="py-3 px-md w-[50px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            {displayedPolicies.map((p) => (
              <PolicyRow
                key={p.id}
                policy={p}
                isSelected={p.id === selectedPolicyId}
                onSelect={() => onSelectPolicy(p)}
                onEdit={() => onEditPolicy(p)}
                onDelete={() => onDeletePolicy(p)}
                onDuplicate={() => onDuplicatePolicy(p)}
                canManage={canManage}
              />
            ))}
            {policies.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-on-surface-variant text-sm bg-white font-sans">
                  No policies match your filters or search query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {policies.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-sm px-lg py-md border-t border-outline-variant/60 text-xs text-on-surface-variant bg-slate-50/50">
          <div className="flex items-center gap-sm">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="border border-outline-variant rounded px-2 py-1 bg-white text-on-surface font-sans outline-none focus:border-[#587c94]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="flex items-center gap-md">
            <span>
              {startIdx + 1}–{endIdx} of {policies.length}
            </span>
            <div className="flex gap-xs">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-1 border border-outline-variant rounded hover:bg-surface-container disabled:opacity-40 transition-colors cursor-pointer shrink-0 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[16px] leading-none">chevron_left</span>
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-1 border border-outline-variant rounded hover:bg-surface-container disabled:opacity-40 transition-colors cursor-pointer shrink-0 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[16px] leading-none">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
