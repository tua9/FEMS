/**
 * HistoryDetailModal — Dialog xem chi tiết lịch sử mượn / báo cáo sự cố.
 * Tách ra từ BorrowHistoryPage để trang page gọn hơn.
 */
import React from "react";
import { X } from "lucide-react";
import type { ReportHistoryItem, BorrowHistoryItem } from "@/components/shared/history";

// ── Severity colour map ───────────────────────────────────────────────────────

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: "text-red-600 bg-red-100 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  HIGH: "text-orange-600 bg-orange-100 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
  MEDIUM: "text-yellow-600 bg-yellow-100 border-yellow-200 dark:bg-yellow-900/30 dark:text-orange-400",
  LOW: "text-blue-600 bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
};

// ── Types ─────────────────────────────────────────────────────────────────────

export type ModalItem =
  | { type: "report"; item: ReportHistoryItem }
  | { type: "borrow"; item: BorrowHistoryItem };

interface HistoryDetailModalProps {
  modal: ModalItem;
  onClose: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

const HistoryDetailModal: React.FC<HistoryDetailModalProps> = ({ modal, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div className="dashboard-card animate-in fade-in zoom-in-95 relative w-full max-w-md rounded-4xl p-8 shadow-2xl shadow-[#1E2B58]/20 duration-200">
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close modal"
        className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full text-[#1E2B58]/60 transition hover:bg-[#1E2B58]/10 dark:text-white/60 dark:hover:bg-white/10"
      >
        <X className="h-4 w-4" />
      </button>

      <h3 className="mb-6 text-xl font-black text-[#1E2B58] dark:text-white">
        {modal.type === "report" ? "Report Detail" : "Borrow Detail"}
      </h3>

      <div className="space-y-4 rounded-[1.25rem] bg-white/40 p-5 dark:bg-slate-800/40">
        {modal.type === "report" ? (
          <>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">ID</span>
              <span className="text-sm font-bold text-[#1E2B58] dark:text-white">{modal.item.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">Category</span>
              <span className="text-sm font-bold text-[#1E2B58] dark:text-white">{modal.item.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">Severity</span>
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${SEVERITY_COLORS[modal.item.severity]}`}>
                {modal.item.severity}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">ID</span>
              <span className="text-sm font-bold text-[#1E2B58] dark:text-white">{modal.item.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">Equipment</span>
              <span className="text-sm font-bold text-[#1E2B58] dark:text-white">{modal.item.equipmentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">Status</span>
              <span className="text-sm font-bold text-[#1E2B58] dark:text-white">{modal.item.status}</span>
            </div>
          </>
        )}
      </div>

      <button
        onClick={onClose}
        className="mt-6 w-full rounded-2xl bg-[#1E2B58] py-3 font-bold text-white transition hover:opacity-90"
      >
        Close
      </button>
    </div>
  </div>
);

export default HistoryDetailModal;
