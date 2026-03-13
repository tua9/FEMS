import React from 'react';
import { createPortal } from 'react-dom';
import type { BorrowRequest } from '../../../types/borrowRequest';

interface BorrowingDetailModalProps {
    isOpen: boolean;
    record: BorrowRequest | null;
    onClose: () => void;
    onApprove?: (id: string) => void;
    onHandover?: (id: string) => void;
    onReject?: (id: string) => void;
    onReturn?: (id: string) => void;
    onAlert?: (id: string) => void;
}

const BorrowingDetailModal: React.FC<BorrowingDetailModalProps> = ({
    isOpen,
    record,
    onClose,
    onApprove,
    onHandover,
    onReject,
    onReturn,
    onAlert
}) => {
    if (!isOpen || !record) return null;

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200/50';
            case 'approved': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200/50';
            case 'handed_over': return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-200/50';
            case 'returned': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/50';
            case 'rejected': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200/50';
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

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 shadow-sm ${getStatusStyle(record.status)}`}>
                                    {record.status}
                                </span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID: {record._id}</span>
                            </div>

                            <h3 className="text-3xl font-black text-[#1A2B56] dark:text-white tracking-tight">Loan Specifications</h3>
                        </div>
                    </div>


                    <div className="p-10 pt-0 overflow-y-auto no-scrollbar space-y-8 relative z-10">
                        {/* Borrower & Equipment Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Borrower Info */}
                            <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Borrower Details</h4>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#1A2B56] text-white flex items-center justify-center font-bold text-lg">
                                        {(typeof record.user_id === 'object' ? record.user_id?.displayName : 'U')?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-800 dark:text-white leading-tight">
                                            {typeof record.user_id === 'object' ? record.user_id?.displayName : 'Unknown'}
                                        </p>
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                                            Email: {typeof record.user_id === 'object' ? record.user_id?.email : 'Unknown'}
                                        </p>
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
                                        <p className="font-black text-slate-800 dark:text-white leading-tight">
                                            {typeof record.equipment_id === 'object' ? record.equipment_id?.name : 'Unknown Item'}
                                        </p>
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                                            Category: {typeof record.equipment_id === 'object' ? record.equipment_id?.category : 'N/A'}
                                        </p>
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
                                        <span className="text-xl font-black text-[#1A2B56] dark:text-white">
                                            {new Date(record.return_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden md:block">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Borrow Date</p>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                            {new Date(record.borrow_date).toLocaleDateString()}
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
                            {record.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => { onApprove?.(record._id); onClose(); }}
                                        className="px-6 py-2.5 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20"
                                    >
                                        Approve Loan
                                    </button>
                                    <button
                                        onClick={() => { onReject?.(record._id); onClose(); }}
                                        className="px-6 py-2.5 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-red-100 hover:bg-red-100 transition-all"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}
                            {record.status === 'approved' && (
                                <button
                                    onClick={() => { onHandover?.(record._id); onClose(); }}
                                    className="px-8 py-3 bg-[#1A2B56] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-blue-900/20"
                                >
                                    Handover Equipment
                                </button>
                            )}
                            {record.status === 'handed_over' && (
                                <button
                                    onClick={() => { onReturn?.(record._id); onClose(); }}
                                    className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-indigo-900/20"
                                >
                                    Confirm Return
                                </button>
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
