import React, { useState, useMemo } from "react";
import { X, ArrowRight, CalendarDays, FileText, Clock, Timer } from "lucide-react";
import type { Equipment } from "@/types/equipment";
import { differenceInMinutes } from "date-fns";

interface BorrowModalProps {
  item: Equipment;
  onClose: () => void;
  onSubmit: (borrowDate: string, returnDate: string, purpose: string) => void;
  isLoading?: boolean;
}

const BorrowModal: React.FC<BorrowModalProps> = ({ item, onClose, onSubmit, isLoading }) => {
  // Initialize with current local date/time natively
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const currentDateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const currentTimeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const [borrowDate, setBorrowDate] = useState(currentDateStr);
  const [borrowTime, setBorrowTime] = useState(currentTimeStr);
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  
  const [purpose, setPurpose] = useState("");
  const [formError, setFormError] = useState("");

  const borrowDateTime = borrowDate && borrowTime ? `${borrowDate}T${borrowTime}` : "";
  const returnDateTime = returnDate && returnTime ? `${returnDate}T${returnTime}` : "";

  // Dynamic duration calculation
  const durationText = useMemo(() => {
    if (!borrowDateTime || !returnDateTime) return null;
    const start = new Date(borrowDateTime);
    const end = new Date(returnDateTime);
    
    if (end <= start) return null;

    const mins = differenceInMinutes(end, start);
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ${remainingHours > 0 ? `${remainingHours} hr${remainingHours > 1 ? 's' : ''}` : ''}`;
    } else if (hours > 0) {
      return `${hours} hr${hours > 1 ? 's' : ''} ${remainingMins > 0 ? `${remainingMins} min` : ''}`;
    }
    return `${mins} min`;
  }, [borrowDateTime, returnDateTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowDateTime || !returnDateTime || !purpose.trim()) {
      setFormError("Please fill in all details completely.");
      return;
    }
    if (new Date(returnDateTime) <= new Date(borrowDateTime)) {
      setFormError("Return time must be logically after borrow time.");
      return;
    }
    onSubmit(borrowDateTime, returnDateTime, purpose);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E2B58]/40 px-4 backdrop-blur-md transition-all"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="animate-in fade-in zoom-in-95 relative w-full max-w-lg rounded-[2.5rem] bg-white/90 dark:bg-slate-900/90 p-8 shadow-2xl shadow-[#1E2B58]/30 dark:shadow-black/50 overflow-hidden backdrop-blur-2xl ring-1 ring-white/50 dark:ring-white/10 duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100/50 dark:bg-slate-800/50 text-slate-500 transition hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-slate-300"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Ribbon */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-widest text-blue-700 dark:text-blue-400 uppercase">
              New Borrow Request
            </span>
          </div>
          <h3 className="text-[1.75rem] leading-tight font-black text-[#1E2B58] dark:text-white mb-2">
            {item.name}
          </h3>
          <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-slate-400 uppercase">
            <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              <AsteriskIcon className="w-3 h-3" /> {item._id.slice(-6).toUpperCase()}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 px-2.5 py-1 rounded-lg">
              <MapPinIcon className="w-3 h-3" /> {(item.room_id as any)?.name || "Phòng kho"}
            </span>
          </div>
        </div>

        {/* Form Group */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
          
          <div className="grid grid-cols-2 gap-4">
            {/* Borrow Time */}
            <div className="space-y-3">
              <label className="text-[10px] font-black tracking-widest text-[#1E2B58]/60 dark:text-slate-400 uppercase flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Start Time
              </label>
              <div className="flex flex-col gap-2">
                <div className="relative group">
                  <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="date"
                    required
                    min={currentDateStr}
                    value={borrowDate}
                    onChange={(e) => setBorrowDate(e.target.value)}
                    className="w-full rounded-2xl border-2 border-slate-200/60 dark:border-slate-700 bg-white/60 dark:bg-slate-800 pl-10 pr-4 py-3 text-sm font-bold text-[#1E2B58] dark:text-white outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
                <div className="relative group">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="time"
                    required
                    value={borrowTime}
                    onChange={(e) => setBorrowTime(e.target.value)}
                    className="w-full rounded-2xl border-2 border-slate-200/60 dark:border-slate-700 bg-white/60 dark:bg-slate-800 pl-10 pr-4 py-3 text-sm font-bold text-[#1E2B58] dark:text-white outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>
            </div>

            {/* Return Time */}
            <div className="space-y-3">
              <label className="text-[10px] font-black tracking-widest text-[#1E2B58]/60 dark:text-slate-400 uppercase flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" /> End Time
              </label>
              <div className="flex flex-col gap-2">
                <div className="relative group">
                  <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="date"
                    required
                    min={borrowDate || currentDateStr}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full rounded-2xl border-2 border-slate-200/60 dark:border-slate-700 bg-white/60 dark:bg-slate-800 pl-10 pr-4 py-3 text-sm font-bold text-[#1E2B58] dark:text-white outline-none transition-all hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
                <div className="relative group">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="time"
                    required
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="w-full rounded-2xl border-2 border-slate-200/60 dark:border-slate-700 bg-white/60 dark:bg-slate-800 pl-10 pr-4 py-3 text-sm font-bold text-[#1E2B58] dark:text-white outline-none transition-all hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Duration Display */}
          {durationText && (
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-500/20 animate-in slide-in-from-bottom-2 fade-in">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                <Timer className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-[10px] font-black tracking-widest text-indigo-800/60 dark:text-indigo-400/60 uppercase">
                  Proposed Duration
                </p>
                <p className="text-sm font-bold text-indigo-900 dark:text-indigo-300">
                  {durationText}
                </p>
              </div>
            </div>
          )}

          {/* Purpose */}
          <div className="space-y-3">
            <label className="text-[10px] font-black tracking-widest text-[#1E2B58]/60 dark:text-slate-400 uppercase flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Purpose
            </label>
            <div className="relative group">
              <textarea
                required
                rows={2}
                placeholder="Briefly describe what you'll use this for..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full resize-none rounded-2xl border-2 border-slate-200/60 dark:border-slate-700 bg-white/60 dark:bg-slate-800 px-4 py-3.5 text-sm font-medium text-[#1E2B58] dark:text-white outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {formError && (
            <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-xs font-bold text-red-600 dark:text-red-400 animate-in slide-in-from-bottom-1 fade-in">
              {formError}
            </div>
          )}

          {/* Actions */}
          <div className="mt-2 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-[1] rounded-2xl bg-slate-100 dark:bg-slate-800/80 py-4 text-sm font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="group flex flex-[2] items-center justify-center gap-2 rounded-2xl bg-[#1E2B58] dark:bg-blue-600 py-4 text-sm font-bold text-white shadow-xl shadow-[#1E2B58]/20 dark:shadow-blue-900/20 transition-all hover:scale-[1.02] hover:bg-blue-900 dark:hover:bg-blue-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? "Submitting..." : "Submit Request"}
              {!isLoading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={3} />}
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
