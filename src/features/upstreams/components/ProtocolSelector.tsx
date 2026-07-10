import React from 'react';

interface ProtocolSelectorProps {
    readonly selected: 'http' | 'grpc';
    readonly onChange: (protocol: 'http' | 'grpc') => void;
}

export const ProtocolSelector: React.FC<ProtocolSelectorProps> = ({ selected, onChange }) => {
    return (
        <div className="flex flex-col gap-md py-sm">
            <div className="flex flex-col gap-xs text-left mb-sm">
                <h4 className="font-semibold text-sm text-on-surface">Choose Protocol</h4>
                <p className="text-xs text-on-surface-variant">
                    Select the protocol used by your backend service.
                </p>
            </div>

            <div className="flex flex-col gap-sm">
                {/* HTTP / HTTPS Option */}
                <button
                    type="button"
                    onClick={() => onChange('http')}
                    className={`flex items-start gap-md p-md border rounded-lg text-left transition-all duration-200 cursor-pointer ${
                        selected === 'http'
                            ? 'border-[#113346] bg-[#113346]/5 ring-1 ring-[#113346]'
                            : 'border-outline-variant hover:border-[#587c94]/60 hover:bg-surface-container-low'
                    }`}
                >
                    <div className={`p-sm rounded-lg flex items-center justify-center transition-colors ${
                        selected === 'http' ? 'bg-[#113346] text-white' : 'bg-surface-container-high text-[#587c94]'
                    }`}>
                        <span className="material-symbols-outlined text-[24px]">language</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-sm text-on-surface">HTTP / HTTPS</span>
                            {selected === 'http' && (
                                <span className="material-symbols-outlined text-[#113346] text-[18px]">check_circle</span>
                            )}
                        </div>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                            For REST APIs, webhooks, and traditional web services.
                        </p>
                    </div>
                </button>

                {/* gRPC Option */}
                <button
                    type="button"
                    onClick={() => onChange('grpc')}
                    className={`flex items-start gap-md p-md border rounded-lg text-left transition-all duration-200 cursor-pointer ${
                        selected === 'grpc'
                            ? 'border-[#113346] bg-[#113346]/5 ring-1 ring-[#113346]'
                            : 'border-outline-variant hover:border-[#587c94]/60 hover:bg-surface-container-low'
                    }`}
                >
                    <div className={`p-sm rounded-lg flex items-center justify-center transition-colors ${
                        selected === 'grpc' ? 'bg-[#113346] text-white' : 'bg-surface-container-high text-[#587c94]'
                    }`}>
                        <span className="material-symbols-outlined text-[24px]">deployed_code</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-sm text-on-surface">gRPC</span>
                            {selected === 'grpc' && (
                                <span className="material-symbols-outlined text-[#113346] text-[18px]">check_circle</span>
                            )}
                        </div>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                            For high-performance, low-latency microservices using Protocol Buffers.
                        </p>
                    </div>
                </button>
            </div>
        </div>
    );
};
