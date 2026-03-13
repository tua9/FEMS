import React from 'react';
import { createPortal } from 'react-dom';
import { DamageReport } from '../../../types/admin.types';

interface DamageReportDetailModalProps {
    isOpen: boolean;
    report: DamageReport | null;
    onClose: () => void;
    onApprove?: (report: DamageReport) => void;
    onReject?: (report: DamageReport) => void;
    onUndo?: (report: DamageReport) => void;
    onAssign?: (report: DamageReport) => void;
    onResolve?: (report: DamageReport) => void;
}

const DamageReportDetailModal: React.FC<DamageReportDetailModalProps> = ({
    isOpen,
    report,
    onClose,
    onApprove,
    onReject,
    onUndo,
    onAssign,
    onResolve
}) => {
    if (!isOpen || !report) return null;

    const getPriorityStyle = (priority: string) => {
        if (priority.includes('High')) return 'bg-[#EE4E4E] text-white border-transparent';
        if (priority.includes('Medium')) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200/50';
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200/50';
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Resolved': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/50';
            case 'In Progress': return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-200/50';
            case 'Approved': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200/50';
            case 'Pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200/50';
            case 'Rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200/50';
            default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/50';
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm">
            <style dangerouslySetInnerHTML={{
                __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            ` }} />
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl glass-card rounded-[2rem] shadow-2xl shadow-[#1E2B58]/20 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

                {/* Header Section */}
                <div className="px-10 pt-8 pb-6 relative border-b border-black/8 dark:border-white/10">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-8 w-8 h-8 flex items-center justify-center text-[#1E2B58]/50 hover:text-[#1E2B58] hover:bg-[#1E2B58]/8 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/10 rounded-full transition-colors z-20"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>

                    <div className="flex items-center gap-4 mb-3">
                        <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 shadow-sm ${getStatusStyle(report.status)}`}>
                            {report.status}
                        </span>
                        <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 shadow-sm ${getPriorityStyle(report.priority)}`}>
                            {report.priority}
                        </span>
                    </div>

                    <h3 className="text-2xl font-black text-[#1E2B58] dark:text-white tracking-tight">Issue Report Details</h3>
                    <p className="text-[0.625rem] font-black text-[#1E2B58]/50 dark:text-white/40 uppercase tracking-widest mt-1">Ticket ID: {report.id}</p>
                </div>

                <div className="p-10 pt-0 overflow-y-auto no-scrollbar space-y-8 relative z-10">
                    {/* reporter & Equipment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Reported By</h4>
                            <div className="flex items-center gap-4">
                                {report.reporterAvatar ? (
                                    <img src={report.reporterAvatar} alt={report.reportedBy} className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-slate-600 shadow-sm" />
                                ) : (
                                    <div className="w-12 h-12 rounded-2xl bg-[#1A2B56] text-white flex items-center justify-center font-bold text-lg">
                                        {report.reportedBy.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <p className="font-black text-slate-800 dark:text-white leading-tight">{report.reportedBy}</p>
                                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1">{report.dateReported}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Affected Equipment</h4>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center border-2 border-blue-100 dark:border-blue-900/30">
                                    <span className="material-symbols-outlined text-2xl">devices</span>
                                </div>
                                <div>
                                    <p className="font-black text-slate-800 dark:text-white leading-tight">{report.equipmentName}</p>
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">Asset: {report.equipmentId}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Issue Description */}
                    <div className="p-8 rounded-[32px] bg-slate-50/50 dark:bg-slate-900/20 border-2 border-slate-100 dark:border-slate-800">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Description of the Incident</h4>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">
                            "{report.issueDescription}"
                        </p>
                    </div>

                    {/* Technical Notes / History */}
                    <div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-6 flex items-center gap-3">
                            <span className="w-8 h-0.5 bg-slate-200 dark:bg-slate-700"></span>
                            Processing Status
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/40 border-2 border-slate-100 dark:border-slate-800">
                                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[18px]">history</span>
                                </div>
                                <div className="text-xs">
                                    <p className="font-bold text-slate-800 dark:text-white">
                                        {report.status === 'Pending' ? 'Awaiting Approval' : report.status === 'Approved' ? 'Technician Assigned' : report.status === 'In Progress' ? 'Maintenance Underway' : report.status === 'Rejected' ? 'Request Rejected' : 'Issue Resolved'}
                                    </p>
                                    <p className="text-slate-500">Last updated • {new Date().toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="px-8 py-5 border-t border-black/8 dark:border-white/10 bg-black/3 dark:bg-white/3 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-3">
                        {report.status === 'Pending' && (
                            <>
                                <button
                                    onClick={() => { onApprove?.(report); onClose(); }}
                                    className="w-11 h-11 bg-slate-50 dark:bg-slate-900/10 border-2 border-slate-100 dark:border-slate-800/30 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-100 dark:hover:border-emerald-800/30 rounded-xl transition-all shadow-sm flex items-center justify-center"
                                    title="Approve Report"
                                >
                                    <span className="material-symbols-outlined text-xl">check_circle</span>
                                </button>
                                <button
                                    onClick={() => { onReject?.(report); onClose(); }}
                                    className="px-6 py-2.5 bg-slate-50 dark:bg-slate-900/10 border-2 border-slate-100 dark:border-slate-800/30 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-100 dark:hover:border-red-800/30 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">cancel</span>
                                    Reject
                                </button>
                            </>
                        )}
                        {report.status === 'Rejected' && (
                            <button
                                onClick={() => { onUndo?.(report); onClose(); }}
                                className="w-11 h-11 bg-slate-50 dark:bg-slate-900/10 border-2 border-slate-100 dark:border-slate-800/30 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-100 dark:hover:border-blue-800/30 rounded-xl transition-all shadow-sm flex items-center justify-center"
                                title="Undo Rejection"
                            >
                                <span className="material-symbols-outlined text-xl font-light">undo</span>
                            </button>
                        )}
                        {report.status === 'Approved' && (
                            <button
                                onClick={() => { onAssign?.(report); onClose(); }}
                                className="w-11 h-11 bg-slate-50 dark:bg-slate-900/10 border-2 border-slate-100 dark:border-slate-800/30 text-slate-400 hover:text-orange-700 dark:hover:text-orange-900/80 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-100 dark:hover:border-orange-800/30 rounded-xl transition-all shadow-lg flex items-center justify-center"
                                title="Assign Technician"
                            >
                                <span className="material-symbols-outlined text-xl">person_add</span>
                            </button>
                        )}
                        {report.status === 'In Progress' && (
                            <button
                                onClick={() => { onResolve?.(report); onClose(); }}
                                className="px-8 py-3 bg-slate-50 dark:bg-slate-900/10 border-2 border-slate-100 dark:border-slate-800/30 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-100 dark:hover:border-emerald-800/30 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-xl">task_alt</span>
                                Mark as Resolved
                            </button>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-[10px] uppercase tracking-widest transition-colors"
                    >
                        Dismiss View
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default DamageReportDetailModal;
