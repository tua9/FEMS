import { ChevronLeft, ChevronRight, Eye, Projector } from 'lucide-react';
import React from 'react';
import { StatusBadge } from '@/components/shared/ui/StatusBadge';
import type { BorrowRequest } from '@/types/borrowRequest';


// ─── Types ────────────────────────────────────────────────────────────────────

export type BorrowStatus = 'RETURNED' | 'BORROWED' | 'OVERDUE' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface BorrowHistoryItem {
    id: string;
    course: string;
    group: string;
    equipmentName: string;
    icon: React.ElementType;
    period: string;
    returnDate: string;
    status: BorrowStatus;
    original: BorrowRequest;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

// We keep these for types, but we will pass correctly mapped items from the parents.
export const ALL_BORROW_HISTORY: any[] = []; 

// ─── Pagination helper ────────────────────────────────────────────────────────

function pageRange(current: number, total: number): (number | '...')[] {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 3) return [1, 2, 3, '...', total];
    if (current >= total - 2) return [1, '...', total - 2, total - 1, total];
    return [1, '...', current - 1, current, current + 1, '...', total];
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface BorrowHistoryTableProps {
    items: BorrowHistoryItem[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onViewDetail: (item: BorrowHistoryItem) => void;
    onEdit?: (item: BorrowHistoryItem) => void;
    onCancel?: (item: BorrowHistoryItem) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const BorrowHistoryTable: React.FC<BorrowHistoryTableProps> = ({
    items, currentPage, totalPages, totalItems, onPageChange, onViewDetail, onEdit, onCancel,
}) => {
    return (
        <div className="dashboard-card rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden mb-[4rem]">
            <div className="overflow-x-auto hide-scrollbar">
                <table className="w-full border-collapse min-w-[1000px]">
                    <thead>
                        <tr className="thead-tint">
                            {['Code', 'Class / Course', 'Equipment', 'Borrow Period', 'Purpose', 'Status', 'Actions'].map((h, i) => (
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
                        ) : items.map((item) => {
                            const Icon = item.icon || Projector;
                            const displayStatus = item.status;

                            return (
                                <tr
                                    key={item.original._id}
                                    className="transition-all duration-200 hover:bg-white/70 dark:hover:bg-white/5 group cursor-pointer"
                                    onClick={() => onViewDetail(item)}
                                >
                                    <td className="px-[2rem] py-[1.5rem]">
                                        <span className="text-[0.625rem] font-bold text-[#1E2B58] dark:text-slate-300">
                                            {item.id}
                                        </span>
                                    </td>
                                    <td className="px-[2rem] py-[1.5rem]">
                                        <p className="font-bold text-[#1E2B58] dark:text-white text-[0.875rem] leading-none mb-[0.25rem]">
                                            {item.course}
                                        </p>
                                        <p className="text-[0.625rem] text-slate-500 font-medium">
                                            {item.group}
                                        </p>
                                    </td>
                                    <td className="px-[2rem] py-[1.5rem]">
                                        <div className="flex items-center gap-[0.75rem]">
                                            <Icon className="w-[1.25rem] h-[1.25rem] text-slate-400 dark:text-slate-500" />
                                            <span className="font-bold text-[#1E2B58] dark:text-white text-[0.875rem]">
                                                {item.equipmentName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-[2rem] py-[1.5rem]">
                                        <span className="text-[0.75rem] font-bold text-[#1E2B58] dark:text-slate-300">
                                            {item.period}
                                        </span>
                                    </td>
                                    <td className="px-[2rem] py-[1.5rem]">
                                        <span className="text-[0.75rem] font-medium text-slate-600 dark:text-slate-400">
                                            {item.returnDate}
                                        </span>
                                    </td>
                                    <td className="px-[2rem] py-[1.5rem] text-center">
                                        <span className="inline-block">
                                            <StatusBadge status={displayStatus as any} />
                                        </span>
                                    </td>
                                    <td className="px-[2rem] py-[1.5rem] text-right">
                                        <div className="flex items-center justify-end gap-[0.25rem]">
                                            {item.original.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={e => { e.stopPropagation(); onEdit && onEdit(item); }}
                                                        className="p-[0.5rem] rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all hover:scale-110 active:scale-90"
                                                        title="Edit Request"
                                                    >
                                                        <span className="material-symbols-outlined text-[1.1rem] text-[#1E2B58] dark:text-blue-400">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={e => { e.stopPropagation(); onCancel && onCancel(item); }}
                                                        className="p-[0.5rem] rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-all hover:scale-110 active:scale-90"
                                                        title="Cancel Request"
                                                    >
                                                        <span className="material-symbols-outlined text-[1.1rem] text-red-500">delete_forever</span>
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={e => { e.stopPropagation(); onViewDetail(item); }}
                                                className="p-[0.5rem] rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition-all hover:scale-110 active:scale-90"
                                                title="View Details"
                                            >
                                                <Eye className="w-[1rem] h-[1rem] text-[#1E2B58] dark:text-slate-300" strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
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
                                    className={`w-[2rem] h-[2rem] rounded-full flex items-center justify-center font-bold text-[0.875rem] transition-colors ${currentPage === p
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
