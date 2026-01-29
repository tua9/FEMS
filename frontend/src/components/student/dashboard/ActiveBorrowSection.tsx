import React from 'react';
import Step from './Step';

const ActiveBorrowSection: React.FC = () => {
    return (
        <section className="glass-main p-8 rounded-3xl shadow-xl">
            <h2 className="font-bold text-xl mb-6 flex items-center gap-2 text-[var(--navy-deep)] dark:text-white">
                <span className="material-symbols-outlined text-[var(--navy-deep)] dark:text-blue-400">monitoring</span>
                My Active Borrows
            </h2>

            <div className="glass-card p-8 rounded-2xl shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-md overflow-hidden p-2">
                            <img
                                src="https://picsum.photos/seed/mac/100/100"
                                alt="Mac Studio"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-[var(--navy-deep)] dark:text-white">Mac Studio M2</h3>
                            <p className="text-sm opacity-60">Serial: FPT-MS-2024-089</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest">
                            Handover In Progress
                        </span>
                    </div>
                </div>

                <div className="relative flex items-center justify-between w-full px-4">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 z-0"></div>
                    <div className="absolute top-1/2 left-0 w-[66%] h-0.5 bg-navy-deep dark:bg-blue-400 -translate-y-1/2 z-0 transition-all duration-1000"></div>

                    <Step icon="check" label="Pending" active />
                    <Step icon="check" label="Approved" active />
                    <Step icon="sync" label="Handover" current />
                    <Step icon="keyboard_return" label="Returning" />
                </div>
            </div>
        </section>
    );
};

export default ActiveBorrowSection;