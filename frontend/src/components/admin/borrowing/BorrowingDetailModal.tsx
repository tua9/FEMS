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
    onAlert,
}) => {
    if (!isOpen || !record) return null;

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200/50';
            case 'approved': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200/50';
            case 'handed_over': return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-200/50';
            case 'overdue': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200/50';
            case 'returned': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/50';
            case 'rejected': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200/50';
            default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/50';
        }
    };

    const isOverdue = record.status === 'overdue' || (record.status === 'handed_over' && new Date(record.return_date) < new Date());
    const displayStatus = isOverdue ? 'overdue' : record.status;
    
    // Resolve entity (Equipment or Room)
    const isInfrastructure = record.type === 'infrastructure';
    const entity = isInfrastructure ? record.room_id : record.equipment_id;
    const entityName = (entity as any)?.name || 'Unknown';
    const entitySub = isInfrastructure ? (entity as any)?.type : (entity as any)?.category;
    const entityIcon = isInfrastructure ? 'meeting_room' : 'devices';

    return (
        createPortal(
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
                            <div className="flex items-center gap-4 mb-3">
                                <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 shadow-sm ${getStatusStyle(displayStatus)}`}>
                                    {displayStatus}
                                </span>
                                <span className="px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 shadow-sm bg-blue-50/50 dark:bg-blue-900/10 text-[#1A2B56] dark:text-blue-400 border-blue-100 dark:border-blue-900/30">
                                    {record.type}
                                </span>
                            </div>

                            <h3 className="text-2xl font-black text-[#1E2B58] dark:text-white tracking-tight">Borrowing Specifications</h3>
                            <p className="text-[0.625rem] font-black text-[#1E2B58]/50 dark:text-white/40 uppercase tracking-widest mt-1">Request ID: {record._id}</p>
                        </div>
                    </div>

                    <div className="p-10 pt-0 overflow-y-auto no-scrollbar space-y-8 relative z-10">
                        {/* Borrower & Entity Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            {/* Borrower Info */}
                            <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Borrower Details</h4>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#1A2B56] text-white flex items-center justify-center font-bold text-lg">
                                        {(typeof record.user_id === 'object' ? record.user_id?.displayName : 'U')?.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-black text-slate-800 dark:text-white leading-tight truncate">
                                            {typeof record.user_id === 'object' ? record.user_id?.displayName : 'Unknown'}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                                            {typeof record.user_id === 'object' ? record.user_id?.email : 'No email'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Entity Info (Equipment or Room) */}
                            <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{isInfrastructure ? 'Infrastructure' : 'Equipment'} Details</h4>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-[#1A2B56] dark:text-blue-400 flex items-center justify-center border-2 border-blue-100 dark:border-blue-900/30">
                                        <span className="material-symbols-outlined text-2xl">{entityIcon}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-black text-slate-800 dark:text-white leading-tight truncate">
                                            {entityName}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                                            {isInfrastructure ? 'Type: ' : 'Category: '}{entitySub || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Note / Purpose */}
                        {record.note && (
                            <div className="p-8 rounded-[32px] bg-slate-50/50 dark:bg-slate-900/20 border-2 border-slate-100 dark:border-slate-800">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Purpose/Note</h4>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">
                                    "{record.note}"
                                </p>
                            </div>
                        )}

                        {/* Schedule & Timing */}
                        <div className="p-8 rounded-4xl bg-slate-50/50 dark:bg-slate-900/20 border-2 border-slate-100 dark:border-slate-800">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Scheduled Due Date</p>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xl font-black ${isOverdue ? 'text-red-500' : 'text-[#1A2B56] dark:text-white'}`}>
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

                        {/* Administrative Metadata */}
                        {(record.approved_by || record.createdAt) && (
                            <div>
                                <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-0.5 bg-slate-200 dark:bg-slate-700"></span>
                                    Audit Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {record.createdAt && (
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/40 border-2 border-slate-100 dark:border-slate-800">
                                            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center shadow-sm">
                                                <span className="material-symbols-outlined text-[18px]">history</span>
                                            </div>
                                            <div className="text-[10px]">
                                                <p className="font-bold text-slate-500 uppercase tracking-widest">Requested On</p>
                                                <p className="font-black text-slate-800 dark:text-white mt-0.5">{new Date(record.createdAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    )}
                                    {record.approved_by && (
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/40 border-2 border-slate-100 dark:border-slate-800">
                                            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center shadow-sm">
                                                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                                            </div>
                                            <div className="text-[10px]">
                                                <p className="font-bold text-slate-500 uppercase tracking-widest">Handled By</p>
                                                <p className="font-black text-slate-800 dark:text-white mt-0.5 truncate">
                                                    {typeof record.approved_by === 'object' ? record.approved_by?.displayName : 'Staff'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Important Warning if Overdue */}
                        {isOverdue && (
                            <div className="p-6 rounded-4xl bg-red-50/50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-900/30 flex gap-4">
                                <span className="material-symbols-outlined text-red-500">warning</span>
                                <div>
                                    <p className="text-sm font-bold text-red-700 dark:text-red-400">Compliance Warning</p>
                                    <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1 leading-relaxed italic">
                                        This unit has exceeded its return window. The student must be notified immediately and automated penalties may apply.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer / Actions */}
                    <div className="px-8 py-5 border-t border-black/8 dark:border-white/10 bg-black/3 dark:bg-white/3 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex gap-3">
                            {record.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => { onApprove?.(record._id); onClose(); }}
                                        className="w-11 h-11 bg-slate-50 dark:bg-slate-900/10 border-2 border-slate-100 dark:border-slate-800/30 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-100 dark:hover:border-emerald-800/30 rounded-xl transition-all shadow-sm flex items-center justify-center"
                                        title="Approve Loan"
                                    >
                                        <span className="material-symbols-outlined text-xl">check_circle</span>
                                    </button>
                                    <button
                                        onClick={() => { onReject?.(record._id); onClose(); }}
                                        className="px-6 py-2.5 bg-slate-50 dark:bg-slate-900/10 border-2 border-slate-100 dark:border-slate-800/30 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-100 dark:hover:border-red-800/30 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-lg">cancel</span>
                                        Reject
                                    </button>
                                </>
                            )}
                            {record.status === 'approved' && (
                                <button
                                    onClick={() => { onHandover?.(record._id); onClose(); }}
                                    className="px-8 py-3 bg-[#1A2B56] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">vpn_key</span>
                                    Handover {isInfrastructure ? 'Keys' : 'Equipment'}
                                </button>
                            )}
                            {(record.status === 'handed_over' || record.status === 'overdue' || isOverdue) && (
                                <button
                                    onClick={() => { onReturn?.(record._id); onClose(); }}
                                    className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-indigo-900/20 active:scale-95 flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">assignment_return</span>
                                    Confirm Return
                                </button>
                            )}
                            {isOverdue && (
                                <button
                                    onClick={() => { onAlert?.(record._id); onClose(); }}
                                    className="w-11 h-11 bg-slate-50 dark:bg-slate-900/10 border-2 border-slate-100 dark:border-slate-800/30 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-100 dark:hover:border-amber-800/30 rounded-xl transition-all shadow-sm flex items-center justify-center"
                                    title="Send Alert"
                                >
                                    <span className="material-symbols-outlined text-xl">notifications_active</span>
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
        )
    );
};

export default BorrowingDetailModal;
