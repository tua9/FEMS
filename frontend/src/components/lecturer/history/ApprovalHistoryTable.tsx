import React from 'react';
import { Eye, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ApprovalDecision = 'APPROVED' | 'REJECTED';

export interface ApprovalHistoryItem {
    id:           string;
    studentName:  string;
    studentId:    string;
    equipment:    string;
    requestDate:  string;
    decidedDate:  string;
    decision:     ApprovalDecision;
    reason?:      string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

export const ALL_APPROVAL_HISTORY: ApprovalHistoryItem[] = [
    { id: '#STU-REQ-145', studentName: 'Nguyen Van A', studentId: 'SE180001', equipment: 'MacBook Pro 16"',   requestDate: 'Oct 25, 2023', decidedDate: 'Oct 25, 2023', decision: 'APPROVED' },
    { id: '#STU-REQ-138', studentName: 'Tran Thi B',   studentId: 'SE180042', equipment: 'HDMI Cable x3',    requestDate: 'Oct 23, 2023', decidedDate: 'Oct 23, 2023', decision: 'REJECTED', reason: 'Insufficient justification provided' },
    { id: '#STU-REQ-130', studentName: 'Le Van C',     studentId: 'SE180087', equipment: 'Wireless Mic Set', requestDate: 'Oct 21, 2023', decidedDate: 'Oct 21, 2023', decision: 'APPROVED' },
    { id: '#STU-REQ-125', studentName: 'Pham Thi D',   studentId: 'SE180063', equipment: 'Arduino Kit',      requestDate: 'Oct 19, 2023', decidedDate: 'Oct 20, 2023', decision: 'APPROVED' },
    { id: '#STU-REQ-118', studentName: 'Hoang Van E',  studentId: 'SE180024', equipment: 'Projector Cable',  requestDate: 'Oct 17, 2023', decidedDate: 'Oct 18, 2023', decision: 'REJECTED', reason: 'Equipment already reserved for another class' },
    { id: '#STU-REQ-112', studentName: 'Nguyen Thi F', studentId: 'SE180095', equipment: 'Raspberry Pi 4',  requestDate: 'Oct 15, 2023', decidedDate: 'Oct 15, 2023', decision: 'APPROVED' },
    { id: '#STU-REQ-108', studentName: 'Tran Van G',   studentId: 'SE180011', equipment: 'USB-C Hub',        requestDate: 'Oct 13, 2023', decidedDate: 'Oct 14, 2023', decision: 'APPROVED' },
    { id: '#STU-REQ-104', studentName: 'Le Thi H',     studentId: 'SE180076', equipment: 'External SSD',     requestDate: 'Oct 11, 2023', decidedDate: 'Oct 11, 2023', decision: 'REJECTED', reason: 'Not within course requirements' },
    { id: '#STU-REQ-098', studentName: 'Pham Van I',   studentId: 'SE180038', equipment: 'MacBook Air M2',   requestDate: 'Oct 09, 2023', decidedDate: 'Oct 10, 2023', decision: 'APPROVED' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pageRange(current: number, total: number): (number | '...')[] {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 3) return [1, 2, 3, '...', total];
    if (current >= total - 2) return [1, '...', total - 2, total - 1, total];
    return [1, '...', current - 1, current, current + 1, '...', total];
}

function initials(name: string): string {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ApprovalHistoryTableProps {
    items:        ApprovalHistoryItem[];
    currentPage:  number;
    totalPages:   number;
    totalItems:   number;
    onPageChange: (page: number) => void;
    onViewDetail: (item: ApprovalHistoryItem) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ApprovalHistoryTable: React.FC<ApprovalHistoryTableProps> = ({
    items, currentPage, totalPages, totalItems, onPageChange, onViewDetail,
}) => {
    return (
        <div className="glass-card bg-white/60 dark:bg-slate-900/40 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-[0_10px_30px_-5px_rgba(30,43,88,0.1)] mb-[4rem] border border-white dark:border-white/10">
            <div className="overflow-x-auto hide-scrollbar">
                <table className="w-full border-collapse min-w-[900px]">
                    <thead>
                        <tr className="border-b border-black/5 dark:border-white/5">
                            {['Request ID', 'Student', 'Equipment', 'Requested', 'Decided', 'Decision', 'Actions'].map((h, i) => (
                                <th key={h} className={`px-[2rem] py-[1.5rem] text-[0.625rem] font-black uppercase tracking-[0.2em] text-[#1E2B58]/50 dark:text-slate-400 ${i === 5 ? 'text-center' : i === 6 ? 'text-right' : 'text-left'}`}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 bg-white/40 dark:bg-black/10">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-[2rem] py-[4rem] text-center text-slate-400 dark:text-slate-500 font-bold text-sm">
                                    No records found for the selected filters.
                                </td>
                            </tr>
                        ) : items.map(item => (
                            <tr
                                key={item.id}
                                className="transition-all duration-200 hover:bg-white/70 dark:hover:bg-white/5 group cursor-pointer"
                                onClick={() => onViewDetail(item)}
                            >
                                {/* ID */}
                                <td className="px-[2rem] py-[1.5rem]">
                                    <span className="text-[0.625rem] font-bold text-[#1E2B58] dark:text-slate-300">{item.id}</span>
                                </td>

                                {/* Student */}
                                <td className="px-[2rem] py-[1.5rem]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#1E2B58]/10 dark:bg-white/10 flex items-center justify-center text-[0.625rem] font-black text-[#1E2B58] dark:text-white shrink-0">
                                            {initials(item.studentName)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#1E2B58] dark:text-white text-[0.875rem] leading-none mb-[0.2rem]">{item.studentName}</p>
                                            <p className="text-[0.625rem] text-slate-500 font-medium">{item.studentId}</p>
                                        </div>
                                    </div>
                                </td>

                                {/* Equipment */}
                                <td className="px-[2rem] py-[1.5rem]">
                                    <span className="font-bold text-[#1E2B58] dark:text-white text-[0.875rem]">{item.equipment}</span>
                                </td>

                                {/* Requested */}
                                <td className="px-[2rem] py-[1.5rem]">
                                    <span className="text-[0.75rem] font-medium text-slate-600 dark:text-slate-400">{item.requestDate}</span>
                                </td>

                                {/* Decided */}
                                <td className="px-[2rem] py-[1.5rem]">
                                    <span className="text-[0.75rem] font-bold text-[#1E2B58] dark:text-white">{item.decidedDate}</span>
                                </td>

                                {/* Decision badge */}
                                <td className="px-[2rem] py-[1.5rem] text-center">
                                    {item.decision === 'APPROVED' ? (
                                        <span className="inline-flex items-center gap-1.5 text-[0.625rem] font-bold px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 uppercase tracking-wider">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Approved
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 text-[0.625rem] font-bold px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50 uppercase tracking-wider">
                                            <XCircle className="w-3 h-3" />
                                            Rejected
                                        </span>
                                    )}
                                </td>

                                {/* Actions */}
                                <td className="px-[2rem] py-[1.5rem] text-right">
                                    <button
                                        onClick={e => { e.stopPropagation(); onViewDetail(item); }}
                                        className="p-[0.5rem] rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition-all hover:scale-110 active:scale-90"
                                        title="View Details"
                                    >
                                        <Eye className="w-[1rem] h-[1rem] text-[#1E2B58] dark:text-slate-300" strokeWidth={2.5} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-[2rem] py-[1.5rem] flex flex-col sm:flex-row items-center justify-between gap-[1rem] border-t border-black/5 dark:border-white/5 bg-white/20 dark:bg-transparent">
                <p className="text-[0.6875rem] font-bold text-[#1E2B58]/60 dark:text-slate-400 uppercase tracking-wider">
                    Showing {items.length} of {totalItems} record{totalItems !== 1 ? 's' : ''}
                </p>
                {totalPages > 1 && (
                    <div className="flex gap-[0.5rem] items-center">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="w-[2rem] h-[2rem] rounded-full border border-[#1E2B58]/10 dark:border-white/10 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        >
                            <ChevronLeft className="w-[1rem] h-[1rem] text-[#1E2B58] dark:text-slate-400" />
                        </button>
                        {pageRange(currentPage, totalPages).map((p, i) =>
                            p === '...' ? (
                                <span key={`d-${i}`} className="text-[0.875rem] text-slate-400 mx-[0.25rem]">…</span>
                            ) : (
                                <button
                                    key={p}
                                    onClick={() => onPageChange(p as number)}
                                    className={`w-[2rem] h-[2rem] rounded-full flex items-center justify-center font-bold text-[0.875rem] transition-colors ${
                                        currentPage === p
                                            ? 'bg-[#1E2B58] text-white shadow-sm shadow-[#1E2B58]/20'
                                            : 'border border-[#1E2B58]/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-[#1E2B58] dark:text-slate-300'
                                    }`}
                                >
                                    {p}
                                </button>
                            )
                        )}
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="w-[2rem] h-[2rem] rounded-full border border-[#1E2B58]/10 dark:border-white/10 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        >
                            <ChevronRight className="w-[1rem] h-[1rem] text-[#1E2B58] dark:text-slate-400" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
