import React, { useState } from 'react';

interface CopyableTextProps {
  readonly value: string;
  readonly className?: string;
  readonly truncate?: boolean;
}

export const CopyableText: React.FC<CopyableTextProps> = ({
  value,
  className = '',
  truncate = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = value;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (!successful) {
          throw new Error('Copy failed');
        }
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={`flex items-center gap-1.5 font-mono text-xs ${className}`}>
      <span
        className={`text-on-surface select-all ${truncate ? 'truncate max-w-[280px]' : ''}`}
        title={value}
      >
        {value}
      </span>
      <button
        onClick={handleCopy}
        type="button"
        title="Copy text"
        className="text-on-surface-variant hover:text-primary transition-colors shrink-0 cursor-pointer p-0.5 rounded hover:bg-slate-100"
      >
        <span className="material-symbols-outlined text-[14px]">
          {copied ? 'check' : 'content_copy'}
        </span>
      </button>
    </div>
  );
};

export default CopyableText;
