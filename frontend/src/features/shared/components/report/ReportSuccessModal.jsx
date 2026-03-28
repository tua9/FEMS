import React from 'react';
import { CheckCircle2, X, ArrowRight } from 'lucide-react';

// ─── Props ────────────────────────────────────────────────────────────────────

// ─── Component ────────────────────────────────────────────────────────────────

export const ReportSuccessModal = ({
 reportId, reportSubject, reportDate, reportImages,
 primaryLabel, primaryIcon,
 onPrimary, onSubmitAnother, onClose,
}) => (
 <div
 className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
 onClick={e => { if (e.target === e.currentTarget) onClose(); }}
 >
 <div className="dashboard-card rounded-4xl p-8 w-full max-w-sm shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
 {/* Close */}
 <button
 onClick={onClose}
 className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition"
 >
 <X className="w-4 h-4 text-[#1E2B58]/60 dark:text-white/60" />
 </button>

 {/* Icon */}
 <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
 <CheckCircle2 className="w-9 h-9 text-emerald-500" />
 </div>

 {/* Title */}
 <h3 className="text-xl font-black text-[#1E2B58] dark:text-white text-center mb-1">
 Report Created Successfully!
 </h3>
 <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
 Your issue has been logged. Our team will follow up soon.
 </p>

 {/* Report details */}
 <div className="bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] p-4 mb-4 space-y-2.5">
 {[
 ['Report ID', reportId],
 ['Subject', reportSubject],
 ['Date', reportDate],
 ].map(([label, value]) => (
 <div key={label} className="flex justify-between text-xs">
 <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">{label}</span>
 <span className="font-bold text-[#1E2B58] dark:text-white text-right ml-4 truncate max-w-[11rem]">{value}</span>
 </div>
 ))}
 <div className="flex justify-between text-xs items-center pt-1 border-t border-[#1E2B58]/10 dark:border-white/10">
 <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">Status</span>
 <span className="bg-slate-200 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 text-[0.625rem] font-black px-3 py-1 rounded-full uppercase tracking-wider">
 Pending Review
 </span>
 </div>
 </div>

 {/* Evidence images */}
 {reportImages && reportImages.length > 0 && (
 <div className="mb-6">
 <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-2">
 Evidence Photos
 </p>
 <div className={`grid gap-2 ${reportImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
 {reportImages.map((url, i) => (
 <div key={i} className="aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-white/60 dark:border-white/10">
 <img src={url} alt={`Evidence ${i + 1}`} className="w-full h-full object-cover" />
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Actions */}
 <div className="flex flex-col gap-3">
 {primaryLabel && onPrimary ? (
 <button
 onClick={onPrimary}
 className="w-full py-3.5 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] text-white hover:bg-[#151f40] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#1E2B58]/20 flex items-center justify-center gap-2"
 >
 {primaryIcon}
 {primaryLabel}
 <ArrowRight className="w-4 h-4" />
 </button>
 ) : (
 <button
 onClick={onClose}
 className="w-full py-3.5 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] text-white hover:bg-[#151f40] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#1E2B58]/20"
 >
 Close
 </button>
 )}

 {onSubmitAnother && (
 <button
 onClick={onSubmitAnother}
 className="w-full py-3 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all"
 >
 Submit Another Report
 </button>
 )}
 </div>
 </div>
 </div>
);
