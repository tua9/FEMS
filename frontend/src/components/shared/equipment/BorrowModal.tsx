import React, { useState, useMemo } from "react";
import { X, ArrowRight, FileText, Clock, Timer } from "lucide-react";
import type { Equipment } from "@/types/equipment";

interface BorrowModalProps {
  item: Equipment;
  onClose: () => void;
  onSubmit: (borrowDate: string, returnDate: string, purpose: string) => void;
  isLoading?: boolean;
}

const BorrowModal: React.FC<BorrowModalProps> = ({ item, onClose, onSubmit, isLoading }) => {
  const [startDateOption, setStartDateOption] = useState<'today' | 'tomorrow'>('today');
  const [durationOption, setDurationOption] = useState<'1' | '3' | '7'>('1');
  const [purpose, setPurpose] = useState("mượn với mục đích phục vụ học tập");
  const [formError, setFormError] = useState("");

  const calculatedDates = useMemo(() => {
    const borrow = new Date();
    if (startDateOption === 'tomorrow') {
      borrow.setDate(borrow.getDate() + 1);
    }
    // Set to 07:00 AM fixed
    borrow.setHours(7, 0, 0, 0);

    const durationDays = parseInt(durationOption);
    const returnDateObj = new Date(borrow);
    returnDateObj.setDate(returnDateObj.getDate() + durationDays);
    // Set to 17:00 (5:00 PM) fixed
    returnDateObj.setHours(17, 0, 0, 0);

    return {
      borrow: borrow.toISOString(),
      return: returnDateObj.toISOString(),
      displayBorrow: borrow.toLocaleString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      displayReturn: returnDateObj.toLocaleString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
  }, [startDateOption, durationOption]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim()) {
      setFormError("Vui lòng nhập mục đích mượn.");
      return;
    }
    onSubmit(calculatedDates.borrow, calculatedDates.return, purpose);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1E2B58]/40 px-4 backdrop-blur-md transition-all"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="animate-in fade-in zoom-in-95 relative w-full max-w-lg rounded-[2.5rem] bg-white/95 dark:bg-slate-900/95 p-8 shadow-2xl shadow-[#1E2B58]/30 dark:shadow-black/50 overflow-hidden backdrop-blur-2xl ring-1 ring-white/50 dark:ring-white/10 duration-300">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100/50 dark:bg-slate-800/50 text-slate-500 transition hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-slate-300 z-20"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Ribbon */}
        <div className="mb-6 relative z-10">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-400/10 border border-blue-100 dark:border-blue-400/20">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-widest text-blue-700 dark:text-blue-400 uppercase">
              New Borrow Request
            </span>
          </div>
          <h3 className="text-[1.75rem] leading-tight font-black text-[#1E2B58] dark:text-white mb-2">
            {item.name}
          </h3>
          <div className="flex items-center gap-3 text-[10px] font-black tracking-widest text-slate-400 uppercase">
            <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-black/5 dark:border-white/5">
              <AsteriskIcon className="w-3 h-3" /> {item._id.slice(-6).toUpperCase()}
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400 px-2.5 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-400/20">
              <MapPinIcon className="w-3 h-3" /> {(item.room_id as any)?.name || "Store"}
            </span>
          </div>
        </div>

        {/* Form Group */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
          
          {/* Start Date Option */}
          <div className="space-y-3">
            <label className="text-[10px] font-black tracking-widest text-[#1E2B58]/60 dark:text-slate-400 uppercase flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Start Time
            </label>
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl border border-black/5 dark:border-white/5">
              {(['today', 'tomorrow'] as const).map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setStartDateOption(option)}
                  className={`py-3 rounded-[1.125rem] text-sm font-bold transition-all duration-300 ${
                    startDateOption === option
                      ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/10"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  {option === 'today' ? 'Hôm nay' : 'Ngày mai'}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Option */}
          <div className="space-y-3">
            <label className="text-[10px] font-black tracking-widest text-[#1E2B58]/60 dark:text-slate-400 uppercase flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5" /> Borrow Duration
            </label>
            <div className="grid grid-cols-3 gap-3 p-1.5 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl border border-black/5 dark:border-white/5">
              {(['1', '3', '7'] as const).map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setDurationOption(option)}
                  className={`py-3 rounded-[1.125rem] text-sm font-bold transition-all duration-300 ${
                    durationOption === option
                      ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/10"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  {option} ngày
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Preview */}
          <div className="p-5 rounded-[1.75rem] bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-400/20 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-indigo-900/40 dark:text-indigo-400/40 uppercase tracking-widest">Bắt đầu</span>
                <span className="font-black text-[#1E2B58] dark:text-indigo-200">{calculatedDates.displayBorrow}</span>
              </div>
              <div className="h-px bg-indigo-200/50 dark:bg-white/5 w-full" />
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-indigo-900/40 dark:text-indigo-400/40 uppercase tracking-widest">Kết thúc</span>
                <span className="font-black text-[#1E2B58] dark:text-indigo-200">{calculatedDates.displayReturn}</span>
              </div>
          </div>

          {/* Purpose */}
          <div className="space-y-3">
            <label className="text-[10px] font-black tracking-widest text-[#1E2B58]/60 dark:text-slate-400 uppercase flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Purpose
            </label>
            <textarea
              required
              rows={2}
              placeholder="Mục đích mượn thiết bị..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full resize-none rounded-[1.5rem] border-2 border-slate-200/60 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 px-4 py-4 text-sm font-bold text-[#1E2B58] dark:text-white outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {formError && (
            <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-xs font-bold text-red-600 dark:text-red-400 animate-in slide-in-from-bottom-1 fade-in">
              {formError}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-[1] rounded-[1.25rem] bg-slate-100 dark:bg-slate-800 py-4 text-sm font-black text-slate-500 dark:text-slate-400 transition-all hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="group flex flex-[2] items-center justify-center gap-3 rounded-[1.25rem] bg-[#1E2B58] dark:bg-blue-600 py-4 text-sm font-black text-white shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] hover:bg-blue-900 dark:hover:bg-blue-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Submit Request
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={3} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Quick mock icons that don't need imports from lucide directly if they fail, but they exist in lucide-react
const AsteriskIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v12"/><path d="M17.196 9 6.804 15"/><path d="m6.804 9 10.392 6"/></svg>
);
const MapPinIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
);

export default BorrowModal;
