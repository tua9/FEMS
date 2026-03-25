import React, { useState } from 'react';
import {
 MODAL_OVERLAY, MODAL_CARD, CLOSE_BTN,
 BTN_PRIMARY, BTN_SECONDARY, SECTION_LABEL, TEXTAREA_CLASS,
} from '@/components/technician/common/modalStyles';
import ModalPortal from '@/components/technician/common/ModalPortal';

const TicketApproveModal = ({ ticket, onClose, onConfirm }) => {
 const [note, setNote] = useState('');

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
 <div className="w-12 h-12 rounded-xl bg-[#1A2B56] flex items-center justify-center shrink-0">
 <span className="material-symbols-outlined text-white text-xl">check_circle</span>
 </div>
 <div>
 <h2 className="text-base font-extrabold text-[#1A2B56]">Approve Ticket</h2>
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
 {/* Confirmation message */}
 <div className="flex items-start gap-3 p-4 rounded-xl bg-[#1A2B56]/5 border border-[#1A2B56]/10">
 <span className="material-symbols-outlined text-[#1A2B56] text-xl mt-0.5 shrink-0">info</span>
 <div>
 <p className="text-sm font-bold text-[#1A2B56]">Confirm approval</p>
 <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
 You are approving the repair request for{' '}
 <span className="font-semibold text-slate-700">{ticket.equipment}</span>{' '}
 in <span className="font-semibold text-slate-700">{ticket.room}</span>.
 </p>
 </div>
 </div>

 {/* Optional note */}
 <div className="space-y-1.5">
 <label className={SECTION_LABEL}>Note (optional)</label>
 <textarea
 value={note}
 onChange={(e) => setNote(e.target.value)}
 placeholder="Add approval notes or instructions for the technician..."
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
 <button
 type="button"
 onClick={() => { onConfirm(ticket.id); onClose(); }}
 className={BTN_PRIMARY}
 >
 <span className="material-symbols-outlined text-base">check_circle</span>
 Approve
 </button>
 </div>
 </div>
 </div>
 </ModalPortal>
 );
};

export default TicketApproveModal;
