/**
 * BorrowCancelModal — Dialog xác nhận hủy đơn mượn.
 * Style đồng bộ với BorrowModal.tsx và HistoryDetailModal.tsx
 */
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Ban, FileText } from "lucide-react";
import type { BorrowRequest } from "@/types/borrowRequest";

// ── Lý do gợi ý ───────────────────────────────────────────────────────────────

const SUGGESTED_REASONS = [
  "Không còn nhu cầu mượn nữa",
  "Nhập sai thông tin",
  "Muốn đổi ngày mượn",
  "Muốn đổi thiết bị",
  "Gửi nhầm đơn",
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface BorrowCancelModalProps {
  item: BorrowRequest;
  onClose: () => void;
  onConfirm: (decisionNote: string) => Promise<void>;
}

// ── Component ─────────────────────────────────────────────────────────────────

const BorrowCancelModal: React.FC<BorrowCancelModalProps> = ({
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

  const handleSelectReason = (reason: string) => {
    setDecisionNote(reason);
    setFormError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decisionNote.trim()) {
      setFormError("Vui lòng nhập lý do hủy đơn.");
      return;
    }
    try {
      setIsSubmitting(true);
      setFormError("");
      await onConfirm(decisionNote.trim());
    } catch (err: any) {
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
          <p className="mb-1 text-[0.625rem] font-black uppercase tracking-widest text-red-500/70 dark:text-red-400/70">
            Hủy đơn mượn
          </p>
          <h3 className="text-2xl font-black text-[#1E2B58] dark:text-white leading-tight">
            Xác nhận hủy đơn
          </h3>
          <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40">
            {requestId} • {equipmentName}
          </p>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Vui lòng chọn hoặc nhập lý do hủy đơn trước khi xác nhận.
          </p>
        </div>

        {/* Suggested reasons */}
        <div className="mb-5 flex flex-wrap gap-2">
          {SUGGESTED_REASONS.map((reason) => (
            <button
              key={reason}
              type="button"
              onClick={() => handleSelectReason(reason)}
              className={`rounded-full border px-3 py-1.5 text-[0.6875rem] font-bold transition-all hover:scale-[1.02] active:scale-95 ${
                decisionNote === reason
                  ? "border-red-400 bg-red-50 text-red-600 dark:border-red-500/50 dark:bg-red-900/20 dark:text-red-400"
                  : "border-black/10 bg-white/40 text-[#1E2B58]/70 hover:border-black/20 dark:border-white/10 dark:bg-white/5 dark:text-white/60"
              }`}
            >
              {reason}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#1E2B58]/70 dark:text-white/60">
              <FileText className="h-3.5 w-3.5" />
              Lý do hủy
            </label>
            <textarea
              rows={3}
              placeholder="Nhập lý do hủy đơn mượn..."
              value={decisionNote}
              onChange={(e) => { setDecisionNote(e.target.value); setFormError(""); }}
              className="w-full resize-none rounded-2xl border border-white/40 bg-white/40 px-4 py-3 text-sm font-medium text-[#1E2B58] outline-none transition-all placeholder:text-[#1E2B58]/30 focus:ring-2 focus:ring-red-400/30 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-white/30"
            />
          </div>

          {formError && (
            <p className="rounded-xl bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-500 dark:text-red-400">
              {formError}
            </p>
          )}

          {/* Buttons */}
          <div className="mt-1 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-[1.25rem] bg-white/20 py-3.5 text-sm font-bold text-[#1E2B58] transition hover:bg-white/40 disabled:opacity-50 dark:bg-slate-800/20 dark:text-white dark:hover:bg-slate-800/40"
            >
              Đóng
            </button>
            <button
              type="submit"
              disabled={!decisionNote.trim() || isSubmitting}
              className="flex flex-[2] items-center justify-center gap-2 rounded-[1.25rem] bg-red-500 py-3.5 text-sm font-bold text-white shadow-xl shadow-red-500/20 transition-all hover:scale-[1.02] hover:bg-red-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
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
