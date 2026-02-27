import React from 'react';

const TechnicianFooter: React.FC = () => {
  return (
    <footer className="py-12 border-t border-white/20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
        <div className="flex items-center gap-8 text-slate-400">
          <span className="material-symbols-outlined text-xl">school</span>
          <span className="material-symbols-outlined text-xl">verified_user</span>
          <span className="material-symbols-outlined text-xl">build_circle</span>
        </div>
        <p className="text-[9px] font-bold text-slate-500 tracking-[0.3em] uppercase text-center">
          Facility &amp; Equipment Management System — F-EMS 2024
        </p>
      </div>
    </footer>
  );
};

export default TechnicianFooter;
