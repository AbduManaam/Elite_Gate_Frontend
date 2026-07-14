import React from 'react';

export const GatewayMonitoringPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-md text-left">
      <div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Gateway Monitoring</h2>
        <p className="text-sm text-on-surface-variant mt-0.5">Performance charts, active connections, and latency trends (Read Only).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-xs flex flex-col gap-sm">
          <h3 className="font-semibold text-sm text-on-surface">Active Client Connections</h3>
          <p className="text-3xl font-extrabold text-on-surface mt-2">1,208 <span className="text-xs font-semibold text-outline">active</span></p>
          <span className="text-[11px] text-green-600 font-semibold mt-1">Steady throughput load</span>
        </div>
        <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-xs flex flex-col gap-sm">
          <h3 className="font-semibold text-sm text-on-surface">Average Connection Uptime</h3>
          <p className="text-3xl font-extrabold text-on-surface mt-2">14.8 hrs <span className="text-xs font-semibold text-outline">duration</span></p>
          <span className="text-[11px] text-on-surface-variant mt-1">WebSocket and keep-alive active sessions</span>
        </div>
      </div>
    </div>
  );
};

export default GatewayMonitoringPage;
