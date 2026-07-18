import React, { useState, useEffect } from 'react';

import { useActiveProject } from '../../../shared/hooks/useActiveProject';
import { useRoles } from '../../../shared/hooks/useRoles';
import { PageHeaderActions } from '../../../shared/components/PageHeaderActions';
import { useApiKeysQuery } from '../hooks/useApiKeys';
import { useCreateApiKeyMutation } from '../hooks/useCreateApiKey';
import { useRotateApiKeyMutation } from '../hooks/useRotateApiKey';
import { useRevokeApiKeyMutation } from '../hooks/useRevokeApiKey';
import { ApiKeyRecord, CreateApiKeyInput } from '../types/apiKey';

import ApiKeyToolbar from './ApiKeyToolbar';
import ApiKeyFilters from './ApiKeyFilters';
import ApiKeyTable from './ApiKeyTable';
import ApiKeySkeleton from './ApiKeySkeleton';
import ApiKeyEmptyState from './ApiKeyEmptyState';

import CreateApiKeyDialog from './CreateApiKeyDialog';
import ApiKeyGeneratedDialog from './ApiKeyGeneratedDialog';
import RotateApiKeyDialog from './RotateApiKeyDialog';
import RotateSuccessDialog from './RotateSuccessDialog';
import RevokeApiKeyDialog from './RevokeApiKeyDialog';

export const ApiCredentialsPage: React.FC = () => {
    const { projectId } = useActiveProject();
    const { can } = useRoles();

    // Pagination & Search Filters State
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); // reset to page 1 on search
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // TanStack Query list
    const { data, isLoading, error, refetch } = useApiKeysQuery(
        projectId ?? '',
        page,
        limit,
        debouncedSearch
    );

    // Mutations
    const createKey = useCreateApiKeyMutation(projectId ?? '');
    const rotateKey = useRotateApiKeyMutation(projectId ?? '');
    const revokeKey = useRevokeApiKeyMutation(projectId ?? '');

    // Modals Local State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [generatedKeyInfo, setGeneratedKeyInfo] = useState<{ name: string; key: string } | null>(null);
    const [keyToRotate, setKeyToRotate] = useState<ApiKeyRecord | null>(null);
    const [rotatedKeyInfo, setRotatedKeyInfo] = useState<{ name: string; key: string } | null>(null);
    const [keyToRevoke, setKeyToRevoke] = useState<ApiKeyRecord | null>(null);

    // Toasts
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToastMessage(message);
    };

    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    // Actions
    const handleCreateSubmit = (input: CreateApiKeyInput) => {
        createKey.mutate(input, {
            onSuccess: (res) => {
                setIsCreateOpen(false);
                setGeneratedKeyInfo({ name: res.name, key: res.api_key || res.raw_key || '' });
                showToast('✓ API Key Created Successfully');
            },
        });
    };

    const handleRotateConfirm = () => {
        if (!keyToRotate) return;
        rotateKey.mutate(keyToRotate.id, {
            onSuccess: (res) => {
                setRotatedKeyInfo({ name: res.name, key: res.api_key || res.raw_key || '' });
                setKeyToRotate(null);
                showToast('✓ API Key Rotated Successfully');
            },
        });
    };

    const handleRevokeConfirm = () => {
        if (!keyToRevoke) return;
        revokeKey.mutate(keyToRevoke.id, {
            onSuccess: () => {
                setKeyToRevoke(null);
                showToast('✓ API Key Revoked Successfully');
            },
        });
    };

    const hasPermission = can('editor');
    const apiKeys = data?.keys ?? [];
    const pagination = data?.pagination;

    const totalPages = pagination?.total_pages ?? 1;
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="flex flex-col gap-lg text-left relative w-full font-sans">
            {/* Toast Alert popup */}
            {toastMessage && (
                <div className="fixed bottom-4 right-4 z-50 bg-[#113346] text-white px-md py-3 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 border border-white/10 select-none">
                    <span className="material-symbols-outlined text-[18px] text-emerald-400">check_circle</span>
                    {toastMessage}
                </div>
            )}

            {/* Header */}
            <PageHeaderActions
                title="API Credentials"
                description="Manage secure client keys, API key rotation, and access scopes."
                className="select-none"
                actions={
                    hasPermission && projectId && (
                        <button
                            type="button"
                            onClick={() => setIsCreateOpen(true)}
                            className="bg-[#113346] text-white px-4 py-2 rounded font-semibold text-xs hover:bg-[#123749] transition-colors flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[18px] leading-none">add</span>
                            Create API Key
                        </button>
                    )
                }
            />

            {/* Table Container Card */}
            <div className="bg-white border border-outline-variant rounded-xl flex flex-col overflow-hidden shadow-sm">
                {/* Toolbar */}
                <ApiKeyToolbar
                    onFiltersToggle={() => setShowFilters(!showFilters)}
                    showFilters={showFilters}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                {/* Filters */}
                {showFilters && <ApiKeyFilters />}

                {/* Main State Handler */}
                {isLoading ? (
                    <ApiKeySkeleton />
                ) : error ? (
                    <div className="p-xl text-center flex flex-col items-center justify-center gap-md">
                        <span className="material-symbols-outlined text-[40px] text-error">error_outline</span>
                        <p className="text-sm text-error font-semibold">
                            Failed to load API keys: {error.message || 'Unknown network error'}
                        </p>
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="px-4 py-2 border border-outline-variant rounded text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                        >
                            Retry Connection
                        </button>
                    </div>
                ) : apiKeys.length === 0 ? (
                    <ApiKeyEmptyState
                        onCreateClick={() => setIsCreateOpen(true)}
                        hasPermission={hasPermission}
                    />
                ) : (
                    <>
                        {/* Table */}
                        <ApiKeyTable
                            apiKeys={apiKeys}
                            onRotateClick={(key) => setKeyToRotate(key)}
                            onRevokeClick={(key) => setKeyToRevoke(key)}
                            hasPermission={hasPermission}
                        />

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="p-4 border-t border-outline-variant bg-white rounded-b-xl flex justify-between items-center text-on-surface-variant text-xs select-none">
                                <span>
                                    Showing page {page} of {totalPages} ({pagination?.total ?? apiKeys.length} total keys)
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        disabled={page === 1}
                                        onClick={() => handlePageChange(page - 1)}
                                        className="p-1 rounded text-outline hover:text-on-surface disabled:opacity-30 disabled:hover:text-outline transition-colors cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-[20px] leading-none">chevron_left</span>
                                    </button>
                                    {[...Array(totalPages)].map((_, idx) => {
                                        const pageNum = idx + 1;
                                        const isActive = page === pageNum;
                                        return (
                                            <button
                                                type="button"
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`w-6 h-6 flex items-center justify-center rounded font-semibold text-xs cursor-pointer transition-colors ${
                                                    isActive
                                                        ? 'bg-[#113346] text-white shadow-sm'
                                                        : 'hover:bg-slate-100 text-on-surface-variant'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    <button
                                        type="button"
                                        disabled={page === totalPages}
                                        onClick={() => handlePageChange(page + 1)}
                                        className="p-1 rounded text-outline hover:text-on-surface disabled:opacity-30 disabled:hover:text-outline transition-colors cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-[20px] leading-none">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Dialogs */}
            {isCreateOpen && (
                <CreateApiKeyDialog
                    onClose={() => setIsCreateOpen(false)}
                    onSubmit={handleCreateSubmit}
                    isPending={createKey.isPending}
                    error={createKey.error as Error | null}
                />
            )}

            {generatedKeyInfo && (
                <ApiKeyGeneratedDialog
                    apiKeyName={generatedKeyInfo.name}
                    rawKey={generatedKeyInfo.key}
                    onClose={() => setGeneratedKeyInfo(null)}
                />
            )}

            {keyToRotate && (
                <RotateApiKeyDialog
                    apiKey={keyToRotate}
                    onClose={() => setKeyToRotate(null)}
                    onConfirm={handleRotateConfirm}
                    isPending={rotateKey.isPending}
                />
            )}

            {rotatedKeyInfo && (
                <RotateSuccessDialog
                    apiKeyName={rotatedKeyInfo.name}
                    newRawKey={rotatedKeyInfo.key}
                    onClose={() => setRotatedKeyInfo(null)}
                />
            )}

            {keyToRevoke && (
                <RevokeApiKeyDialog
                    apiKey={keyToRevoke}
                    onClose={() => setKeyToRevoke(null)}
                    onConfirm={handleRevokeConfirm}
                    isPending={revokeKey.isPending}
                />
            )}
        </div>
    );
};

export default ApiCredentialsPage;
