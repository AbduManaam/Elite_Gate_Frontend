export type ProjectJwtAlgorithm = 'HS256';

export interface ProjectJwtConfig {
  configured: boolean;
  secret_configured: boolean;
  enabled: boolean;
  algorithm: ProjectJwtAlgorithm;
  config_version: number;
  issuer: string | null;
  audiences: string[];
  subject_claim: string;
  role_claim: string;
  scopes_claim: string;
  clock_skew_seconds: number;
  created_at?: string;
  updated_at?: string;
}

export interface ConfigureProjectJwtInput {
  enabled: boolean;
  algorithm: ProjectJwtAlgorithm;

  /**
   * Write-only.
   * Omit when preserving an already-configured secret.
   */
  secret?: string;

  issuer: string | null;
  audiences: string[];
  subject_claim: string;
  role_claim: string;
  scopes_claim: string;
  clock_skew_seconds: number;
}
