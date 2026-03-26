import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';
import type { ReportHistoryItem, ReportSeverity } from './ReportHistoryTable';

// ─── Constants ────────────────────────────────────────────────────────────────

const SEVERITY_COLORS: Record<string, string> = {
    CRITICAL: 'text-red-600 bg-red-100 border-red-200 dark:bg-red-900/30 dark:text-red-400',
    HIGH:     'text-orange-600 bg-orange-100 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400',
    MEDIUM:   'text-yellow-600 bg-yellow-100 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400',
    LOW:      'text-blue-600 bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface ReportDetailModalProps {
    item: ReportHistoryItem;
    onClose: () => void;
    onReportAgain: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ item: r, onClose, onReportAgain }) => {
    const Icon = r.icon || FileText;

    return (
        <>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-[1rem] bg-[#1E2B58]/10 dark:bg-white/5 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#1E2B58] dark:text-white" strokeWidth={1.5} />
                </div>
                <div>
                    <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40">Report Detail</p>
                    <h3 className="text-lg font-black text-[#1E2B58] dark:text-white">{r.id}</h3>
                </div>
            </div>

            <div className="space-y-3 bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] p-5 mb-6">
                {[
                    ['Category', r.category],
                    ['Location', `${r.location}, ${r.block}`],
                    ['Date', r.date],
                ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm">
                        <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">{k}</span>
                        <span className="font-bold text-[#1E2B58] dark:text-white">{v}</span>
                    </div>
                ))}

                {r.description && (
                    <div className="pt-2 border-t border-[#1E2B58]/10 dark:border-white/10">
                        <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium text-sm block mb-1">Description</span>
                        <p className="text-[#1E2B58] dark:text-white/90 text-sm font-medium leading-relaxed bg-white/30 dark:bg-slate-900/30 p-3 rounded-xl border border-white/40 dark:border-white/5">
                            {r.description}
                        </p>
                    </div>
                )}

                {((r.original as any)?.images?.length > 0 || r.img) && (
                    <div className="pt-2 border-t border-[#1E2B58]/10 dark:border-white/10">
                        <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium text-sm block mb-2">Evidence Images</span>
                        <div className={`grid ${(r.original as any)?.images?.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
                            {(r.original as any)?.images?.length > 0 ? (
                                (r.original as any).images.map((imgUrl: string, idx: number) => (
                                    <div key={idx} className="rounded-xl overflow-hidden border border-[#1E2B58]/10 dark:border-white/10 max-h-48 flex justify-center bg-black/5 dark:bg-black/20">
                                        <img src={imgUrl} alt={`Evidence ${idx + 1}`} className="object-contain max-h-48 w-full" />
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-xl overflow-hidden border border-[#1E2B58]/10 dark:border-white/10 max-h-48 flex justify-center bg-black/5 dark:bg-black/20">
                                    <img src={r.img} alt="Evidence" className="object-contain max-h-48 w-full" />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center text-sm pt-2 border-t border-[#1E2B58]/10 dark:border-white/10">
                    <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">Severity</span>
                    <span className={`text-[0.625rem] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${SEVERITY_COLORS[r.severity] || SEVERITY_COLORS['MEDIUM']}`}>
                        {r.severity}
                    </span>
                </div>

                <div className="flex justify-between items-center text-sm pt-2 border-t border-[#1E2B58]/10 dark:border-white/10">
                    <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">Status</span>
                    <span className={`text-[0.625rem] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                        r.status === 'RESOLVED'    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : r.status === 'IN PROGRESS' ? 'bg-[#1E2B58] text-white'
                        : r.status === 'CANCELLED'   ? 'bg-slate-200 text-slate-600 dark:bg-slate-700/50 dark:text-slate-400'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-700/50 dark:text-slate-400'
                    }`}>
                        {r.status}
                    </span>
                </div>

                {r.status === 'CANCELLED' && r.decision_note && (
                    <div className="pt-2 border-t border-[#1E2B58]/10 dark:border-white/10">
                        <p className="text-[0.625rem] font-bold uppercase tracking-wider text-red-500/60 dark:text-red-400/50 mb-1">Cancellation Reason</p>
                        <p className="text-sm text-[#1E2B58] dark:text-white/90 font-medium bg-red-50/60 dark:bg-red-900/10 border border-red-200/60 dark:border-red-800/20 px-3 py-2.5 rounded-xl leading-relaxed">
                            {r.decision_note}
                        </p>
                    </div>
                )}
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onReportAgain}
                    className="flex-1 py-3 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] text-white hover:bg-[#151f40] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#1E2B58]/20 flex items-center justify-center gap-2"
                >
                    <FileText className="w-4 h-4" /> Report Again <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                    onClick={onClose}
                    className="flex-1 py-3 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 transition-all"
                >
                    Close
                </button>
            </div>
        </>
    );
};
