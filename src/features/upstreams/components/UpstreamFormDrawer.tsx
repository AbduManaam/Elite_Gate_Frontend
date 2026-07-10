import React, { useState } from 'react';
import { UpstreamRecord } from '../api/types';
import { UpstreamInput } from '../api/upstreamsApi';
import { useCreateUpstreamMutation, useUpdateUpstreamMutation } from '../hooks/useUpstreams';
import { toApiError } from '../../../shared/api/apiError';
import { ProtocolSelector } from './ProtocolSelector';
import { UpstreamReviewStep } from './UpstreamReviewStep';

interface UpstreamFormDrawerProps {
    readonly projectId: string;
    readonly mode: 'create' | 'edit';
    readonly upstream?: UpstreamRecord; // required when mode === 'edit'
    readonly onClose: () => void;
}

export const UpstreamFormDrawer: React.FC<UpstreamFormDrawerProps> = ({
    projectId,
    mode,
    upstream,
    onClose,
}) => {
    const createUpstream = useCreateUpstreamMutation(projectId);
    const updateUpstream = useUpdateUpstreamMutation(projectId);

    // Form fields
    const [form, setForm] = useState<UpstreamInput>({
        name: upstream?.name ?? '',
        target_url: upstream?.target_url ?? '',
        protocol: (upstream?.protocol as 'http' | 'grpc') ?? 'http',
        health_path: upstream?.health_path ?? '',
        enabled: upstream?.enabled ?? true,
        lb_strategy: upstream?.lb_strategy ?? 'round_robin',
    });

    // Stepper state (only used in create mode)
    const [step, setStep] = useState<number>(1);

    const mutation = mode === 'create' ? createUpstream : updateUpstream;
    const apiError = mutation.error ? toApiError(mutation.error) : null;

    const handleNextStep = () => {
        if (step === 2) {
            // Validation before proceeding to review
            if (!form.name.trim() || !form.target_url.trim()) return;
        }
        setStep((s) => s + 1);
    };

    const handleBackStep = () => {
        setStep((s) => s - 1);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'create') {
            createUpstream.mutate(form, { onSuccess: onClose });
        } else if (upstream) {
            updateUpstream.mutate({ id: upstream.id, input: form }, { onSuccess: onClose });
        }
    };

    const isStep2Valid = form.name.trim().length > 0 && form.target_url.trim().length > 0;

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col h-full w-screen sm:w-[450px] max-w-full bg-white text-left justify-between"
        >
            {/* Header Area */}
            <div className="flex flex-col border-b border-outline-variant">
                <div className="flex justify-between items-center p-lg">
                    <div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface">
                            {mode === 'create' ? 'New Gateway Service (Upstream)' : 'Edit Upstream'}
                        </h3>
                        {mode === 'edit' && (
                            <p className="text-xs text-on-surface-variant mt-0.5">
                                Modify your backend destination host settings.
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 hover:bg-surface-container rounded cursor-pointer transition-colors text-on-surface-variant"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                {/* Steps indicator for Create Mode */}
                {mode === 'create' && (
                    <div className="flex items-center justify-between px-lg py-sm border-t border-outline-variant bg-slate-50/50">
                        {/* Step 1 */}
                        <div className="flex items-center gap-xs">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                step > 1 
                                    ? 'bg-[#113346] text-white' 
                                    : step === 1 
                                        ? 'bg-[#113346] text-white ring-2 ring-[#113346]/20' 
                                        : 'bg-surface-container-high text-on-surface-variant'
                            }`}>
                                {step > 1 ? <span className="material-symbols-outlined text-[12px]">check</span> : '1'}
                            </div>
                            <span className={`text-[11px] font-semibold ${step === 1 ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                                Protocol
                            </span>
                        </div>

                        {/* Line 1 */}
                        <div className={`flex-1 h-[2px] mx-sm ${step > 1 ? 'bg-[#113346]' : 'bg-outline-variant'}`} />

                        {/* Step 2 */}
                        <div className="flex items-center gap-xs">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                step > 2 
                                    ? 'bg-[#113346] text-white' 
                                    : step === 2 
                                        ? 'bg-[#113346] text-white ring-2 ring-[#113346]/20' 
                                        : 'bg-surface-container-high text-on-surface-variant'
                            }`}>
                                {step > 2 ? <span className="material-symbols-outlined text-[12px]">check</span> : '2'}
                            </div>
                            <span className={`text-[11px] font-semibold ${step === 2 ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                                Configuration
                            </span>
                        </div>

                        {/* Line 2 */}
                        <div className={`flex-1 h-[2px] mx-sm ${step > 2 ? 'bg-[#113346]' : 'bg-outline-variant'}`} />

                        {/* Step 3 */}
                        <div className="flex items-center gap-xs">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                step === 3 
                                    ? 'bg-[#113346] text-white ring-2 ring-[#113346]/20' 
                                    : 'bg-surface-container-high text-on-surface-variant'
                            }`}>
                                3
                            </div>
                            <span className={`text-[11px] font-semibold ${step === 3 ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                                Review
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-lg flex flex-col gap-md">
                {mode === 'create' ? (
                    /* Create Stepper Steps */
                    <>
                        {step === 1 && (
                            <ProtocolSelector
                                selected={form.protocol}
                                onChange={(p) => setForm((f) => ({ ...f, protocol: p }))}
                            />
                        )}

                        {step === 2 && (
                            <div className="flex flex-col gap-md">
                                <h4 className="font-semibold text-sm text-on-surface">Configuration</h4>
                                
                                <label className="flex flex-col gap-xs text-xs font-semibold text-on-surface-variant">
                                    Service Name *
                                    <input
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                        placeholder="e.g. user-service"
                                        className="border border-outline-variant rounded-lg px-3 py-2 font-sans font-normal text-sm outline-none focus:border-[#587c94] bg-white text-on-surface"
                                    />
                                </label>

                                <label className="flex flex-col gap-xs text-xs font-semibold text-on-surface-variant">
                                    Protocol
                                    <select
                                        value={form.protocol}
                                        onChange={(e) => setForm((f) => ({ ...f, protocol: e.target.value as 'http' | 'grpc' }))}
                                        className="border border-outline-variant rounded-lg px-3 py-2 font-sans font-normal text-sm outline-none focus:border-[#587c94] bg-white text-on-surface"
                                    >
                                        <option value="http">HTTP / HTTPS</option>
                                        <option value="grpc">gRPC</option>
                                    </select>
                                </label>

                                <label className="flex flex-col gap-xs text-xs font-semibold text-on-surface-variant">
                                    Target Host URL (Base Destination) *
                                    <input
                                        required
                                        value={form.target_url}
                                        onChange={(e) => setForm((f) => ({ ...f, target_url: e.target.value }))}
                                        placeholder="e.g. http://10.0.0.5:8080 or http://my-service.local"
                                        className="border border-outline-variant rounded-lg px-3 py-2 font-mono font-normal text-sm outline-none focus:border-[#587c94] bg-white text-on-surface"
                                    />
                                </label>

                                <label className="flex flex-col gap-xs text-xs font-semibold text-on-surface-variant">
                                    Active Health Check Path (Optional)
                                    <input
                                        value={form.health_path}
                                        onChange={(e) => setForm((f) => ({ ...f, health_path: e.target.value }))}
                                        placeholder="e.g. /healthz or /health"
                                        className="border border-outline-variant rounded-lg px-3 py-2 font-mono font-normal text-sm outline-none focus:border-[#587c94] bg-white text-on-surface"
                                    />
                                </label>

                                <label className="flex flex-col gap-xs text-xs font-semibold text-on-surface-variant">
                                    Load Balancer Strategy
                                    <select
                                        value={form.lb_strategy}
                                        onChange={(e) => setForm((f) => ({ ...f, lb_strategy: e.target.value }))}
                                        className="border border-outline-variant rounded-lg px-3 py-2 font-sans font-normal text-sm outline-none focus:border-[#587c94] bg-white text-on-surface"
                                    >
                                        <option value="round_robin">Round Robin</option>
                                        <option value="least_conn">Least Connections</option>
                                    </select>
                                </label>

                                <div className="flex items-center gap-md mt-sm bg-slate-50 border border-outline-variant/60 rounded-lg p-md">
                                    <input
                                        type="checkbox"
                                        id="upstream-enabled-create"
                                        checked={form.enabled}
                                        onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))}
                                        className="w-4 h-4 rounded text-[#113346] accent-[#113346] cursor-pointer"
                                    />
                                    <label htmlFor="upstream-enabled-create" className="text-xs font-medium text-on-surface cursor-pointer select-none">
                                        Enable Gateway Service immediately
                                    </label>
                                </div>
                            </div>
                        )}

                        {step === 3 && <UpstreamReviewStep form={form} />}
                    </>
                ) : (
                    /* Edit Simple Form Mode */
                    <div className="flex flex-col gap-md">
                        <label className="flex flex-col gap-xs text-xs font-semibold text-on-surface-variant">
                            Service Name *
                            <input
                                required
                                value={form.name}
                                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                placeholder="e.g. user-service"
                                className="border border-outline-variant rounded-lg px-3 py-2 font-sans font-normal text-sm outline-none focus:border-[#587c94] bg-white text-on-surface"
                            />
                        </label>

                        <label className="flex flex-col gap-xs text-xs font-semibold text-on-surface-variant">
                            Protocol
                            <select
                                value={form.protocol}
                                onChange={(e) => setForm((f) => ({ ...f, protocol: e.target.value as 'http' | 'grpc' }))}
                                className="border border-outline-variant rounded-lg px-3 py-2 font-sans font-normal text-sm outline-none focus:border-[#587c94] bg-white text-on-surface"
                            >
                                <option value="http">HTTP / HTTPS</option>
                                <option value="grpc">gRPC</option>
                            </select>
                        </label>

                        <label className="flex flex-col gap-xs text-xs font-semibold text-on-surface-variant">
                            Target Host URL (Base Destination) *
                            <input
                                required
                                value={form.target_url}
                                onChange={(e) => setForm((f) => ({ ...f, target_url: e.target.value }))}
                                placeholder="e.g. http://10.0.0.5:8080 or http://my-service.local"
                                className="border border-outline-variant rounded-lg px-3 py-2 font-mono font-normal text-sm outline-none focus:border-[#587c94] bg-white text-on-surface"
                            />
                        </label>

                        <label className="flex flex-col gap-xs text-xs font-semibold text-on-surface-variant">
                            Active Health Check Path (Optional)
                            <input
                                value={form.health_path}
                                onChange={(e) => setForm((f) => ({ ...f, health_path: e.target.value }))}
                                placeholder="e.g. /healthz or /health"
                                className="border border-outline-variant rounded-lg px-3 py-2 font-mono font-normal text-sm outline-none focus:border-[#587c94] bg-white text-on-surface"
                            />
                        </label>

                        <label className="flex flex-col gap-xs text-xs font-semibold text-on-surface-variant">
                            Load Balancer Strategy
                            <select
                                value={form.lb_strategy}
                                onChange={(e) => setForm((f) => ({ ...f, lb_strategy: e.target.value }))}
                                className="border border-outline-variant rounded-lg px-3 py-2 font-sans font-normal text-sm outline-none focus:border-[#587c94] bg-white text-on-surface"
                            >
                                <option value="round_robin">Round Robin</option>
                                <option value="least_conn">Least Connections</option>
                            </select>
                        </label>

                        <div className="flex items-center gap-md mt-sm bg-slate-50 border border-outline-variant/60 rounded-lg p-md">
                            <input
                                type="checkbox"
                                id="upstream-enabled-edit"
                                checked={form.enabled}
                                onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))}
                                className="w-4 h-4 rounded text-[#113346] accent-[#113346] cursor-pointer"
                            />
                            <label htmlFor="upstream-enabled-edit" className="text-xs font-medium text-on-surface cursor-pointer select-none">
                                Enable Gateway Service
                            </label>
                        </div>
                    </div>
                )}

                {apiError && (
                    <p className="text-error text-xs font-semibold bg-red-50 border border-red-100 rounded-lg p-md mt-sm">
                        {apiError.message}
                    </p>
                )}
            </div>

            {/* Footer Navigation controls */}
            <div className="border-t border-outline-variant p-lg flex justify-between items-center bg-slate-50/50">
                {mode === 'create' ? (
                    <>
                        {/* Left button */}
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
                                onClick={handleBackStep}
                                className="px-md py-2 border border-outline-variant rounded-lg text-xs font-bold text-on-surface hover:bg-surface-container transition-colors cursor-pointer flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                                Back
                            </button>
                        )}

                        {/* Right button */}
                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={handleNextStep}
                                disabled={step === 2 && !isStep2Valid}
                                className="bg-[#113346] text-white px-lg py-2 rounded-lg text-xs font-bold hover:bg-[#123749] transition-all disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                            >
                                Next
                                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={mutation.isPending}
                                className="bg-[#113346] text-white px-lg py-2 rounded-lg text-xs font-bold hover:bg-[#123749] transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                {mutation.isPending ? 'Creating...' : 'Create Upstream'}
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-md py-2 border border-outline-variant rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="bg-[#113346] text-white px-lg py-2 rounded-lg text-xs font-bold hover:bg-[#123749] transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            {mutation.isPending ? 'Saving...' : 'Save Changes'}
                        </button>
                    </>
                )}
            </div>
        </form>
    );
};
