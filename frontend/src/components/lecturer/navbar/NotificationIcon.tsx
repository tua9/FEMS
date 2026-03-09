import React, { useEffect, useRef, useState } from 'react';
import NotificationPanel, { Notification } from './NotificationPanel';

// ─── Mock initial notifications ───────────────────────────────────────────────

const INITIAL_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'approval',
        title: 'Equipment Request Approved',
        message: 'Your request for Laptop has been approved and is ready for pickup.',
        timestamp: '2 hours ago',
        read: false,
    },
    {
        id: '2',
        type: 'return',
        title: 'Return Reminder',
        message: 'Please return the Projector by tomorrow to avoid late fees.',
        timestamp: '1 day ago',
        read: false,
    },
    {
        id: '3',
        type: 'equipment',
        title: 'New Equipment Available',
        message: 'Camera equipment is now available for borrowing.',
        timestamp: '3 days ago',
        read: true,
    },
    {
        id: '4',
        type: 'report',
        title: 'Issue Resolved',
        message: 'Your reported issue with Monitor has been resolved.',
        timestamp: '1 week ago',
        read: true,
    },
    {
        id: '5',
        type: 'borrow',
        title: 'Borrow Request Submitted',
        message: 'Your borrow request for Tablet has been submitted and is pending approval.',
        timestamp: '2 weeks ago',
        read: true,
    },
];

// ─── NotificationIcon ─────────────────────────────────────────────────────────

const NotificationIcon: React.FC = () => {
    const [isOpen, setIsOpen]                 = useState(false);
    const [notifications, setNotifications]   = useState<Notification[]>(INITIAL_NOTIFICATIONS);
    const containerRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Close panel when clicking outside
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen]);

    const handleMarkRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <div ref={containerRef} className="relative">
            {/* Bell button */}
            <button
                onClick={() => setIsOpen(p => !p)}
                className="relative w-9 h-9 flex items-center justify-center rounded-full border border-[#1E2B58]/30 dark:border-white/40 hover:bg-white/40 dark:hover:bg-white/10 transition-all"
                aria-label="Notifications"
            >
                <span className="material-symbols-outlined text-[18px] text-[#1E2B58] dark:text-white">
                    notifications
                </span>

                {/* Unread badge */}
                {unreadCount > 0 ? (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-[1.1rem] bg-red-500 text-white text-[0.5625rem] font-black rounded-full border-2 border-white dark:border-[#0f172a] flex items-center justify-center leading-none px-0.5">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                ) : (
                    // Subtle dot when all read
                    <span className="absolute top-0 right-0 w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full border-2 border-white dark:border-[#0f172a]" />
                )}
            </button>

            {/* Panel */}
            {isOpen && (
                <NotificationPanel
                    notifications={notifications}
                    onClose={() => setIsOpen(false)}
                    onMarkRead={handleMarkRead}
                    onMarkAllRead={handleMarkAllRead}
                />
            )}
        </div>
    );
};

export default NotificationIcon;
