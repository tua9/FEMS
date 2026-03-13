import React from 'react';
import { Ticket, getPriorityStyle, getStatusDisplay } from '@/data/technician/mockTickets';
import {
  MODAL_OVERLAY, MODAL_CARD, CLOSE_BTN,
  BTN_SECONDARY, SECTION_LABEL, INFO_CARD, CHIP,
} from '@/components/technician/common/modalStyles';
import ModalPortal from '@/components/technician/common/ModalPortal';

interface Props {
  ticket: Ticket;
  onClose: () => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onStartRepair?: (id: string) => void;
  onMarkResolved?: (id: string) => void;
}

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
    <span className={`${SECTION_LABEL} pt-0.5 shrink-0`}>{label}</span>
    <div className="text-right">{children}</div>
  </div>
);

const TicketViewModal: React.FC<Props> = ({
  ticket, onClose, onApprove, onReject, onStartRepair, onMarkResolved,
}) => {
  const status = getStatusDisplay(ticket.status);
  const priorityClass = getPriorityStyle(ticket.priority);

  const priorityColor: Record<string, string> = {
    Urgent: 'text-rose-600',
    High:   'text-rose-500',
    Medium: 'text-amber-500',
    Low:    'text-emerald-600',
  };

  return (
    <ModalPortal>
    <div className={MODAL_OVERLAY} onClick={onClose}>
      <div
        className={`${MODAL_CARD} max-w-md`}
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-7 pt-7 pb-5 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#1A2B56] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white text-xl">receipt_long</span>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#1A2B56]">Ticket #{ticket.id}</h2>
              <p className="text-xs text-slate-400 mt-0.5">Maintenance request details</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className={CLOSE_BTN}>
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="mx-7 border-t border-slate-100" />

        {/* Body */}
        <div className="px-7 py-6 overflow-y-auto flex-1 space-y-5">

          {/* Status + Priority row */}
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
              style={{ background: status.bgColor, color: status.textColor }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: status.dotColor }} />
              {status.label}
            </span>
            <span className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${priorityClass}`}>
              {ticket.priority}
            </span>
            <span className="ml-auto text-[11px] text-slate-400 font-medium">
              {new Date(ticket.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>

          {/* Equipment info card */}
          <div className={`${INFO_CARD} space-y-1`}>
            <p className={SECTION_LABEL}>Equipment</p>
            <p className="text-sm font-bold text-slate-800 mt-1">{ticket.equipment}</p>
            <p className="text-xs text-slate-500">{ticket.equipmentType}</p>
          </div>

          {/* Details */}
          <div className={INFO_CARD}>
            <Row label="Room / Location">
              <span className="text-sm font-semibold text-slate-700">{ticket.room}</span>
            </Row>
            <Row label="Reported By">
              <div className="flex items-center gap-2 justify-end">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-700">
                  {ticket.reporter.initials}
                </div>
                <span className="text-sm font-semibold text-slate-700">{ticket.reporter.name}</span>
              </div>
            </Row>
            {ticket.assignee && (
              <Row label="Assigned To">
                <div className="flex items-center gap-2 justify-end">
                  {ticket.assignee.avatar ? (
                    <img src={ticket.assignee.avatar} alt={ticket.assignee.initials} className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#1A2B56]/10 flex items-center justify-center text-[9px] font-bold text-[#1A2B56]">
                      {ticket.assignee.initials}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-slate-700">{ticket.assignee.name}</span>
                </div>
              </Row>
            )}
            <Row label="Created">
              <span className="text-sm text-slate-600">{ticket.createdAt}</span>
            </Row>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className={CHIP}>
              <span className="material-symbols-outlined text-[13px]">build</span>
              {ticket.equipmentType}
            </span>
            <span className={`${CHIP} ${priorityColor[ticket.priority]}`}>
              <span className="material-symbols-outlined text-[13px]">flag</span>
              {ticket.priority} Priority
            </span>
          </div>
        </div>

        {/* Footer — contextual action buttons */}
        <div className="px-7 py-5 border-t border-slate-100 flex gap-3">
          {ticket.status === 'Pending' && (
            <>
              <button
                onClick={() => { onReject?.(ticket.id); onClose(); }}
                className="flex-1 py-3 rounded-xl border border-rose-200 text-rose-500 text-sm font-bold hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">cancel</span>
                Reject
              </button>
              <button
                onClick={() => { onApprove?.(ticket.id); onClose(); }}
                className="flex-1 py-3 rounded-xl bg-[#1A2B56] text-white text-sm font-bold hover:bg-[#14203f] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-base">check_circle</span>
                Approve
              </button>
            </>
          )}
          {ticket.status === 'Approved' && (
            <>
              <button type="button" onClick={onClose} className={BTN_SECONDARY}>
                Close
              </button>
              <button
                onClick={() => { onStartRepair?.(ticket.id); onClose(); }}
                className="flex-1 py-3 rounded-xl bg-[#1A2B56] text-white text-sm font-bold hover:bg-[#14203f] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-base">handyman</span>
                Start Repair
              </button>
            </>
          )}
          {ticket.status === 'In Progress' && (
            <>
              <button type="button" onClick={onClose} className={BTN_SECONDARY}>
                Close
              </button>
              <button
                onClick={() => { onMarkResolved?.(ticket.id); onClose(); }}
                className="flex-1 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-base">task_alt</span>
                Mark Resolved
              </button>
            </>
          )}
          {(ticket.status === 'Rejected' || ticket.status === 'Completed') && (
            <button type="button" onClick={onClose} className={BTN_SECONDARY}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
    </ModalPortal>
  );
};

export default TicketViewModal;
