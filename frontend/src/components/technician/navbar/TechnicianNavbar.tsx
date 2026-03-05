import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/hooks/useDarkMode';
import NotificationDropdown from './NotificationDropdown';
import { useAuthStore } from '@/stores/useAuthStore';

const NAV_ITEMS = [
  { path: '/technician/dashboard', label: 'Home' },
  { path: '/technician/tasks', label: 'Tickets' },
  { path: '/technician/equipment', label: 'Equipment' },
  { path: '/technician/handover', label: 'Handover' },
  { path: '/technician/reports', label: 'Reports' },
];

const TechnicianNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggle } = useDarkMode();
  const { signOut, user } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <header className="fixed top-3 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
      {/* Main pill */}
      <nav
        className="rounded-full px-4 py-2 flex items-center justify-between shadow-2xl"
        style={{
          background: isDark ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.4)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 pl-2">
          <Link to="/technician/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#1E2B58] rounded-full flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <span className="material-symbols-outlined text-xl">engineering</span>
            </div>
            <div className="hidden md:flex flex-col justify-center">
              <p className="text-[12px] font-extrabold text-[#1E2B58] dark:text-white leading-none tracking-tight">F-EMS</p>
              <p className="text-[8px] text-slate-500 dark:text-slate-400 font-medium tracking-[0.1em] uppercase leading-none mt-1">Technician Portal</p>
            </div>
          </Link>
        </div>

        {/* Desktop nav links */}
        <div
          className="hidden lg:flex items-center gap-1 p-1 rounded-full"
          style={{
            background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.3)',
            border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(255,255,255,0.2)',
          }}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${isActive(item.path)
                ? 'bg-white dark:bg-slate-700 text-[#232F58] dark:text-white font-semibold shadow-[0_4px_10px_rgba(35,47,88,0.15)]'
                : 'text-slate-600 dark:text-slate-300 hover:text-[#232F58] dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10'
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Icons */}
          <div className="flex items-center gap-1 pr-2 border-r border-slate-300/30 dark:border-slate-600/30">
            <button
              onClick={toggle}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/10 transition-all"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <NotificationDropdown isDark={isDark} />
          </div>

          {/* User */}
          <div className="flex items-center gap-3 pl-1">
            <div className="text-right hidden sm:block">
              <p className="text-[11px] font-extrabold text-slate-900 dark:text-white leading-none">
                {user?.name ?? 'Technician'}
              </p>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold capitalize">
                {user?.role ?? 'technician'}
              </p>
            </div>
            <button onClick={handleLogout} className="relative" title="Logout">
              <img
                src={user?.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? 'T')}&background=232F58&color=fff`}
                alt="User Profile"
                className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></div>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/10 transition-all"
          >
            <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="lg:hidden absolute top-full mt-2 left-0 right-0 rounded-3xl p-4 space-y-1 shadow-xl"
          style={{
            background: isDark ? 'rgba(15,23,42,0.92)' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.4)',
          }}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`block px-5 py-3 rounded-2xl text-sm font-bold transition-all ${isActive(item.path)
                ? 'bg-[#232F58] text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10'
                }`}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full text-left px-5 py-3 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50/60 dark:hover:bg-rose-500/10 transition-all"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default TechnicianNavbar;
