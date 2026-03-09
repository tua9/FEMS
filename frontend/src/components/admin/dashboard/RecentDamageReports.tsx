import React from 'react';
import { DamageReport } from '../../../types/admin.types';

interface RecentDamageReportsProps {
    reports: DamageReport[];
    onViewAll?: () => void;
    onRowClick?: (report: DamageReport) => void;
}

const RecentDamageReports: React.FC<RecentDamageReportsProps> = ({ reports, onViewAll, onRowClick }) => {
    const getPriorityBadgeColor = (priority: string) => {
        if (priority.includes('High')) return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
        if (priority.includes('Medium')) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
    };

    return (
        <div className="bg-white/40 dark:bg-slate-800/60 p-8 ambient-shadow rounded-[32px] border border-white/40 dark:border-white/10 backdrop-blur-xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h4 className="font-extrabold text-[#1A2B56] dark:text-white text-lg">User Damage Reports</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Detailed breakdown of equipment issues reported by university staff.</p>
                </div>
                <button
                    onClick={onViewAll}
                    className="px-6 py-2 bg-white dark:bg-slate-700 hover:bg-white/90 dark:hover:bg-slate-600 shadow-md border border-white/40 dark:border-slate-500/30 rounded-2xl transition-all text-sm font-bold text-[#1A2B56] dark:text-white active:scale-95"
                >
                    View All Reports
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-4">
                    <thead>
                        <tr>
                            <th className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">Equipment Name</th>
                            <th className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400 hidden md:table-cell">Issue Description</th>
                            <th className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">Reported By</th>
                            <th className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400 hidden sm:table-cell">Date Reported</th>
                            <th className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400 text-right">Priority</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report.id} onClick={() => onRowClick?.(report)} className="bg-white/10 dark:bg-slate-700/20 hover:bg-white/30 dark:hover:bg-slate-700/40 transition-all rounded-2xl group cursor-pointer backdrop-blur-sm">
                                <td className="p-4 rounded-l-2xl text-sm font-bold text-slate-800 dark:text-white">{report.equipmentName}</td>
                                <td className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400 max-w-xs truncate hidden md:table-cell">{report.issueDescription}</td>
                                <td className="p-4 flex items-center gap-3">
                                    {report.reporterAvatar ? (
                                        <img alt="Avatar" className="w-7 h-7 rounded-full shadow-sm object-cover" src={report.reporterAvatar} />
                                    ) : (
                                        <div className="w-7 h-7 rounded-full bg-[#1A2B56] text-white flex items-center justify-center font-semibold text-[10px]">
                                            {report.reportedBy.charAt(0)}
                                        </div>
                                    )}
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{report.reportedBy}</span>
                                </td>
                                <td className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400 hidden sm:table-cell">{report.dateReported}</td>
                                <td className="p-4 rounded-r-2xl text-right">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${getPriorityBadgeColor(report.priority)}`}>
                                        {report.priority}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentDamageReports;
