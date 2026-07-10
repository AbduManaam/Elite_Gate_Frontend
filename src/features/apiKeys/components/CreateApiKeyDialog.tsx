import React, { useState } from 'react';
import { CreateApiKeyInput } from '../types/apiKey';

interface CreateApiKeyDialogProps {
    readonly onClose: () => void;
    readonly onSubmit: (input: CreateApiKeyInput) => void;
    readonly isPending: boolean;
    readonly error: Error | null;
}

export const CreateApiKeyDialog: React.FC<CreateApiKeyDialogProps> = ({
    onClose,
    onSubmit,
    isPending,
    error,
}) => {
    const [name, setName] = useState('');
    const [expiresAt, setExpiresAt] = useState('');
    const [roles, setRoles] = useState('');
    const [scopes, setScopes] = useState('');
    const [formError, setFormError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (!name.trim()) {
            setFormError('Key Name is required');
            return;
        }

        const rolesArr = roles
            .split(',')
            .map((r) => r.trim())
            .filter(Boolean);
        const scopesArr = scopes
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

        onSubmit({
            name: name.trim(),
            expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
            roles: rolesArr,
            scopes: scopesArr,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-md backdrop-blur-xs select-none">
            <form
                onSubmit={handleSubmit}
                className="bg-white border border-outline-variant rounded-xl p-lg shadow-2xl w-[440px] max-w-full flex flex-col gap-md text-left"
            >
                <div className="flex justify-between items-center border-b border-outline-variant pb-md mb-xs">
                    <div>
                        <h3 className="font-headline-md text-headline-md text-on-surface">Create API Key</h3>
                        <p className="text-[11px] text-on-surface-variant mt-1">Create a new API key to authenticate and authorize client requests.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded p-1 transition-colors outline-none cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[20px] leading-none">close</span>
                    </button>
                </div>

                <label className="flex flex-col gap-1 text-xs font-semibold text-on-surface-variant">
                    Key Name *
                    <input
                        required
                        placeholder="Mobile App Client"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-outline-variant rounded px-2.5 py-1.5 text-sm font-sans text-on-surface outline-none focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94] transition-all bg-transparent"
                    />
                </label>

                <label className="flex flex-col gap-1 text-xs font-semibold text-on-surface-variant">
                    Expiration Date (optional)
                    <input
                        type="datetime-local"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                        className="border border-outline-variant rounded px-2.5 py-1.5 text-sm font-sans text-on-surface-variant outline-none focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94] transition-all bg-transparent"
                    />
                </label>

                <label className="flex flex-col gap-1 text-xs font-semibold text-on-surface-variant">
                    Roles (comma separated)
                    <input
                        placeholder="editor, viewer"
                        value={roles}
                        onChange={(e) => setRoles(e.target.value)}
                        className="border border-outline-variant rounded px-2.5 py-1.5 text-sm font-sans text-on-surface outline-none focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94] transition-all bg-transparent"
                    />
                </label>

                <label className="flex flex-col gap-1 text-xs font-semibold text-on-surface-variant">
                    Scopes (comma separated)
                    <input
                        placeholder="read, write"
                        value={scopes}
                        onChange={(e) => setScopes(e.target.value)}
                        className="border border-outline-variant rounded px-2.5 py-1.5 text-sm font-sans text-on-surface outline-none focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94] transition-all bg-transparent"
                    />
                </label>

                {(formError || error) && (
                    <p className="text-error text-xs font-sans font-semibold">
                        {formError || error?.message || 'Failed to generate key'}
                    </p>
                )}

                <div className="flex justify-end gap-sm mt-sm border-t border-outline-variant pt-md">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded transition-colors cursor-pointer outline-none"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-[#113346] hover:bg-[#123749] text-white px-4 py-2 rounded text-xs font-semibold disabled:opacity-50 cursor-pointer outline-none"
                    >
                        {isPending ? 'Generating...' : 'Generate Key'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateApiKeyDialog;
