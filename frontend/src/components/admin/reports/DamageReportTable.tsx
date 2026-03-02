import React from 'react';
import { DamageReport } from '../../../types/admin.types';

interface DamageReportTableProps {
    reports: DamageReport[];
    onOpenDetails?: (report: DamageReport) => void;
}

const DamageReportTable: React.FC<DamageReportTableProps> = ({ reports, onOpenDetails }) => {

    const getPriorityStyle = (priority: string) => {
        if (priority.includes('High')) return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50';
        if (priority.includes('Medium')) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50';
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Resolved': return 'bg-emerald-500 shadow-emerald-500/50';
            case 'In Progress': return 'bg-amber-500 shadow-amber-500/50';
            case 'Open': return 'bg-red-500 shadow-red-500/50';
            default: return 'bg-slate-500 flex-shrink-0';
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
                            <td className={`p-3 rounded-l-xl align-top pt-4 ${rowBg}`}>
                                <div className="font-bold text-xs text-[#1A2B56] dark:text-blue-400">{report.id}</div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">{report.dateReported}</div>
                            </td>
                            <td className={`p-3 ${rowBg}`}>
                                <div className="text-xs font-bold text-slate-800 dark:text-white mb-1 truncate">{report.equipmentName}</div>
                                <div className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-2">{report.issueDescription}</div>
                            </td>
                            <td className={`p-3 align-top pt-3 ${rowBg}`}>
                                <div className="flex items-center gap-2">
                                    {report.reporterAvatar ? (
                                        <img alt="Avatar" className="w-7 h-7 rounded-full object-cover shadow-sm border border-slate-200 dark:border-slate-600 flex-shrink-0" src={report.reporterAvatar} />
                                    ) : (
                                        <div className="w-7 h-7 rounded-full bg-[#1A2B56] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                                            {report.reportedBy.charAt(0)}
                                        </div>
                                    )}
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{report.reportedBy}</span>
                                </div>
                            </td>
                            <td className={`p-3 align-top pt-3 ${rowBg}`}>
                                <div className="flex flex-col items-start gap-1.5">
                                    <span className="px-2 py-1 flex items-center gap-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusStyle(report.status)}`}></span>
                                        {report.status}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getPriorityStyle(report.priority)}`}>
                                        {report.priority}
                                    </span>
                                </div>
                            </td>
                            <td className={`p-3 rounded-r-xl text-right align-top pt-3 ${rowBg}`} onClick={e => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 hover:bg-[#1A2B56]/10 dark:hover:bg-blue-900/30 rounded-lg transition-all text-slate-400 hover:text-[#1A2B56] dark:hover:text-blue-400">
                                        <span className="material-symbols-outlined text-lg">assignment_ind</span>
                                    </button>
                                    <button className="p-1.5 hover:bg-white/80 dark:hover:bg-slate-600 rounded-lg transition-all text-slate-400 hover:text-[#1A2B56] dark:hover:text-blue-400">
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
