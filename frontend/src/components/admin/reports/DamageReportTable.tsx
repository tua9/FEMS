import React from 'react';
import { DamageReport } from '../../../types/admin.types';

interface DamageReportTableProps {
    reports: DamageReport[];
    onOpenDetails?: (report: DamageReport) => void;
}

const DamageReportTable: React.FC<DamageReportTableProps> = ({ reports, onOpenDetails }) => {

    const getPriorityStyle = (priority: string) => {
        if (priority.includes('High')) return 'bg-red-500 text-white border-transparent';
        if (priority.includes('Medium')) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/30';
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Resolved': return 'bg-emerald-500 shadow-emerald-500/20';
            case 'In Progress': return 'bg-amber-500 shadow-amber-500/20';
            case 'Pending': return 'bg-red-500 shadow-red-500/20';
            default: return 'bg-slate-500';
        }
    };

    const rowBg = "bg-white/70 group-hover:bg-white dark:bg-slate-800/60 dark:group-hover:bg-slate-700/80 backdrop-blur-sm transition-colors";

    return (
        <div>
            <table className="w-full text-left border-separate border-spacing-y-3">
                <colgroup>
                    <col className="w-[20%]" />
                    <col className="w-[28%]" />
                    <col className="w-[20%]" />
                    <col className="w-[20%]" />
                    <col className="w-[12%]" />
                </colgroup>
                <thead>
                    <tr className="text-slate-800 dark:text-slate-300">
                        <th className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-[0.15em] opacity-80">Report ID &amp; Date</th>
                        <th className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-[0.15em] opacity-80">Equipment Issue</th>
                        <th className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-[0.15em] opacity-80">Reported By</th>
                        <th className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-[0.15em] opacity-80">Status &amp; Priority</th>
                        <th className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-[0.15em] opacity-80 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map(report => (
                        <tr key={report.id} className="group cursor-pointer" onClick={() => onOpenDetails && onOpenDetails(report)}>
                            <td className={`p-4 rounded-l-[24px] ${rowBg}`}>
                                <div className="space-y-1">
                                    <div className="font-bold text-xs text-[#1A2B56] dark:text-blue-400">{report.id}</div>
                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{report.dateReported}</div>
                                </div>
                            </td>
                            <td className={`p-4 ${rowBg}`}>
                                <div className="flex flex-col justify-center min-h-[44px]">
                                    <div className="text-xs font-bold text-slate-800 dark:text-white mb-1 truncate">{report.equipmentName}</div>
                                    <div className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{report.issueDescription}</div>
                                </div>
                            </td>
                            <td className={`p-4 ${rowBg}`}>
                                <div className="flex items-center gap-2.5 h-full">
                                    {report.reporterAvatar ? (
                                        <img alt="Avatar" className="w-8 h-8 rounded-full object-cover shadow-sm border-2 border-slate-200 dark:border-slate-600 flex-shrink-0" src={report.reporterAvatar} />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-[#1A2B56] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                                            {report.reportedBy.charAt(0)}
                                        </div>
                                    )}
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{report.reportedBy}</span>
                                </div>
                            </td>
                            <td className={`p-4 ${rowBg}`}>
                                <div className="flex flex-col items-center gap-2 h-full justify-center">
                                    <span className="w-[124px] py-1.5 flex items-center justify-center gap-2 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400">
                                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusStyle(report.status)}`}></span>
                                        {report.status}
                                    </span>
                                    <span className={`w-[124px] py-1 flex items-center justify-center rounded-full text-[8px] font-black uppercase tracking-[0.15em] border ${getPriorityStyle(report.priority)}`}>
                                        {report.priority}
                                    </span>
                                </div>
                            </td>
                            <td className={`p-4 rounded-r-[24px] text-right ${rowBg}`} onClick={e => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                    <button className="p-2 hover:bg-[#1A2B56] dark:hover:bg-blue-500 rounded-xl transition-all text-slate-400 hover:text-white group/icon shadow-sm hover:shadow-md">
                                        <span className="material-symbols-outlined text-lg">assignment_ind</span>
                                    </button>
                                    <button className="p-2 hover:bg-[#1A2B56] dark:hover:bg-blue-500 rounded-xl transition-all text-slate-400 hover:text-white group/icon shadow-sm hover:shadow-md">
                                        <span className="material-symbols-outlined text-lg">visibility</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DamageReportTable;
