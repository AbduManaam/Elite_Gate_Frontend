import React, { useState } from 'react';
import { RouteRecord } from '../api/route.types';
import { RouteInput } from '../api/routesApi';
import { useCreateRouteMutation, useUpdateRouteMutation } from '../hooks/useRouteMutations';
import { useUpstreamsQuery, useCreateUpstreamMutation } from '../../upstreams/hooks/useUpstreams';
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
    const createUpstream = useCreateUpstreamMutation(projectId);

    const [isCreatingUpstreamInline, setIsCreatingUpstreamInline] = useState(false);
    const [inlineUpstream, setInlineUpstream] = useState({
        name: '',
        target_url: '',
        protocol: 'http' as 'http' | 'grpc',
    });

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
    const activeProtocol = isCreatingUpstreamInline ? inlineUpstream.protocol : selectedUpstream?.protocol;
    const isGrpc = activeProtocol === 'grpc';

    const mutation = mode === 'create' ? createRoute : updateRoute;
    const apiError = mutation.error ? toApiError(mutation.error) : null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let upstreamId = form.upstream_id;
            if (isCreatingUpstreamInline && mode === 'create') {
                const newUpstream = await createUpstream.mutateAsync({
                    name: inlineUpstream.name,
                    target_url: inlineUpstream.target_url,
                    protocol: inlineUpstream.protocol,
                    enabled: true,
                });
                upstreamId = newUpstream.id;
            }

            const routeInput = {
                ...form,
                upstream_id: upstreamId,
            };

            if (mode === 'create') {
                createRoute.mutate(routeInput, { onSuccess: onClose });
            } else if (route) {
                updateRoute.mutate({ id: route.id, input: routeInput }, { onSuccess: onClose });
            }
        } catch (err) {
            console.error('Failed to create upstream inline:', err);
        }
    };

    const toggleMethod = (m: string) => {
        setForm((f) => ({
            ...f,
            methods: f.methods.includes(m) ? f.methods.filter((x) => x !== m) : [...f.methods, m],
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-md p-lg w-screen sm:w-[420px] max-w-full">
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

            {mode === 'create' ? (
                <div className="flex flex-col gap-xs text-sm border-l-2 border-[#587c94]/30 pl-3 py-1 bg-slate-50/50 rounded-r">
                    <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-xs text-on-surface-variant">Gateway Service (Upstream)</span>
                        <button
                            type="button"
                            onClick={() => setIsCreatingUpstreamInline(!isCreatingUpstreamInline)}
                            className="text-[#587c94] text-xs font-semibold hover:underline cursor-pointer"
                        >
                            {isCreatingUpstreamInline ? 'Select Existing' : '+ Add New Service inline'}
                        </button>
                    </div>

                    {isCreatingUpstreamInline ? (
                        <div className="flex flex-col gap-sm mt-1">
                            <label className="flex flex-col gap-1 text-xs">
                                Service Name
                                <input
                                    required
                                    value={inlineUpstream.name}
                                    onChange={(e) => setInlineUpstream(u => ({ ...u, name: e.target.value }))}
                                    placeholder="e.g. auth-service"
                                    className="border border-outline-variant bg-white rounded px-2 py-1 outline-none focus:border-[#587c94]"
                                />
                            </label>
                            <label className="flex flex-col gap-1 text-xs">
                                Target Host URL
                                <input
                                    required
                                    value={inlineUpstream.target_url}
                                    onChange={(e) => setInlineUpstream(u => ({ ...u, target_url: e.target.value }))}
                                    placeholder="e.g. http://auth-svc:8080"
                                    className="border border-outline-variant bg-white rounded px-2 py-1 font-mono outline-none focus:border-[#587c94]"
                                />
                            </label>
                            <div className="flex gap-md text-xs mt-1">
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="inline-protocol"
                                        checked={inlineUpstream.protocol === 'http'}
                                        onChange={() => setInlineUpstream(u => ({ ...u, protocol: 'http' }))}
                                        className="accent-[#113346]"
                                    />
                                    HTTP
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="inline-protocol"
                                        checked={inlineUpstream.protocol === 'grpc'}
                                        onChange={() => setInlineUpstream(u => ({ ...u, protocol: 'grpc' }))}
                                        className="accent-[#113346]"
                                    />
                                    gRPC
                                </label>
                            </div>
                        </div>
                    ) : (
                        <select
                            required
                            value={form.upstream_id}
                            onChange={(e) => setForm((f) => ({ ...f, upstream_id: e.target.value }))}
                            className="border border-outline-variant bg-white rounded px-2 py-1 outline-none focus:border-[#587c94] w-full text-xs"
                        >
                            <option value="">Select an upstream…</option>
                            {upstreams?.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name} ({u.protocol})
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            ) : (
                <label className="flex flex-col gap-xs text-sm">
                    Upstream
                    <select
                        required
                        value={form.upstream_id}
                        onChange={(e) => setForm((f) => ({ ...f, upstream_id: e.target.value }))}
                        className="border border-outline-variant rounded px-2 py-1 outline-none focus:border-[#587c94]"
                    >
                        <option value="">Select an upstream…</option>
                        {upstreams?.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name} ({u.protocol})
                            </option>
                        ))}
                    </select>
                </label>
            )}

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