import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, X } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '@/mocks/technician/mockNotifications';

// ── icon colour per type ────────────────────────────────────────────────────
const TYPE_STYLE= {
 ticket: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-500 dark:text-blue-400', icon: 'confirmation_number' },
 assigned: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-500 dark:text-indigo-400', icon: 'assignment_ind' },
 resolved: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-500 dark:text-emerald-400', icon: 'check_circle' },
 alert: { bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-500 dark:text-rose-400', icon: 'warning' },
 handover: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-500 dark:text-amber-400', icon: 'swap_horiz' },
};

// NOTE: Only `y` on the outer motion.div — opacity on a parent creates a GPU
// compositing layer that breaks backdrop-filter (causes ~0.5 s blur delay).
// Opacity is animated on the inner glass <motion.div> instead.
const wrapperVariants = {
 hidden: { y: -8 },
 visible: { y: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
 exit: { y: -6, transition: { duration: 0.15 } },
};

const glassVariants = {
 hidden: { opacity: 0 },
 visible: { opacity: 1, transition: { duration: 0.18, ease: 'easeOut' } },
 exit: { opacity: 0, transition: { duration: 0.12 } },
};

const AdminNotificationDropdown = () => {
 const [open, setOpen] = useState(false);
 const [items, setItems] = useState(MOCK_NOTIFICATIONS);
 const buttonRef = useRef(null);
 const dropdownRef = useRef(null);
 const navigate = useNavigate();

 const unread = items.filter((n) => !n.isRead).length;

 // ── Portal position ───────────────────────────────────────────────────────
 const [pos, setPos] = useState({ top: 0, right: 0 });

 const updatePos = () => {
 if (!buttonRef.current) return;
 const rect = buttonRef.current.getBoundingClientRect();
 setPos({ top: rect.bottom + 12, right: window.innerWidth - rect.right });
 };

 const handleToggle = () => {
 if (!open) updatePos();
 setOpen((o) => !o);
 };

 useEffect(() => {
 if (!open) return;
 window.addEventListener('resize', updatePos);
 window.addEventListener('scroll', updatePos, true);
 return () => {
 window.removeEventListener('resize', updatePos);
 window.removeEventListener('scroll', updatePos, true);
 };
 }, [open]);

 // close on outside click
 useEffect(() => {
 if (!open) return;
 const handler = (e) => {
 if (
 buttonRef.current?.contains(e.target) ||
 dropdownRef.current?.contains(e.target)
 ) return;
 setOpen(false);
 };
 document.addEventListener('mousedown', handler);
 return () => document.removeEventListener('mousedown', handler);
 }, [open]);

 const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
 const markRead = (id) => setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

 return (
 <>
 {/* ── Bell button ── */}
 <button
 ref={buttonRef}
 onClick={handleToggle}
 aria-label="Notifications"
 className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#1A2B56]/20 transition-all hover:bg-white/60 dark:border-white/20 dark:hover:bg-white/10"
 >
 <span className="material-symbols-outlined text-[18px] text-[#1A2B56] dark:text-white">
 notifications
 </span>
 {unread > 0 ? (
 <span className="absolute -right-0.5 -top-0.5 flex h-[1.1rem] min-w-[1.1rem] items-center justify-center rounded-full border-2 border-white bg-red-500 px-0.5 text-[0.5625rem] font-black leading-none text-white dark:border-[#0f172a]">
 {unread > 9 ? '9+' : unread}
 </span>
 ) : (
 <span className="absolute right-0 top-0 h-2 w-2 rounded-full border-2 border-white bg-slate-300 dark:border-[#0f172a] dark:bg-slate-600" />
 )}
 </button>

 {/* ── Dropdown portal ── */}
 {createPortal(
 <AnimatePresence>
 {open && (
 // Outer wrapper: only y-translate, NO opacity
 <motion.div
 ref={dropdownRef}
 variants={wrapperVariants}
 initial="hidden"
 animate="visible"
 exit="exit"
 style={{
 position: 'fixed',
 top: pos.top,
 right: pos.right,
 zIndex: 9999,
 width: '20rem',
 }}
 >
 {/* Glass surface: opacity animated here so blur is instant */}
 <motion.div
 variants={glassVariants}
 initial="hidden"
 animate="visible"
 exit="exit"
 className={[
 'overflow-hidden rounded-2xl',
 'bg-white/30 backdrop-saturate-150',
 'border border-white/60',
 'shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]',
 'dark:bg-slate-900/40',
 'dark:border-white/15',
 'dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7)]',
 ].join(' ')}
 style={{
 WebkitBackdropFilter: 'blur(20px) saturate(160%)',
 backdropFilter: 'blur(20px) saturate(160%)',
 }}
 >
 {/* Header */}
 <div className="flex items-center justify-between border-b border-black/10 bg-black/3 px-5 py-3.5 dark:border-white/15 dark:bg-white/5">
 <div className="flex items-center gap-2.5">
 <Bell className="h-4 w-4 text-[#1A2B56] dark:text-white" />
 <span className="text-[0.9375rem] font-extrabold tracking-tight text-slate-900 dark:text-white">
 Notifications
 </span>
 {unread > 0 && (
 <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[0.5625rem] font-black leading-none text-white">
 {unread}
 </span>
 )}
 </div>
 <div className="flex items-center gap-1">
 {unread > 0 && (
 <button
 onClick={markAllRead}
 className="flex items-center gap-1 rounded-lg px-2 py-1 text-[0.6875rem] font-bold text-blue-500 transition-colors hover:bg-blue-500/8 hover:text-blue-600 dark:text-blue-400 dark:hover:bg-blue-400/10"
 >
 <CheckCheck className="h-3.5 w-3.5" />
 Mark all
 </button>
 )}
 <button
 onClick={() => setOpen(false)}
 aria-label="Close"
 className="ml-1 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-black/5 hover:text-slate-600 dark:hover:bg-white/8 dark:hover:text-slate-200"
 >
 <X className="h-4 w-4" />
 </button>
 </div>
 </div>

 {/* List */}
 <div className="max-h-88 overflow-y-auto">
 {items.length === 0 ? (
 <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
 <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5 dark:bg-white/8">
 <Bell className="h-6 w-6 text-slate-400 dark:text-slate-500" />
 </div>
 <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">
 No notifications
 </p>
 </div>
 ) => {
 const style = TYPE_STYLE[notif.type];
 return (
 <button
 key={notif.id}
 onClick={() => markRead(notif.id)}
 className={[
 'group w-full border-b border-black/8 px-4 py-3.5 text-left transition-colors last:border-0 hover:bg-black/5 dark:border-white/12 dark:hover:bg-white/10',
 !notif.isRead ? 'bg-blue-500/6 dark:bg-blue-400/10' : '',
 ].join(' ')}
 >
 <div className="flex items-start gap-3">
 <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${style.bg}`}>
 <span className={`material-symbols-outlined text-[16px] ${style.text}`}>
 {notif.icon ?? style.icon}
 </span>
 </div>
 <div className="min-w-0 flex-1">
 <div className="flex items-start justify-between gap-2">
 <p className={`text-[0.8125rem] font-bold leading-tight ${notif.isRead ? 'text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
 {notif.title}
 </p>
 {!notif.isRead && (
 <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
 )}
 </div>
 <p className={`mt-0.5 line-clamp-2 text-xs leading-snug ${notif.isRead ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-300'}`}>
 {notif.body}
 </p>
 <span className="mt-1 block text-[0.6875rem] font-semibold text-slate-400 dark:text-slate-500">
 {notif.time}
 </span>
 </div>
 </div>
 </button>
 );
 })
 )}
 </div>

 {/* Footer */}
 <div className="border-t border-black/10 bg-black/3 px-5 py-3 text-center dark:border-white/15 dark:bg-white/5">
 <button
 onClick={() => { setOpen(false); navigate('/admin/notifications'); }}
 className="text-[0.8125rem] font-bold text-[#1A2B56] transition-colors hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
 >
 View All Notifications →
 </button>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>,
 document.body
 )}
 </>
 );
};

export default AdminNotificationDropdown;
