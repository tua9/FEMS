import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import BorrowBadge from './BorrowBadge';
import { getStudentName, getEquipmentName, fmtDateTime } from './borrowUtils';

const RequestDetailModal = ({ isOpen, onClose, request }) => {
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

        <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-5">
          Request Details #{String(request._id).slice(-6).toUpperCase()}
        </p>

        <div className="space-y-0">
          {[
            ['Student', getStudentName(request)],
            ['Equipment', getEquipmentName(request)],
            ['Status', <BorrowBadge key="s" status={request.status} />],
            ['Reason', request.note || '—'],
            ['Submitted', fmtDateTime(request.createdAt)],
            ['Response', request.decisionNote || '—'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between items-center gap-4 py-2.5 border-b border-[#1E2B58]/5 dark:border-white/5 last:border-0">
              <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium text-sm shrink-0">{label}</span>
              <span className="font-bold text-[#1E2B58] dark:text-white text-right text-sm">{value}</span>
            </div>
          ))}
        </div>

        <button onClick={onClose}
          className="mt-6 w-full py-3 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] text-white hover:bg-[#2A3B66] transition-all active:scale-95">
          Close
        </button>
      </div>
    </div>,
    document.body
  );
};

export default RequestDetailModal;
