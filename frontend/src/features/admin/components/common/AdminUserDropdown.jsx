import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

// kept for API compatibility with callers that still pass isDark
const MENU_ITEMS = [
 {
 to: '/admin/profile',
 icon: 'person',
 label: 'My Profile',
 description: 'View personal information',
 iconBg: 'bg-blue-50 dark:bg-blue-900/20',
 iconColor: 'text-blue-500 dark:text-blue-400',
 },
 {
 to: '/admin/change-password',
 icon: 'key',
 label: 'Account Settings',
 description: 'Password & security',
 iconBg: 'bg-amber-50 dark:bg-amber-900/20',
 iconColor: 'text-amber-500 dark:text-amber-400',
 },
 {
 to: '/admin/notifications',
 icon: 'history',
 label: 'Activity Log',
 description: 'Recent account activity',
 iconBg: 'bg-violet-50 dark:bg-violet-900/20',
 iconColor: 'text-violet-500 dark:text-violet-400',
 },
];

// ── Animation variants ──────────────────────────────────────────────────────
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

const AdminUserDropdown = () => {
 const [open, setOpen] = useState(false);
 const buttonRef = useRef(null);
 const dropdownRef = useRef(null);
 const navigate = useNavigate();
 const location = useLocation();
 const { user, signOut } = useAuthStore();

 const avatarUrl =
 user?.avatarUrl ??
 `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName ?? 'Admin')}&background=1A2B56&color=fff`;

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

 const handleNavigate = (to) => { setOpen(false); navigate(to); };

 const handleLogout = async () => {
 setOpen(false);
 await signOut();
 navigate('/login', { replace: true });
 };

 return (
 <>
 {/* ── Avatar Trigger ── */}
 <button
 ref={buttonRef}
 onClick={handleToggle}
 aria-label="Open user menu"
 aria-expanded={open}
 className="flex items-center gap-3 cursor-pointer rounded-2xl border border-transparent p-1 pr-3 transition-all hover:border-white/20 hover:bg-white/40 dark:hover:border-white/10 dark:hover:bg-white/8"
 >
 <div className="relative">
 <img
 alt={user?.displayName ?? 'Admin'}
 className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm transition-transform group-hover:scale-105 dark:border-slate-700"
 src={avatarUrl}
 />
 <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-800" />
 </div>
 <div className="hidden text-left sm:block">
 <p className="text-xs font-bold leading-tight text-[#1A2B56] dark:text-white">
 {user?.displayName ?? 'Admin'}
 </p>
 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
 {user?.role ?? 'admin'}
 </p>
 </div>
 <span className={`material-symbols-outlined text-sm text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
 keyboard_arrow_down
 </span>
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
 width: '18rem',
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
 {/* ── User info header ── */}
 <button
 type="button"
 onClick={() => handleNavigate('/admin/profile')}
 className="group w-full border-b border-black/10 px-5 py-4 text-left transition-colors hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/8"
 >
 <div className="flex items-center gap-3">
 <div className="relative shrink-0">
 <div className="h-11 w-11 overflow-hidden rounded-2xl shadow-md ring-2 ring-[#1A2B56]/15 dark:ring-white/20">
 <img
 alt={user?.displayName ?? 'Admin'}
 className="h-full w-full object-cover"
 src={avatarUrl}
 />
 </div>
 <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 dark:border-slate-900" />
 </div>
 <div className="min-w-0 flex-1">
 <p className="truncate text-[0.8125rem] font-extrabold leading-tight text-[#1A2B56] dark:text-white">
 {user?.displayName ?? 'Admin'}
 </p>
 <p className="mt-0.5 truncate text-[0.6875rem] font-semibold text-slate-500 dark:text-slate-400">
 {user?.email ?? ''}
 </p>
 </div>
 <span className="material-symbols-rounded shrink-0 text-base text-[#1A2B56]/20 transition-all group-hover:translate-x-0.5 group-hover:text-[#1A2B56]/50 dark:text-white/20 dark:group-hover:text-white/50">
 chevron_right
 </span>
 </div>
 <div className="mt-3">
 <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#1A2B56]/6 px-2.5 py-1 dark:bg-white/10">
 <span className="material-symbols-rounded text-[13px] text-[#1A2B56] dark:text-blue-400">
 admin_panel_settings
 </span>
 <span className="text-[0.5625rem] font-black uppercase tracking-[0.12em] text-[#1A2B56]/70 dark:text-blue-400">
 {user?.role ?? 'admin'}
 </span>
 </span>
 </div>
 </button>

 {/* ── Quick Access label ── */}
 <div className="px-5 pb-1 pt-3">
 <p className="text-[0.5625rem] font-black uppercase tracking-[0.18em] text-[#1A2B56]/30 dark:text-white/30">
 Quick Access
 </p>
 </div>

 {/* ── Menu items ── */}
 <div className="px-2 py-1.5">
 {MENU_ITEMS.map((item) => {
 const isActive = location.pathname === item.to;
 return (
 <button
 key={item.to}
 type="button"
 onClick={() => handleNavigate(item.to)}
 className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
 isActive ? 'bg-black/8 dark:bg-white/12' : 'hover:bg-black/6 dark:hover:bg-white/10'
 }`}
 >
 <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all ${
 isActive ? 'bg-[#1A2B56] dark:bg-blue-500' : `${item.iconBg} group-hover:scale-105`
 }`}>
 <span className={`material-symbols-rounded text-[16px] ${isActive ? 'text-white' : item.iconColor}`}>
 {item.icon}
 </span>
 </div>
 <div className="min-w-0 flex-1">
 <p className={`text-[0.8125rem] font-bold leading-tight ${isActive ? 'text-[#1A2B56] dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>
 {item.label}
 </p>
 <p className="mt-0.5 truncate text-[0.6875rem] text-slate-400 dark:text-slate-500">
 {item.description}
 </p>
 </div>
 {isActive ? (
 <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#1A2B56] dark:bg-blue-400" />
 ) : (
 <span className="material-symbols-rounded shrink-0 text-sm text-slate-300 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 dark:text-slate-600">
 chevron_right
 </span>
 )}
 </button>
 );
 })}
 </div>

 {/* ── Logout ── */}
 <div className="border-t border-black/10 p-2 dark:border-white/15">
 <button
 type="button"
 onClick={handleLogout}
 className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-red-500/8 dark:hover:bg-red-400/10"
 >
 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-500/8 transition-colors group-hover:bg-red-500/15 dark:bg-red-400/10 dark:group-hover:bg-red-400/20">
 <LogOut className="h-4 w-4 text-red-500 dark:text-red-400" />
 </div>
 <span className="text-[0.8125rem] font-bold text-red-500 dark:text-red-400">
 Log Out
 </span>
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

export default AdminUserDropdown;
