import React, { useState } from 'react';

interface StepItem {
  title: string;
  icon?: string;
  content: React.ReactNode;
}

interface LetsGetStartedBannerProps {
  readonly onAddServiceRoute?: () => void;
  readonly onImportOpenAPI?: () => void;
}

export const LetsGetStartedBanner: React.FC<LetsGetStartedBannerProps> = ({
  onAddServiceRoute,
  onImportOpenAPI,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeStep, setActiveStep] = useState(1); // Default to "Add configuration" (index 1) to match screenshot

  const steps: StepItem[] = [
    {
      title: 'Complete setup',
      content: (
        <div className="flex flex-col gap-md text-left font-sans">
          <h4 className="font-bold text-sm text-[#113346]">Install and connect your Gateway nodes</h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Provision Docker containers or on-prem nodes and connect them to your project control plane to begin routing traffic.
          </p>
          <div className="bg-slate-900 text-slate-100 rounded-lg p-md font-mono text-[11px] relative select-all leading-relaxed">
            <code>docker run -d --name elitegate-node -p 8000:8000 elitegate/gateway:latest</code>
          </div>
        </div>
      ),
    },
    {
      title: 'Add configuration',
      content: (
        <div className="flex flex-col gap-md text-left font-sans">
          <h4 className="font-bold text-sm text-[#113346]">Define and route traffic to your services</h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Add a service and a route to define how requests are routed to your services.
          </p>

          {/* Interactive Flow Canvas */}
          <div className="relative border border-outline-variant rounded-xl h-[260px] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] bg-slate-50/40 flex items-center justify-center p-md overflow-hidden select-none">
            {/* Canvas Zoom Controls */}
            <div className="absolute left-3 top-3 flex flex-col border border-outline-variant rounded bg-white shadow-sm divide-y divide-outline-variant">
              <button type="button" className="p-1 hover:bg-slate-50 transition-colors text-outline hover:text-[#587c94] text-[16px] font-bold">+</button>
              <button type="button" className="p-1 hover:bg-slate-50 transition-colors text-outline hover:text-[#587c94] text-[16px] font-bold">-</button>
              <button type="button" className="p-1 hover:bg-slate-50 transition-colors text-outline hover:text-[#587c94] flex items-center justify-center">
                <span className="material-symbols-outlined text-[14px]">fullscreen</span>
              </button>
            </div>

            {/* Diagram Flow Grid */}
            <div className="flex items-center gap-xs md:gap-md relative w-full justify-between max-w-2xl px-sm">
              {/* Client Box */}
              <div className="flex flex-col gap-1 items-center bg-white border border-outline-variant rounded-lg p-2 shadow-sm w-[110px] text-center">
                <span className="material-symbols-outlined text-[#587c94] text-[20px]">laptop_mac</span>
                <span className="font-bold text-[10px] text-[#113346]">Client</span>
                <span className="text-[8px] text-on-surface-variant leading-tight">Your users, apps, consumers</span>
              </div>

              {/* Arrow Client -> Gateway */}
              <div className="flex flex-col items-center flex-1 min-w-[20px]">
                <span className="text-[7px] text-outline font-semibold">Request</span>
                <span className="material-symbols-outlined text-outline text-[16px] -mt-1">arrow_forward</span>
              </div>

              {/* Central Control Plane & Gateway Group */}
              <div className="flex flex-col gap-sm items-center">
                {/* Control Plane (Top) */}
                <div className="bg-white border border-outline-variant rounded-lg p-2 shadow-sm w-[170px] text-left relative">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[#587c94] text-[14px]">cloud</span>
                    <span className="font-bold text-[9px] text-[#113346]">EliteGate Konnect</span>
                  </div>
                  <div className="mt-1 flex justify-between items-center">
                    <span className="text-[8px] text-[#587c94] font-medium bg-[#587c94]/10 px-1 py-0.5 rounded">Control plane</span>
                    <span className="text-[7px] text-[#587c94] bg-[#587c94]/10 px-1 py-0.5 rounded">Managed by Cloud</span>
                  </div>
                  <p className="text-[7px] text-on-surface-variant mt-1 leading-tight">Configure services, routes, and plugins here</p>
                </div>

                {/* Connection Line */}
                <div className="w-[1px] h-3 bg-dashed border-l border-dashed border-outline-variant" />

                {/* Gateway Box (Bottom) */}
                <div className="bg-white border border-outline-variant rounded-lg p-2.5 shadow-sm w-[210px] text-left">
                  <div className="flex justify-between items-center border-b border-outline-variant/60 pb-1.5 mb-1.5">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[#587c94] text-[14px]">settings_ethernet</span>
                      <span className="font-bold text-[9px] text-[#113346]">Your cloud / on-prem</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[8px] text-on-surface font-semibold">EliteGate Gateway</span>
                    <div className="flex items-center gap-0.5 bg-green-50 text-green-700 px-1 py-0.5 rounded border border-green-200">
                      <span className="w-1 h-1 bg-green-600 rounded-full animate-pulse" />
                      <span className="text-[7px] font-bold">Verifying...</span>
                    </div>
                  </div>
                  {/* Inside Gateway: Route -> Service */}
                  <div className="flex items-center justify-between gap-1 bg-slate-50/50 p-1 border border-outline-variant rounded">
                    <div className="bg-white border border-outline-variant rounded p-1 text-center flex-1">
                      <span className="font-semibold text-[8px] text-on-surface">Route</span>
                    </div>
                    <span className="material-symbols-outlined text-outline text-[10px]">link</span>
                    <div className="bg-white border border-outline-variant rounded p-1 text-center flex-1">
                      <span className="font-semibold text-[8px] text-on-surface">Service</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow Gateway -> Backend */}
              <div className="flex flex-col items-center flex-1 min-w-[20px]">
                <span className="text-[7px] text-outline font-semibold">Request</span>
                <span className="material-symbols-outlined text-outline text-[16px] -mt-1">arrow_forward</span>
              </div>

              {/* Backend API Box */}
              <div className="flex flex-col gap-1 items-center bg-white border border-outline-variant rounded-lg p-2 shadow-sm w-[110px] text-center">
                <span className="material-symbols-outlined text-[#587c94] text-[20px]">dns</span>
                <span className="font-bold text-[10px] text-[#113346]">Backend API</span>
                <span className="text-[8px] text-on-surface-variant leading-tight">Your APIs, microservices, databases</span>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <button
              type="button"
              onClick={onAddServiceRoute}
              className="flex items-center justify-between p-md border border-outline-variant rounded-xl bg-white hover:bg-slate-50 transition-colors shadow-sm text-left cursor-pointer group"
            >
              <div className="flex items-center gap-md">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </div>
                <div>
                  <h5 className="font-bold text-xs text-[#113346]">Add a service and route</h5>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Define your target microservices.</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:text-[#587c94] group-hover:translate-x-1 transition-all text-[20px]">arrow_forward</span>
            </button>

            <button
              type="button"
              onClick={onImportOpenAPI}
              className="flex items-center justify-between p-md border border-outline-variant rounded-xl bg-white hover:bg-slate-50 transition-colors shadow-sm text-left cursor-pointer group"
            >
              <div className="flex items-center gap-md">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                </div>
                <div>
                  <h5 className="font-bold text-xs text-[#113346]">Import services and routes via OpenAPI spec</h5>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Upload a YAML or JSON API contract.</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:text-[#587c94] group-hover:translate-x-1 transition-all text-[20px]">arrow_forward</span>
            </button>
          </div>
        </div>
      ),
    },
    {
      title: 'Add plugins',
      content: (
        <div className="flex flex-col gap-md text-left font-sans">
          <h4 className="font-bold text-sm text-[#113346]">Secure and optimize your APIs with policies</h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Layer authentication, rate limiting, and CORS management templates on top of your endpoints to keep them secure and resilient.
          </p>
          <div className="flex items-center gap-md p-md border border-outline-variant bg-slate-50/50 rounded-xl">
            <span className="material-symbols-outlined text-[#587c94] text-[36px]">security</span>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-xs text-[#113346]">Policies Dashboard</span>
              <span className="text-[10px] text-on-surface-variant">Access rate-limit templates and authentication requirements inside the Policies section.</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Next steps',
      icon: 'rocket_launch',
      content: (
        <div className="flex flex-col gap-md text-left font-sans">
          <h4 className="font-bold text-sm text-[#113346]">Explore analytics and monitor traffic</h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Analyze request distributions, gateway latency metrics, and error rates using the built-in observability explorer.
          </p>
          <div className="flex items-center gap-md p-md border border-outline-variant bg-slate-50/50 rounded-xl">
            <span className="material-symbols-outlined text-[#587c94] text-[36px]">insights</span>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-xs text-[#113346]">Observability Explorer</span>
              <span className="text-[10px] text-on-surface-variant">View traffic status, detailed request traces, and upstream connectivity graphs.</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm text-left">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex justify-between items-center p-md bg-[#fafbfc] border-b border-outline-variant hover:bg-slate-50 transition-colors cursor-pointer outline-none"
      >
        <span className="font-semibold text-sm text-[#113346] flex items-center gap-sm">
          <span className="material-symbols-outlined text-[20px] text-[#587c94]">rocket_launch</span>
          Let's get started!
        </span>
        <span className="material-symbols-outlined text-outline transition-transform duration-200" style={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}>
          expand_more
        </span>
      </button>

      {/* Accordion Body */}
      {!isCollapsed && (
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-outline-variant">
          {/* Left Stepper (3 cols) */}
          <div className="md:col-span-3 flex flex-col p-md gap-sm bg-slate-50/30">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={`flex items-center gap-md p-md rounded-lg text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white shadow-sm border border-outline-variant font-semibold text-[#113346]'
                      : 'text-on-surface-variant hover:bg-slate-100/50'
                  }`}
                >
                  {step.icon ? (
                    <span className="material-symbols-outlined text-[20px] text-[#587c94]">{step.icon}</span>
                  ) : (
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                      isActive ? 'bg-[#113346] text-white' : 'bg-slate-200 text-on-surface-variant'
                    }`}>
                      {idx + 1}
                    </span>
                  )}
                  <span className="text-xs">{step.title}</span>
                </button>
              );
            })}
          </div>

          {/* Right Content Area (9 cols) */}
          <div className="md:col-span-9 p-lg flex flex-col gap-lg bg-white">
            {steps[activeStep].content}
          </div>
        </div>
      )}
    </div>
  );
};
