/**
 * BorrowCancelModal — Dialog xác nhận hủy đơn mượn.
 * Style đồng bộ với BorrowModal.tsx và HistoryDetailModal.tsx
 */
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Ban, FileText, Loader2 } from "lucide-react";
// ── Lý do gợi ý ───────────────────────────────────────────────────────────────

const SUGGESTED_REASONS = [
 "Không còn nhu cầu mượn nữa",
 "Nhập sai thông tin",
 "Muốn đổi ngày mượn",
 "Muốn đổi thiết bị",
 "Gửi nhầm đơn",
];

// ── Props ─────────────────────────────────────────────────────────────────────

// ── Component ─────────────────────────────────────────────────────────────────

const BorrowCancelModal = ({
 item,
 onClose,
 onConfirm,
}) => {
 const [decisionNote, setDecisionNote] = useState("");
 const [formError, setFormError] = useState("");
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [mounted, setMounted] = useState(false);

 useEffect(() => {
 setMounted(true);
 const originalStyle = window.getComputedStyle(document.body).overflow;
 document.body.style.overflow = "hidden";
 return () => { document.body.style.overflow = originalStyle; };
 }, []);

 const equipmentName =
 item.equipment_id && typeof item.equipment_id !== "string"
 ? item.equipment_id.name
 : "Thiết bị";

 const requestId = `#${item._id.slice(-6).toUpperCase()}`;

 const handleSelectReason = (reason) => {
 setDecisionNote(reason);
 setFormError("");
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 if (!decisionNote.trim()) {
 setFormError("Vui lòng nhập lý do hủy đơn.");
 return;
 }
 try {
 setIsSubmitting(true);
 setFormError("");
 await onConfirm(decisionNote.trim());
 } catch (err) {
 const msg = err?.response?.data?.message || err?.message || "Hủy đơn thất bại, vui lòng thử lại.";
 setFormError(msg);
 } finally {
 setIsSubmitting(false);
 }
 };

 if (!mounted) return null;

 return createPortal(
 <div
 className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
 onClick={(e) => e.target === e.currentTarget && onClose()}
 >
 <div className="glass-card animate-in fade-in zoom-in-95 relative w-full max-w-md rounded-4xl p-8 shadow-2xl duration-200">
 {/* Close button */}
 <button
 onClick={onClose}
 aria-label="Close modal"
 className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
 >
 <X className="h-4 w-4 text-[#1E2B58]/60 dark:text-white/60" />
 </button>

 {/* Header */}
 <div className="mb-6">
 <div className="flex flex-col">
 <p className="mb-1 text-[0.625rem] font-black uppercase tracking-[0.2em] text-red-500/80 dark:text-red-400/80">
 Action Required
 </p>
 <h3 className="text-2xl font-black text-[#1E2B58] dark:text-white leading-tight">
 Xác nhận hủy đơn
 </h3>
 </div>
 <div className="mt-2 flex items-center gap-2 py-1.5 px-3 rounded-xl bg-[#1E2B58]/5 dark:bg-white/5 w-fit">
 <span className="text-[0.625rem] font-black text-[#1E2B58]/40 dark:text-white/40 uppercase tracking-widest">{requestId}</span>
 <div className="w-1 h-1 rounded-full bg-[#1E2B58]/20 dark:bg-white/20" />
 <span className="text-[0.625rem] font-black text-[#1E2B58]/60 dark:text-white/60 uppercase tracking-widest">{equipmentName}</span>
 </div>
 <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
 Vui lòng chọn hoặc nhập lý do hủy đơn mượn thiết bị này.
 </p>
 </div>

 {/* Suggested reasons */}
 <div className="mb-6 flex flex-wrap gap-2">
 {SUGGESTED_REASONS.map((reason) => (
 <button
 key={reason}
 type="button"
 onClick={() => handleSelectReason(reason)}
 className={`rounded-xl border px-3.5 py-2 text-[0.6875rem] font-bold transition-all hover:scale-[1.02] active:scale-95 ${
 decisionNote === reason
 ? "border-red-400 bg-red-50 text-red-600 shadow-sm shadow-red-500/10 dark:border-red-500/50 dark:bg-red-900/30 dark:text-red-400"
 : "border-black/5 bg-white/40 text-[#1E2B58]/60 hover:border-black/10 hover:bg-white/60 dark:border-white/5 dark:bg-white/5 dark:text-white/50"
 }`}
 >
 {reason}
 </button>
 ))}
 </div>

 {/* Form */}
 <form onSubmit={handleSubmit} className="flex flex-col gap-4">
 <div className="flex flex-col gap-2">
 <label className="flex items-center gap-2 text-[0.625rem] font-black uppercase tracking-[0.2em] text-[#1E2B58]/40 dark:text-white/40">
 <FileText className="h-3 w-3" />
 Lý do chi tiết
 </label>
 <textarea
 rows={3}
 placeholder="Nhập lý do chi tiết (nếu có)..."
 value={decisionNote}
 onChange={(e) => { setDecisionNote(e.target.value); setFormError(""); }}
 className="w-full resize-none rounded-[1.25rem] border border-[#1E2B58]/10 bg-white/50 px-4 py-3 text-sm font-bold text-[#1E2B58] outline-none transition-all placeholder:text-[#1E2B58]/20 focus:ring-4 focus:ring-red-500/10 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-white/20"
 />
 </div>

 {formError && (
 <p className="rounded-xl bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-500 dark:text-red-400">
 {formError}
 </p>
 )}

 {/* Buttons */}
 <div className="mt-2 flex gap-3">
 <button
 type="button"
 onClick={onClose}
 disabled={isSubmitting}
 className="flex-1 rounded-[1.25rem] py-3.5 text-sm font-bold border border-[#1E2B58]/10 dark:border-white/10 text-[#1E2B58]/70 dark:text-white/70 bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
 >
 Đóng
 </button>
 <button
 type="submit"
 disabled={!decisionNote.trim() || isSubmitting}
 className="flex flex-[2] items-center justify-center gap-2 rounded-[1.25rem] bg-red-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600 hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
 >
 {isSubmitting ? (
 <Loader2 className="h-4 w-4 animate-spin" />
 ) : (
 <Ban className="h-4 w-4" />
 )}
 Xác nhận hủy đơn
 </button>
 </div>
 </form>
 </div>
 </div>,
 document.body,
 );
};

export default BorrowCancelModal;
