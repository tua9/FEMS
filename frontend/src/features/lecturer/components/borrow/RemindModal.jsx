import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Mail, Loader2, X, AlertTriangle, MessageSquare } from 'lucide-react';
import { getStudentName, getEquipmentName } from './borrowUtils';

const RemindModal = ({ isOpen, onClose, request, onConfirm, submitting }) => {
  const [note, setNote] = useState('');

  // Reset when opened/closed
  useEffect(() => {
    if (isOpen) {
      setNote(`Please return equipment for request ${request?.code || ''} as soon as possible.`);
    } else {
      setNote('');
    }
  }, [isOpen, request]);

  if (!isOpen || !request) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={e => { if (e.target === e.currentTarget && !submitting) onClose(); }}
    >
      <div className="dashboard-card rounded-4xl p-8 w-full max-w-md shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200 bg-white dark:bg-[#0B1120]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={submitting}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition disabled:opacity-50"
        >
          <X className="w-4 h-4 text-[#1E2B58]/60 dark:text-white/60" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-4 transform -rotate-6">
            <Mail className="w-8 h-8 text-amber-500 dark:text-amber-400 transform rotate-6" />
          </div>
          <h2 className="text-xl font-black text-[#1E2B58] dark:text-white">Send reminder</h2>
          <p className="text-sm font-bold text-slate-500 mt-2">
            Send an overdue return reminder to <span className="text-[#1E2B58] dark:text-white font-black">{getStudentName(request)}</span>.
          </p>
        </div>

        {/* Info Box */}
        <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100/50 dark:border-amber-900/20 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-black text-amber-700 dark:text-amber-400">Equipment to recover</p>
            <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">{getEquipmentName(request)}</p>
          </div>
        </div>

        {/* Note Textarea */}
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1E2B58]/40 dark:text-white/40 mb-2 ml-1">
              <MessageSquare className="w-3.5 h-3.5" />
              Message
            </label>
            <textarea
              className="w-full bg-slate-50 dark:bg-[#1E2B58]/10 border border-[#1E2B58]/10 dark:border-white/10 rounded-2xl p-4 text-sm font-medium text-[#1E2B58] dark:text-white placeholder:text-[#1E2B58]/20 dark:placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              rows={3}
              placeholder="Enter reminder text…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={submitting}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 py-3.5 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={() => onConfirm(note)}
            disabled={submitting || !note.trim()}
            className="flex-[2] py-3.5 rounded-[1.25rem] font-bold text-sm text-white bg-amber-500 hover:bg-amber-600 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            Send reminder
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RemindModal;
