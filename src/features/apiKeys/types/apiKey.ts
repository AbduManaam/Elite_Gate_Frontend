export interface ApiKeyRecord {
    readonly id: string;
    readonly project_id: string;
    readonly name: string;
    readonly status: string; // "active" | "revoked" | "expired"
    readonly roles: string[];
    readonly scopes: string[];
    readonly expires_at?: string;
    readonly created_at: string;
    readonly updated_at: string;
    readonly api_key?: string;
    readonly raw_key?: string;
}

export interface PaginationInfo {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly total_pages: number;
}

export interface ListApiKeysResponse {
    readonly keys?: ApiKeyRecord[];
    readonly api_keys?: ApiKeyRecord[];
    readonly items?: ApiKeyRecord[];
    readonly pagination?: PaginationInfo;
}

export interface CreateApiKeyInput {
    readonly name: string;
    readonly expires_at?: string | null;
    readonly roles: string[];
    readonly scopes: string[];
}
