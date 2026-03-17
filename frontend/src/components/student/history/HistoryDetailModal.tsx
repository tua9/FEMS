/**
 * HistoryDetailModal — Dialog xem chi tiết lịch sử mượn / báo cáo sự cố.
 * Tách ra từ BorrowHistoryPage để trang page gọn hơn.
 */
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { Report } from "@/types/report";
import type { BorrowRequest } from "@/types/borrowRequest";
import { StatusBadge } from "@/components/shared/ui/StatusBadge";

// ── Severity colour map ───────────────────────────────────────────────────────

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: "text-red-600 bg-red-100 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  HIGH: "text-orange-600 bg-orange-100 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
  MEDIUM: "text-yellow-600 bg-yellow-100 border-yellow-200 dark:bg-yellow-900/30 dark:text-orange-400",
  LOW: "text-blue-600 bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
};

// ── Types ─────────────────────────────────────────────────────────────────────

export type ModalItem =
  | { type: "report"; item: Report }
  | { type: "borrow"; item: BorrowRequest };

interface HistoryDetailModalProps {
  modal: ModalItem;
  onClose: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

const HistoryDetailModal: React.FC<HistoryDetailModalProps> = ({ modal, onClose }) => {
  const isReport = modal.type === "report";
  const item = modal.item;
  
  // Helpers to safely extract relations
  const getEquipmentName = (eq: any) => {
    if (!eq) return "Infrastructure / Unknown";
    if (typeof eq === 'string') return eq;
    return eq.name || "Unknown Equipment";
  };
  
  const getRoomName = (room: any) => {
    if (!room) return "Unknown Room";
    if (typeof room === 'string') return room;
    const building = room.building_id && typeof room.building_id !== 'string' ? room.building_id : null;
    return building ? `${building.name}, ${room.name}` : (room.name || "Unknown Room");
  };

  const severity = isReport ? ((item as Report).type === 'equipment' ? 'HIGH' : 'MEDIUM') : null;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prevent scrolling behind modal
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

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
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5"
        >
          <X className="h-4 w-4" />
        </button>

        <h3 className="mb-6 text-xl font-black text-[#1E2B58] dark:text-white">
          {isReport ? "Report Detail" : "Borrow Detail"}
        </h3>

        <div className="space-y-4 rounded-[1.25rem] bg-white/40 p-5 dark:bg-slate-800/40">
          <div className="flex justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">ID</span>
            <span className="text-sm font-bold text-[#1E2B58] dark:text-white">
              #{item._id.substring(item._id.length - 6).toUpperCase()}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">Status</span>
            <span className="text-sm font-bold text-[#1E2B58] dark:text-white">
              <StatusBadge status={item.status} />
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">Date</span>
            <span className="text-sm font-bold text-[#1E2B58] dark:text-white">
              {new Date(item.createdAt || (item as any).borrow_date || new Date()).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">Room</span>
            <span className="text-sm font-bold text-[#1E2B58] dark:text-white">
              {getRoomName(item.room_id)}
            </span>
          </div>

          {isReport ? (
            <>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Category</span>
                <span className="text-sm font-bold text-[#1E2B58] dark:text-white capitalize">
                  {(item as Report).type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Severity</span>
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${SEVERITY_COLORS[severity!]}`}>
                  {severity}
                </span>
              </div>
              {((item as Report).description) && (
                <div className="mt-4 border-t border-black/5 dark:border-white/5 pt-4">
                  <span className="mb-2 block text-sm text-slate-500 dark:text-slate-400">Description</span>
                  <p className="text-sm font-medium text-[#1E2B58] dark:text-slate-300">
                    {(item as Report).description}
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Equipment</span>
                <span className="text-sm font-bold text-[#1E2B58] dark:text-white">
                  {getEquipmentName(item.equipment_id)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Return By</span>
                <span className="text-sm font-bold text-[#1E2B58] dark:text-white">
                  {new Date((item as BorrowRequest).return_date).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </span>
              </div>
              {((item as BorrowRequest).note) && (
                <div className="mt-4 border-t border-black/5 dark:border-white/5 pt-4">
                  <span className="mb-2 block text-sm text-slate-500 dark:text-slate-400">Note</span>
                  <p className="text-sm font-medium text-[#1E2B58] dark:text-slate-300">
                    {(item as BorrowRequest).note}
                  </p>
                </div>
              )}
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
    </div>,
    document.body
  );
};

export default HistoryDetailModal;
