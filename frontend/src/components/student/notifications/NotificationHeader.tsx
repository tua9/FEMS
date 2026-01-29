import React from 'react';

const NotificationHeader: React.FC = () => {
    return (
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            {/* Title section */}
            <div>
                <h1 className="text-4xl font-extrabold text-navy-deep dark:text-white mb-2 tracking-tight">
                    All Notifications
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                    Stay updated with your equipment requests and system alerts.
                </p>
            </div>

            {/* Mark all as read button */}
            <button className="text-xs font-black uppercase tracking-widest text-navy-deep dark:text-blue-400 hover:opacity-70 transition-opacity">
                Mark all as read
            </button>
        </div>
    );
};

export default NotificationHeader;
