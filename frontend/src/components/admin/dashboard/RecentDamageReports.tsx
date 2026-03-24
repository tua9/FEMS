import React from 'react';
import { format } from 'date-fns';
import type { RecentDamageReport } from '../../../types/admin.types';

interface RecentDamageReportsProps {
    reports: RecentDamageReport[];
    onViewAll?: () => void;
    onRowClick?: (report: RecentDamageReport) => void;
}

const RecentDamageReports: React.FC<RecentDamageReportsProps> = ({ reports, onViewAll, onRowClick }) => {
    const getPriorityBadgeColor = (priority: string) => {
        const p = priority?.toLowerCase() || '';
        if (p === 'critical' || p === 'high') return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
        if (p === 'medium') return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
    };

    return (
        <div className="dashboard-card p-8 rounded-4xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h4 className="font-extrabold text-[#1A2B56] dark:text-white text-lg">Recent Damage Reports</h4>
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
                        {reports.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-slate-400 text-sm font-medium italic">No recent reports found</td>
                            </tr>
                        ) : (
                            reports.map((report) => (
                                <tr key={report._id} onClick={() => onRowClick?.(report)} className="bg-white/10 dark:bg-slate-700/20 hover:bg-white/30 dark:hover:bg-slate-700/40 transition-all rounded-2xl group cursor-pointer backdrop-blur-sm">
                                    <td className="p-4 rounded-l-2xl text-sm font-bold text-slate-800 dark:text-white">
                                        {report.equipment_id?.name || 'Unknown Equipment'}
                                    </td>
                                    <td className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400 max-w-xs truncate hidden md:table-cell">
                                        {report.description}
                                    </td>
                                    <td className="p-4 flex items-center gap-3">
                                        {report.user_id?.avatar ? (
                                            <img alt="Avatar" className="w-7 h-7 rounded-full shadow-sm object-cover" src={report.user_id.avatar} />
                                        ) : (
                                            <div className="w-7 h-7 rounded-full bg-[#1A2B56] text-white flex items-center justify-center font-semibold text-[10px] shrink-0">
                                                {report.user_id?.name?.charAt(0) || 'U'}
                                            </div>
                                        )}
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">
                                            {report.user_id?.name || 'Anonymous User'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400 hidden sm:table-cell">
                                        {format(new Date(report.createdAt), 'MMM dd, yyyy')}
                                    </td>
                                    <td className="p-4 rounded-r-2xl text-right">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${getPriorityBadgeColor(report.priority)}`}>
                                            {report.priority}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentDamageReports;
