import React from 'react';

export const ReportHeader: React.FC = () => {
    return (
        <header className="mb-[2rem] text-left">
            <h2 className="text-[2rem] sm:text-[2.5rem] font-extrabold text-[#1E2B58] dark:text-white mb-[0.5rem] tracking-tight">Report an Issue</h2>
            <p className="text-slate-500 dark:text-slate-400 text-[0.875rem]">Submit a maintenance request for university facilities or equipment.</p>
        </header>
    );
};
