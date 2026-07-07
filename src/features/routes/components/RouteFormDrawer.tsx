import React, { useState, useEffect } from 'react';
import { RouteRecord } from '../api/types';
import { RouteInput } from '../api/routesApi';
import { useCreateRouteMutation, useUpdateRouteMutation } from '../hooks/useRouteMutations';
import { useUpstreamsQuery } from '../../upstreams/hooks/useUpstreams';
import { usePoliciesQuery } from '../../policies/hooks/usePolicies';
import { toApiError } from '../../../shared/api/apiError';

interface RouteFormDrawerProps {
    projectId: string;
    mode: 'create' | 'edit';
    route?: RouteRecord;      // required when mode === 'edit'
    onClose: () => void;
}

const METHOD_OPTIONS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export const RouteFormDrawer: React.FC<RouteFormDrawerProps> = ({ projectId, mode, route, onClose }) => {
    const { data: upstreams } = useUpstreamsQuery(projectId);
    const { data: policies } = usePoliciesQuery(projectId);
    const createRoute = useCreateRouteMutation(projectId);
    const updateRoute = useUpdateRouteMutation(projectId);

    const [form, setForm] = useState<RouteInput>({
        name: route?.name ?? '',
        path: route?.path ?? '',
        upstream_id: route?.upstream_id ?? '',
        policy_id: route?.policy_id ?? null,
        methods: route?.methods ?? ['GET'],
        match_type: (route?.match_type as 'exact' | 'prefix') ?? 'prefix',
        enabled: route?.enabled ?? true,
    });

    // The selected upstream's protocol drives the "path" label — this is the
    // ONLY thing that changes for a gRPC route. There is no separate gRPC form.
    const selectedUpstream = upstreams?.find((u) => u.id === form.upstream_id);
    const isGrpc = selectedUpstream?.protocol === 'grpc';

    const mutation = mode === 'create' ? createRoute : updateRoute;
    const apiError = mutation.error ? toApiError(mutation.error) : null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'create') {
            createRoute.mutate(form, { onSuccess: onClose });
        } else if (route) {
            updateRoute.mutate({ id: route.id, input: form }, { onSuccess: onClose });
        }
    };

    const toggleMethod = (m: string) => {
        setForm((f) => ({
            ...f,
            methods: f.methods.includes(m) ? f.methods.filter((x) => x !== m) : [...f.methods, m],
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-md p-lg w-[420px]">
            <h3 className="font-headline-sm text-headline-sm">
                {mode === 'create' ? 'New Route' : `Edit ${route?.name}`}
            </h3>

            <label className="flex flex-col gap-xs text-sm">
                Name
                <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="border border-outline-variant rounded px-2 py-1"
                />
            </label>

            <label className="flex flex-col gap-xs text-sm">
                {isGrpc ? 'Service name prefix' : 'Path'}
                <input
                    required
                    value={form.path}
                    onChange={(e) => setForm((f) => ({ ...f, path: e.target.value }))}
                    placeholder={isGrpc ? '/package.Service' : '/api/v1/...'}
                    className="border border-outline-variant rounded px-2 py-1 font-mono"
                />
                {isGrpc && (
                    <span className="text-xs text-on-surface-variant">
                        gRPC upstream selected — this matches against the incoming service name, not an HTTP path.
                    </span>
                )}
            </label>

            <label className="flex flex-col gap-xs text-sm">
                Upstream
                <select
                    required
                    value={form.upstream_id}
                    onChange={(e) => setForm((f) => ({ ...f, upstream_id: e.target.value }))}
                    className="border border-outline-variant rounded px-2 py-1"
                >
                    <option value="">Select an upstream…</option>
                    {upstreams?.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.name} ({u.protocol})
                        </option>
                    ))}
                </select>
            </label>

            {!isGrpc && (
                <div className="flex flex-col gap-xs text-sm">
                    Methods
                    <div className="flex flex-wrap gap-xs">
                        {METHOD_OPTIONS.map((m) => (
                            <button
                                type="button"
                                key={m}
                                onClick={() => toggleMethod(m)}
                                className={`px-2 py-1 rounded text-xs font-bold border ${form.methods.includes(m)
                                        ? 'bg-[#113346] text-white border-[#113346]'
                                        : 'bg-white text-on-surface-variant border-outline-variant'
                                    }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <label className="flex flex-col gap-xs text-sm">
                Policy (optional)
                <select
                    value={form.policy_id ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, policy_id: e.target.value || null }))}
                    className="border border-outline-variant rounded px-2 py-1"
                >
                    <option value="">No policy</option>
                    {policies?.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </label>

            {apiError && (
                <p className="text-error text-xs">
                    {apiError.kind === 'unknown' && apiError.status === 409
                        ? 'A route with this name already exists.'
                        : apiError.message}
                </p>
            )}

            <div className="flex justify-end gap-sm mt-sm">
                <button type="button" onClick={onClose} className="px-3 py-1.5 text-sm text-on-surface-variant">
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="bg-[#113346] text-white px-3 py-1.5 rounded text-sm font-semibold disabled:opacity-50"
                >
                    {mutation.isPending ? 'Saving…' : mode === 'create' ? 'Create Route' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
};