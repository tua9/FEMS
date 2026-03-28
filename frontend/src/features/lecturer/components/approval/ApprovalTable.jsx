import { CheckCircle2, ChevronLeft, ChevronRight, Clock, XCircle } from 'lucide-react';
import React from 'react';
import { BORROW_STATUS } from '@/constants';

// ─── Shared Types (exported so ApprovalCenter can use them) ──────────────────

// ─── Status badge helper ──────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
 if (status === BORROW_STATUS.APPROVED) return (
 <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[0.5625rem] font-black uppercase tracking-widest">
 <CheckCircle2 className="w-3 h-3" /> Approved
 </span>
 );
 if (status === BORROW_STATUS.REJECTED) return (
 <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 dark:text-red-400 text-[0.5625rem] font-black uppercase tracking-widest">
 <XCircle className="w-3 h-3" /> Rejected
 </span>
 );
 return (
 <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[0.5625rem] font-black uppercase tracking-widest">
 <Clock className="w-3 h-3" /> Pending
 </span>
 );
};

// ─── Component ────────────────────────────────────────────────────────────────

export const ApprovalTable = ({
 items,
 totalPending,
 currentPage,
 totalPages,
 onPageChange,
 onApprove,
 onReject,
}) => {
 return (
 <div className="dashboard-card rounded-3xl sm:rounded-4xl overflow-hidden mb-16">
 <div className="overflow-x-auto hide-scrollbar">
 {items.length === 0 ? (
 <div className="py-[4rem] flex flex-col items-center gap-3 text-center px-6">
 <span className="material-symbols-outlined text-4xl text-[#1E2B58]/20 dark:text-white/20">
 inbox
 </span>
 <p className="font-black text-[#1E2B58]/40 dark:text-white/30 text-lg">No requests found.</p>
 <p className="text-sm text-[#1E2B58]/30 dark:text-white/20 font-medium">Try adjusting your search or filters.</p>
 </div>
 ) : (
 <table className="w-full border-collapse min-w-[800px]">
 <thead>
 <tr className="thead-tint">
 <th className="px-[2rem] py-[1.5rem] text-left text-[0.625rem] font-black uppercase tracking-[0.2em] text-[#1E2B58]/50 dark:text-slate-400">Student Info</th>
 <th className="px-[2rem] py-[1.5rem] text-left text-[0.625rem] font-black uppercase tracking-[0.2em] text-[#1E2B58]/50 dark:text-slate-400">Equipment / Facility</th>
 <th className="px-[2rem] py-[1.5rem] text-left text-[0.625rem] font-black uppercase tracking-[0.2em] text-[#1E2B58]/50 dark:text-slate-400">Period</th>
 <th className="px-[2rem] py-[1.5rem] text-right text-[0.625rem] font-black uppercase tracking-[0.2em] text-[#1E2B58]/50 dark:text-slate-400">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-black/5 dark:divide-white/5">
 {items.map((req) => {
 const Icon = req.equipment.icon;
 const isPending = req.status === BORROW_STATUS.PENDING;

 return (
 <tr key={req.id} className="transition-all duration-200 hover:bg-white/50 dark:hover:bg-white/5 group">
 {/* Student */}
 <td className="px-[2rem] py-[1.5rem]">
 <div className="flex items-center gap-[1rem]">
 <div className="relative shrink-0">
 {req.student.avatar ? (
 <img
 src={req.student.avatar}
 alt={req.student.name}
 className="w-[3rem] h-[3rem] rounded-full bg-white/40 border border-white/50 shadow-sm object-cover"
 />
 ) : (
 <div className="w-[3rem] h-[3rem] rounded-full bg-[#1E2B58]/10 dark:bg-slate-700 border border-white/50 flex items-center justify-center">
 <span className="text-sm font-black text-[#1E2B58] dark:text-white">{req.student.initials}</span>
 </div>
 )}
 <span className={`absolute bottom-0 right-0 w-[0.625rem] h-[0.625rem] ${req.student.statusColor} border-2 border-white rounded-full`} />
 </div>
 <div>
 <p className="font-bold text-[#1E2B58] dark:text-white text-[0.875rem] leading-none mb-[0.25rem]">{req.student.name}</p>
 <p className="text-[0.625rem] text-slate-500 font-bold uppercase tracking-widest">ID: {req.student.id}</p>
 </div>
 </div>
 </td>

 {/* Equipment */}
 <td className="px-[2rem] py-[1.5rem]">
 <div className="flex items-center gap-[1rem]">
 <div className="w-[3rem] h-[3rem] rounded-full bg-[#1E2B58]/10 dark:bg-slate-800 flex items-center justify-center text-[#1E2B58] dark:text-slate-300 shrink-0">
 <Icon className="w-[1.25rem] h-[1.25rem]" strokeWidth={2} />
 </div>
 <div>
 <p className="font-bold text-slate-800 dark:text-slate-200 text-[0.875rem] mb-[0.125rem]">{req.equipment.name}</p>
 <p className="text-[0.625rem] text-slate-500 font-medium tracking-wide">Asset: {req.equipment.asset}</p>
 </div>
 </div>
 </td>

 {/* Period */}
 <td className="px-[2rem] py-[1.5rem]">
 <p className="text-[0.75rem] font-bold text-slate-800 dark:text-slate-200 mb-[0.25rem]">{req.period.date}</p>
 <p className={`text-[0.5625rem] font-black uppercase tracking-widest ${req.period.labelColor}`}>{req.period.label}</p>
 </td>

 {/* Actions */}
 <td className="px-[2rem] py-[1.5rem] text-right">
 {isPending ? (
 <div className="flex items-center justify-end gap-[0.75rem]">
 <button
 onClick={() => onReject(req)}
 className="px-[1.25rem] py-[0.5rem] rounded-full border border-[#1E2B58]/20 dark:border-white/20 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400 transition-all text-[0.6875rem] font-bold text-[#1E2B58] dark:text-slate-300 active:scale-95"
 >
 Reject
 </button>
 <button
 onClick={() => onApprove(req)}
 className="bg-[#1E2B58] text-white px-[1.5rem] py-[0.5rem] rounded-full text-[0.6875rem] font-bold hover:bg-[#1E2B58]/90 hover:scale-105 active:scale-95 transition-all shadow-sm shadow-[#1E2B58]/20"
 >
 Approve
 </button>
 </div>
 ) : (
 <StatusBadge status={req.status} />
 )}
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 )}
 </div>

 {/* Footer: count + pagination */}
 <div className="px-[2rem] py-[1.5rem] flex flex-col sm:flex-row items-center justify-between gap-[1rem] border-t border-black/5 dark:border-white/5">
 <p className="text-[0.6875rem] font-bold text-[#1E2B58]/60 dark:text-slate-400">
 Showing {items.length} of {totalPending} requests
 </p>

 {totalPages > 1 && (
 <div className="flex gap-[0.5rem]">
 <button
 onClick={() => onPageChange(currentPage - 1)}
 disabled={currentPage === 1}
 className="w-[2rem] h-[2rem] rounded-full bg-white/50 border border-white/60 dark:border-white/10 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/80 dark:hover:bg-white/10 transition-colors text-[#1E2B58] dark:text-white"
 >
 <ChevronLeft className="w-[1rem] h-[1rem]" />
 </button>

 {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
 <button
 key={p}
 onClick={() => onPageChange(p)}
 className={`w-[2rem] h-[2rem] rounded-full flex items-center justify-center font-bold text-[0.875rem] transition-all hover:scale-105 active:scale-95 ${
 currentPage === p
 ? 'bg-[#1E2B58] text-white shadow-sm shadow-[#1E2B58]/20'
 : 'bg-white/50 border border-white/60 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 text-[#1E2B58] dark:text-white'
 }`}
 >
 {p}
 </button>
 ))}

 <button
 onClick={() => onPageChange(currentPage + 1)}
 disabled={currentPage === totalPages}
 className="w-[2rem] h-[2rem] rounded-full bg-white/50 border border-white/60 dark:border-white/10 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/80 dark:hover:bg-white/10 transition-colors text-[#1E2B58] dark:text-white"
 >
 <ChevronRight className="w-[1rem] h-[1rem]" />
 </button>
 </div>
 )}
 </div>
 </div>
 );
};
