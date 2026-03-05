import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDarkMode } from '../../../hooks/useDarkMode';
import AdminNotificationDropdown from './AdminNotificationDropdown';
import AdminUserDropdown from './AdminUserDropdown';

const AdminNavbar: React.FC = () => {
    const { isDark, toggle } = useDarkMode();
    const location = useLocation();

    // Helper function to check if a route is active
    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const linkBaseClasses = 'px-4 py-2 rounded-2xl hover:bg-white/30 dark:hover:bg-slate-700/30 text-slate-600 dark:text-slate-300 hover:text-[#1A2B56] dark:hover:text-white transition-all font-medium';
    const activeLinkClasses = 'px-4 py-2 rounded-2xl bg-white/60 dark:bg-slate-700/60 backdrop-blur-md shadow-sm border border-white/80 dark:border-slate-600 text-[#1A2B56] dark:text-white font-semibold transition-all';

    return (
        <header className="fixed top-3 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300">
            <nav className="glass-card hover:transform-none hover:bg-white/50 dark:hover:bg-slate-800/60 dark:bg-slate-800/50 px-8 py-2.5 flex items-center justify-between ambient-shadow rounded-full border border-white/40 dark:border-white/10 backdrop-blur-[30px] bg-white/40">
                <div className="flex items-center gap-4">
                    <div className="bg-[#1A2B56] p-2.5 rounded-2xl shadow-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-2xl block">shield_person</span>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="font-extrabold text-xl tracking-tight text-[#1A2B56] dark:text-white leading-none mb-0.5">F-EMS</h1>
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400 leading-none">Admin Portal</p>
                    </div>
                </div>

                <ul className="hidden lg:flex items-center gap-2 text-sm">
                    <li>
                        <Link to="/admin/dashboard" className={isActive('/admin/dashboard') ? activeLinkClasses : linkBaseClasses}>
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/equipment" className={isActive('/admin/equipment') ? activeLinkClasses : linkBaseClasses}>
                            Equipment
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/borrowing" className={isActive('/admin/borrowing') ? activeLinkClasses : linkBaseClasses}>
                            Borrowing
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/users" className={isActive('/admin/users') ? activeLinkClasses : linkBaseClasses}>
                            Users
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/reports" className={isActive('/admin/reports') ? activeLinkClasses : linkBaseClasses}>
                            Reports
                        </Link>
                    </li>
                </ul>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggle}
                            className="w-10 h-10 flex items-center justify-center hover:bg-white/40 dark:hover:bg-slate-700/50 rounded-full transition-all cursor-pointer text-slate-700 dark:text-slate-300 group"
                        >
                            <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">
                                {isDark ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>
                        <AdminNotificationDropdown isDark={isDark} />
                    </div>

                    <div className="h-8 w-px bg-slate-300 dark:bg-slate-600 mx-1 block"></div>

                    <AdminUserDropdown isDark={isDark} />
                </div>
            </nav>
        </header>
    );
};

export default AdminNavbar;
