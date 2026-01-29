import React from 'react';
import NotificationHeader from '@/components/student/notifications/NotificationHeader';
import NotificationsList from '@/components/student/notifications/NotificationsList';

const Notifications: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-6">
            <NotificationHeader />
            <NotificationsList />
        </div>
    );
};

export default Notifications;
