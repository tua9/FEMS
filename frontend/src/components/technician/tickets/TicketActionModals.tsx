import React from 'react';
import type { Ticket } from '@/data/technician/mockTickets';
import {
  MODAL_OVERLAY, MODAL_CARD, CLOSE_BTN,
  BTN_SECONDARY,
} from '@/components/technician/common/modalStyles';

interface Props {
  ticket: Ticket;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

// ── Start Repair Confirm Modal ─────────────────────────────────────────────
export const StartRepairModal: React.FC<Props> = ({ ticket, onClose, onConfirm }) => (
  <div className={MODAL_OVERLAY} onClick={onClose}>
    <div
      className={`${MODAL_CARD} max-w-sm`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-7 pt-7 pb-5 flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white text-xl">handyman</span>
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-800">Start Repair</h2>
            <p className="text-xs text-slate-400 mt-0.5">#{ticket.id}</p>
          </div>
        </div>
        <button type="button" onClick={onClose} className={CLOSE_BTN}>
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      <div className="mx-7 border-t border-slate-100" />

      <div className="px-7 py-6 space-y-4">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
          <span className="material-symbols-outlined text-amber-500 text-xl mt-0.5 shrink-0">info</span>
          <div>
            <p className="text-sm font-bold text-amber-700">Begin repair work?</p>
            <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
              <span className="font-semibold">{ticket.equipment}</span> at{' '}
              <span className="font-semibold">{ticket.room}</span> will be moved to{' '}
              <span className="font-semibold">In Progress</span>.
            </p>
          </div>
        </div>
        {ticket.assignee && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100">
            {ticket.assignee.avatar ? (
              <img src={ticket.assignee.avatar} alt={ticket.assignee.initials} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#1A2B56]/10 flex items-center justify-center text-[10px] font-bold text-[#1A2B56]">
                {ticket.assignee.initials}
              </div>
            )}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned Technician</p>
              <p className="text-sm font-bold text-slate-700">{ticket.assignee.name}</p>
            </div>
          </div>
        )}
      </div>

      <div className="px-7 py-5 border-t border-slate-100 flex gap-3">
        <button type="button" onClick={onClose} className={BTN_SECONDARY}>
          Cancel
        </button>
        <button
          type="button"
          onClick={() => { onConfirm(ticket.id); onClose(); }}
          className="flex-1 py-3 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-base">handyman</span>
          Start Repair
        </button>
      </div>
    </div>
  </div>
);

// ── Mark Resolved Confirm Modal ────────────────────────────────────────────
export const MarkResolvedModal: React.FC<Props> = ({ ticket, onClose, onConfirm }) => (
  <div className={MODAL_OVERLAY} onClick={onClose}>
    <div
      className={`${MODAL_CARD} max-w-sm`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-7 pt-7 pb-5 flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white text-xl">task_alt</span>
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-800">Mark as Resolved</h2>
            <p className="text-xs text-slate-400 mt-0.5">#{ticket.id}</p>
          </div>
        </div>
        <button type="button" onClick={onClose} className={CLOSE_BTN}>
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      <div className="mx-7 border-t border-slate-100" />

      <div className="px-7 py-6 space-y-4">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
          <span className="material-symbols-outlined text-emerald-500 text-xl mt-0.5 shrink-0">check_circle</span>
          <div>
            <p className="text-sm font-bold text-emerald-700">Confirm completion?</p>
            <p className="text-xs text-emerald-600 mt-0.5 leading-relaxed">
              <span className="font-semibold">{ticket.equipment}</span> at{' '}
              <span className="font-semibold">{ticket.room}</span> will be marked as{' '}
              <span className="font-semibold">Completed</span>.
            </p>
          </div>
        </div>
      </div>

      <div className="px-7 py-5 border-t border-slate-100 flex gap-3">
        <button type="button" onClick={onClose} className={BTN_SECONDARY}>
          Cancel
        </button>
        <button
          type="button"
          onClick={() => { onConfirm(ticket.id); onClose(); }}
          className="flex-1 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-base">task_alt</span>
          Mark Resolved
        </button>
      </div>
    </div>
  </div>
);
