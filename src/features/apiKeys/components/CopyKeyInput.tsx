import React, { useState } from 'react';

interface CopyKeyInputProps {
    readonly value: string;
}

export const CopyKeyInput: React.FC<CopyKeyInputProps> = ({ value }) => {
    const [copied, setCopied] = useState(false);
    const [showKey, setShowKey] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex gap-2 items-center bg-surface-container-low border border-outline-variant rounded p-2.5 font-mono text-sm break-all w-full text-left">
            <span className="text-on-surface flex-1 select-all truncate pr-2 font-mono">
                {showKey ? value : '••••••••••••••••••••••••••••••••••••••••'}
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
