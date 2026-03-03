import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Bell, CheckCheck } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type NotificationType = 'approval' | 'borrow' | 'return' | 'equipment' | 'report' | 'general';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    /** Optional navigate target override */
    to?: string;
    /** Optional state to pass when navigating */
    state?: Record<string, unknown>;
}

interface NotificationPanelProps {
    notifications: Notification[];
    onClose: () => void;
    onMarkRead: (id: string) => void;
    onMarkAllRead: () => void;
}

// ─── Type → route mapping ─────────────────────────────────────────────────────

const TYPE_ROUTE: Record<NotificationType, { path: string; state?: Record<string, unknown> }> = {
    approval:  { path: '/lecturer/approval' },
    borrow:    { path: '/lecturer/history',  state: { tab: 'borrow'   } },
    return:    { path: '/lecturer/history',  state: { tab: 'borrow'   } },
    equipment: { path: '/lecturer/equipment' },
    report:    { path: '/lecturer/history',  state: { tab: 'report'   } },
    general:   { path: '/lecturer/history' },
};

// ─── Icon per type ────────────────────────────────────────────────────────────

const TYPE_ICON: Record<NotificationType, { icon: string; bg: string; color: string }> = {
    approval:  { icon: 'check_circle',          bg: 'bg-emerald-50 dark:bg-emerald-900/20', color: 'text-emerald-500' },
    borrow:    { icon: 'inventory_2',            bg: 'bg-blue-50   dark:bg-blue-900/20',     color: 'text-blue-500'    },
    return:    { icon: 'assignment_return',      bg: 'bg-amber-50  dark:bg-amber-900/20',    color: 'text-amber-500'   },
    equipment: { icon: 'devices',                bg: 'bg-violet-50 dark:bg-violet-900/20',   color: 'text-violet-500'  },
    report:    { icon: 'build_circle',           bg: 'bg-rose-50   dark:bg-rose-900/20',     color: 'text-rose-500'    },
    general:   { icon: 'notifications',          bg: 'bg-slate-100 dark:bg-slate-700/40',    color: 'text-slate-500'   },
};

// ─── NotificationItem ─────────────────────────────────────────────────────────

interface ItemProps {
    notification: Notification;
    onRead: (id: string) => void;
    onClose: () => void;
}

const NotificationItem: React.FC<ItemProps> = ({ notification, onRead, onClose }) => {
    const navigate = useNavigate();
    const { icon, bg, color } = TYPE_ICON[notification.type];
    const route = notification.to
        ? { path: notification.to, state: notification.state }
        : TYPE_ROUTE[notification.type];

    const handleClick = () => {
        onRead(notification.id);
        onClose();
        navigate(route.path, { state: route.state ?? {} });
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`w-full text-left px-5 py-4 border-b border-slate-100 dark:border-slate-700/40 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors group ${
                !notification.read ? 'bg-blue-50/60 dark:bg-slate-700/20' : ''
            }`}
        >
            <div className="flex items-start gap-3">
                {/* Type icon */}
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform`}>
                    <span className={`material-symbols-rounded text-[18px] ${color}`}>{icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-[0.8125rem] font-bold leading-snug ${
                            notification.read
                                ? 'text-slate-600 dark:text-slate-300'
                                : 'text-slate-800 dark:text-slate-100'
                        }`}>
                            {notification.title}
                        </h4>
                        {!notification.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />
                        )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                        {notification.message}
                    </p>
                    <span className="text-[0.6875rem] text-slate-400 dark:text-slate-500 mt-1.5 block">
                        {notification.timestamp}
                    </span>
                </div>
            </div>
        </button>
    );
};

// ─── NotificationPanel ────────────────────────────────────────────────────────

const NotificationPanel: React.FC<NotificationPanelProps> = ({
    notifications,
    onClose,
    onMarkRead,
    onMarkAllRead,
}) => {
    const navigate = useNavigate();
    const unreadCount = notifications.filter(n => !n.read).length;

    const handleViewAll = () => {
        onClose();
        navigate('/lecturer/notifications');
    };

    return (
        <div className="absolute right-0 mt-3 w-[22rem] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-[#1E2B58]/15 dark:shadow-black/40 border border-slate-200/60 dark:border-slate-700/50 overflow-hidden z-50"
            style={{ animation: 'fadeInDown 0.15s ease' }}
        >
            {/* ── Header ── */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <Bell className="w-4 h-4 text-[#1E2B58] dark:text-white" />
                    <h3 className="text-[0.9375rem] font-extrabold text-slate-800 dark:text-slate-100">
                        Notifications
                    </h3>
                    {unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-[0.625rem] font-black px-1.5 py-0.5 rounded-full leading-none">
                            {unreadCount}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    {unreadCount > 0 && (
                        <button
                            onClick={onMarkAllRead}
                            className="flex items-center gap-1 text-[0.6875rem] font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            title="Mark all as read"
                        >
                            <CheckCheck className="w-3.5 h-3.5" />
                            Mark all read
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/40 ml-1"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* ── List ── */}
            <div className="max-h-[22rem] overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(n => (
                        <NotificationItem
                            key={n.id}
                            notification={n}
                            onRead={onMarkRead}
                            onClose={onClose}
                        />
                    ))
                ) : (
                    <div className="px-6 py-14 text-center flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700/40 flex items-center justify-center">
                            <Bell className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">
                            No notifications
                        </p>
                    </div>
                )}
            </div>

            {/* ── Footer ── */}
            {notifications.length > 0 && (
                <div className="px-5 py-3.5 border-t border-slate-100 dark:border-slate-700/50 text-center">
                    <button
                        onClick={handleViewAll}
                        className="text-[0.8125rem] font-bold text-[#1E2B58] dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                    >
                        View All Notifications →
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationPanel;
