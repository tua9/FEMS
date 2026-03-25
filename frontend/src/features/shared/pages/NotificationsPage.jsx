import { ArrowLeft, Bell, Check, CheckCheck, Filter, Trash2, Loader2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { PageHeader } from '@/features/shared/components/PageHeader';
import { formatDistanceToNow } from 'date-fns';
import NotificationDetailModal from '@/features/shared/components/notifications/NotificationDetailModal';
import { NOTIFICATION_TYPE_CONFIG, getNotificationAction } from '@/utils/notificationHelper';
import { useAuthStore } from '@/stores/useAuthStore';
import { Radio } from 'lucide-react';
import BroadcastModal from '@/features/admin/components/notifications/BroadcastModal';

// ─── Type config ──────────────────────────────────────────────────────────────

const FILTER_TABS = [
 { value: 'all', label: 'All' },
 { value: 'approval', label: 'Approvals' },
 { value: 'borrow', label: 'Borrow' },
 { value: 'return', label: 'Returns' },
 { value: 'equipment', label: 'Equipment' },
 { value: 'report', label: 'Reports' },
];

// ─── NotificationRow ──────────────────────────────────────────────────────────

const NotificationRow = ({ notification, onRead, onDelete, onOpenDetail, isHighlighted }) => {
 const navigate = useNavigate();
 const cfg = NOTIFICATION_TYPE_CONFIG[notification.type] || NOTIFICATION_TYPE_CONFIG.general;

 const action = getNotificationAction(notification);
 const hasDetail = action.type === 'modal';

 const handleClick = () => {
 if (!notification.read) {
 onRead(notification._id);
 }
 if (action.type === 'modal') {
 // Open inline modal
 onOpenDetail(action.modalType, action.id);
 } else if (action.type === 'navigate') {
 navigate(action.to, { state: action.state ?? {} });
 }
 };

 return (
 <div
 className={`flex items-start gap-4 p-5 border-b border-[#1E2B58]/[0.05] dark:border-white/[0.05] last:border-0 group transition-all duration-500 ${
 isHighlighted ? 'ring-2 ring-blue-500 ring-inset bg-blue-50 dark:bg-blue-900/30 scale-[1.01] shadow-lg z-10' :
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
 {hasDetail && (
 <span className="text-[0.625rem] font-bold uppercase tracking-wide px-2 py-0.5 rounded-lg bg-[#1E2B58]/10 text-[#1E2B58]/60 dark:bg-white/10 dark:text-white/50">
 Tap to view detail
 </span>
 )}
 <span className="text-[0.75rem] text-slate-400 dark:text-slate-500">
 {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
 </span>
 </div>
 </button>

 {/* Actions */}
 <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
 {!notification.read && (
 <button
 type="button"
 onClick={(e) => { e.stopPropagation(); onRead(notification._id); }}
 title="Mark as read"
 className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/40 flex items-center justify-center transition-colors"
 >
 <Check className="w-3.5 h-3.5" />
 </button>
 )}
 <button
 type="button"
 onClick={(e) => { e.stopPropagation(); onDelete(notification._id); }}
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

const NotificationsPage = () => {
 const navigate = useNavigate();
 const { 
 notifications, 
 unreadCount, 
 loading, 
 fetchNotifications, 
 markAsRead, 
 markAllAsRead, 
 deleteNotification, 
 clearAll 
 } = useNotificationStore();

 const [activeFilter, setActiveFilter] = useState('all');
 const [showUnreadOnly, setShowUnreadOnly] = useState(false);
 const [highlightId, setHighlightId] = useState(null);
 const location = useLocation();
 const { user } = useAuthStore();
 const isAdmin = user?.role === 'admin';

 // Detail modal state
 const [detailModal, setDetailModal] = useState(null);
 const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

 useEffect(() => {
 fetchNotifications();
 
 // Check for highlightId in state (passed from NavNotificationBell)
 if (location.state?.highlightId) {
 setHighlightId(location.state.highlightId);
 const timer = setTimeout(() => setHighlightId(null), 3000);
 window.history.replaceState({}, document.title);
 return () => clearTimeout(timer);
 }
 }, [fetchNotifications, location.state]);

 const filtered = useMemo(() => {
 return notifications.filter(n => {
 const typeMatch = activeFilter === 'all' || n.type === activeFilter;
 const unreadMatch = !showUnreadOnly || !n.read;
 return typeMatch && unreadMatch;
 });
 }, [notifications, activeFilter, showUnreadOnly]);

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
 : "You're all caught up Stay updated with equipment, borrows, and facility alerts."}
 className="items-start text-left mb-0!"
 />
 {unreadCount > 0 && (
 <span className="inline-block mt-2 bg-blue-500 text-white text-sm font-black px-2.5 py-1 rounded-full leading-none">
 {unreadCount} new
 </span>
 )}
 </div>

 {/* Actions */}
 <div className="flex items-center gap-2 mt-1">
 {isAdmin && (
 <button
 type="button"
 onClick={() => setIsBroadcastModalOpen(true)}
 className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl font-bold text-[0.8125rem] hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 mr-2"
 >
 <Radio className="w-4 h-4" />
 Broadcast
 </button>
 )}
 {unreadCount > 0 && (
 <button
 type="button"
 onClick={markAllAsRead}
 className="flex items-center gap-2 px-4 py-2.5 glass-card rounded-xl font-bold text-[0.8125rem] text-[#1E2B58] dark:text-white hover:bg-blue-50/60 dark:hover:bg-blue-900/20 transition-colors"
 >
 <CheckCheck className="w-4 h-4 text-blue-500" />
 Mark all read
 </button>
 )}
 {notifications.length > 0 && (
 <button
 type="button"
 onClick={clearAll}
 className="flex items-center gap-2 px-4 py-2.5 glass-card rounded-xl font-bold text-[0.8125rem] text-red-500 dark:text-red-400 hover:bg-red-50/60 dark:hover:bg-red-900/20 transition-colors"
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
 <div className="extreme-glass rounded-[2rem] overflow-hidden shadow-xl shadow-[#1E2B58]/8 min-h-[400px]">
 {loading ? (
 <div className="py-20 flex flex-col items-center justify-center gap-4">
 <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
 <p className="text-sm font-bold text-[#1E2B58]/40 dark:text-white/40">Loading notifications...</p>
 </div>
) : filtered.length === 0 ? (
 <div className="py-20 flex flex-col items-center gap-4 text-center">
 <div className="w-16 h-16 rounded-3xl bg-[#1E2B58]/[0.05] dark:bg-white/[0.05] flex items-center justify-center">
 <Bell className="w-8 h-8 text-[#1E2B58]/25 dark:text-white/25" />
 </div>
 <div>
 <p className="text-[0.9375rem] font-bold text-[#1E2B58]/50 dark:text-white/50">
 {showUnreadOnly ? 'No unread notifications' : 'No notifications'}
 </p>
 <p className="text-sm text-[#1E2B58]/35 dark:text-white/35 mt-1 font-medium">
 {showUnreadOnly ? 'All caught up Toggle off "Unread only" to see all.' : "You're all caught up."}
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
) : (
 filtered.map((n) => (
 <NotificationRow
 key={n._id}
 notification={n}
 onRead={markAsRead}
 onDelete={deleteNotification}
 onOpenDetail={(type, id) => setDetailModal({ type, id })}
 isHighlighted={n._id === highlightId}
 />
 ))
)}
 </div>

 {/* Summary */}
 {!loading && filtered.length > 0 && (
 <p className="mt-4 text-center text-[0.75rem] font-semibold text-[#1E2B58]/40 dark:text-white/40">
 Showing {filtered.length} of {notifications.length} notifications
 {unreadCount > 0 && ` · ${unreadCount} unread`}
 </p>
 )}
 </main>

 {/* Detail Modal */}
 {detailModal && (
 <NotificationDetailModal
 entityType={detailModal.type}
 entityId={detailModal.id}
 onClose={() => setDetailModal(null)}
 />
 )}

 {isAdmin && (
 <BroadcastModal 
 isOpen={isBroadcastModalOpen}
 onClose={() => setIsBroadcastModalOpen(false)}
 onSuccess={() => fetchNotifications(true)}
 />
 )}
 </div>
 );
};

export default NotificationsPage;
