import React from 'react';

export const ApprovalHeader: React.FC = () => {
    return (
        <header className="mb-[2rem] md:mb-[3rem]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-[1.5rem]">
                <div>
                    <h2 className="text-[2.25rem] sm:text-[2.5rem] md:text-[3.5rem] font-extrabold text-[#1E2B58] dark:text-white tracking-tight leading-tight">
                        Student Request <span className="opacity-50 font-light">/</span> <span className="text-slate-600 dark:text-slate-400">Approval Center</span>
                    </h2>
                    <p className="mt-[1rem] text-slate-600 dark:text-slate-400 max-w-2xl text-[1rem] sm:text-[1.125rem] leading-relaxed">
                        Review pending equipment and facility borrow requests. All approvals are logged for academic compliance.
                    </p>
                </div>

                <div className="flex flex-row items-center gap-[1rem] mt-[1.5rem] md:mt-0">
                    <div className="glass-card bg-white/60 dark:bg-slate-800/60 border border-white/60 dark:border-white/10 px-[1.5rem] md:px-[2.5rem] py-[1.25rem] md:py-[1.75rem] rounded-[1.5rem] md:rounded-[2rem] flex flex-col items-center justify-center min-w-[8rem] md:min-w-[10rem] flex-1 md:flex-none">
                        <span className="text-[2.25rem] md:text-[2.5rem] font-black text-[#1E2B58] dark:text-white leading-none mb-[0.375rem]">14</span>
                        <span className="text-[0.625rem] font-bold uppercase tracking-[0.2em] text-[#1E2B58]/50 dark:text-white/50">Pending</span>
                    </div>
                    <div className="glass-card bg-white/60 dark:bg-slate-800/60 border border-white/60 dark:border-white/10 px-[1.5rem] md:px-[2.5rem] py-[1.25rem] md:py-[1.75rem] rounded-[1.5rem] md:rounded-[2rem] flex flex-col items-center justify-center min-w-[8rem] md:min-w-[10rem] flex-1 md:flex-none">
                        <span className="text-[2.25rem] md:text-[2.5rem] font-black text-slate-500 dark:text-slate-300 leading-none mb-[0.375rem]">128</span>
                        <span className="text-[0.625rem] font-bold uppercase tracking-[0.2em] text-slate-500/70 dark:text-slate-400/70">Total</span>
                    </div>
                </div>
            </div>
        </header>
    );
};
