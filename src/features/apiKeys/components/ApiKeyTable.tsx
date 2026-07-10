import React from 'react';
import { ApiKeyRecord } from '../types/apiKey';
import ApiKeyRow from './ApiKeyRow';

interface ApiKeyTableProps {
    readonly apiKeys: ApiKeyRecord[];
    readonly onRotateClick: (apiKey: ApiKeyRecord) => void;
    readonly onRevokeClick: (apiKey: ApiKeyRecord) => void;
    readonly hasPermission: boolean;
}

export const ApiKeyTable: React.FC<ApiKeyTableProps> = ({
    apiKeys,
    onRotateClick,
    onRevokeClick,
    hasPermission,
}) => {
    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low border-b border-outline-variant text-xs font-semibold text-on-surface-variant sticky top-0 z-10 select-none">
                    <tr>
                        <th className="py-3 px-md font-semibold">Key Name</th>
                        <th className="py-3 px-md font-semibold">Roles</th>
                        <th className="py-3 px-md font-semibold">Scopes</th>
                        <th className="py-3 px-md font-semibold">Expires</th>
                        <th className="py-3 px-md font-semibold">Created</th>
                        <th className="py-3 px-md font-semibold">Status</th>
                        {hasPermission && <th className="py-3 px-md w-[64px]" />}
                    </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant font-sans text-sm text-on-surface">
                    {apiKeys.map((key) => (
                        <ApiKeyRow
                            key={key.id}
                            apiKey={key}
                            onRotateClick={onRotateClick}
                            onRevokeClick={onRevokeClick}
                            hasPermission={hasPermission}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ApiKeyTable;
