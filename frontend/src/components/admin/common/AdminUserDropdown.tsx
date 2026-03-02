import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
    isDark: boolean;
}

const AdminUserDropdown: React.FC<Props> = ({ isDark }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = () => {
        // In a real app, clear auth tokens here
        navigate('/login');
    };

    return (
        <div className="relative" ref={ref}>
            {/* Avatar Trigger */}
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-3 p-1 pr-3 rounded-2xl hover:bg-white/40 dark:hover:bg-slate-700/50 transition-all cursor-pointer group border border-transparent hover:border-white/20 dark:hover:border-white/10"
            >
                <div className="relative">
                    <img
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-700 shadow-sm object-cover group-hover:scale-105 transition-transform"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcggs7eAYT2sZhh9PUUg92V8HXIIxc0jDm5T-fbIxRUndvYPXR-KaiMKom4de_HNUf5iT0-HXrSSkKxMtksiCqeXY_XGF1VWVo0aCv_toMt8A72BLQ4v8_rNOTrcGhPwgm0qltaPl1Snkr87WwGfeaxWAzmp68qbD9ReQq-riFao0D-mhrHJ2uTB-RSHtnfotQfepINcMPrQjS61Bci7WRtS9u43hLtR7cob_7vOg1HZm3AvAwVWqo8McXaZGEZ3JKnAWygJOar1AQ"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                </div>
                <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-[#1A2B56] dark:text-white leading-tight">Dr. Alex Rivers</p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">Super Admin</p>
                </div>
                <span className={`material-symbols-outlined text-sm text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
                    keyboard_arrow_down
                </span>
            </button>

            {/* Dropdown Panel */}
            {open && (
                <div
                    className="absolute right-0 top-full mt-3 w-64 rounded-[32px] z-50 overflow-hidden"
                    style={{
                        background: isDark
                            ? 'rgba(13, 20, 40, 0.97)'
                            : 'rgba(257, 259, 255, 0.98)',
                        backdropFilter: 'blur(32px) saturate(200%)',
                        WebkitBackdropFilter: 'blur(32px) saturate(200%)',
                        border: isDark
                            ? '1px solid rgba(255,255,255,0.10)'
                            : '1px solid rgba(200,210,240,0.70)',
                        boxShadow: isDark
                            ? '0 20px 60px rgba(0,0,0,0.60), 0 4px 16px rgba(0,0,0,0.40)'
                            : '0 20px 60px rgba(26,43,86,0.16), 0 4px 16px rgba(26,43,86,0.10)',
                    }}
                >
                    <div className="p-6">
                        {/* User Summary */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-[#1A2B56] p-0.5 shadow-lg flex-shrink-0">
                                <img
                                    className="w-full h-full rounded-full object-cover border border-white/20"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcggs7eAYT2sZhh9PUUg92V8HXIIxc0jDm5T-fbIxRUndvYPXR-KaiMKom4de_HNUf5iT0-HXrSSkKxMtksiCqeXY_XGF1VWVo0aCv_toMt8A72BLQ4v8_rNOTrcGhPwgm0qltaPl1Snkr87WwGfeaxWAzmp68qbD9ReQq-riFao0D-mhrHJ2uTB-RSHtnfotQfepINcMPrQjS61Bci7WRtS9u43hLtR7cob_7vOg1HZm3AvAwVWqo8McXaZGEZ3JKnAWygJOar1AQ"
                                    alt=""
                                />
                            </div>
                            <div>
                                <p className="text-sm font-black text-[#1A2B56] dark:text-white tracking-tight">Dr. Alex Rivers</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.1em]">Super Admin</p>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="space-y-1.5">
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[#1A2B56]/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-[#1A2B56] dark:hover:text-white transition-all text-sm font-bold group">
                                <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-[#1A2B56] dark:group-hover:text-blue-400 transition-colors">person</span>
                                My Profile
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[#1A2B56]/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-[#1A2B56] dark:hover:text-white transition-all text-sm font-bold group">
                                <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-[#1A2B56] dark:group-hover:text-blue-400 transition-colors">settings</span>
                                Account Settings
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[#1A2B56]/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-[#1A2B56] dark:hover:text-white transition-all text-sm font-bold group">
                                <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-[#1A2B56] dark:group-hover:text-blue-400 transition-colors">history</span>
                                Activity Log
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-slate-200 dark:bg-slate-700 my-4"></div>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-all text-sm font-black uppercase tracking-widest group"
                        >
                            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">logout</span>
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUserDropdown;
