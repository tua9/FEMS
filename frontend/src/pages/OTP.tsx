
import React from 'react';
import { useNavigate } from 'react-router-dom';

const OTP: React.FC<{ onVerify: () => void }> = ({ onVerify }) => {
  const navigate = useNavigate();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="glass-main p-8 md:p-12 rounded-4xl shadow-2xl relative overflow-hidden w-full max-w-lg text-center">
        <button onClick={() => navigate('/login')} className="absolute top-8 left-8 text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
            <span className="material-symbols-outlined text-3xl text-primary dark:text-blue-400">shield_lock</span>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">Verification Code</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-[13px] font-medium leading-relaxed mb-10">
          We have sent a 6-digit code to your university email. Please enter it below to continue.
        </p>

        <form onSubmit={handleVerify} className="space-y-8">
          <div className="flex justify-center gap-2 md:gap-4 px-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                className="w-12 h-14 md:w-16 md:h-16 text-center text-2xl font-bold bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm text-slate-800 dark:text-white transition-all"
              />
            ))}
          </div>

          <button type="submit" className="w-full btn-navy-gradient text-white font-bold py-4 rounded-full flex items-center justify-center gap-2">
            <span>Verify & Continue</span>
            <span className="material-symbols-outlined">check_circle</span>
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Didn't receive the code?</p>
          <div className="flex items-center gap-2">
            <button className="text-sm font-bold text-primary dark:text-blue-400 hover:underline">Resend Code</button>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">Resend in 00:59</span>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800/50 text-center">
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">Security Verification Step 2/2</p>
        </div>
      </div>
    </div>
  );
};

export default OTP;
