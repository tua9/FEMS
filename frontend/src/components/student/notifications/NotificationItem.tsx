import React from 'react';
import { Notification, IconColor } from './types';

interface NotificationItemProps {
    notification: Notification;
}

// Map icon colors to Tailwind classes
const ICON_COLOR_MAP: Record<IconColor, { bg: string; icon: string }> = {
    emerald: { bg: 'bg-emerald-100 dark:bg-emerald-500/20', icon: 'text-emerald-600 dark:text-emerald-400' },
    amber: { bg: 'bg-amber-100 dark:bg-amber-500/20', icon: 'text-amber-600 dark:text-amber-400' },
    blue: { bg: 'bg-blue-100 dark:bg-blue-500/20', icon: 'text-[var(--navy-deep)] dark:text-blue-400' },
    red: { bg: 'bg-red-100 dark:bg-red-500/20', icon: 'text-red-600 dark:text-red-400' },
};

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
    const colorStyle = ICON_COLOR_MAP[notification.iconColor];

    return (
        <div className="notification-row px-8 py-6 flex items-center gap-6 cursor-pointer hover:bg-white/20 dark:hover:bg-white/5 transition-colors relative">
            {/* Unread indicator */}
            {notification.isUnread && (
                <div className="absolute left-3 w-2 h-2 rounded-full bg-red-500"></div>
            )}

            {/* Icon */}
            <div className={`w-12 h-12 rounded-2xl ${colorStyle.bg} flex items-center justify-center flex-shrink-0`}>
                <span className={`material-symbols-outlined ${colorStyle.icon} text-2xl`}>
                    {notification.icon}
                </span>
            </div>

            {/* Content */}
            <div className="flex-grow">
                <h4 className="text-base font-extrabold text-navy-deep dark:text-white leading-tight">
                    {notification.title}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {notification.message}
                </p>
            </div>

            {/* Timestamp */}
            <div className="text-right flex-shrink-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    {notification.timestamp}
                </p>
            </div>
        </div>
    );
};

export default NotificationItem;
