import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, Loader2 } from 'lucide-react';
import { getStudentName, getEquipmentName, fmtDateTime } from './borrowUtils';

const ApproveModal = ({ isOpen, onClose, request, onConfirm, submitting }) => {
  const [approveNote, setApproveNote] = useState('');

  if (!isOpen || !request) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="dashboard-card rounded-4xl p-8 w-full max-w-md shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition">
          <X className="w-4 h-4 text-[#1E2B58]/60 dark:text-white/60" />
        </button>

        <div className="flex flex-col items-center text-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-500" />
          </div>
          <div>
            <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-1">Confirm approval</p>
            <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">Approve this request?</h3>
          </div>
        </div>

        <div className="bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] p-4 mb-6 space-y-2 text-sm">
          {[
            ['Student', getStudentName(request)],
            ['Equipment', getEquipmentName(request)],
            ['Reason', request.note || '—'],
            ['Submitted', fmtDateTime(request.createdAt)],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium shrink-0">{label}</span>
              <span className="font-bold text-[#1E2B58] dark:text-white text-right">{value}</span>
            </div>
          ))}
        </div>

        <div className="mb-5">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-2 block">
            Message to student <span className="normal-case font-medium opacity-70">(optional)</span>
          </label>
          <textarea
            value={approveNote}
            onChange={e => setApproveNote(e.target.value)}
            placeholder="E.g. Please come to room B203 to collect the equipment after slot 2…"
            rows={3}
            className="w-full rounded-[1rem] border border-[#1E2B58]/10 dark:border-white/10 bg-white/60 dark:bg-white/5 px-4 py-3 text-sm font-medium text-[#1E2B58] dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-400/30 resize-none transition-all"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3.5 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all">
            Cancel
          </button>
          <button onClick={() => onConfirm(approveNote)} disabled={submitting}
            className="flex-[2] py-3.5 rounded-[1.25rem] font-bold text-sm bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-60 active:scale-95">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Confirm approval
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ApproveModal;
