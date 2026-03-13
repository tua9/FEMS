/**
 * BorrowModal — Dialog xác nhận mượn thiết bị của Student.
 * Tách ra từ EquipmentPage để trang page gọn hơn.
 */
import React, { useState } from "react";
import { X, ArrowRight, CalendarDays, FileText } from "lucide-react";
import type { EquipmentItem } from "@/components/shared/equipment";

interface BorrowModalProps {
  item: EquipmentItem;
  onClose: () => void;
  onSubmit: (returnDate: string, purpose: string) => void;
}

const BorrowModal: React.FC<BorrowModalProps> = ({ item, onClose, onSubmit }) => {
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().split("T")[0];
  const [returnDate, setReturnDate] = useState(tomorrow);
  const [purpose, setPurpose] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnDate || !purpose.trim()) {
      setFormError("Please fill in all fields.");
      return;
    }
    onSubmit(returnDate, purpose);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="dashboard-card animate-in fade-in zoom-in-95 relative w-full max-w-md rounded-4xl p-8 shadow-2xl shadow-[#1E2B58]/20 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full text-[#1E2B58]/60 transition hover:bg-[#1E2B58]/10 dark:text-white/60 dark:hover:bg-white/10"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <p className="mb-1 text-[0.625rem] font-black tracking-widest text-[#1E2B58]/50 uppercase dark:text-white/40">
            Borrow Request
          </p>
          <h3 className="text-2xl font-black text-[#1E2B58] dark:text-white">
            {item.title}
          </h3>
          <p className="mt-1 text-xs font-bold tracking-widest text-[#1E2B58]/50 uppercase dark:text-white/40">
            {item.sku} • {item.location}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-xs font-black tracking-widest text-[#1E2B58]/70 uppercase dark:text-white/60">
              <CalendarDays className="h-3.5 w-3.5" />
              Return Date
            </label>
            <input
              type="date"
              required
              min={tomorrow}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-3 text-sm font-bold text-[#1E2B58] outline-none transition-all focus:ring-2 focus:ring-[#1E2B58]/30 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-xs font-black tracking-widest text-[#1E2B58]/70 uppercase dark:text-white/60">
              <FileText className="h-3.5 w-3.5" />
              Purpose
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Study group project..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full resize-none rounded-2xl border border-white/40 bg-white/40 px-4 py-3 text-sm font-medium text-[#1E2B58] outline-none transition-all placeholder:text-[#1E2B58]/30 focus:ring-2 focus:ring-[#1E2B58]/30 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-white/30"
            />
          </div>

          {formError && (
            <p className="rounded-xl bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-500">
              {formError}
            </p>
          )}

          <div className="mt-1 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-[1.25rem] bg-white/20 py-3.5 text-sm font-bold text-[#1E2B58] transition hover:bg-white/40 dark:bg-slate-800/20 dark:text-white dark:hover:bg-slate-800/40"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex flex-2 items-center justify-center gap-2 rounded-[1.25rem] bg-[#1E2B58] py-3.5 text-sm font-bold text-white shadow-xl shadow-[#1E2B58]/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              Submit Request <ArrowRight className="h-4 w-4" strokeWidth={3} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BorrowModal;
