import React from 'react';
import { useProvisioningStatusQuery } from '../hooks/useCustomDomains';
import { useRetryProvisioningMutation, useRetryDeprovisioningMutation } from '../hooks/useDomainMutations';
import { mapProvisioningStatusUI } from '../utils/statusMapper';
import { CopyableText } from '../../../shared/components/ui/CopyableText';
import { toApiError } from '../../../shared/api/apiError';

interface ProvisioningStatusCardProps {
  projectId: string;
  domainId: string;
  isExpanded: boolean;
  canRetry: boolean;
  onToast?: (msg: string, isError?: boolean) => void;
}

export const ProvisioningStatusCard: React.FC<ProvisioningStatusCardProps> = ({
  projectId,
  domainId,
  isExpanded,
  canRetry,
  onToast,
}) => {
  const { data: statusData, isLoading, error } = useProvisioningStatusQuery(
    projectId,
    domainId,
    isExpanded
  );
  const retryProvisioningMutation = useRetryProvisioningMutation(projectId);
  const retryDeprovisioningMutation = useRetryDeprovisioningMutation(projectId);

  if (!isExpanded) return null;

  if (isLoading) {
    return (
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-center gap-2 text-slate-600 font-sans">
        <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
        Loading provisioning status...
      </div>
    );
  }

  if (error || !statusData) return null;

  const ui = mapProvisioningStatusUI(statusData.provisioningStatus);
  const isFailed = statusData.provisioningStatus === 'failed';
  const isDeprovisionFailed = statusData.provisioningStatus === 'deprovision_failed';
  const isAnyFailed = isFailed || isDeprovisionFailed;

  const showValidationRecord =
    (statusData.provisioningStatus === 'waiting_for_validation_record' ||
      statusData.provisioningStatus === 'waiting_for_dns') &&
    Boolean(
      statusData.certificateValidationName ||
        statusData.certificateValidationValue
    );

  const showGatewayRouting =
    statusData.status === 'active' ||
    statusData.provisioningStatus === 'completed' ||
    statusData.hostRoutingActive ||
    Boolean(statusData.gatewayExternalId);

  const isHttpsSecured =
    (statusData.status === 'active' || statusData.provisioningStatus === 'completed') &&
    statusData.certificateStatus?.toLowerCase() === 'issued';

  const isPending = retryProvisioningMutation.isPending || retryDeprovisioningMutation.isPending;

  const handleRetry = () => {
    if (isDeprovisionFailed) {
      retryDeprovisioningMutation.mutate(domainId, {
        onSuccess: () => {
          if (onToast) onToast('Deprovisioning retry initiated.');
        },
        onError: (err) => {
          if (onToast) onToast(`Retry failed: ${toApiError(err).message}`, true);
        },
      });
    } else {
      retryProvisioningMutation.mutate(domainId, {
        onSuccess: () => {
          if (onToast) onToast('Provisioning retry initiated.');
        },
        onError: (err) => {
          if (onToast) onToast(`Retry failed: ${toApiError(err).message}`, true);
        },
      });
    }
  };

  return (
    <div
      className={`p-4 rounded-xl border flex flex-col gap-3 text-xs font-sans ${
        isAnyFailed
          ? 'bg-red-50/70 border-red-200'
          : ui.color === 'emerald'
          ? 'bg-emerald-50/70 border-emerald-200'
          : 'bg-blue-50/70 border-blue-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          <span
            className={`material-symbols-outlined text-[18px] ${
              ui.isInProgress
                ? 'animate-spin text-blue-600'
                : ui.color === 'emerald'
                ? 'text-emerald-600'
                : 'text-red-600'
            }`}
          >
            {ui.icon}
          </span>
          <span>{ui.title}</span>
        </div>
        {statusData.attempts > 0 && (
          <span className="text-[11px] text-slate-500 font-mono">
            Attempts: {statusData.attempts}
          </span>
        )}
      </div>

      <p className="text-slate-600 font-sans">{ui.description}</p>

      {showValidationRecord && (
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex flex-col gap-2">
          <div className="text-slate-600 font-sans">
            Create this CNAME record in your DNS provider. EliteGate will continue
            automatically after ACM validates it.
          </div>

          {statusData.certificateValidationName && (
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-slate-700 font-sans">
                ACM Validation CNAME Record Name:
              </span>
              <CopyableText value={statusData.certificateValidationName} />
            </div>
          )}

          {statusData.certificateValidationValue && (
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-slate-700 font-sans">
                ACM Validation CNAME Record Value:
              </span>
              <CopyableText value={statusData.certificateValidationValue} />
            </div>
          )}
        </div>
      )}

      {showGatewayRouting && (
        <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 border-b border-slate-100 pb-2">
            <span className="material-symbols-outlined text-[16px] text-indigo-600">
              alt_route
            </span>
            <span>Gateway Routing</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {statusData.gatewayType && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-slate-500 font-medium">Gateway Type</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {statusData.gatewayType === 'dedicated' ? 'Dedicated' : statusData.gatewayType}
                </span>
              </div>
            )}

            {statusData.gatewayExternalId && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-slate-500 font-medium">Gateway</span>
                <span className="font-mono font-semibold text-slate-800">
                  {statusData.gatewayExternalId}
                </span>
              </div>
            )}

            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] text-slate-500 font-medium">ALB Host Routing</span>
              <span
                className={`font-semibold flex items-center gap-1 ${
                  statusData.hostRoutingActive ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {statusData.hostRoutingActive ? (
                  <>
                    Connected
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  </>
                ) : (
                  'Not Connected'
                )}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] text-slate-500 font-medium">HTTPS</span>
              <span
                className={`font-semibold flex items-center gap-1 ${
                  isHttpsSecured ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {isHttpsSecured ? (
                  <>
                    Secured
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  </>
                ) : (
                  'Pending'
                )}
              </span>
            </div>
          </div>

          {statusData.hostRoutingActive && (
            <div className="mt-1 pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-600 overflow-x-auto">
              <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                {statusData.hostname}
              </span>
              <span className="material-symbols-outlined text-[14px] text-slate-400">arrow_forward</span>
              <span className="font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                Dedicated Gateway
              </span>
              <span className="material-symbols-outlined text-[14px] text-slate-400">arrow_forward</span>
              <span className="font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                Project Routes
              </span>
            </div>
          )}
        </div>
      )}

      {isAnyFailed && statusData.lastError && (
        <div className="p-2.5 bg-red-100/80 border border-red-300 rounded-lg text-red-800 font-medium font-sans">
          {statusData.lastError}
        </div>
      )}

      {isAnyFailed && canRetry && (
        <div className="flex items-center justify-end mt-1">
          <button
            onClick={handleRetry}
            disabled={isPending}
            type="button"
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-xs transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            <span className={`material-symbols-outlined text-[16px] ${isPending ? 'animate-spin' : ''}`}>
              {isPending ? 'progress_activity' : 'refresh'}
            </span>
            {isPending
              ? 'Retrying...'
              : isDeprovisionFailed
              ? 'Retry Deprovisioning'
              : 'Retry Provisioning'}
          </button>
        </div>
      )}
    </div>
  );
};
