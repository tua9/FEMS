import React from 'react';
import { Link } from 'react-router-dom';

const NotificationPanel: React.FC = () => {
    return (
        <div className="glass-main p-6 rounded-3xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg text-navy-deep dark:text-white">
                    Notifications
                </h2>
                <span className="bg-blue-100 text-navy-deep dark:bg-blue-900/30 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded-full">
                    3 New
                </span>
            </div>

            {/* Notification items */}
            <div className="space-y-4">
                <div className="glass-card p-4 rounded-2xl flex gap-3 items-start border-l-4 border-emerald-500 shadow-sm">
                    <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
                    <div>
                        <p className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">
                            Request Approved
                        </p>
                        <p className="text-[11px] opacity-80 mt-1">Mac Studio M2 is ready for pickup at Room 402.</p>
                    </div>
                </div>

                <div className="glass-card p-4 rounded-2xl flex gap-3 items-start border-l-4 border-amber-500 shadow-sm">
                    <span className="material-symbols-outlined text-amber-500 text-lg">history</span>
                    <div>
                        <p className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400">
                            Return Reminder
                        </p>
                        <p className="text-[11px] opacity-80 mt-1">Projector PT-42 due in 2 hours.</p>
                    </div>
                </div>

                <div className="glass-card p-4 rounded-2xl flex gap-3 items-start border-l-4 border-blue-500 shadow-sm opacity-70">
                    <span className="material-symbols-outlined text-blue-500 text-lg">info</span>
                    <div>
                        <p className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400">
                            Maintenance Update
                        </p>
                        <p className="text-[11px] opacity-80 mt-1">Lab A-301 is closed for repairs.</p>
                    </div>
                </div>
            </div>

            {/* View all link */}
            <Link
                to="/notifications"
                className="mt-6 block w-full py-2 text-center text-sm font-bold text-navy-deep dark:text-blue-400 hover:opacity-70 transition-opacity"
            >
                View All Notifications →
            </Link>
        </div>
    );
};

export default NotificationPanel;