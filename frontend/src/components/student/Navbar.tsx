
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Equipment List', path: '/equipment' },
    { name: 'My History', path: '/history' },
    { name: 'Report Issue', path: '/report' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <nav className="max-w-7xl mx-auto glass-nav rounded-full px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--navy-deep)] rounded-full flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-2xl font-bold">category</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-extrabold text-lg leading-tight text-[var(--navy-deep)] dark:text-white">F-EMS</h1>
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 text-[var(--navy-deep)] dark:text-slate-400">Student Portal</p>
          </div>
        </div>

        <ul className="hidden md:flex items-center gap-8 font-semibold text-sm">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`transition-colors pb-1 ${location.pathname === link.path
                  ? 'text-[var(--navy-deep)] dark:text-blue-400 border-b-2 border-[var(--navy-deep)] dark:border-blue-400'
                  : 'text-slate-600 hover:text-[var(--navy-deep)] dark:text-slate-400 dark:hover:text-blue-400'
                  }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/40 transition-colors text-slate-600 dark:text-slate-300"
          >
            <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
          </button>

          <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/40 transition-colors text-slate-600 dark:text-slate-300">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1e2b58]"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 ring-[var(--navy-deep)] shadow-lg focus:outline-none transition-all"
            >
              <img alt="User avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEN1b793kY1IzuwH6AhBg4THRAhN-JBovYTje7ZGjazVNDtsu72U8fdYKy3MV0FmBn6PnnfScPedB4SaDBi6FfEqWdfSW7-0juht7C7_0pbGixLlk-XDsLVX61ZkXNWPVX_EBgSECgI4cbyyg2m3-VMBFi6rGN6wtHQu3wpjb-5L0kc70b0oGrsm0Sr625B7i9oTGud7IUOqDOZD140FWMyoc2eBRCRxaPP5DvbeELgk2tzfSJVM6uVR6Jd17tE4lsy3IjlCo_u2PF" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-4 w-72 glass-nav rounded-3xl overflow-hidden z-[60] py-4">
                <div className="px-8 py-4 border-b border-white/20">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                  <p className="text-base font-extrabold text-[var(--navy-deep)] dark:text-white truncate">Nguyen Van A</p>
                </div>
                <div className="p-4 space-y-1">
                  <Link to="/profile" className="flex items-center gap-3 px-5 py-3 rounded-2xl hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                    <span className="material-symbols-outlined text-xl text-slate-500">person</span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Personal Profile</span>
                  </Link>
                  <Link to="/change-password" className="flex items-center gap-3 px-5 py-3 rounded-2xl hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                    <span className="material-symbols-outlined text-xl text-slate-500">key</span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Change Password</span>
                  </Link>
                </div>
                <div className="p-4 pt-2 border-t border-white/20">
                  <Link to="/login" className="flex items-center gap-3 px-5 py-3 rounded-2xl hover:bg-red-500/10 transition-colors">
                    <span className="material-symbols-outlined text-xl text-red-500">logout</span>
                    <span className="text-sm font-bold text-red-500">Log Out</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
