import React, { useState, useMemo } from 'react';
import CustomDropdown from '@/components/shared/CustomDropdown';
import { MOCK_ADMIN_NOTIFICATIONS } from '@/data/admin/mockAdminNotifications';
import { NotifType } from '@/data/technician/mockNotifications';
import { PageHeader } from '@/components/shared/PageHeader';

const TYPE_LABELS: Record<NotifType | 'all', string> = {
    all: 'All',
    alert: 'Alerts',
    ticket: 'Tickets',
    assigned: 'Assignments',
    resolved: 'Resolved',
    handover: 'Borrowing',
};

const AdminNotifications: React.FC = () => {
    const [activeTab, setActiveTab] = useState<NotifType | 'all'>('all');
    const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>('all');
    const [items, setItems] = useState(MOCK_ADMIN_NOTIFICATIONS);

    // Stats
    const unreadCount = items.filter(n => !n.read).length;

    // Filtering Logic
    const filteredNotifications = useMemo(() => {
        return items.filter(n => {
            const matchesTab = activeTab === 'all' || n.type === activeTab;
            const matchesRead = filterRead === 'all' ||
                (filterRead === 'unread' && !n.read) ||
                (filterRead === 'read' && n.read);
            return matchesTab && matchesRead;
        });
    }, [items, activeTab, filterRead]);

    // Grouping Logic
    const groupedNotifications = useMemo(() => {
        const groups: Record<string, typeof filteredNotifications> = {
            'Today': [],
            'Yesterday': [],
            'Earlier': []
        };

        filteredNotifications.forEach(n => {
            if (n.time.includes('AM') || n.time.includes('PM') || n.time.includes('ago')) {
                groups['Today'].push(n);
            } else if (n.time === 'Yesterday') {
                groups['Yesterday'].push(n);
            } else {
                groups['Earlier'].push(n);
            }
        });

        return groups;
    }, [filteredNotifications]);

    const markAllRead = () => {
        setItems(prev => prev.map(n => ({ ...n, read: true })));
    };

    const toggleRead = (id: string) => {
        setItems(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
    };

    return (
        <div className="max-w-5xl mx-auto px-6 pt-6 sm:pt-8 pb-10">
            {/* Header with Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <PageHeader
                    title="Command Center"
                    subtitle={`Monitoring ${items.length} total events • ${unreadCount} unread alerts`}
                    className="items-start! text-left! mb-0!"
                />
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={markAllRead}
                        className="px-5 py-2.5 bg-[#1A2B56] text-white rounded-2xl font-bold text-xs hover:bg-[#2A3B66] transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">done_all</span>
                        Mark All Read
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="dashboard-card p-2 rounded-3xl mb-8 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-1 p-1 bg-slate-100/50 dark:bg-slate-900/30 rounded-2xl overflow-x-auto no-scrollbar">
                    {(Object.keys(TYPE_LABELS) as Array<NotifType | 'all'>).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === tab
                                ? 'bg-white dark:bg-slate-700 text-[#1A2B56] dark:text-white shadow-md'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            {TYPE_LABELS[tab]}
                        </button>
                    ))}
                </div>

                <div className="flex items-center">
                    <CustomDropdown
                        value={filterRead}
                        options={[
                            { value: 'all',    label: 'Status: All'  },
                            { value: 'unread', label: 'Unread Only'  },
                            { value: 'read',   label: 'Read Only'    },
                        ]}
                        onChange={v => setFilterRead(v as any)}
                        align="right"
                    />
                </div>
            </div>

            {/* Notification List Grouped */}
            <div className="space-y-10">
                {Object.entries(groupedNotifications).map(([groupName, groupItems]) => (
                    groupItems.length > 0 && (
                        <div key={groupName}>
                            <div className="flex items-center gap-4 mb-5 ml-2">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                                    {groupName}
                                </h3>
                                <div className="h-px flex-1 bg-gradient-to-r from-slate-200 dark:from-slate-700 to-transparent"></div>
                            </div>

                            <div className="space-y-3">
                                {groupItems.map((notif) => (
                                    <div
                                        key={notif.id}
                                        onClick={() => toggleRead(notif.id)}
                                        className={`group relative p-5 rounded-[28px] border transition-all cursor-pointer ${notif.read
                                            ? 'bg-white/30 dark:bg-slate-800/20 border-white/40 dark:border-white/5 opacity-60 grayscale-[0.3]'
                                            : 'bg-white/80 dark:bg-slate-700/50 border-white dark:border-white/10 shadow-xl shadow-blue-900/5 hover:-translate-y-1'
                                            }`}
                                    >
                                        <div className="flex items-start gap-5">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${notif.read
                                                ? 'bg-slate-100 dark:bg-slate-900 text-slate-400'
                                                : 'bg-[#1A2B56] text-white'
                                                }`}>
                                                <span className="material-symbols-outlined text-2xl">{notif.icon}</span>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1 gap-4">
                                                    <h4 className={`font-extrabold text-sm truncate ${notif.read ? 'text-slate-600 dark:text-slate-400' : 'text-[#1A2B56] dark:text-white'}`}>
                                                        {notif.title}
                                                    </h4>
                                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                                        {notif.time}
                                                    </span>
                                                </div>
                                                <p className={`text-xs leading-relaxed line-clamp-2 ${notif.read ? 'text-slate-500 dark:text-slate-500' : 'text-slate-600 dark:text-slate-300'}`}>
                                                    {notif.body}
                                                </p>
                                            </div>

                                            {!notif.read && (
                                                <div className="mt-1 w-2.5 h-2.5 bg-rose-500 rounded-full shadow-lg shadow-rose-500/40 flex-shrink-0 animate-pulse"></div>
                                            )}
                                        </div>

                                        {/* Hover Actions */}
                                        <div className="absolute right-6 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="text-[10px] font-bold text-[#1A2B56] dark:text-blue-400 underline underline-offset-4">
                                                {notif.read ? 'Mark Unread' : 'Mark Read'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}

                {filteredNotifications.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-center bg-white/40 dark:bg-slate-800/20 rounded-[40px] border border-dashed border-slate-300 dark:border-slate-700">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-3xl text-slate-400">filter_list_off</span>
                        </div>
                        <h4 className="text-slate-700 dark:text-slate-300 font-bold mb-1">No matches found</h4>
                        <p className="text-slate-500 text-xs px-10">Try adjusting your filters to see more notifications.</p>
                        <button
                            onClick={() => { setActiveTab('all'); setFilterRead('all'); }}
                            className="mt-6 text-xs font-bold text-[#1A2B56] dark:text-blue-400 hover:underline"
                        >
                            Reset all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminNotifications;
