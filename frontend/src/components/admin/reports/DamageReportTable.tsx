import type { Report, ReportStatus } from '../../../types/report';

interface DamageReportTableProps {
    reports: Report[];
    onOpenDetails?: (report: Report) => void;
    onApprove?: (report: Report) => void;
    onReject?: (report: Report) => void;
    onUndo?: (report: Report) => void;
    onAssign?: (report: Report) => void;
    onResolve?: (report: Report) => void;
}

const DamageReportTable: React.FC<DamageReportTableProps> = ({
    reports,
    onOpenDetails,
    onApprove,
    onReject,
    onUndo,
    onAssign,
    onResolve
}) => {

    const getPriorityStyle = (priority: string) => {
        const p = priority.toLowerCase();
        if (p === 'high') return 'bg-[#EE4E4E] text-white border-transparent';
        if (p === 'medium') return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/30';
    };

    const getStatusStyle = (status: ReportStatus) => {
        switch (status) {
            case 'fixed': return 'bg-emerald-500 shadow-emerald-500/20';
            case 'processing': return 'bg-indigo-500 shadow-indigo-500/20';
            case 'approved': return 'bg-blue-400 shadow-blue-400/20 dark:bg-blue-400/80';
            case 'pending': return 'bg-amber-500 shadow-amber-500/20';
            case 'rejected': return 'bg-red-500 shadow-red-500/20';
            default: return 'bg-slate-500';
        }
    };

    const getStatusLabel = (status: ReportStatus) => {
        switch (status) {
            case 'fixed': return 'Resolved';
            case 'processing': return 'In Progress';
            case 'approved': return 'Approved';
            case 'pending': return 'Pending';
            case 'rejected': return 'Rejected';
            default: return status;
        }
    };

    const rowBg = "bg-white/70 group-hover:bg-white dark:bg-slate-800/60 dark:group-hover:bg-slate-700/80 backdrop-blur-sm transition-colors";

    const renderActions = (report: Report) => {
        const baseBtnClass = "min-h-[40px] px-3 rounded-[14px] transition-all shadow-sm flex items-center justify-center group/btn font-bold uppercase tracking-wider text-[10px] border-2";

        if (report.status === 'pending') {
            return (
                <div className="flex items-center justify-end gap-2 text-right">
                    <button
                        onClick={() => onApprove && onApprove(report)}
                        className={`${baseBtnClass} bg-slate-50 dark:bg-slate-900/10 border-slate-100 dark:border-slate-800/30 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-100 dark:hover:border-emerald-800/30 w-11 p-0`}
                        title="Approve Report"
                    >
                        <span className="material-symbols-outlined text-xl">check_circle</span>
                    </button>
                    <button
                        onClick={() => onReject && onReject(report)}
                        className={`${baseBtnClass} bg-slate-50 dark:bg-slate-900/10 border-slate-100 dark:border-slate-800/30 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-100 dark:hover:border-red-800/30 w-11 p-0`}
                        title="Reject Report"
                    >
                        <span className="material-symbols-outlined text-xl">cancel</span>
                    </button>
                </div>
            );
        }

        if (report.status === 'rejected') {
            return (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => onUndo && onUndo(report)}
                        className={`${baseBtnClass} bg-slate-50 dark:bg-slate-900/10 border-slate-100 dark:border-slate-800/30 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-100 dark:hover:border-blue-800/30 w-11 p-0`}
                        title="Undo Rejection"
                    >
                        <span className="material-symbols-outlined text-xl font-light">undo</span>
                    </button>
                </div>
            );
        }

        if (report.status === 'approved') {
            return (
                <div className="flex items-center justify-end gap-2 text-right">
                    <button
                        onClick={() => onAssign && onAssign(report)}
                        className={`${baseBtnClass} bg-slate-50 dark:bg-slate-900/10 border-slate-100 dark:border-slate-800/30 text-slate-400 hover:text-orange-700 dark:hover:text-orange-900/80 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-100 dark:hover:border-orange-800/30 w-11 p-0`}
                        title="Assign Technician"
                    >
                        <span className="material-symbols-outlined text-xl">person_add</span>
                    </button>
                </div>
            );
        }

        if (report.status === 'processing') {
            return (
                <div className="flex items-center justify-end gap-2 text-right">
                    <button
                        onClick={() => onResolve && onResolve(report)}
                        className={`${baseBtnClass} bg-slate-50 dark:bg-slate-900/10 border-slate-100 dark:border-slate-800/30 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-100 dark:hover:border-emerald-800/30 w-full max-w-[100px] font-black`}
                        title="Mark as Resolved"
                    >
                        <span className="material-symbols-outlined text-lg mr-1">task_alt</span>
                        Done
                    </button>
                </div>
            );
        }

        return <div className="h-10"></div>;
    };

    return (
        <div>
            <table className="w-full text-left border-separate border-spacing-y-3 table-fixed">
                <colgroup>
                    <col className="w-[15%]" />
                    <col className="w-[25%]" />
                    <col className="w-[25%]" />
                    <col className="w-[18%]" />
                    <col className="w-[17%]" />
                </colgroup>
                <thead>
                    <tr className="text-slate-800 dark:text-slate-300">
                        <th className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.15em] opacity-80">Report ID & Date</th>
                        <th className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.15em] opacity-80">Equipment Issue</th>
                        <th className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.15em] opacity-80">Reported By</th>
                        <th className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.15em] opacity-80 text-center">Status & Priority</th>
                        <th className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.15em] opacity-80 text-right pr-6">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map(report => {
                        const eqName = typeof report.equipment_id === 'object' ? report.equipment_id?.name : 'General Issue';
                        const reporterName = typeof report.user_id === 'object' ? report.user_id?.displayName || report.user_id?.username : 'Unknown';
                        
                        return (
                            <tr key={report._id} className="group cursor-pointer" onClick={() => onOpenDetails && onOpenDetails(report)}>
                                <td className={`p-4 rounded-l-[24px] ${rowBg}`}>
                                    <div className="space-y-1">
                                        <div className="font-semibold text-xs text-[#1A2B56] dark:text-blue-400">{report._id.slice(-8).toUpperCase()}</div>
                                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{new Date(report.createdAt || '').toLocaleDateString()}</div>
                                    </div>
                                </td>
                                <td className={`p-4 ${rowBg}`}>
                                    <div className="flex flex-col justify-center min-h-[44px] max-w-[300px]">
                                        <div className="text-xs font-semibold text-slate-800 dark:text-white mb-1 truncate">{eqName}</div>
                                        <div className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed break-words">{report.description}</div>
                                    </div>
                                </td>
                                <td className={`p-4 ${rowBg}`}>
                                    <div className="flex items-center gap-2.5 h-full">
                                        <div className="w-8 h-8 rounded-full bg-[#1A2B56] text-white flex items-center justify-center font-semibold text-xs flex-shrink-0">
                                            {(reporterName || 'U').charAt(0)}
                                        </div>
                                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{reporterName || 'Unknown'}</span>
                                    </div>
                                </td>
                                <td className={`p-4 ${rowBg}`}>
                                    <div className="flex flex-col items-center gap-2 h-full justify-center">
                                        <span className="w-full max-w-[120px] py-1.5 flex items-center justify-center gap-2 rounded-full text-[9px] font-semibold uppercase tracking-widest bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400">
                                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusStyle(report.status)}`}></span>
                                            {getStatusLabel(report.status)}
                                        </span>
                                        <span className={`w-full max-w-[120px] py-1 flex items-center justify-center rounded-full text-[8px] font-semibold uppercase tracking-[0.15em] border ${getPriorityStyle(report.priority)}`}>
                                            {report.priority}
                                        </span>
                                    </div>
                                </td>
                                <td className={`p-4 rounded-r-[24px] text-right pr-6 ${rowBg}`} onClick={e => e.stopPropagation()}>
                                    <div className="flex justify-end min-w-max">
                                        {renderActions(report)}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default DamageReportTable;
