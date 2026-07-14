import React from 'react';
import { UpstreamRecord } from '../api/types';
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal';

interface UpstreamDeleteDialogProps {
    readonly upstream: UpstreamRecord;
    readonly isOpen: boolean;
    readonly isDeleting: boolean;
    readonly onConfirm: () => void;
    readonly onCancel: () => void;
}

export const UpstreamDeleteDialog: React.FC<UpstreamDeleteDialogProps> = ({
    upstream,
    isOpen,
    isDeleting,
    onConfirm,
    onCancel,
}) => {
    return (
        <ConfirmModal
            isOpen={isOpen}
            title="Delete Upstream"
            isDanger
            message={
                <span>
                    Are you sure you want to delete upstream service <span className="font-bold">"{upstream?.name}"</span>?
                </span>
            }
            description="This action cannot be undone. Any API Gateway routes currently referencing this upstream may stop working."
            confirmLabel="Delete Upstream"
            cancelLabel="Cancel"
            onConfirm={onConfirm}
            onClose={onCancel}
            isPending={isDeleting}
            requireConfirmText="delete"
        />
    );
};
