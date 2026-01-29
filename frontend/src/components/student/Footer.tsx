
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="pb-12 text-center space-y-6">
      <div className="flex items-center justify-center gap-8 text-slate-400">
        <span className="material-symbols-outlined text-2xl cursor-pointer hover:text-[var(--navy-deep)] transition-colors">school</span>
        <span className="material-symbols-outlined text-2xl cursor-pointer hover:text-[var(--navy-deep)] transition-colors">security</span>
        <span className="material-symbols-outlined text-2xl cursor-pointer hover:text-[var(--navy-deep)] transition-colors">build</span>
      </div>
      <p className="text-[9px] font-extrabold uppercase tracking-[0.3em] text-slate-500 opacity-60">
        Facility & Equipment Management System — F-EMS 2024
      </p>
    </footer>
  );
};

export default Footer;
