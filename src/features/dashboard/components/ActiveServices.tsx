import React from 'react';

interface ActiveServicesProps {
  readonly routeCount: number;
  readonly upstreamCount: number;
  readonly policyCount: number;
  readonly httpGatewayCount: number;
  readonly grpcGatewayCount: number;
}

export const ActiveServices: React.FC<ActiveServicesProps> = ({
  routeCount,
  upstreamCount,
  policyCount,
  httpGatewayCount,
  grpcGatewayCount,
}) => {
  const services = [
    { name: 'HTTP Gateways', count: httpGatewayCount, colorBg: 'bg-green-500' },
    { name: 'gRPC Gateways', count: grpcGatewayCount, colorBg: 'bg-green-500' },
    { name: 'Upstreams', count: upstreamCount, colorBg: 'bg-green-500' },
    { name: 'Routes', count: routeCount, colorBg: 'bg-green-500' },
    { name: 'Policies', count: policyCount, colorBg: 'bg-green-500' },
  ];

  return (
    <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col gap-md shadow-xs text-left">
      <div className="flex items-center gap-xs border-b border-outline-variant pb-xs">
        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
          pulse
        </span>
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
          Active Services
        </h3>
      </div>

      <div className="flex flex-col gap-sm">
        {services.map((svc) => (
          <div
            key={svc.name}
            className="flex items-center justify-between p-sm border border-outline-variant rounded-lg bg-surface-container-low/40"
          >
            <div className="flex items-center gap-sm">
              <span className={`w-2 h-2 rounded-full ${svc.colorBg} shrink-0`} />
              <span className="text-xs font-semibold text-on-surface">
                {svc.name}
              </span>
            </div>
            <span className="text-xs font-mono font-bold bg-[#e3f2fd] text-[#0d47a1] px-2 py-0.5 rounded border border-[#bbdefb]">
              {svc.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveServices;
