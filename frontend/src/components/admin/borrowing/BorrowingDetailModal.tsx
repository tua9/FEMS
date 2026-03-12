import React from 'react';
import { createPortal } from 'react-dom';
import type { BorrowRecord } from '../../../types/admin.types';

interface BorrowingDetailModalProps {
    isOpen: boolean;
    record: BorrowRecord | null;
    onClose: () => void;
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
    onReturn?: (id: string) => void;
    onAlert?: (id: string) => void;
}

const BorrowingDetailModal: React.FC<BorrowingDetailModalProps> = ({
    isOpen,
    record,
    onClose,
    onApprove,
    onReject,
    onReturn,
    onAlert
}) => {
    if (!isOpen || !record) return null;

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200/50';
            case 'Approved': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200/50';
            case 'Returned': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/50';
            case 'Overdue': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200/50';
            case 'Rejected': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200/50';
            default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/50';
        }
    };

    return (
        createPortal(
            <div className="fixed inset-0 z-100 flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm">
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
                <div className="relative w-full max-w-2xl dashboard-card rounded-4xl shadow-2xl shadow-[#1E2B58]/20 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

                    {/* Header Section */}
                    <div className="px-10 pt-8 pb-6 relative border-b border-black/8 dark:border-white/10">
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-8 w-8 h-8 flex items-center justify-center text-[#1E2B58]/50 hover:text-[#1E2B58] hover:bg-[#1E2B58]/8 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/10 rounded-full transition-colors z-20"
                        >
                            <span className="material-symbols-outlined text-xl">close</span>
                        </button>

                        <div className="flex items-center gap-4 mb-3">
                            <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 shadow-sm ${getStatusStyle(record.status)}`}>
                                {record.status}
                            </span>
                            <span className="text-[10px] font-black text-[#1E2B58]/40 dark:text-white/40 uppercase tracking-widest">Transaction ID: {record.id}</span>
                        </div>

                        <h3 className="text-2xl font-black text-[#1E2B58] dark:text-white tracking-tight">Loan Specifications</h3>
                    </div>

                    <div className="p-10 pt-0 overflow-y-auto no-scrollbar space-y-8 relative z-10">
                        {/* Borrower & Equipment Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Borrower Info */}
                            <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Borrower Details</h4>
                                <div className="flex items-center gap-4">
                                    {record.borrowerAvatar ? (
                                        <img src={record.borrowerAvatar} alt={record.borrowerName} className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-slate-600 shadow-sm" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-2xl bg-[#1A2B56] text-white flex items-center justify-center font-bold text-lg">
                                            {record.borrowerName.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-black text-slate-800 dark:text-white leading-tight">{record.borrowerName}</p>
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">ID: {record.borrowerId}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Equipment Info */}
                            <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Equipment Details</h4>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-[#1A2B56] dark:text-blue-400 flex items-center justify-center border-2 border-blue-100 dark:border-blue-900/30">
                                        <span className="material-symbols-outlined text-2xl">devices</span>
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-800 dark:text-white leading-tight">{record.equipmentName}</p>
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">Asset: {record.equipmentId}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Schedule & Timing */}
                        <div className="p-8 rounded-4xl bg-slate-50/50 dark:bg-slate-900/20 border-2 border-slate-100 dark:border-slate-800">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Scheduled Due Date</p>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xl font-black ${record.status === 'Overdue' ? 'text-red-500' : 'text-[#1A2B56] dark:text-white'}`}>
                                            {record.dueDate}
                                        </span>
                                        {record.status === 'Overdue' && (
                                            <span className="px-2 py-0.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-black uppercase">Overdue</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden md:block">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Remaining Time</p>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                            {record.status === 'Overdue' ? 'Exceeded' : '4 Days Remaining'}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 border-2 border-slate-100 dark:border-slate-700 transform rotate-12">
                                        <span className="material-symbols-outlined">schedule</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Mini-Timeline */}
                        <div>
                            <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-6 flex items-center gap-3">
                                <span className="w-8 h-0.5 bg-slate-200 dark:bg-slate-700"></span>
                                Transaction Timeline
                            </h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/40 border-2 border-slate-100 dark:border-slate-800">
                                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[18px]">verified</span>
                                    </div>
                                    <div className="text-xs">
                                        <p className="font-bold text-slate-800 dark:text-white">Loan Request Processed</p>
                                        <p className="text-slate-500">Auto-approved by policy • Feb 24, 2026</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Important Warning if Overdue */}
                        {record.status === 'Overdue' && (
                            <div className="p-6 rounded-4xl bg-red-50/50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-900/30 flex gap-4">
                                <span className="material-symbols-outlined text-red-500">warning</span>
                                <div>
                                    <p className="text-sm font-bold text-red-700 dark:text-red-400">Compliance Warning</p>
                                    <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1 leading-relaxed">
                                        This unit has exceeded its return window. The student must be notified immediately and automated penalties may apply.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer / Actions */}
                    <div className="p-8 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/30 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex gap-2">
                            {record.status === 'Pending' && (
                                <>
                                    <button
                                        onClick={() => { onApprove?.(record.id); onClose(); }}
                                        className="px-6 py-2.5 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20"
                                    >
                                        Approve Loan
                                    </button>
                                    <button
                                        onClick={() => { onReject?.(record.id); onClose(); }}
                                        className="px-6 py-2.5 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-red-100 hover:bg-red-100 transition-all"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}
                            {record.status === 'Approved' && (
                                <button
                                    onClick={() => { onReturn?.(record.id); onClose(); }}
                                    className="px-8 py-3 bg-[#1A2B56] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-blue-900/20"
                                >
                                    Confirm Return
                                </button>
                            )}
                            {record.status === 'Overdue' && (
                                <>
                                    <button
                                        onClick={() => { onAlert?.(record.id); onClose(); }}
                                        className="px-6 py-2.5 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-red-500/20 flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm">notifications_active</span>
                                        Send Alert
                                    </button>
                                    <button
                                        onClick={() => { onReturn?.(record.id); onClose(); }}
                                        className="px-6 py-2.5 bg-[#1A2B56] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all"
                                    >
                                        Mark Returned
                                    </button>
                                </>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-black text-[10px] uppercase tracking-widest transition-colors"
                        >
                            Dismiss View
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        )
    );
};

export default BorrowingDetailModal;
