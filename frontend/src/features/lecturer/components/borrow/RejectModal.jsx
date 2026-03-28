import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { getStudentName, getEquipmentName } from './borrowUtils';

const QUICK_REJECT_REASONS = [
  'Equipment not available',
  'Not suitable for intended use',
  'Request missing information',
  'Invalid timing',
];

const RejectModal = ({ isOpen, onClose, request, onConfirm, submitting }) => {
  const [rejectReason, setRejectReason] = useState('');
  const [rejectError, setRejectError] = useState('');

  if (!isOpen || !request) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      setRejectError('Please enter a rejection reason.');
      return;
    }
    onConfirm(rejectReason.trim());
  };

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
          <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <div>
            <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-1">Reject request</p>
            <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">{getStudentName(request)}</h3>
            <p className="text-xs text-[#1E2B58]/50 dark:text-white/40 mt-0.5">{getEquipmentName(request)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-2">
              Quick reasons
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_REJECT_REASONS.map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setRejectReason(r); setRejectError(''); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
                    rejectReason === r
                      ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                      : 'bg-white/40 dark:bg-slate-800/40 text-[#1E2B58] dark:text-white border border-[#1E2B58]/10 dark:border-white/10 hover:bg-white/60 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40">
              Rejection reason <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Explain why this request is rejected…"
              value={rejectReason}
              onChange={e => { setRejectReason(e.target.value); setRejectError(''); }}
              className="w-full bg-white/40 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/50 rounded-[1rem] px-4 py-3 text-sm font-medium text-[#1E2B58] dark:text-white placeholder:text-[#1E2B58]/30 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-red-400/30 transition-all resize-none"
            />
            {rejectError && <p className="text-xs font-bold text-red-500">{rejectError}</p>}
          </div>

          <div className="flex gap-3 mt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-3.5 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-[2] py-3.5 rounded-[1.25rem] font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-60 active:scale-95">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
              Reject request
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default RejectModal;
