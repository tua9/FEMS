import { ArrowLeft, Bell, Check, CheckCheck, Filter, Trash2 } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationType } from '@/components/lecturer/navbar/NotificationPanel';
import { useAuthStore } from '@/stores/useAuthStore';
import { PageHeader } from '@/components/shared/PageHeader';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    to: string;
    state?: Record<string, unknown>;
}

// ─── Role-aware mock data ─────────────────────────────────────────────────────

const getMockNotifications = (role: string): Notification[] => {
    const isStudent = role === 'student';
    const historyPath  = isStudent ? '/student/borrow-history' : '/lecturer/history';
    const equipPath    = isStudent ? '/student/equipment'      : '/lecturer/equipment';
    const approvalPath = isStudent ? '/student/borrow-history' : '/lecturer/approval';

    return [
        {
            id: '1',
            type: 'approval',
            title: 'Equipment Request Approved',
            message: 'Your request for Laptop has been approved and is ready for pickup at the Equipment Center.',
            timestamp: '2 hours ago',
            read: false,
            to: approvalPath,
        },
        {
            id: '2',
            type: 'return',
            title: 'Return Reminder',
            message: 'Please return the Projector by tomorrow to avoid late fees. Return deadline: March 4, 2026.',
            timestamp: '1 day ago',
            read: false,
            to: historyPath,
            state: { tab: 'borrow' },
        },
        {
            id: '3',
            type: 'equipment',
            title: 'New Equipment Available',
            message: 'Camera equipment is now available for borrowing. Check the Equipment Catalog for more details.',
            timestamp: '3 days ago',
            read: true,
            to: equipPath,
        },
        {
            id: '4',
            type: 'report',
            title: 'Issue Resolved',
            message: 'Your reported issue with Monitor has been resolved by the maintenance team. Issue ID: #RPT-2024-0089.',
            timestamp: '1 week ago',
            read: true,
            to: historyPath,
            state: { tab: 'report' },
        },
        {
            id: '5',
            type: 'borrow',
            title: 'Borrow Request Submitted',
            message: 'Your borrow request for Tablet has been submitted and is pending approval from the facility team.',
            timestamp: '2 weeks ago',
            read: true,
            to: historyPath,
            state: { tab: 'borrow' },
        },
        {
            id: '6',
            type: 'approval',
            title: 'Borrow Request Rejected',
            message: 'Your request for the Dell Monitor has been rejected. Reason: Equipment is reserved for another department.',
            timestamp: '3 weeks ago',
            read: true,
            to: approvalPath,
        },
        {
            id: '7',
            type: 'report',
            title: 'New Report Submitted',
            message: 'Your issue report for Room G405 projector has been logged. Ticket ID: #RPT-2024-0102.',
            timestamp: '1 month ago',
            read: true,
            to: historyPath,
            state: { tab: 'report' },
        },
        {
            id: '8',
            type: 'equipment',
            title: 'Equipment Overdue',
            message: 'The HP Laptop (SN: LT-2024-0033) is 2 days overdue. Please return it immediately to avoid penalties.',
            timestamp: '1 month ago',
            read: true,
            to: historyPath,
            state: { tab: 'borrow' },
        },
    ];
};

// ─── Type config ──────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<NotificationType, { icon: string; bg: string; color: string; label: string }> = {
    approval:  { icon: 'check_circle',      bg: 'bg-emerald-50 dark:bg-emerald-900/20', color: 'text-emerald-500',  label: 'Approval'  },
    borrow:    { icon: 'inventory_2',       bg: 'bg-blue-50   dark:bg-blue-900/20',     color: 'text-blue-500',    label: 'Borrow'    },
    return:    { icon: 'assignment_return', bg: 'bg-amber-50  dark:bg-amber-900/20',    color: 'text-amber-500',   label: 'Return'    },
    equipment: { icon: 'devices',           bg: 'bg-violet-50 dark:bg-violet-900/20',   color: 'text-violet-500',  label: 'Equipment' },
    report:    { icon: 'build_circle',      bg: 'bg-rose-50   dark:bg-rose-900/20',     color: 'text-rose-500',    label: 'Report'    },
    general:   { icon: 'notifications',    bg: 'bg-slate-100 dark:bg-slate-700/40',    color: 'text-slate-500',   label: 'General'   },
};

const FILTER_TABS: { value: 'all' | NotificationType; label: string }[] = [
    { value: 'all',       label: 'All'       },
    { value: 'approval',  label: 'Approvals' },
    { value: 'borrow',    label: 'Borrow'    },
    { value: 'return',    label: 'Returns'   },
    { value: 'equipment', label: 'Equipment' },
    { value: 'report',    label: 'Reports'   },
];

// ─── NotificationRow ──────────────────────────────────────────────────────────

interface RowProps {
    notification: Notification;
    onRead: (id: string) => void;
    onDelete: (id: string) => void;
}

const NotificationRow: React.FC<RowProps> = ({ notification, onRead, onDelete }) => {
    const navigate = useNavigate();
    const cfg = TYPE_CONFIG[notification.type];

    const handleClick = () => {
        onRead(notification.id);
        navigate(notification.to, { state: notification.state ?? {} });
    };

    return (
        <div
            className={`flex items-start gap-4 p-5 border-b border-[#1E2B58]/[0.05] dark:border-white/[0.05] last:border-0 group transition-colors ${
                !notification.read ? 'bg-blue-50/40 dark:bg-slate-700/20' : 'hover:bg-[#1E2B58]/[0.02] dark:hover:bg-white/[0.02]'
            }`}
        >
            {/* Type icon */}
            <button
                type="button"
                onClick={handleClick}
                className={`w-11 h-11 rounded-2xl ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5 hover:scale-105 transition-transform`}
            >
                <span className={`material-symbols-rounded text-[20px] ${cfg.color}`}>{cfg.icon}</span>
            </button>

            {/* Content */}
            <button
                type="button"
                onClick={handleClick}
                className="flex-1 min-w-0 text-left"
            >
                <div className="flex items-start justify-between gap-3">
                    <h3 className={`text-[0.875rem] font-bold leading-snug ${
                        !notification.read
                            ? 'text-[#1E2B58] dark:text-white'
                            : 'text-slate-600 dark:text-slate-300'
                    }`}>
                        {notification.title}
                    </h3>
                    {!notification.read && (
                        <span className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0 mt-1" />
                    )}
                </div>
                <p className="text-[0.8125rem] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {notification.message}
                </p>
                <div className="flex items-center gap-3 mt-2">
                    <span className={`text-[0.625rem] font-black uppercase tracking-wide px-2 py-0.5 rounded-lg ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                    </span>
                    <span className="text-[0.75rem] text-slate-400 dark:text-slate-500">
                        {notification.timestamp}
                    </span>
                </div>
            </button>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {!notification.read && (
                    <button
                        type="button"
                        onClick={() => onRead(notification.id)}
                        title="Mark as read"
                        className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/40 flex items-center justify-center transition-colors"
                    >
                        <Check className="w-3.5 h-3.5" />
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => onDelete(notification.id)}
                    title="Delete"
                    className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center justify-center transition-colors"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
};

// ─── NotificationsPage (shared) ───────────────────────────────────────────────

const NotificationsPage: React.FC = () => {
    const navigate  = useNavigate();
    const { user }  = useAuthStore();
    const role      = user?.role ?? 'student';

    const [notifications, setNotifications]   = useState<Notification[]>(() => getMockNotifications(role));
    const [activeFilter, setActiveFilter]     = useState<'all' | NotificationType>('all');
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    const filtered = useMemo(() => {
        return notifications.filter(n => {
            const typeMatch   = activeFilter === 'all' || n.type === activeFilter;
            const unreadMatch = !showUnreadOnly || !n.read;
            return typeMatch && unreadMatch;
        });
    }, [notifications, activeFilter, showUnreadOnly]);

    const handleMarkRead    = (id: string) => setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
    const handleMarkAllRead = ()           => setNotifications(p => p.map(n => ({ ...n, read: true })));
    const handleDelete      = (id: string) => setNotifications(p => p.filter(n => n.id !== id));
    const handleClearAll    = ()           => setNotifications([]);

    return (
        <div className="w-full">
            <main className="pt-6 sm:pt-8 pb-10 px-4 sm:px-6 w-full max-w-[90vw] xl:max-w-3xl mx-auto flex-1 flex flex-col">
                {/* Back */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-[0.8125rem] font-bold text-[#1E2B58]/60 dark:text-white/50 hover:text-[#1E2B58] dark:hover:text-white transition-colors mb-6 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back
                </button>

                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
                    <div className="flex-1">
                        <PageHeader
                            title="Notifications"
                            subtitle={unreadCount > 0
                                ? `${unreadCount} unread · Stay updated with equipment, borrows, and facility alerts.`
                                : "You're all caught up! Stay updated with equipment, borrows, and facility alerts."}
                            className="items-start! text-left! mb-0!"
                        />
                        {unreadCount > 0 && (
                            <span className="inline-block mt-2 bg-blue-500 text-white text-sm font-black px-2.5 py-1 rounded-full leading-none">
                                {unreadCount} new
                            </span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-1">
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={handleMarkAllRead}
                                className="flex items-center gap-2 px-4 py-2.5 glass-card rounded-xl! font-bold text-[0.8125rem] text-[#1E2B58] dark:text-white hover:bg-blue-50/60 dark:hover:bg-blue-900/20 transition-colors"
                            >
                                <CheckCheck className="w-4 h-4 text-blue-500" />
                                Mark all read
                            </button>
                        )}
                        {notifications.length > 0 && (
                            <button
                                type="button"
                                onClick={handleClearAll}
                                className="flex items-center gap-2 px-4 py-2.5 glass-card rounded-xl! font-bold text-[0.8125rem] text-red-500 dark:text-red-400 hover:bg-red-50/60 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear all
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter bar */}
                <div className="extreme-glass rounded-[1.5rem] p-2 mb-6 flex items-center gap-1 overflow-x-auto hide-scrollbar">
                    {FILTER_TABS.map(tab => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => setActiveFilter(tab.value)}
                            className={`px-4 py-2 rounded-xl text-[0.8125rem] font-bold whitespace-nowrap transition-all ${
                                activeFilter === tab.value
                                    ? 'active-pill-premium text-[#1E2B58] dark:text-white shadow-sm'
                                    : 'text-[#1E2B58]/55 dark:text-white/55 hover:text-[#1E2B58] dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/10'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}

                    <div className="h-5 w-px bg-[#1E2B58]/10 dark:bg-white/10 mx-1" />

                    <button
                        type="button"
                        onClick={() => setShowUnreadOnly(p => !p)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[0.8125rem] font-bold whitespace-nowrap transition-all ${
                            showUnreadOnly
                                ? 'active-pill-premium text-[#1E2B58] dark:text-white shadow-sm'
                                : 'text-[#1E2B58]/55 dark:text-white/55 hover:bg-white/40 dark:hover:bg-white/10'
                        }`}
                    >
                        <Filter className="w-3.5 h-3.5" />
                        Unread only
                    </button>
                </div>

                {/* List */}
                <div className="extreme-glass rounded-[2rem] overflow-hidden shadow-xl shadow-[#1E2B58]/8">
                    {filtered.length > 0 ? (
                        filtered.map(n => (
                            <NotificationRow
                                key={n.id}
                                notification={n}
                                onRead={handleMarkRead}
                                onDelete={handleDelete}
                            />
                        ))
                    ) : (
                        <div className="py-20 flex flex-col items-center gap-4 text-center">
                            <div className="w-16 h-16 rounded-3xl bg-[#1E2B58]/[0.05] dark:bg-white/[0.05] flex items-center justify-center">
                                <Bell className="w-8 h-8 text-[#1E2B58]/25 dark:text-white/25" />
                            </div>
                            <div>
                                <p className="text-[0.9375rem] font-bold text-[#1E2B58]/50 dark:text-white/50">
                                    {showUnreadOnly ? 'No unread notifications' : 'No notifications'}
                                </p>
                                <p className="text-sm text-[#1E2B58]/35 dark:text-white/35 mt-1 font-medium">
                                    {showUnreadOnly ? 'All caught up! Toggle off "Unread only" to see all.' : "You're all caught up."}
                                </p>
                            </div>
                            {showUnreadOnly && (
                                <button
                                    type="button"
                                    onClick={() => setShowUnreadOnly(false)}
                                    className="text-[0.8125rem] font-bold text-blue-500 hover:text-blue-600 transition-colors"
                                >
                                    Show all notifications
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Summary */}
                {filtered.length > 0 && (
                    <p className="mt-4 text-center text-[0.75rem] font-semibold text-[#1E2B58]/40 dark:text-white/40">
                        Showing {filtered.length} of {notifications.length} notifications
                        {unreadCount > 0 && ` · ${unreadCount} unread`}
                    </p>
                )}
            </main>
        </div>
    );
};

export default NotificationsPage;
