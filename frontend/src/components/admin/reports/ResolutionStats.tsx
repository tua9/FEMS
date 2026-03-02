import React from 'react';

const ResolutionStats: React.FC = () => {
    // Mocking stats display
    return (
        <div className="glass-card dark:!bg-slate-800/80 p-8 ambient-shadow border border-white/40 dark:border-white/10 rounded-[32px] bg-white/60 backdrop-blur-[30px] h-full flex flex-col">
            <h4 className="font-extrabold text-[#1A2B56] dark:text-white text-lg mb-8">Resolution Overview</h4>

            <div className="flex-1 flex flex-col justify-center">
                <div className="relative pt-4">
                    {/* Mock simple bar chart layout */}
                    <div className="flex items-end justify-between h-40 gap-2 mb-4 px-2">
                        {/* Bars */}
                        {[30, 45, 25, 60, 85, 50, 75].map((height, i) => (
                            <div key={i} className="w-full flex flex-col items-center gap-2 group">
                                <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-t-sm h-full flex items-end relative overflow-hidden">
                                    <div
                                        className="w-full bg-[#1A2B56] dark:bg-blue-500 rounded-t-sm transition-all duration-500 group-hover:opacity-80"
                                        style={{ height: `${height}%` }}
                                    ></div>
                                </div>
                                <span className="text-[9px] font-bold text-slate-500">M{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 dark:text-slate-400 font-semibold">Average Time to Resolve</span>
                        <span className="font-extrabold text-[#1A2B56] dark:text-white">2.4 Days</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[75%] rounded-full"></div>
                    </div>

                    <div className="flex justify-between items-center text-sm pt-2">
                        <span className="text-slate-600 dark:text-slate-400 font-semibold">Resolution Rate</span>
                        <span className="font-extrabold text-[#1A2B56] dark:text-white">88%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[88%] rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResolutionStats;
