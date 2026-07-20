import React, { useState } from 'react';

interface CopyKeyInputProps {
    readonly value: unknown;
}

export const CopyKeyInput: React.FC<CopyKeyInputProps> = ({ value }) => {
    const [copied, setCopied] = useState(false);
    const [showKey, setShowKey] = useState(false);

    const getKeyString = (val: unknown): string => {
        if (typeof val === 'string') return val;
        if (val && typeof val === 'object') {
            const obj = val as Record<string, unknown>;
            if (typeof obj.raw_key === 'string' && obj.raw_key) return obj.raw_key;
            if (typeof obj.api_key === 'string' && obj.api_key) return obj.api_key;
            if (typeof obj.key === 'string' && obj.key) return obj.key;
            if (typeof obj.token === 'string' && obj.token) return obj.token;
            if (typeof obj.secret === 'string' && obj.secret) return obj.secret;
        }
        return val != null ? String(val) : '';
    };

    const keyString = getKeyString(value);

    const handleCopy = () => {
        if (!keyString) return;
        navigator.clipboard.writeText(keyString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex gap-2 items-center bg-surface-container-low border border-outline-variant rounded p-2.5 font-mono text-sm break-all w-full text-left">
            <span className="text-on-surface flex-1 select-all truncate pr-2 font-mono">
                {showKey ? keyString : '••••••••••••••••••••••••••••••••••••••••'}
            </span>
            <div className="flex items-center gap-1.5 shrink-0 select-none">
                <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="p-1 hover:bg-surface-container rounded cursor-pointer text-on-surface-variant hover:text-on-surface transition-colors outline-none"
                    title={showKey ? 'Hide key' : 'Show key'}
                >
                    <span className="material-symbols-outlined text-[18px] leading-none">
                        {showKey ? 'visibility_off' : 'visibility'}
                    </span>
                </button>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1 hover:bg-surface-container rounded cursor-pointer text-on-surface-variant hover:text-on-surface transition-colors outline-none"
                    title="Copy to clipboard"
                >
                    <span className="material-symbols-outlined text-[18px] text-[#587c94] leading-none">
                        {copied ? 'check' : 'content_copy'}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default CopyKeyInput;
