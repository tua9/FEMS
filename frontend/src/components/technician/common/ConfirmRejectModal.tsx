import React, { useState } from 'react';
import {
  MODAL_OVERLAY_TOP, MODAL_CARD, CLOSE_BTN,
  BTN_DANGER, BTN_SECONDARY, CHIP,
  TEXTAREA_CLASS,
} from '@/components/technician/common/modalStyles';

interface Props {
  ticketId: string;
  ticketTitle: string;
  imageUrl?: string;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}

const ConfirmRejectModal: React.FC<Props> = ({ ticketId, ticketTitle, imageUrl, onCancel, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [error,  setError]  = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) { setError('Please provide a reason for rejection.'); return; }
    onConfirm(reason.trim());
  };

  return (
    <div className={MODAL_OVERLAY_TOP} onClick={onCancel}>
      <div
        className={`${MODAL_CARD} max-w-md`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="px-7 pt-7 pb-5 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-rose-500 text-2xl">cancel</span>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#1A2B56] leading-tight">Reject Ticket?</h2>
              <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone.</p>
            </div>
          </div>
          <button onClick={onCancel} className={CLOSE_BTN}>
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* ── Ticket chips ── */}
        <div className="px-7 pb-5 flex flex-wrap gap-2">
          <span className={`${CHIP} bg-slate-100 text-slate-600`}>
            TICKET: #{ticketId}
          </span>
        </div>

        <div className="mx-7 border-t border-slate-100" />

        {/* ── Body ── */}
        <div className="px-7 py-6 space-y-5">

          {/* Ticket reference */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl overflow-hidden">
            {imageUrl && (
              <div className="relative w-full h-28 bg-slate-100">
                <img
                  src={imageUrl}
                  alt={ticketTitle}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            )}
            <div className="px-4 py-3.5 flex items-start gap-3">
              <span className="material-symbols-outlined text-slate-400 text-base mt-0.5 shrink-0">confirmation_number</span>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ticket</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                  <span className="text-rose-500">#{ticketId}</span> · {ticketTitle}
                </p>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              Rejection Reason <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => { setReason(e.target.value); setError(''); }}
              placeholder="Describe why this ticket is being rejected…"
              rows={4}
              className={`${TEXTAREA_CLASS} focus:border-rose-400 focus:ring-rose-400/10`}
            />
            {error && (
              <p className="flex items-center gap-1.5 text-xs text-rose-500 font-semibold">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {error}
              </p>
            )}
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3.5">
            <span className="material-symbols-outlined text-rose-400 text-base mt-0.5 shrink-0">info</span>
            <p className="text-xs text-rose-600 leading-relaxed">
              The requester will be notified with your rejection reason. Make sure your comment is clear and professional.
            </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-7 py-5 border-t border-slate-100 flex gap-3">
          <button type="button" onClick={onCancel} className={BTN_SECONDARY}>
            Cancel
          </button>
          <button type="button" onClick={handleConfirm} className={BTN_DANGER}>
            <span className="material-symbols-outlined text-base">cancel</span>
            Confirm Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRejectModal;
