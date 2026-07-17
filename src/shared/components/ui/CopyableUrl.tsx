import React, { useState } from 'react';

interface CopyableUrlProps {
    readonly url: string;
    readonly className?: string;
}

export const CopyableUrl: React.FC<CopyableUrlProps> = ({ url, className = '' }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className={`flex items-center gap-1.5 font-mono text-xs ${className}`}>
            <a
                href={url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[#587c94] hover:underline truncate max-w-[260px]"
                title={url}
            >
                {url}
            </a>
            <button
                onClick={handleCopy}
                title="Copy URL"
                className="text-on-surface-variant hover:text-primary transition-colors shrink-0 cursor-pointer"
            >
                <span className="material-symbols-outlined text-[14px]">
                    {copied ? 'check' : 'content_copy'}
                </span>
            </button>
        </div>
    );
};
