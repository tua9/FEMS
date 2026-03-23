import React from 'react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import type { ApprovalHistoryItem } from './ApprovalHistoryTable';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ApprovalDetailModalProps {
    item: ApprovalHistoryItem;
    onClose: () => void;
    onViewRequests: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ApprovalDetailModal: React.FC<ApprovalDetailModalProps> = ({ item: a, onClose, onViewRequests }) => {
    const isApproved = a.decision === 'APPROVED';

    return (
        <>
            <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center ${
                    isApproved ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'
                }`}>
                    {isApproved
                        ? <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        : <XCircle     className="w-6 h-6 text-red-600 dark:text-red-400" />
                    }
                </div>
                <div>
                    <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40">Approval Detail</p>
                    <h3 className="text-lg font-black text-[#1E2B58] dark:text-white">{a.id}</h3>
                </div>
            </div>

            <div className="space-y-3 bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] p-5 mb-6">
                {[
                    ['Student',   `${a.studentName} (${a.studentId})`],
                    ['Equipment', a.equipment],
                    ['Requested', a.requestDate],
                    ['Decided',   a.decidedDate],
                ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm">
                        <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">{k}</span>
                        <span className="font-bold text-[#1E2B58] dark:text-white text-right ml-4">{v}</span>
                    </div>
                ))}

                <div className="flex justify-between items-center text-sm pt-2 border-t border-[#1E2B58]/10 dark:border-white/10">
                    <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">Decision</span>
                    <span className={`text-[0.625rem] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                        isApproved
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                        {a.decision}
                    </span>
                </div>

                {a.reason && (
                    <div className="pt-2 border-t border-[#1E2B58]/10 dark:border-white/10">
                        <p className="text-[0.625rem] font-bold uppercase tracking-wider text-[#1E2B58]/50 dark:text-white/40 mb-1">Rejection Reason</p>
                        <p className="text-sm text-[#1E2B58] dark:text-white font-medium">{a.reason}</p>
                    </div>
                )}
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onViewRequests}
                    className="flex-1 py-3 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] text-white hover:bg-[#151f40] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#1E2B58]/20 flex items-center justify-center gap-2"
                >
                    View Student Requests <ArrowRight className="w-3.5 h-3.5" />
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
