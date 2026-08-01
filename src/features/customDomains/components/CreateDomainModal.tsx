import React, { useState } from 'react';
import { CustomDomain } from '../api/domain.types';
import { CopyableText } from '../../../shared/components/ui/CopyableText';

interface CreateDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (hostname: string) => Promise<CustomDomain>;
  isPending: boolean;
  error: string | null;
}

export const CreateDomainModalContent: React.FC<Omit<CreateDomainModalProps, 'isOpen'>> = ({
  onClose,
  onSubmit,
  isPending,
  error,
}) => {
  const [hostname, setHostname] = useState('');
  const [validationErr, setValidationErr] = useState<string | null>(null);
  const [createdDomain, setCreatedDomain] = useState<CustomDomain | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErr(null);
    const cleaned = hostname.trim().toLowerCase();
    
    const domainRegex = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;
    if (!cleaned) {
      setValidationErr('Hostname is required.');
      return;
    }
    if (!domainRegex.test(cleaned)) {
      setValidationErr('Please enter a valid hostname (e.g. api.customer.com).');
      return;
    }

    try {
      const res = await onSubmit(cleaned);
      setCreatedDomain(res);
    } catch {
      // Error is displayed via error prop
    }
  };

  const handleClose = () => {
    setHostname('');
    setValidationErr(null);
    setCreatedDomain(null);
    onClose();
  };

  const record = createdDomain?.verification_record;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-md backdrop-blur-xs select-none">
      <div className="bg-white rounded-xl border border-outline-variant shadow-2xl w-[520px] max-w-full overflow-hidden">
        <div className="px-6 py-5 border-b border-outline-variant flex justify-between items-center">
          <h3 className="font-semibold text-base text-[#113346] flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">language</span>
            Add Custom Domain
          </h3>
          <button onClick={handleClose} type="button" className="material-symbols-outlined text-outline hover:text-on-surface cursor-pointer text-[20px]">
            close
          </button>
        </div>

        {!createdDomain ? (
          <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
            {(validationErr || error) && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {validationErr || error}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="hostname-input" className="text-xs font-semibold text-on-surface">
                Hostname
              </label>
              <input
                id="hostname-input"
                type="text"
                value={hostname}
                onChange={(e) => setHostname(e.target.value)}
                placeholder="api.customer.com"
                disabled={isPending}
                className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              />
              <span className="text-[11px] text-on-surface-variant">
                Enter the domain or subdomain you wish to map to EliteGate.
              </span>
            </div>

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-outline-variant">
              <button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 text-xs font-semibold bg-[#113346] text-white hover:bg-brand-hover rounded-lg flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isPending && <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>}
                {isPending ? 'Creating...' : 'Add Domain'}
              </button>
            </div>
          </form>
        ) : (
          <div className="px-6 py-5 flex flex-col gap-4">
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg">
              Domain <strong>{createdDomain.hostname}</strong> added successfully!
            </div>

            {record ? (
              <div className="bg-slate-50 border border-outline-variant rounded-lg p-4 flex flex-col gap-3">
                <div className="font-sans font-semibold text-xs text-[#113346]">DNS TXT Verification Record</div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-sans">Record Type:</span>
                  <span className="font-mono font-bold">{record.type}</span>
                </div>
                <div className="flex justify-between items-center gap-2 text-xs">
                  <span className="text-on-surface-variant font-sans shrink-0">Record Name:</span>
                  <CopyableText value={record.name} />
                </div>
                <div className="flex justify-between items-center gap-2 text-xs">
                  <span className="text-on-surface-variant font-sans shrink-0">Record Value:</span>
                  <CopyableText value={record.value} />
                </div>

                <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] rounded flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] shrink-0 text-amber-600">warning</span>
                  <span>
                    <strong>Important:</strong> Copy this TXT value now. For security, it will not be displayed again.
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg">
                Verification record was not returned. Refreshing will not recover the secret value.
              </div>
            )}

            <div className="flex justify-end mt-4 pt-4 border-t border-outline-variant">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2 text-xs font-semibold bg-[#113346] text-white hover:bg-brand-hover rounded-lg cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const CreateDomainModal: React.FC<CreateDomainModalProps> = (props) => {
  if (!props.isOpen) return null;
  return <CreateDomainModalContent key={props.isOpen ? 'open' : 'closed'} {...props} />;
};
