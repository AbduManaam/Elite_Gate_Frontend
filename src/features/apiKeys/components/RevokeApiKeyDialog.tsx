import React from 'react';
import { ApiKeyRecord } from '../types/apiKey';
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal';

interface RevokeApiKeyDialogProps {
    readonly apiKey: ApiKeyRecord;
    readonly onClose: () => void;
    readonly onConfirm: () => void;
    readonly isPending: boolean;
}

export const RevokeApiKeyDialog: React.FC<RevokeApiKeyDialogProps> = ({
    apiKey,
    onClose,
    onConfirm,
    isPending,
}) => {
    return (
        <ConfirmModal
            isOpen={true} // Conditionally rendered by the parent
            title="Revoke API Key"
            isDanger
            message={
                <span>
                    Are you sure you want to revoke the credential <span className="font-bold">"{apiKey?.name}"</span>?
                </span>
            }
            description="This action is permanent and cannot be undone. The credential will be immediately invalidated and will fail to authorize any incoming requests."
            confirmLabel="Revoke Key"
            cancelLabel="Cancel"
            onConfirm={onConfirm}
            onClose={onClose}
            isPending={isPending}
            requireConfirmText="delete"
        />
    );
};

export default RevokeApiKeyDialog;
