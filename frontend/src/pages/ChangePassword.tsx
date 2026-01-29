
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto px-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-navy-deep dark:text-white mb-2 tracking-tight">Change Password</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Please enter your current password to set a new one.</p>
      </div>

      <div className="glass-main rounded-4xl p-10 shadow-2xl">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">lock</span>
              Current Password
            </label>
            <div className="relative">
              <input type="password" placeholder="••••••••" className="w-full bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl px-5 py-4 pr-12 text-sm font-bold outline-none focus:ring-2 focus:ring-navy-deep transition-all" />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <span className="material-symbols-outlined text-lg">visibility</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">lock_open</span>
              New Password
            </label>
            <div className="relative">
              <input type="password" placeholder="••••••••" className="w-full bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl px-5 py-4 pr-12 text-sm font-bold outline-none focus:ring-2 focus:ring-navy-deep transition-all" />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <span className="material-symbols-outlined text-lg">visibility</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              Confirm Password
            </label>
            <div className="relative">
              <input type="password" placeholder="••••••••" className="w-full bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl px-5 py-4 pr-12 text-sm font-bold outline-none focus:ring-2 focus:ring-navy-deep transition-all" />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <span className="material-symbols-outlined text-lg">visibility</span>
              </button>
            </div>
          </div>

          <div className="pt-2 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Password Requirements</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              <Requirement met label="Minimum 8 characters" />
              <Requirement label="One special character" />
              <Requirement label="One number" />
              <Requirement label="One uppercase letter" />
            </div>
          </div>

          <div className="pt-6">
            <button type="submit" className="w-full btn-navy-gradient text-white px-10 py-5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-3 shadow-xl">
              Update Password
              <span className="material-symbols-outlined text-lg">key</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Requirement: React.FC<{ met?: boolean; label: string }> = ({ met, label }) => (
  <div className={`flex items-center gap-2 transition-colors duration-300 ${met ? 'text-green-500' : 'text-slate-400'}`}>
    <span className="material-symbols-outlined text-[14px] font-bold">{met ? 'check_circle' : 'circle'}</span>
    <span className="text-[11px] font-semibold">{label}</span>
  </div>
);

export default ChangePassword;
