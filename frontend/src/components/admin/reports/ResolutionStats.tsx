import React from 'react';

const ResolutionStats: React.FC = () => {
    // Mocking stats display
    return (
        <div className="glass-card dark:!bg-slate-800/80 p-8 ambient-shadow border border-white/40 dark:border-white/10 rounded-[32px] bg-white/60 backdrop-blur-[30px] h-full flex flex-col transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
                <h4 className="font-extrabold text-[#1A2B56] dark:text-white text-lg tracking-tight">Resolution Overview</h4>
                <span className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-xl">
                    <span className="material-symbols-outlined text-xl">analytics</span>
                </span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                <div className="relative pt-2">
                    {/* Mock simple bar chart layout */}
                    <div className="flex items-end justify-between h-44 gap-2.5 mb-6 px-1">
                        {/* Bars with gradients */}
                        {[30, 45, 25, 60, 85, 50, 75].map((height, i) => (
                            <div key={i} className="w-full flex flex-col items-center gap-3 group">
                                <div className="w-full bg-slate-100 dark:bg-slate-700/30 rounded-full h-full flex items-end relative overflow-hidden">
                                    <div
                                        className="w-full bg-gradient-to-t from-[#1A2B56] to-blue-500 dark:from-blue-600 dark:to-blue-400 rounded-full transition-all duration-700 ease-out group-hover:brightness-110 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                                        style={{ height: `${height}%` }}
                                    ></div>
                                </div>
                                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Day {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 space-y-6 pt-6 border-t border-slate-200/50 dark:border-white/5">
                    <div className="group">
                        <div className="flex justify-between items-center mb-2.5">
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Avg. Resolution</span>
                            <span className="font-extrabold text-[#1A2B56] dark:text-white text-sm bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-lg">2.4 Days</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-700/50 h-2 rounded-full overflow-hidden p-0.5 border border-white dark:border-transparent">
                            <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full w-[75%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-1000"></div>
                        </div>
                    </div>

                    <div className="group">
                        <div className="flex justify-between items-center mb-2.5">
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Success Rate</span>
                            <span className="font-extrabold text-[#1A2B56] dark:text-white text-sm bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-lg">88%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-700/50 h-2 rounded-full overflow-hidden p-0.5 border border-white dark:border-transparent">
                            <div className="bg-gradient-to-r from-blue-400 to-[#1A2B56] h-full w-[88%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-1000"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResolutionStats;
