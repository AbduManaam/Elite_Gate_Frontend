import React, { useState, useRef } from 'react';
import { ApiKeyRecord } from '../types/apiKey';
import ApiKeyStatusBadge from './ApiKeyStatusBadge';
import ApiKeyActionsMenu from './ApiKeyActionsMenu';

interface ApiKeyRowProps {
    readonly apiKey: ApiKeyRecord;
    readonly onRotateClick: (apiKey: ApiKeyRecord) => void;
    readonly onRevokeClick: (apiKey: ApiKeyRecord) => void;
    readonly hasPermission: boolean;
}

export const ApiKeyRow: React.FC<ApiKeyRowProps> = ({
    apiKey,
    onRotateClick,
    onRevokeClick,
    hasPermission,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'Never';
        return new Date(dateStr).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleMenuToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (buttonRef.current) {
            setTriggerRect(buttonRef.current.getBoundingClientRect());
        }
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <tr className="hover:bg-surface-container-low transition-colors group">
            <td className="py-4 px-md font-semibold text-[#587c94] font-sans">{apiKey.name}</td>
            <td className="py-4 px-md font-sans text-on-surface-variant">
                {apiKey.roles && apiKey.roles.length > 0 ? (
                    <div className="flex gap-1 flex-wrap">
                        {apiKey.roles.map((role) => (
                            <span key={role} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] border border-slate-200/50">
                                {role}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="text-outline/70">—</span>
                )}
            </td>
            <td className="py-4 px-md font-sans text-on-surface-variant">
                {apiKey.scopes && apiKey.scopes.length > 0 ? (
                    <div className="flex gap-1 flex-wrap">
                        {apiKey.scopes.map((scope) => (
                            <span key={scope} className="bg-slate-100/80 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">
                                {scope}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="text-outline/70">—</span>
                )}
            </td>
            <td className="py-4 px-md font-sans text-on-surface-variant">{formatDate(apiKey.expires_at)}</td>
            <td className="py-4 px-md font-sans text-on-surface-variant">{formatDate(apiKey.created_at)}</td>
            <td className="py-4 px-md">
                <ApiKeyStatusBadge status={apiKey.status} />
            </td>
            <td className="py-4 px-md text-right relative" onClick={(e) => e.stopPropagation()}>
                {hasPermission && apiKey.status.toLowerCase() === 'active' && (
                    <div>
                        <button
                            ref={buttonRef}
                            type="button"
                            onClick={handleMenuToggle}
                            className="text-[#587c94] hover:text-[#113346] hover:bg-surface-container-high rounded p-1 transition-all cursor-pointer outline-none"
                            title="Actions"
                        >
                            <span className="material-symbols-outlined text-[20px] leading-none">more_vert</span>
                        </button>
                        {isMenuOpen && (
                            <ApiKeyActionsMenu
                                triggerRect={triggerRect}
                                triggerRef={buttonRef}
                                onRotateClick={() => onRotateClick(apiKey)}
                                onRevokeClick={() => onRevokeClick(apiKey)}
                                onClose={() => setIsMenuOpen(false)}
                            />
                        )}
                    </div>
                )}
            </td>
        </tr>
    );
};

export default ApiKeyRow;
