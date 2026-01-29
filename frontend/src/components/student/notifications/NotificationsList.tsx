import React from 'react';
import NotificationSection from './NotificationSection';
import { Notification, NotificationGroup } from './types';

// Mock notification data
const NOTIFICATIONS_DATA: NotificationGroup[] = [
    {
        section: 'Today',
        notifications: [
            {
                id: '1',
                title: 'Borrow Request Approved',
                message: 'Your request for Laptop #42 has been accepted. You can pick it up at the IT desk.',
                icon: 'check_circle',
                iconColor: 'emerald',
                timestamp: '2 mins ago',
                isUnread: true,
            },
            {
                id: '2',
                title: 'Return Reminder',
                message: 'The iPad Pro is due for return by 5:00 PM today. Please ensure all data is backed up.',
                icon: 'schedule',
                iconColor: 'amber',
                timestamp: '1 hour ago',
                isUnread: true,
            },
        ],
    },
    {
        section: 'Yesterday',
        notifications: [
            {
                id: '3',
                title: 'System Update',
                message: 'Scheduled maintenance was completed successfully. New features are now live.',
                icon: 'info',
                iconColor: 'blue',
                timestamp: 'Oct 24, 08:30 PM',
                isUnread: false,
            },
        ],
    },
    {
        section: 'Earlier',
        notifications: [
            {
                id: '4',
                title: 'Report Issue Update',
                message: 'Maintenance staff has been assigned to your reported issue #REP-9021.',
                icon: 'warning',
                iconColor: 'red',
                timestamp: 'Oct 22, 11:15 AM',
                isUnread: false,
            },
            {
                id: '5',
                title: 'Item Returned',
                message: 'The HDMI Adapter #12 has been successfully returned and verified.',
                icon: 'history_edu',
                iconColor: 'emerald',
                timestamp: 'Oct 20, 04:45 PM',
                isUnread: false,
            },
        ],
    },
];

const NotificationsList: React.FC = () => {
    return (
        <div className="glass-main rounded-[2.5rem] overflow-hidden">
            {NOTIFICATIONS_DATA.map((group) => (
                <NotificationSection key={group.section} group={group} />
            ))}
        </div>
    );
};

export default NotificationsList;
