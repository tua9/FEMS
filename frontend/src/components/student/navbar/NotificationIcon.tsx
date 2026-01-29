import React, { useState, useEffect, useRef } from 'react';
import NotificationPanel from './NotificationPanel';

const NotificationIcon: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div ref={notificationRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-white/30 dark:hover:bg-slate-700/30 transition-colors text-slate-600 dark:text-slate-300"
                aria-label="Notifications"
            >
                <span className="material-symbols-outlined text-xl">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#0f172a]" />
            </button>

            {isOpen && <NotificationPanel onClose={() => setIsOpen(false)} />}
        </div>
    );
};

export default NotificationIcon;