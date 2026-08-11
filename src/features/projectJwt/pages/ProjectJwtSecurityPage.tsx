import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useActiveProject } from '../../../shared/hooks/useActiveProject';
import { queryKeys } from '../../../shared/api/queryKeys';
import { toApiError } from '../../../shared/api/apiError';
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal';
import { useProjectJwtConfigQuery } from '../hooks/useProjectJwtConfig';
import { configureProjectJwt, deleteProjectJwtConfig } from '../api/projectJwtApi';
import type { ConfigureProjectJwtInput, ProjectJwtConfig } from '../api/types';

const DEFAULT_FORM = {
  enabled: true,
  issuer: '',
  audiences: '',
  subjectClaim: 'sub',
  roleClaim: 'role',
  scopesClaim: 'scope',
  clockSkewSeconds: 30,
};

function parseAudiences(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(/[,\n]/)
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
}

function secretByteLength(secret: string): number {
  return new TextEncoder().encode(secret).length;
}

export const ProjectJwtSecurityPage: React.FC = () => {
  const { projectId } = useActiveProject();
  const queryClient = useQueryClient();

  const { data: config, isLoading, isError, error, refetch } = useProjectJwtConfigQuery(projectId);

  const [enabled, setEnabled] = useState(DEFAULT_FORM.enabled);
  const [secret, setSecret] = useState('');
  const [issuer, setIssuer] = useState(DEFAULT_FORM.issuer);
  const [audiences, setAudiences] = useState(DEFAULT_FORM.audiences);
  const [subjectClaim, setSubjectClaim] = useState(DEFAULT_FORM.subjectClaim);
  const [roleClaim, setRoleClaim] = useState(DEFAULT_FORM.roleClaim);
  const [scopesClaim, setScopesClaim] = useState(DEFAULT_FORM.scopesClaim);
  const [clockSkewSeconds, setClockSkewSeconds] = useState(DEFAULT_FORM.clockSkewSeconds);

  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Clear form state immediately when switching projects
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(DEFAULT_FORM.enabled);
    setSecret('');
    setIssuer(DEFAULT_FORM.issuer);
    setAudiences(DEFAULT_FORM.audiences);
    setSubjectClaim(DEFAULT_FORM.subjectClaim);
    setRoleClaim(DEFAULT_FORM.roleClaim);
    setScopesClaim(DEFAULT_FORM.scopesClaim);
    setClockSkewSeconds(DEFAULT_FORM.clockSkewSeconds);
    setFormError('');
    setSuccessMessage('');
  }, [projectId]);

  // Populate form from safe GET response
  useEffect(() => {
    if (!config) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(config.enabled);
    setIssuer(config.issuer ?? '');
    setAudiences((config.audiences ?? []).join('\n'));
    setSubjectClaim(config.subject_claim || 'sub');
    setRoleClaim(config.role_claim || 'role');
    setScopesClaim(config.scopes_claim || 'scope');
    setClockSkewSeconds(config.clock_skew_seconds ?? 30);

  }, [config]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || isSubmitting || isDeleting) return;

    setFormError('');
    setSuccessMessage('');

    // Validation
    const isSecretConfigured = Boolean(config?.secret_configured);
    if (!isSecretConfigured && !secret) {
      setFormError('A secret key is required for initial JWT configuration.');
      return;
    }

    if (secret) {
      const bytes = secretByteLength(secret);
      if (bytes < 32) {
        setFormError(`JWT secret must be at least 32 bytes (current: ${bytes} bytes).`);
        return;
      }
      if (bytes > 4096) {
        setFormError(`JWT secret must not exceed 4096 bytes (current: ${bytes} bytes).`);
        return;
      }
    }

    const normalizedAudiences = parseAudiences(audiences);
    if (normalizedAudiences.length > 20) {
      setFormError('A maximum of 20 audiences is allowed.');
      return;
    }

    if (issuer.trim().length > 512) {
      setFormError('Issuer must not exceed 512 characters.');
      return;
    }

    if (
      !Number.isInteger(clockSkewSeconds) ||
      clockSkewSeconds < 0 ||
      clockSkewSeconds > 300
    ) {
      setFormError('Clock skew must be an integer between 0 and 300 seconds.');
      return;
    }

    const input: ConfigureProjectJwtInput = {
      enabled,
      algorithm: 'HS256',
      issuer: issuer.trim() || null,
      audiences: normalizedAudiences,
      subject_claim: subjectClaim.trim() || 'sub',
      role_claim: roleClaim.trim() || 'role',
      scopes_claim: scopesClaim.trim() || 'scope',
      clock_skew_seconds: Number(clockSkewSeconds),
      ...(secret ? { secret } : {}),
    };

    setIsSubmitting(true);
    try {
      const updated = await configureProjectJwt(projectId, input);
      queryClient.setQueryData<ProjectJwtConfig>(
        queryKeys.projectJwt(projectId),
        updated
      );
      setSecret('');
      setSuccessMessage('JWT authentication configuration saved successfully.');
    } catch (err) {
      setFormError(toApiError(err).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!projectId || isDeleting || isSubmitting) return;

    setIsDeleting(true);
    setFormError('');
    setSuccessMessage('');
    try {
      await deleteProjectJwtConfig(projectId);
      setIsDeleteModalOpen(false);
      setSecret('');
      setSuccessMessage('JWT authentication configuration deleted.');
      await refetch();
    } catch (err) {
      setFormError(toApiError(err).message);
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-xs text-on-surface-variant flex flex-col items-center gap-2">
        <span className="material-symbols-outlined text-[24px] animate-spin text-[#587c94]">progress_activity</span>
        Loading JWT authentication configuration...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-4 max-w-2xl mx-auto p-6 bg-red-50 border border-red-200 rounded-xl text-left font-sans">
        <div className="flex items-center gap-2 text-red-700 font-semibold text-sm">
          <span className="material-symbols-outlined text-[20px]">error</span>
          Unable to load JWT authentication configuration.
        </div>
        <p className="text-xs text-red-600">
          {toApiError(error).message}
        </p>
        <div>
          <button
            onClick={() => refetch()}
            type="button"
            className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const isConfigured = Boolean(config?.configured);
  const isSecretConfigured = Boolean(config?.secret_configured);

  return (
    <div className="flex flex-col gap-6 w-full text-left font-sans max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display-lg text-display-lg text-on-surface">JWT Authentication</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isConfigured ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-700 border border-slate-300'
              }`}>
              {isConfigured ? 'Configured' : 'Not configured'}
            </span>
            {isConfigured && (
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${config?.enabled ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                {config?.enabled ? 'Enabled' : 'Disabled'}
              </span>
            )}
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Configure customer JWT token verification for project API requests.
          </p>
        </div>

        {isConfigured && (
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isSubmitting || isDeleting}
            type="button"
            className="border border-red-200 text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
            Delete JWT Configuration
          </button>
        )}
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-medium">
          <span className="material-symbols-outlined text-[20px] text-emerald-600">check_circle</span>
          {successMessage}
        </div>
      )}

      {formError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2 font-medium">
          <span className="material-symbols-outlined text-[20px] text-red-600">error</span>
          {formError}
        </div>
      )}

      {/* Main Configuration Form */}
      <form onSubmit={handleSave} className="bg-white border border-outline-variant rounded-xl p-6 shadow-xs flex flex-col gap-6">
        {/* Toggle & Version */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-outline-variant/60 rounded-lg">
          <div>
            <span className="text-sm font-semibold text-on-surface block">Enable JWT Authentication</span>
            <span className="text-xs text-on-surface-variant">
              When enabled, incoming API requests will be validated against this JWT configuration.
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#113346]"></div>
          </label>
        </div>

        {/* Algorithm & Version */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">Algorithm</label>
            <input
              type="text"
              value="HS256"
              disabled
              className="w-full border border-outline-variant bg-slate-100 rounded-lg px-3 py-2 text-xs text-on-surface-variant font-mono cursor-not-allowed"
            />
            <span className="text-[10px] text-on-surface-variant/80 mt-1 block">HS256 (HMAC with SHA-256) is currently the supported algorithm.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">Config Version</label>
            <input
              type="text"
              value={config?.config_version ? `v${config.config_version}` : 'v1 (New)'}
              disabled
              className="w-full border border-outline-variant bg-slate-100 rounded-lg px-3 py-2 text-xs text-on-surface-variant font-mono cursor-not-allowed"
            />
            <span className="text-[10px] text-on-surface-variant/80 mt-1 block">Version auto-increments upon metadata update.</span>
          </div>
        </div>

        {/* Secret Key Input */}
        <div>
          <label htmlFor="jwt-secret-input" className="block text-xs font-semibold text-on-surface mb-1">
            JWT Secret <span className="text-red-500">{isSecretConfigured ? '' : '*'}</span>
          </label>
          <input
            id="jwt-secret-input"
            type="password"
            autoComplete="new-password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder={isSecretConfigured ? 'Leave blank to keep existing secret' : 'Enter secret key (min 32 bytes)'}
            className="w-full border border-outline-variant rounded-lg px-3 py-2 text-xs text-on-surface bg-white focus:outline-none focus:ring-1 focus:ring-[#587c94] focus:border-[#587c94] transition-all font-mono"
          />
          {isSecretConfigured ? (
            <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              A secret is already configured. The current value cannot be viewed. Leave this field blank to keep it, or enter a new value to rotate it.
            </p>
          ) : (
            <p className="text-[11px] text-on-surface-variant mt-1">
              Must be at least 32 bytes. Secret is write-only and stored securely in AWS Secrets Manager.
            </p>
          )}
        </div>

        {/* Issuer */}
        <div>
          <label htmlFor="jwt-issuer-input" className="block text-xs font-semibold text-on-surface mb-1">
            Issuer (iss) <span className="text-on-surface-variant font-normal">(Optional)</span>
          </label>
          <input
            id="jwt-issuer-input"
            type="text"
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            placeholder="e.g. https://auth.yourcompany.com"
            className="w-full border border-outline-variant rounded-lg px-3 py-2 text-xs text-on-surface bg-white focus:outline-none focus:ring-1 focus:ring-[#587c94] focus:border-[#587c94] transition-all"
          />
        </div>

        {/* Audiences */}
        <div>
          <label htmlFor="jwt-audiences-input" className="block text-xs font-semibold text-on-surface mb-1">
            Allowed Audiences (aud) <span className="text-on-surface-variant font-normal">(Optional, one per line or comma-separated)</span>
          </label>
          <textarea
            id="jwt-audiences-input"
            rows={3}
            value={audiences}
            onChange={(e) => setAudiences(e.target.value)}
            placeholder="api.yourcompany.com&#10;https://api.yourcompany.com"
            className="w-full border border-outline-variant rounded-lg p-3 text-xs text-on-surface bg-white focus:outline-none focus:ring-1 focus:ring-[#587c94] focus:border-[#587c94] transition-all font-mono"
          />
        </div>

        {/* Claims Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="jwt-sub-claim-input" className="block text-xs font-semibold text-on-surface mb-1">
              Subject Claim
            </label>
            <input
              id="jwt-sub-claim-input"
              type="text"
              value={subjectClaim}
              onChange={(e) => setSubjectClaim(e.target.value)}
              className="w-full border border-outline-variant rounded-lg px-3 py-2 text-xs text-on-surface bg-white focus:outline-none focus:ring-1 focus:ring-[#587c94] focus:border-[#587c94] transition-all font-mono"
            />
          </div>

          <div>
            <label htmlFor="jwt-role-claim-input" className="block text-xs font-semibold text-on-surface mb-1">
              Role Claim
            </label>
            <input
              id="jwt-role-claim-input"
              type="text"
              value={roleClaim}
              onChange={(e) => setRoleClaim(e.target.value)}
              className="w-full border border-outline-variant rounded-lg px-3 py-2 text-xs text-on-surface bg-white focus:outline-none focus:ring-1 focus:ring-[#587c94] focus:border-[#587c94] transition-all font-mono"
            />
          </div>

          <div>
            <label htmlFor="jwt-scopes-claim-input" className="block text-xs font-semibold text-on-surface mb-1">
              Scopes Claim
            </label>
            <input
              id="jwt-scopes-claim-input"
              type="text"
              value={scopesClaim}
              onChange={(e) => setScopesClaim(e.target.value)}
              className="w-full border border-outline-variant rounded-lg px-3 py-2 text-xs text-on-surface bg-white focus:outline-none focus:ring-1 focus:ring-[#587c94] focus:border-[#587c94] transition-all font-mono"
            />
          </div>
        </div>

        {/* Clock Skew */}
        <div>
          <label htmlFor="jwt-clock-skew-input" className="block text-xs font-semibold text-on-surface mb-1">
            Clock Skew Tolerance (seconds)
          </label>
          <input
            id="jwt-clock-skew-input"
            type="number"
            min={0}
            max={300}
            value={clockSkewSeconds}
            onChange={(e) => setClockSkewSeconds(Number(e.target.value))}
            className="w-full md:w-48 border border-outline-variant rounded-lg px-3 py-2 text-xs text-on-surface bg-white focus:outline-none focus:ring-1 focus:ring-[#587c94] focus:border-[#587c94] transition-all"
          />
          <span className="text-[10px] text-on-surface-variant mt-1 block font-sans">Allowed nbf/exp drift tolerance in seconds (0–300).</span>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end pt-4 border-t border-outline-variant">
          <button
            type="submit"
            disabled={isSubmitting || isDeleting}
            className="bg-[#113346] hover:bg-brand-hover text-white px-6 py-2.5 rounded-lg font-semibold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                Saving...
              </>
            ) : (
              'Save JWT Configuration'
            )}
          </button>
        </div>
      </form>

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete JWT Configuration"
        isDanger={true}
        message="Are you sure you want to delete this project's JWT authentication configuration?"
        description="Deleting this configuration removes project JWT authentication. The gateway will stop using it after the updated project configuration is synchronized."
        requireConfirmText="DELETE"
        confirmLabel="Delete Configuration"
        onConfirm={handleDeleteConfirm}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
          }
        }}
        isPending={isDeleting}
      />
    </div>
  );
};

export default ProjectJwtSecurityPage;
