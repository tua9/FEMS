import React, { useState, useMemo } from "react";
import { X, ArrowRight, FileText, Clock, Timer, MapPin, Hash, Info } from "lucide-react";
import { createPortal } from "react-dom";

const BorrowModal = ({ item, onClose, onSubmit, isLoading }) => {
 const [startDateOption, setStartDateOption] = useState('today');
 const [durationOption, setDurationOption] = useState('1');
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
 displayBorrow: borrow.toLocaleString('vi-VN', { weekday: 'narrow', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
 displayReturn: returnDateObj.toLocaleString('vi-VN', { weekday: 'narrow', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
 };
 }, [startDateOption, durationOption]);

 const handleSubmit = (e) => {
 e.preventDefault();
 if (!purpose.trim()) {
 setFormError("Vui lòng nhập mục đích mượn.");
 return;
 }
 onSubmit(calculatedDates.borrow, calculatedDates.return, purpose);
 };

 const labelClasses = "text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1.5 mb-2";

 return createPortal(
 <div
 className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm transition-all"
 onClick={(e) => e.target === e.currentTarget && onClose()}
 >
 <div className="animate-in fade-in zoom-in-95 relative w-full max-w-3xl rounded-[2.5rem] bg-white dark:bg-[#1a2340] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden duration-300">
 
 {/* Header Section */}
 <div className="px-8 pt-8 pb-6 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-2xl bg-[#1E2B58] dark:bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
 <Clock className="w-6 h-6 text-white" />
 </div>
 <div>
 <div className="inline-flex items-center gap-2 mb-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-400/10 border border-blue-100 dark:border-blue-400/20">
 <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
 <span className="text-[9px] font-black tracking-widest text-blue-700 dark:text-blue-400 uppercase">
 New Borrow Request
 </span>
 </div>
 <h3 className="text-xl font-black text-[#1E2B58] dark:text-white leading-tight">
 {item.name}
 </h3>
 </div>
 </div>
 <button
 onClick={onClose}
 className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
 >
 <X className="h-5 w-5" />
 </button>
 </div>

 {/* Body Content - Two Column Layout */}
 <div className="flex-1 overflow-y-auto no-scrollbar p-8">
 <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
 
 {/* Left Column: Preview & Info */}
 <div className="md:col-span-2 space-y-6">
 {item.img ? (
 <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-slate-100 dark:border-white/5 shadow-sm bg-slate-50 dark:bg-slate-900/50">
 <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
 </div>
 ) : (
 <div className="aspect-[4/3] rounded-3xl bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-white/5 text-slate-300">
 <span className="material-symbols-outlined text-4xl mb-2">image_not_supported</span>
 <span className="text-[10px] font-bold uppercase tracking-widest">No preview available</span>
 </div>
 )}

 <div className="p-5 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 space-y-4">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
 <Hash className="w-4 h-4" />
 </div>
 <div>
 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Equipment ID</p>
 <p className="text-xs font-black text-[#1E2B58] dark:text-white uppercase">{item._id.slice(-8)}</p>
 </div>
 </div>
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
 <MapPin className="w-4 h-4" />
 </div>
 <div>
 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Location</p>
 <p className="text-xs font-black text-[#1E2B58] dark:text-white">{(item.room_id)?.name || "Central Store"}</p>
 </div>
 </div>
 </div>
 </div>

 {/* Right Column: Form Fields */}
 <form id="borrowForm" onSubmit={handleSubmit} className="md:col-span-3 space-y-6">
 
 {/* Timing Options Grid */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 {/* Start Date */}
 <div className="space-y-3">
 <label className={labelClasses}><Clock className="w-3.5 h-3.5" /> Start Time</label>
 <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/5">
 {(['today', 'tomorrow']).map(option => (
 <button
 key={option}
 type="button"
 onClick={() => setStartDateOption(option)}
 className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
 startDateOption === option
 ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-md"
 : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
 }`}
 >
 {option === 'today' ? 'Hôm nay' : 'Ngày mai'}
 </button>
 ))}
 </div>
 </div>

 {/* Duration */}
 <div className="space-y-3">
 <label className={labelClasses}><Timer className="w-3.5 h-3.5" /> Duration</label>
 <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/5">
 {(['1', '3', '7']).map(option => (
 <button
 key={option}
 type="button"
 onClick={() => setDurationOption(option)}
 className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
 durationOption === option
 ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md"
 : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
 }`}
 >
 {option}d
 </button>
 ))}
 </div>
 </div>
 </div>

 {/* Purpose */}
 <div className="space-y-3">
 <label className={labelClasses}><FileText className="w-3.5 h-3.5" /> Purpose</label>
 <textarea
 required
 rows={3}
 placeholder="Mô tả mục đích sử dụng..."
 value={purpose}
 onChange={(e) => setPurpose(e.target.value)}
 className="w-full resize-none rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 px-4 py-3.5 text-sm font-bold text-[#1E2B58] dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-300"
 />
 </div>

 {/* Summary Box */}
 <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-400/5 border border-blue-100 dark:border-blue-400/10">
 <div className="flex items-start gap-3">
 <Info className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
 <div className="space-y-3 flex-1">
 <p className="text-[10px] font-black uppercase tracking-widest text-blue-800/60 dark:text-blue-400/60">Schedule Summary</p>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Pickup</p>
 <p className="text-xs font-black text-[#1E2B58] dark:text-blue-200">{calculatedDates.displayBorrow}</p>
 </div>
 <div>
 <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Return</p>
 <p className="text-xs font-black text-[#1E2B58] dark:text-blue-200">{calculatedDates.displayReturn}</p>
 </div>
 </div>
 </div>
 </div>
 </div>

 {formError && (
 <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold border border-red-100 dark:border-red-900/30 animate-in slide-in-from-top-1">
 {formError}
 </div>
 )}
 </form>
 </div>
 </div>

 {/* Footer Actions */}
 <div className="px-8 py-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2 flex gap-4">
 <button
 type="button"
 onClick={onClose}
 className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 text-sm font-black text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-white/5 transition-all"
 >
 Hủy bỏ
 </button>
 <button
 type="submit"
 form="borrowForm"
 disabled={isLoading}
 className="flex-2 flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-[#1E2B58] dark:bg-blue-600 text-sm font-black text-white shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all"
 >
 {isLoading ? (
 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
 ) : (
 <>
 Confirm Request
 <ArrowRight className="w-4 h-4" />
 </>
 )}
 </button>
 </div>
 </div>
 </div>,
 document.body
 );
};

export default BorrowModal;
