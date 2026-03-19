import React, { useState } from 'react';

interface Props {
  ticketId: string;
  ticketTitle: string;
  imageUrl?: string;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}

const ConfirmRejectModal: React.FC<Props> = ({ ticketId, ticketTitle, onCancel, onConfirm }) => {
  const [note,  setNote]  = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!note.trim()) {
      setError('Please provide a reason for rejection.');
      return;
    }
    onConfirm(note.trim());
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-sm bg-white dark:bg-[#1a2340] rounded-3xl shadow-2xl shadow-rose-900/20 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="px-7 pt-7 pb-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* Small circular icon */}
            <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center shrink-0 shadow-md shadow-rose-500/30">
              <span
                className="material-symbols-outlined text-white text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                cancel
              </span>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800 dark:text-white leading-tight">
                Reject Ticket
              </h2>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                #{ticketId}
              </p>
            </div>
          </div>
          {/* Close button */}
          <button
            type="button"
            onClick={onCancel}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/10 dark:hover:text-white transition-all ml-2 shrink-0"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-7 pb-6 space-y-4">
          {/* Confirm info box */}
          <div className="flex items-start gap-3 px-4 py-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20">
            <span
              className="material-symbols-outlined text-rose-500 text-[20px] shrink-0 mt-0.5"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              info
            </span>
            <div>
              <p className="text-sm font-bold text-rose-700 dark:text-rose-400 leading-snug">
                Confirm rejection
              </p>
              <p className="text-xs text-rose-500/80 dark:text-rose-400/70 mt-1 leading-relaxed">
                You are rejecting the repair request for{' '}
                <span className="font-semibold text-rose-700 dark:text-rose-300">
                  {ticketTitle}
                </span>.
              </p>
            </div>
          </div>

          {/* Note field */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Note <span className="text-rose-400 normal-case font-bold">*</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => { setNote(e.target.value); setError(''); }}
              placeholder="Add rejection notes or instructions for the technician..."
              rows={3}
              className="w-full resize-none rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-sm text-slate-800 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-rose-400/20 transition-all"
            />
            {error && (
              <p className="flex items-center gap-1.5 text-xs font-semibold text-rose-500">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {error}
              </p>
            )}
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
          {/* Reject — solid rose pill */}
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-2 py-3 rounded-full bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25"
          >
            <span
              className="material-symbols-outlined text-[17px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              cancel
            </span>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRejectModal;
