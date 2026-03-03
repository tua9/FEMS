import React, { useState, useEffect, useRef } from 'react';
import { NavLinks } from './NavLinks';
import { useDarkMode } from '@/hooks/useDarkMode';
import NotificationIcon from './NotificationIcon';
import UserDropdownMenu from './UserDropdownMenu';

const LecturerNavbar: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { isDark, toggle } = useDarkMode();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        if (isDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    return (
        <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-[1%]">
            <nav className="extreme-glass rounded-[32px] px-8 py-3 flex items-center justify-between shadow-2xl shadow-slate-900/10 dark:shadow-none w-full max-w-[1400px]">

                {/* ── Brand ── */}
                <div className="flex items-center gap-3 min-w-[160px]">
                    <div className="w-10 h-10 bg-[#1E2B58] rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white/20">
                        <span className="material-symbols-rounded text-xl">school</span>
                    </div>
                    <div>
                        <h1 className="font-extrabold text-base leading-none tracking-tight text-[#1E2B58] dark:text-white">
                            F-EMS
                        </h1>
                        <p className="text-[8px] font-black opacity-70 uppercase tracking-[0.15em] mt-1 text-[#1E2B58] dark:text-slate-400">
                            LECTURER PORTAL
                        </p>
                    </div>
                </div>

                {/* ── Nav links (pill-style) ── */}
                <NavLinks />

                {/* ── Right actions ── */}
                <div className="flex items-center gap-4 min-w-[160px] justify-end">
                    {/* Dark-mode + Notification buttons (bordered) */}
                    <div className="flex items-center gap-2 pr-4 border-r border-[#1E2B58]/10 dark:border-white/10">
                        <button
                            onClick={toggle}
                            className="w-9 h-9 flex items-center justify-center rounded-full border border-[#1E2B58]/30 dark:border-white/40 hover:bg-white/40 dark:hover:bg-white/10 transition-all"
                            aria-label="Toggle dark mode"
                        >
                            <span className="material-symbols-outlined text-[18px] text-[#1E2B58] dark:text-white">
                                {isDark ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>
                        <NotificationIcon />
                    </div>

                    {/* Avatar + name */}
                    <div ref={dropdownRef} className="flex items-center gap-3">
                        <div className="text-right hidden xl:block">
                            <p className="text-[11px] font-extrabold text-[#1E2B58] dark:text-white leading-none">
                                Dr. Alex Rivers
                            </p>
                            <p className="text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter mt-1">
                                Senior Lecturer
                            </p>
                        </div>
                        <UserDropdownMenu
                            isOpen={isDropdownOpen}
                            toggle={() => setIsDropdownOpen(prev => !prev)}
                            close={() => setIsDropdownOpen(false)}
                        />
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default LecturerNavbar;
