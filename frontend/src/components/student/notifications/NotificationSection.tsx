import React from 'react';
import NotificationItem from './NotificationItem';
import { NotificationGroup } from './types';

interface NotificationSectionProps {
    group: NotificationGroup;
}

const NotificationSection: React.FC<NotificationSectionProps> = ({ group }) => {
    return (
        <>
            {/* Section header */}
            <div className="border-b border-white/30 dark:border-white/5">
                <div className="px-8 py-4 bg-white/20 dark:bg-white/5">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                        {group.section}
                    </span>
                </div>

                {/* Notification items */}
                {group.notifications.map((notification, index) => (
                    <React.Fragment key={notification.id}>
                        {index > 0 && <div className="border-t border-white/10 dark:border-white/5"></div>}
                        <NotificationItem notification={notification} />
                    </React.Fragment>
                ))}
            </div>
        </>
    );
};

export default NotificationSection;
