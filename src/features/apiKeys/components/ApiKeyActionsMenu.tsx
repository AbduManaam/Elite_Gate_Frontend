import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface ApiKeyActionsMenuProps {
    readonly triggerRect: DOMRect | null;
    readonly triggerRef: React.RefObject<HTMLButtonElement | null>;
    readonly onRotateClick: () => void;
    readonly onRevokeClick: () => void;
    readonly onClose: () => void;
}

export const ApiKeyActionsMenu: React.FC<ApiKeyActionsMenuProps> = ({
    triggerRect,
    triggerRef,
    onRotateClick,
    onRevokeClick,
    onClose,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (!triggerRect) return;

        const calculatePosition = () => {
            const menuWidth = 160; // w-40 is 10rem = 160px
            const top = triggerRect.bottom + window.scrollY + 4;
            const left = triggerRect.right + window.scrollX - menuWidth;
            setCoords({ top, left });
        };

        calculatePosition();

        // Optional: Recalculate on window resize/scroll to keep it aligned
        window.addEventListener('resize', calculatePosition);
        window.addEventListener('scroll', calculatePosition, { passive: true });

        return () => {
            window.removeEventListener('resize', calculatePosition);
            window.removeEventListener('scroll', calculatePosition);
        };
    }, [triggerRect]);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            // Avoid closing when clicking the trigger button itself (let toggle handle it)
            if (triggerRef.current && triggerRef.current.contains(e.target as Node)) {
                return;
            }
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [onClose, triggerRef]);

    if (!triggerRect) return null;

    return createPortal(
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                top: `${coords.top}px`,
                left: `${coords.left}px`,
            }}
            className="w-40 bg-white border border-outline-variant rounded-lg shadow-lg py-1 z-50 font-sans text-left"
        >
            <button
                type="button"
                onClick={() => {
                    onRotateClick();
                    onClose();
                }}
                className="w-full text-left px-4 py-2 text-xs text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer transition-colors outline-none"
            >
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant leading-none">sync</span>
                Rotate Key
            </button>
            <button
                type="button"
                onClick={() => {
                    onRevokeClick();
                    onClose();
                }}
                className="w-full text-left px-4 py-2 text-xs text-error hover:bg-error/5 flex items-center gap-2 cursor-pointer transition-colors border-t border-outline-variant outline-none"
            >
                <span className="material-symbols-outlined text-[16px] text-error leading-none">delete_forever</span>
                Revoke Key
            </button>
        </div>,
        document.body
    );
};

export default ApiKeyActionsMenu;
