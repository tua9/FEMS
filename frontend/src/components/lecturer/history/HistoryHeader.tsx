import React from 'react';

export const HistoryHeader: React.FC = () => {
    return (
        <header className="mb-[2.5rem] mt-[1rem] flex flex-col items-center justify-center text-center">
            <h2 className="text-[2.25rem] sm:text-[3rem] md:text-[4rem] font-bold text-[#1E2B58] dark:text-white mb-[0.5rem] tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-[#1E2B58] to-[#3a4c88] dark:from-white dark:to-slate-300">
                My History
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-[1rem] sm:text-[1.125rem]">
                Track your recent activities, reports, and approvals
            </p>
        </header>
    );
};
