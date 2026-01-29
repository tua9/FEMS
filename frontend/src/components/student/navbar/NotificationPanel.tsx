import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
}

interface NotificationPanelProps {
    onClose: () => void;
}

// Mock notification data
const NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        title: 'Equipment Request Approved',
        message: 'Your request for Laptop has been approved and is ready for pickup.',
        timestamp: '2 hours ago',
        read: false,
    },
    {
        id: '2',
        title: 'Return Reminder',
        message: 'Please return the Projector by tomorrow.',
        timestamp: '1 day ago',
        read: false,
    },
    {
        id: '3',
        title: 'New Equipment Available',
        message: 'Camera equipment is now available for borrowing.',
        timestamp: '3 days ago',
        read: true,
    },
    {
        id: '4',
        title: 'Issue Resolved',
        message: 'Your reported issue with Monitor has been resolved.',
        timestamp: '1 week ago',
        read: true,
    },
];

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
    const navigate = useNavigate();

    const handleViewAll = () => {
        navigate('/notifications');
        onClose();
    };

    return (
        <div className="absolute right-0 mt-3 w-96 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    Notifications
                </h3>
                <button
                    onClick={onClose}
                    className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    aria-label="Close notifications"
                >
                    <span className="material-symbols-outlined text-xl">close</span>
                </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
                {NOTIFICATIONS.length > 0 ? (
                    NOTIFICATIONS.map((notification) => (
                        <NotificationItem key={notification.id} notification={notification} />
                    ))
                ) : (
                    <div className="px-6 py-12 text-center">
                        <p className="text-slate-500 dark:text-slate-400">No notifications</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            {NOTIFICATIONS.length > 0 && (
                <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-700 text-center">
                    <button
                        onClick={handleViewAll}
                        className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                        View All Notifications
                    </button>
                </div>
            )}
        </div>
    );
};

interface NotificationItemProps {
    notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
    return (
        <div
            className={`px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50 dark:bg-slate-700/20' : ''
                }`}
        >
            <div className="flex items-start gap-3">
                {/* Unread indicator */}
                {!notification.read && (
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {notification.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {notification.message}
                    </p>
                    <span className="text-xs text-slate-500 dark:text-slate-500 mt-2 block">
                        {notification.timestamp}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default NotificationPanel;