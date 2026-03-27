import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Laptop, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { fmtTime } from './borrowUtils';

const BorrowModal = ({ isOpen, onClose, target, activeSchedule, onConfirm, submitting }) => {
  const [borrowNote, setBorrowNote] = useState('');

  if (!isOpen || !target) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!borrowNote.trim()) {
      toast.error('Please enter a reason for borrowing this equipment.');
      return;
    }
    onConfirm(borrowNote.trim());
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="dashboard-card rounded-4xl p-8 w-full max-w-md shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition"
        >
          <X className="w-4 h-4 text-[#1E2B58]/60 dark:text-white/60" />
        </button>

        {/* Equipment preview */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center shrink-0">
            {target.img
              ? <img src={target.img} alt="" className="w-full h-full object-cover" />
              : <Laptop className="w-6 h-6 text-slate-400" />
            }
          </div>
          <div>
            <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-0.5">
              Borrow Request
            </p>
            <h3 className="text-lg font-black text-[#1E2B58] dark:text-white leading-tight">
              {target.name}
            </h3>
          </div>
        </div>

        {/* Session summary */}
        <div className="bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] p-4 mb-5 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium shrink-0">Room</span>
            <span className="font-bold text-[#1E2B58] dark:text-white text-right">
              {activeSchedule?.roomId?.name || '—'}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium shrink-0">Session</span>
            <span className="font-bold text-[#1E2B58] dark:text-white text-right truncate max-w-[65%]">
              {activeSchedule?.title}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium shrink-0">Time</span>
            <span className="font-bold text-[#1E2B58] dark:text-white">
              {fmtTime(activeSchedule?.startAt)} – {fmtTime(activeSchedule?.endAt)}
            </span>
          </div>
        </div>

        {/* Purpose textarea */}
        <div className="flex flex-col gap-2 mb-6">
          <label className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40">
            Reason for Borrowing <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Describe how you intend to use this equipment..."
            value={borrowNote}
            onChange={e => setBorrowNote(e.target.value)}
            className="w-full bg-white/40 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/50 rounded-[1rem] px-4 py-3 text-sm font-medium text-[#1E2B58] dark:text-white placeholder:text-[#1E2B58]/30 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-[#1E2B58]/20 dark:focus:ring-white/10 transition-all resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-[2] py-3.5 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] text-white hover:bg-[#2A3B66] transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-60 active:scale-95"
          >
            {submitting
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Plus className="w-4 h-4" />
            }
            Submit Request
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BorrowModal;
