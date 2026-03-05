import React from 'react';
import { DamageReport } from '../../../types/admin.types';

interface ResolutionStatsProps {
    reports: DamageReport[];
}

const ResolutionStats: React.FC<ResolutionStatsProps> = ({ reports }) => {
    // Dynamic calculations
    const total = reports.length || 1;
    const stats = {
        Pending: reports.filter(r => r.status === 'Pending').length,
        Approved: reports.filter(r => r.status === 'Approved').length,
        'In Progress': reports.filter(r => r.status === 'In Progress').length,
        Resolved: reports.filter(r => r.status === 'Resolved').length,
        Rejected: reports.filter(r => r.status === 'Rejected').length,
    };

    const priorities = {
        'High': reports.filter(r => r.priority === 'High Priority').length,
        'Medium': reports.filter(r => r.priority === 'Medium Priority').length,
        'Low': reports.filter(r => r.priority === 'Low Priority').length,
    };

    const successRate = Math.round((stats.Resolved / total) * 100);
    const criticalRate = Math.round((priorities.High / total) * 100);

    return (
        <div className="glass-card dark:!bg-slate-800/80 p-8 border border-white/40 dark:border-white/10 rounded-[40px] bg-white/60 backdrop-blur-[30px] h-full flex flex-col transition-all duration-500">
            {/* Header */}
            <div className="mb-10">
                <h4 className="font-extrabold text-[#1A2B56] dark:text-blue-400 text-lg tracking-tight mb-1">Live Analytics</h4>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Real-time Status Tracking</p>
            </div>

            <div className="space-y-12 flex-1 pt-2">
                {/* Alternating Square Bar Chart */}
                <div>
                    {/* Increased height to h-48 to make columns taller */}
                    <div className="flex items-end justify-between h-52 gap-4 px-2">
                        {Object.entries(stats).map(([label, count], index) => {
                            const barHeight = Math.max((count / total) * 100, 4);
                            const isNavy = index % 2 === 0;
                            // Lightened the light blue tone from blue-300 to blue-200
                            const barColor = isNavy ? 'bg-[#1A2B56] dark:bg-blue-600' : 'bg-blue-200 dark:bg-blue-400/80';
                            const hoverColor = isNavy ? 'group-hover:bg-[#0f1936] dark:group-hover:bg-blue-700' : 'group-hover:bg-blue-300 dark:group-hover:bg-blue-400';

                            return (
                                <div key={label} className="flex-1 flex flex-col items-center gap-3 group relative h-full justify-end">
                                    {/* Tooltip on hover */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 dark:bg-slate-700 text-white text-[10px] py-1 px-2.5 rounded-md whitespace-nowrap pointer-events-none z-10 shadow-lg">
                                        {label}, {count} report{count !== 1 ? 's' : ''}
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-2 border-transparent border-t-slate-800 dark:border-t-slate-700"></div>
                                    </div>

                                    {/* Added max-w-[44px] and mx-auto to make the columns slimmer instead of stretching the full width */}
                                    <div className="w-full max-w-[44px] mx-auto bg-slate-100 dark:bg-slate-700/20 flex-1 flex items-end relative overflow-hidden h-full">
                                        <div
                                            className={`w-full ${barColor} transition-all duration-1000 ease-out ${hoverColor}`}
                                            style={{ height: `${barHeight}%` }}
                                        ></div>
                                    </div>
                                    {/* Unbolded, full name label */}
                                    <span className="text-[8px] text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center truncate w-full">
                                        {label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Minimalist KPI Metrics */}
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-700/50">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Efficiency</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-[#1A2B56] dark:text-white">{successRate}%</span>
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Critical Load</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-[#1A2B56] dark:text-white">{criticalRate}%</span>
                        </div>
                    </div>
                </div>

                {/* Alternating Navy/Light Blue Priority Distribution */}
                <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-700/50">
                    <h5 className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-4">Priority Breakdown</h5>

                    {Object.entries(priorities).map(([priority, count], index) => {
                        const isNavy = index % 2 === 0;
                        const barColor = isNavy ? 'bg-[#1A2B56] dark:bg-blue-600' : 'bg-blue-200 dark:bg-blue-400/80';

                        return (
                            <div key={priority}>
                                <div className="flex justify-between items-center mb-2.5">
                                    <span className="text-[11px] text-[#1A2B56] dark:text-slate-400 uppercase tracking-wider">{priority} Level</span>
                                    {/* Unbolded text, changed 'tasks' to 'reports' */}
                                    <span className="text-[10px] text-slate-500 tabular-nums">{count} report{count !== 1 ? 's' : ''}</span>
                                </div>
                                {/* Removed rounded corners completely */}
                                <div className="w-full bg-slate-100 dark:bg-slate-700/30 h-2 overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ease-out ${barColor}`}
                                        style={{ width: `${(count / total) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ResolutionStats;
