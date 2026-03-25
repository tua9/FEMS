import React, { useState, useMemo, useEffect } from 'react';
import CustomDropdown from '@/components/shared/CustomDropdown';
import { PageHeader } from '@/components/shared/PageHeader';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { formatDistanceToNow } from 'date-fns';
import BroadcastModal from '@/components/admin/notifications/BroadcastModal';
import { Radio, Loader2, Bell } from 'lucide-react';
const TYPE_LABELS= {
 all: 'All',
 approval: 'Approvals',
 borrow: 'Borrowing',
 return: 'Returns',
 equipment: 'Equipment',
 report: 'Reports',
 general: 'General'
};

const AdminNotifications = () => {
 const {
 notifications,
 unreadCount,
 loading,
 fetchNotifications,
 markAsRead,
 markAllAsRead,
 } = useNotificationStore();

 const [activeTab, setActiveTab] = useState('all');
 const [filterRead, setFilterRead] = useState('all');
 const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

 useEffect(() => {
 fetchNotifications(true);
 }, [fetchNotifications]);

 // Filtering Logic
 const filteredNotifications = useMemo(() => {
 return notifications.filter(n => {
 const matchesTab = activeTab === 'all' || n.type === activeTab;
 const matchesRead = filterRead === 'all' ||
 (filterRead === 'unread' && !n.read) ||
 (filterRead === 'read' && n.read);
 return matchesTab && matchesRead;
 });
 }, [notifications, activeTab, filterRead]);

 // Grouping Logic
 const groupedNotifications = useMemo(() => {
 const groups= {
 'Today': [],
 'Yesterday': [],
 'Earlier': []
 };

 const now = new Date();
 const yesterday = new Date(now);
 yesterday.setDate(now.getDate() - 1);

 filteredNotifications.forEach(n => {
 const d = new Date(n.createdAt || Date.now());
 if (d.toDateString() === now.toDateString()) {
 groups['Today'].push(n);
 } else if (d.toDateString() === yesterday.toDateString()) {
 groups['Yesterday'].push(n);
 } else {
 groups['Earlier'].push(n);
 }
 });

 return groups;
 }, [filteredNotifications]);

 return (
 <div className="max-w-5xl mx-auto px-6 pt-6 sm:pt-8 pb-10">
 {/* Header with Stats */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
 <PageHeader
 title="Command Center"
 subtitle={`Monitoring ${notifications.length} total events • ${unreadCount} unread alerts`}
 className="items-start text-left mb-0!"
 />
 <div className="flex items-center gap-3 shrink-0">
 <button
 onClick={() => setIsBroadcastModalOpen(true)}
 className="px-5 py-2.5 bg-blue-500 text-white rounded-2xl font-bold text-xs hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
 >
 <Radio className="w-4 h-4" />
 Broadcast
 </button>
 <button
 onClick={markAllAsRead}
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
 {(Object.keys(TYPE_LABELS)).map((tab) => (
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
 { value: 'all', label: 'Status: All' },
 { value: 'unread', label: 'Unread Only' },
 { value: 'read', label: 'Read Only' },
 ]}
 onChange={v => setFilterRead(v)}
 align="right"
 />
 </div>
 </div>

 {/* Notification List Grouped */}
 <div className="space-y-10">
 {loading ? (
 <div className="py-20 flex flex-col items-center gap-4">
 <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
 <p className="text-sm font-bold text-slate-400">Fetching latest alerts...</p>
 </div>
 ) => (
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
 key={notif._id}
 onClick={() => !notif.read && markAsRead(notif._id)}
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
 <span className="material-symbols-outlined text-2xl">
 {notif.type === 'approval' ? 'check_circle' : 
 notif.type === 'borrow' ? 'inventory_2' :
 notif.type === 'report' ? 'build_circle' : 'notifications'}
 </span>
 </div>

 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between mb-1 gap-4">
 <h4 className={`font-extrabold text-sm truncate ${notif.read ? 'text-slate-600 dark:text-slate-400' : 'text-[#1A2B56] dark:text-white'}`}>
 {notif.title}
 </h4>
 <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">
 {formatDistanceToNow(new Date(notif.createdAt || Date.now()), { addSuffix: true })}
 </span>
 </div>
 <p className={`text-xs leading-relaxed line-clamp-2 ${notif.read ? 'text-slate-500 dark:text-slate-500' : 'text-slate-600 dark:text-slate-300'}`}>
 {notif.message}
 </p>
 </div>

 {!notif.read && (
 <div className="mt-1 w-2.5 h-2.5 bg-rose-500 rounded-full shadow-lg shadow-rose-500/40 flex-shrink-0 animate-pulse"></div>
 )}
 </div>
 </div>
 ))}
 </div>
 </div>
 )
 ))}

 {!loading && filteredNotifications.length === 0 && (
 <div className="py-20 flex flex-col items-center justify-center text-center bg-white/40 dark:bg-slate-800/20 rounded-[40px] border border-dashed border-slate-300 dark:border-slate-700">
 <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
 <Bell className="w-8 h-8 text-slate-400" />
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

 <BroadcastModal 
 isOpen={isBroadcastModalOpen}
 onClose={() => setIsBroadcastModalOpen(false)}
 onSuccess={() => fetchNotifications(true)}
 />
 </div>
 );
};

export default AdminNotifications;
