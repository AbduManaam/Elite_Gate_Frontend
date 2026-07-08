import React, { useState } from 'react';
import { UpstreamRecord } from '../api/types';
import { UpstreamInput } from '../api/upstreamsApi';
import { useCreateUpstreamMutation, useUpdateUpstreamMutation } from '../hooks/useUpstreams';
import { toApiError } from '../../../shared/api/apiError';

interface UpstreamFormDrawerProps {
    projectId: string;
    mode: 'create' | 'edit';
    upstream?: UpstreamRecord; // required when mode === 'edit'
    onClose: () => void;
}

export const UpstreamFormDrawer: React.FC<UpstreamFormDrawerProps> = ({ projectId, mode, upstream, onClose }) => {
    const createUpstream = useCreateUpstreamMutation(projectId);
    const updateUpstream = useUpdateUpstreamMutation(projectId);

    const [form, setForm] = useState<UpstreamInput>({
        name: upstream?.name ?? '',
        target_url: upstream?.target_url ?? '',
        protocol: (upstream?.protocol as 'http' | 'grpc') ?? 'http',
        health_path: upstream?.health_path ?? '',
        enabled: upstream?.enabled ?? true,
    });

    const mutation = mode === 'create' ? createUpstream : updateUpstream;
    const apiError = mutation.error ? toApiError(mutation.error) : null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'create') {
            createUpstream.mutate(form, { onSuccess: onClose });
        } else if (upstream) {
            updateUpstream.mutate({ id: upstream.id, input: form }, { onSuccess: onClose });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-md p-lg w-[420px] text-left">
            <h3 className="font-headline-sm text-headline-sm">
                {mode === 'create' ? 'New Gateway Service (Upstream)' : `Edit ${upstream?.name}`}
            </h3>
            <p className="text-xs text-on-surface-variant -mt-sm">
                Configure your backend destination host where requests will be forwarded.
            </p>

            <label className="flex flex-col gap-xs text-sm">
                Service Name
                <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. user-service"
                    className="border border-outline-variant rounded px-2 py-1 outline-none focus:border-[#587c94]"
                />
            </label>

            <label className="flex flex-col gap-xs text-sm">
                Target Host URL (Base Destination)
                <input
                    required
                    value={form.target_url}
                    onChange={(e) => setForm((f) => ({ ...f, target_url: e.target.value }))}
                    placeholder="e.g. http://10.0.0.5:8080 or http://my-service.local"
                    className="border border-outline-variant rounded px-2 py-1 font-mono outline-none focus:border-[#587c94]"
                />
            </label>

            <div className="flex flex-col gap-xs text-sm">
                Protocol
                <div className="flex gap-md mt-1">
                    <label className="flex items-center gap-2 cursor-pointer font-sans">
                        <input
                            type="radio"
                            name="protocol"
                            checked={form.protocol === 'http'}
                            onChange={() => setForm((f) => ({ ...f, protocol: 'http' }))}
                            className="accent-[#113346]"
                        />
                        HTTP / HTTPS
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-sans">
                        <input
                            type="radio"
                            name="protocol"
                            checked={form.protocol === 'grpc'}
                            onChange={() => setForm((f) => ({ ...f, protocol: 'grpc' }))}
                            className="accent-[#113346]"
                        />
                        gRPC
                    </label>
                </div>
            </div>

            <label className="flex flex-col gap-xs text-sm">
                Active Health Check Path (Optional)
                <input
                    value={form.health_path}
                    onChange={(e) => setForm((f) => ({ ...f, health_path: e.target.value }))}
                    placeholder="e.g. /healthz or /health"
                    className="border border-outline-variant rounded px-2 py-1 font-mono outline-none focus:border-[#587c94]"
                />
            </label>

            <div className="flex items-center gap-2 mt-2">
                <input
                    type="checkbox"
                    id="upstream-enabled"
                    checked={form.enabled}
                    onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))}
                    className="accent-[#113346] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="upstream-enabled" className="text-sm cursor-pointer select-none">
                    Enable Gateway Service
                </label>
            </div>

            {apiError && (
                <p className="text-error text-xs">
                    {apiError.kind === 'unknown' && apiError.status === 409
                        ? 'A service with this name already exists.'
                        : apiError.message}
                </p>
            )}

            <div className="flex justify-end gap-sm mt-md">
                <button type="button" onClick={onClose} className="px-3 py-1.5 text-sm text-on-surface-variant">
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="bg-[#113346] text-white px-4 py-1.5 rounded text-sm font-semibold disabled:opacity-50 hover:bg-[#123749] transition-colors cursor-pointer"
                >
                    {mutation.isPending ? 'Saving…' : mode === 'create' ? 'Create Service' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
};
