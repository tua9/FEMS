import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

// kept for API compatibility with callers that still pass isDark
interface Props {
    isDark?: boolean;
}

const MENU_ITEMS = [
    { to: '/admin/profile',         icon: 'person',   label: 'My Profile'       },
    { to: '/admin/change-password', icon: 'settings', label: 'Account Settings' },
    { to: '/admin/notifications',   icon: 'history',  label: 'Activity Log'     },
];

const AdminUserDropdown: React.FC<Props> = () => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, signOut } = useAuthStore();

    const avatarUrl =
        user?.avatarUrl ??
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName ?? 'Admin')}&background=1A2B56&color=fff`;

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleNavigate = (to: string) => { setOpen(false); navigate(to); };

    const handleLogout = async () => {
        setOpen(false);
        await signOut();
        navigate('/login', { replace: true });
    };

    return (
        <div className="relative" ref={ref}>
            {/* ── Avatar Trigger ── */}
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-3 p-1 pr-3 rounded-2xl hover:bg-white/40 dark:hover:bg-white/8 transition-all cursor-pointer group border border-transparent hover:border-white/20 dark:hover:border-white/10"
            >
                <div className="relative">
                    <img
                        alt={user?.displayName ?? 'Admin'}
                        className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-700 shadow-sm object-cover group-hover:scale-105 transition-transform"
                        src={avatarUrl}
                    />
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" />
                </div>
                <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-[#1A2B56] dark:text-white leading-tight">
                        {user?.displayName ?? 'Admin'}
                    </p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
                        {user?.role ?? 'admin'}
                    </p>
                </div>
                <span className={`material-symbols-outlined text-sm text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
                    keyboard_arrow_down
                </span>
            </button>

            {/* ── Dropdown Panel ── */}
            {open && (
                <div className={[
                    'absolute right-0 top-full mt-3 w-64 rounded-3xl z-50 overflow-hidden',
                    'bg-white/70 backdrop-blur-[28px]',
                    'dark:bg-slate-950/40 dark:backdrop-blur-[28px]',
                    'ring-1 ring-inset ring-black/5 dark:ring-white/12',
                    'shadow-2xl shadow-[#1A2B56]/10 dark:shadow-black/50',
                ].join(' ')}>
                    <div className="p-5">
                        {/* User Summary */}
                        <div className="flex items-center gap-3.5 mb-5">
                            <div className="w-11 h-11 rounded-full bg-[#1A2B56] p-0.5 shadow-lg shrink-0">
                                <img
                                    className="w-full h-full rounded-full object-cover border border-white/20"
                                    src={avatarUrl}
                                    alt={user?.displayName ?? 'Admin'}
                                />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                                    {user?.displayName ?? 'Admin'}
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
                                    {user?.role ?? 'admin'}
                                </p>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="space-y-1">
                            {MENU_ITEMS.map((item) => {
                                const isActive = location.pathname === item.to;
                                return (
                                    <button
                                        key={item.to}
                                        type="button"
                                        onClick={() => handleNavigate(item.to)}
                                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all text-sm font-bold group ${
                                            isActive
                                                ? 'bg-[#1A2B56]/8 dark:bg-white/8 text-[#1A2B56] dark:text-white'
                                                : 'hover:bg-[#1A2B56]/5 dark:hover:bg-white/6 text-slate-600 dark:text-slate-300 hover:text-[#1A2B56] dark:hover:text-white'
                                        }`}
                                    >
                                        <span className={`material-symbols-outlined text-[19px] transition-colors ${
                                            isActive
                                                ? 'text-[#1A2B56] dark:text-blue-400'
                                                : 'text-slate-400 group-hover:text-[#1A2B56] dark:group-hover:text-blue-400'
                                        }`}>
                                            {item.icon}
                                        </span>
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-black/6 dark:bg-white/8 my-3" />

                        {/* Logout */}
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-red-500/6 dark:bg-red-400/8 text-red-500 dark:text-red-400 hover:bg-red-500/12 dark:hover:bg-red-400/15 transition-all text-sm font-black uppercase tracking-widest group"
                        >
                            <span className="material-symbols-outlined text-[19px] group-hover:translate-x-0.5 transition-transform">logout</span>
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUserDropdown;
