import React from 'react';
import { UpstreamInput } from '../api/upstreamsApi';

interface UpstreamReviewStepProps {
    readonly form: UpstreamInput;
}

export const UpstreamReviewStep: React.FC<UpstreamReviewStepProps> = ({ form }) => {
    const getLBStrategyName = (s?: string) => {
        if (s === 'least_conn') return 'Least Connections';
        return 'Round Robin';
    };

    return (
        <div className="flex flex-col gap-md py-sm text-left">
            <div className="flex flex-col gap-xs mb-sm">
                <h4 className="font-semibold text-sm text-on-surface">Review Your Configuration</h4>
                <p className="text-xs text-on-surface-variant">
                    Please review the details before creating the upstream.
                </p>
            </div>

            <div className="border border-outline-variant rounded-lg overflow-hidden divide-y divide-outline-variant">
                {/* Protocol */}
                <div className="flex justify-between items-center p-md bg-surface-container-lowest">
                    <span className="text-xs font-medium text-on-surface-variant">Protocol</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        form.protocol === 'grpc'
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                    }`}>
                        {form.protocol}
                    </span>
                </div>

                {/* Service Name */}
                <div className="flex justify-between items-center p-md bg-white">
                    <span className="text-xs font-medium text-on-surface-variant">Service Name</span>
                    <span className="text-xs font-semibold text-on-surface">{form.name}</span>
                </div>

                {/* Target URL */}
                <div className="flex justify-between items-center p-md bg-surface-container-lowest">
                    <span className="text-xs font-medium text-on-surface-variant">Target URL</span>
                    <span className="text-xs font-mono font-semibold text-on-surface truncate max-w-[200px]">{form.target_url}</span>
                </div>

                {/* Health Check Path */}
                <div className="flex justify-between items-center p-md bg-white">
                    <span className="text-xs font-medium text-on-surface-variant">Health Check Path</span>
                    <span className="text-xs font-mono text-on-surface">
                        {form.health_path ? form.health_path : '—'}
                    </span>
                </div>

                {/* Load Balancer */}
                <div className="flex justify-between items-center p-md bg-surface-container-lowest">
                    <span className="text-xs font-medium text-on-surface-variant">Load Balancer</span>
                    <span className="text-xs font-semibold text-on-surface">
                        {getLBStrategyName(form.lb_strategy)}
                    </span>
                </div>

                {/* Status */}
                <div className="flex justify-between items-center p-md bg-white">
                    <span className="text-xs font-medium text-on-surface-variant">Status</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        form.enabled
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-outline-variant/30 text-on-surface-variant border border-outline-variant/50'
                    }`}>
                        {form.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                </div>
            </div>
        </div>
    );
};
