import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/technician/dashboard', label: 'Home' },
  { path: '/technician/tasks',     label: 'Tickets' },
  { path: '/technician/equipment', label: 'Equipment' },
  { path: '/technician/handover',  label: 'Handover' },
  { path: '/technician/reports',   label: 'Reports' },
];

const TechnicianNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
      {/* Main pill */}
      <nav
        className="rounded-full px-4 py-2 flex items-center justify-between shadow-2xl"
        style={{
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.4)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 pl-2">
          <Link to="/technician/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#232F58] rounded-full flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <span className="material-symbols-outlined text-xl">engineering</span>
            </div>
            <div className="hidden md:block">
              <p className="text-[11px] font-extrabold text-[#232F58] leading-tight tracking-tight">F-EMS</p>
              <p className="text-[8px] text-slate-500 font-bold tracking-[0.05em] uppercase">Technician Portal</p>
            </div>
          </Link>
        </div>

        {/* Desktop nav links */}
        <div
          className="hidden lg:flex items-center gap-1 p-1 rounded-full"
          style={{ background: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                isActive(item.path)
                  ? 'bg-white text-[#232F58] font-bold shadow-[0_4px_10px_rgba(35,47,88,0.15)]'
                  : 'text-slate-600 hover:text-[#232F58]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Icons */}
          <div className="flex items-center gap-1 pr-2 border-r border-slate-300/50">
            <button className="p-2 rounded-full text-slate-600 hover:bg-white/50 transition-all">
              <span className="material-symbols-outlined text-[20px]">dark_mode</span>
            </button>
            <button className="p-2 rounded-full text-slate-600 hover:bg-white/50 transition-all relative">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white"></span>
            </button>
          </div>

          {/* User */}
          <div className="flex items-center gap-3 pl-1">
            <div className="text-right hidden sm:block">
              <p className="text-[11px] font-extrabold text-slate-900 leading-none">Marcus Thorne</p>
              <p className="text-[9px] text-slate-500 font-semibold">Senior Tech</p>
            </div>
            <button onClick={handleLogout} className="relative">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGFNwLU9EfhxGexiaMimmAb95aoYyejy0f0ZdHLub3EAjZ8EgpsK3xk_leqeHmzxqy1L5ImFtgOW72yD-vAi6yNMwNFFX6UgQPBfoJW_b5JcGoomzRcrCh_y2xtl4qrVk7hpZARPei5RgcCLZXxXjRKkL90LBJfGtAi2UYf7xbtW5vRq6-S6pIxWBjZiBvoqnpWKRUqG0iJkKbPEUALJzxLCw8-gC6saLMjkvCg8RFm-ZWEh8kU7z8fwC-HhTIO-Bv6Ihi99Qxf4M"
                alt="User Profile"
                className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden p-2 rounded-full text-slate-600 hover:bg-white/50 transition-all"
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
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.4)',
          }}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`block px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
                isActive(item.path)
                  ? 'bg-[#232F58] text-white'
                  : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full text-left px-5 py-3 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50/60 transition-all"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default TechnicianNavbar;
