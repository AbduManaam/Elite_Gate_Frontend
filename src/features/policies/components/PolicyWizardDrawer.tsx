import React, { useState } from 'react';
import { useCreatePolicyMutation } from '../hooks/usePolicies';
import { PolicyInput } from '../api/policiesApi';
import { PolicyBasicsStep } from './wizard/PolicyBasicsStep';
import { PolicyTrafficRulesStep } from './wizard/PolicyTrafficRulesStep';
import { PolicyReviewStep } from './wizard/PolicyReviewStep';
import { toApiError } from '../../../shared/api/apiError';

interface PolicyWizardDrawerProps {
  readonly projectId: string;
  readonly onClose: () => void;
  readonly onSuccess?: () => void;
}

export const PolicyWizardDrawer: React.FC<PolicyWizardDrawerProps> = ({ projectId, onClose, onSuccess }) => {
  const createPolicy = useCreatePolicyMutation(projectId);
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState<PolicyInput>({
    name: '',
    auth_required: false,
    rate_limit_rpm: 0,
    allowed_origins: [],
    allowed_roles: [],
    allowed_scopes: [],
    ip_allowlist: [],
    ip_blocklist: [],
  });

  const [enableRateLimiting, setEnableRateLimiting] = useState(false);

  const handleFieldChange = (fields: Partial<PolicyInput>) => {
    setForm((f) => ({ ...f, ...fields }));
  };

  const handleBasicsChange = (fields: Partial<{ name: string; authRequired: boolean; enableRateLimiting: boolean }>) => {
    if (fields.name !== undefined) handleFieldChange({ name: fields.name });
    if (fields.authRequired !== undefined) handleFieldChange({ auth_required: fields.authRequired });
    if (fields.enableRateLimiting !== undefined) {
      setEnableRateLimiting(fields.enableRateLimiting);
      if (!fields.enableRateLimiting) {
        handleFieldChange({ rate_limit_rpm: 0 });
      } else if (form.rate_limit_rpm === 0) {
        handleFieldChange({ rate_limit_rpm: 100 });
      }
    }
  };

  const handleNext = () => {
    if (step === 1 && !form.name.trim()) {
      setErrorMsg('Policy Name is required.');
      return;
    }
    setErrorMsg(null);
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrorMsg(null);
    setStep((s) => s - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Final payload construction
    const payload: PolicyInput = {
      ...form,
      rate_limit_rpm: enableRateLimiting ? form.rate_limit_rpm : 0,
    };

    createPolicy.mutate(payload, {
      onSuccess: () => {
        if (onSuccess) onSuccess();
        else onClose();
      },
      onError: (err) => {
        setErrorMsg(toApiError(err).message || 'Failed to create policy.');
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
      <form
        onSubmit={handleSubmit}
        className="bg-white h-full w-screen sm:w-[560px] max-w-full shadow-2xl border-l border-outline-variant animate-slide-in flex flex-col justify-between"
      >
        {/* Header & Steps Indicator */}
        <div className="flex flex-col border-b border-outline-variant">
          <div className="flex justify-between items-center p-lg">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Create Policy</h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 hover:bg-surface-container rounded cursor-pointer text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="flex items-center justify-between px-lg py-sm border-t border-outline-variant bg-slate-50/50">
            {/* Step 1 */}
            <div className="flex items-center gap-xs">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step > 1
                  ? 'bg-[#113346] text-white'
                  : step === 1
                    ? 'bg-[#113346] text-white ring-2 ring-[#113346]/20'
                    : 'bg-surface-container-high text-on-surface-variant'
                  }`}
              >
                {step > 1 ? <span className="material-symbols-outlined text-[12px]">check</span> : '1'}
              </div>
              <span className={`text-[11px] font-semibold ${step === 1 ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                Basics
              </span>
            </div>

            <div className={`flex-1 h-[2px] mx-sm ${step > 1 ? 'bg-[#113346]' : 'bg-outline-variant'}`} />

            {/* Step 2 */}
            <div className="flex items-center gap-xs">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step > 2
                  ? 'bg-[#113346] text-white'
                  : step === 2
                    ? 'bg-[#113346] text-white ring-2 ring-[#113346]/20'
                    : 'bg-surface-container-high text-on-surface-variant'
                  }`}
              >
                {step > 2 ? <span className="material-symbols-outlined text-[12px]">check</span> : '2'}
              </div>
              <span className={`text-[11px] font-semibold ${step === 2 ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                Traffic Rules
              </span>
            </div>

            <div className={`flex-1 h-[2px] mx-sm ${step > 2 ? 'bg-[#113346]' : 'bg-outline-variant'}`} />

            {/* Step 3 */}
            <div className="flex items-center gap-xs">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 3
                  ? 'bg-[#113346] text-white ring-2 ring-[#113346]/20'
                  : 'bg-surface-container-high text-on-surface-variant'
                  }`}
              >
                3
              </div>
              <span className={`text-[11px] font-semibold ${step === 3 ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                Review
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-lg flex flex-col gap-md">
          {step === 1 && (
            <PolicyBasicsStep
              name={form.name}
              authRequired={form.auth_required}
              enableRateLimiting={enableRateLimiting}
              onChange={handleBasicsChange}
            />
          )}

          {step === 2 && (
            <PolicyTrafficRulesStep
              rate_limit_rpm={form.rate_limit_rpm}
              enableRateLimiting={enableRateLimiting}
              allowed_origins={form.allowed_origins ?? []}
              allowed_roles={form.allowed_roles ?? []}
              allowed_scopes={form.allowed_scopes ?? []}
              ip_allowlist={form.ip_allowlist ?? []}
              ip_blocklist={form.ip_blocklist ?? []}
              onChange={handleFieldChange}
            />
          )}

          {step === 3 && <PolicyReviewStep form={form} />}

          {errorMsg && (
            <p className="text-error text-xs font-semibold bg-red-50 border border-red-100 rounded-lg p-md mt-sm">
              {errorMsg}
            </p>
          )}
        </div>

        {/* Footer controls */}
        <div className="border-t border-outline-variant p-lg flex justify-between items-center bg-slate-50/50">
          {step === 1 ? (
            <button
              type="button"
              onClick={onClose}
              className="px-md py-2 border border-outline-variant rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              onClick={handleBack}
              className="px-md py-2 border border-outline-variant rounded-lg text-xs font-bold text-on-surface hover:bg-surface-container transition-colors cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              Back
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-[#113346] text-white px-lg py-2 rounded-lg text-xs font-bold hover:bg-[#123749] transition-all flex items-center gap-1 cursor-pointer"
            >
              Next
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={createPolicy.isPending}
              className="bg-[#113346] text-white px-lg py-2 rounded-lg text-xs font-bold hover:bg-[#123749] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {createPolicy.isPending ? 'Creating...' : 'Create Policy'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
