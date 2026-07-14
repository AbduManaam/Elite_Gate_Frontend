import React from 'react';
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal';
import { PolicyRecord } from '../api/policiesApi';

interface PolicyDeleteDialogProps {
  readonly isOpen: boolean;
  readonly policy: PolicyRecord | null;
  readonly isDeleting: boolean;
  readonly onConfirm: () => void;
  readonly onClose: () => void;
}

export const PolicyDeleteDialog: React.FC<PolicyDeleteDialogProps> = ({
  isOpen,
  policy,
  isDeleting,
  onConfirm,
  onClose,
}) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      title="Delete Policy"
      isDanger
      message={
        <span>
          Are you sure you want to delete policy <span className="font-bold">"{policy?.name}"</span>?
        </span>
      }
      description="Deleting this policy will immediately remove it from any associated ingress routes, reverting them to their default behaviors. This action cannot be undone."
      confirmLabel="Delete Policy"
      cancelLabel="Cancel"
      onConfirm={onConfirm}
      onClose={onClose}
      isPending={isDeleting}
      requireConfirmText="delete"
    />
  );
};
