import React, { useState } from 'react';
// ── Main Modal ────────────────────────────────────────────────────────────────
const ConfirmApproveModal = ({ task, onCancel, onConfirm }) => {
 const [note, setNote] = useState('');

 return (
 <div
 className="fixed inset-0 z-60 flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm"
 onClick={onCancel}
 >
 <div
 className="relative w-full max-w-sm bg-white dark:bg-[#1a2340] rounded-3xl shadow-2xl shadow-[#1A2B56]/25 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
 onClick={(e) => e.stopPropagation()}
 >
 {/* ── Header ── */}
 <div className="px-7 pt-7 pb-5 flex items-center justify-between">
 <div className="flex items-center gap-3.5">
 {/* Small circular icon */}
 <div className="w-10 h-10 rounded-full bg-[#1A2B56] flex items-center justify-center shrink-0 shadow-md shadow-[#1A2B56]/30">
 <span
 className="material-symbols-outlined text-white text-[18px]"
 style={{ fontVariationSettings: "'FILL' 1" }}
 >
 check_circle
 </span>
 </div>
 <div>
 <h2 className="text-base font-extrabold text-[#1A2B56] dark:text-white leading-tight">
 Approve Ticket
 </h2>
 <p className="text-[11px] text-slate-400 dark:text-slate-400 font-medium mt-0.5">
 #{task.id}
 </p>
 </div>
 </div>
 {/* Close button */}
 <button
 type="button"
 onClick={onCancel}
 className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/10 dark:text-slate-400 dark:hover:text-white transition-all ml-2 shrink-0"
 aria-label="Close"
 >
 <span className="material-symbols-outlined text-[18px]">close</span>
 </button>
 </div>

 {/* ── Body ── */}
 <div className="px-7 pb-6 space-y-4">
 {/* Confirm info box */}
 <div className="flex items-start gap-3 px-4 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
 <span
 className="material-symbols-outlined text-[#1A2B56] dark:text-blue-300 text-[20px] shrink-0 mt-0.5"
 style={{ fontVariationSettings: "'FILL' 1" }}
 >
 info
 </span>
 <div>
 <p className="text-sm font-bold text-[#1A2B56] dark:text-white leading-snug">
 Confirm approval
 </p>
 <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
 You are approving the repair request for{' '}
 <span className="font-semibold text-slate-700 dark:text-slate-200">
 {task.title}
 </span>{' '}
 in{' '}
 <span className="font-semibold text-slate-700 dark:text-slate-200">
 {task.location.building}, {task.location.room}
 </span>.
 </p>
 </div>
 </div>

 {/* Note field */}
 <div className="space-y-1.5">
 <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
 Note <span className="normal-case font-semibold">(optional)</span>
 </label>
 <textarea
 value={note}
 onChange={(e) => setNote(e.target.value)}
 placeholder="Add approval notes or instructions for the technician..."
 rows={3}
 className="w-full resize-none rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-sm text-[#1A2B56] dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-[#1A2B56]/20 dark:focus:ring-blue-500/20 transition-all"
 />
 </div>
 </div>

 {/* ── Footer ── */}
 <div className="px-7 py-5 border-t border-slate-100 dark:border-white/8 flex gap-3">
 {/* Cancel — ghost pill */}
 <button
 type="button"
 onClick={onCancel}
 className="flex-1 py-3 rounded-full border border-slate-200 dark:border-white/15 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
 >
 Cancel
 </button>
 {/* Approve — solid pill */}
 <button
 type="button"
 onClick={onConfirm}
 className="flex-2 py-3 rounded-full bg-[#1A2B56] dark:bg-[#1A2B56] text-white text-sm font-bold hover:bg-[#151f40] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1A2B56]/25"
 >
 <span
 className="material-symbols-outlined text-[17px]"
 style={{ fontVariationSettings: "'FILL' 1" }}
 >
 check_circle
 </span>
 Approve
 </button>
 </div>
 </div>
 </div>
 );
};

export default ConfirmApproveModal;
