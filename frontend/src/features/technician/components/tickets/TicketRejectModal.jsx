import React, { useState } from 'react';
import {
 MODAL_OVERLAY, MODAL_CARD, CLOSE_BTN,
 BTN_SECONDARY, BTN_DANGER, SECTION_LABEL, TEXTAREA_CLASS,
} from '@/features/technician/components/common/modalStyles';
import ModalPortal from '@/features/technician/components/common/ModalPortal';

const REJECT_REASONS = [
 'Insufficient information provided',
 'Duplicate request already exists',
 'Issue out of maintenance scope',
 'Budget not available',
 'Other',
];

const TicketRejectModal = ({ ticket, onClose, onConfirm }) => {
 const [reason, setReason] = useState('');
 const [note, setNote] = useState('');
 const [error, setError] = useState('');

 const handleConfirm = () => {
 if (!reason) { setError('Please select a reason for rejection.'); return; }

 const fullNote = [reason, note].map((s) => String(s || '').trim()).filter(Boolean).join(' — ');
 onConfirm(ticket.id, fullNote);
 onClose();
 };

 return (
 <ModalPortal>
 <div className={MODAL_OVERLAY} onClick={onClose}>
 <div
 className={`${MODAL_CARD} max-w-sm`}
 onClick={(e) => e.stopPropagation()}
 >
 {/* Header */}
 <div className="px-7 pt-7 pb-5 flex items-start justify-between">
 <div className="flex items-start gap-4">
 <div className="w-12 h-12 rounded-xl bg-rose-500 flex items-center justify-center shrink-0">
 <span className="material-symbols-outlined text-white text-xl">cancel</span>
 </div>
 <div>
 <h2 className="text-base font-extrabold text-slate-800">Reject Ticket</h2>
 <p className="text-xs text-slate-400 mt-0.5">#{ticket.id}</p>
 </div>
 </div>
 <button type="button" onClick={onClose} className={CLOSE_BTN}>
 <span className="material-symbols-outlined text-lg">close</span>
 </button>
 </div>

 <div className="mx-7 border-t border-slate-100" />

 {/* Body */}
 <div className="px-7 py-6 space-y-5">
 {/* Warning */}
 <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-100">
 <span className="material-symbols-outlined text-rose-500 text-xl mt-0.5 shrink-0">warning</span>
 <div>
 <p className="text-sm font-bold text-rose-600">Reject this request?</p>
 <p className="text-xs text-rose-400 mt-0.5 leading-relaxed">
 <span className="font-semibold">{ticket.equipment}</span> — {ticket.room}
 </p>
 </div>
 </div>

 {/* Error */}
 {error && (
 <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
 <span className="material-symbols-outlined text-base">error</span>
 {error}
 </div>
 )}

 {/* Reason selector */}
 <div className="space-y-2">
 <label className={SECTION_LABEL}>
 Reason <span className="text-rose-400 normal-case">*</span>
 </label>
 <div className="flex flex-col gap-1.5">
 {REJECT_REASONS.map((r) => (
 <button
 key={r}
 type="button"
 onClick={() => { setReason(r); setError(''); }}
 className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
 reason === r
 ? 'border-rose-400 bg-rose-50 text-rose-600'
 : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white hover:border-slate-300'
 }`}
 >
 <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
 reason === r ? 'border-rose-500' : 'border-slate-300'
}`}>
 {reason === r && <span className="w-2 h-2 rounded-full bg-rose-500 block" />}
 </span>
 {r}
 </button>
 ))}
 </div>
 </div>

 {/* Additional note */}
 <div className="space-y-1.5">
 <label className={SECTION_LABEL}>Additional Note (optional)</label>
 <textarea
 value={note}
 onChange={(e) => setNote(e.target.value)}
 placeholder="Explain the rejection reason in more detail..."
 rows={3}
 className={TEXTAREA_CLASS}
 />
 </div>
 </div>

 {/* Footer */}
 <div className="px-7 py-5 border-t border-slate-100 flex gap-3">
 <button type="button" onClick={onClose} className={BTN_SECONDARY}>
 Cancel
 </button>
 <button type="button" onClick={handleConfirm} className={BTN_DANGER}>
 <span className="material-symbols-outlined text-base">cancel</span>
 Reject Ticket
 </button>
 </div>
 </div>
 </div>
 </ModalPortal>
 );
};

export default TicketRejectModal;
