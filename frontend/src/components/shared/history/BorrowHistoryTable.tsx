import { AlertTriangle, Cable, ChevronLeft, ChevronRight, Eye, Laptop, Mic, Microchip, Projector, Router } from 'lucide-react';
import React from 'react';
import { StatusBadge } from '@/components/shared/ui/StatusBadge';
import type { BorrowRequest } from '@/types/borrowRequest';

export type BorrowStatus = "Returned" | "Overdue" | "Borrowed" | "Pending" | "Approved" | "Rejected" | "Cancelled";
export interface BorrowHistoryItem { id: string; room: string; roomType: string; category: string; equipment: string; date: string; returnDate: string; status: string; icon?: any; course?: string; group?: string; equipmentName?: string; period?: string; }
export const ALL_BORROW_HISTORY: BorrowHistoryItem[] = [];

// ─── Pagination helper ────────────────────────────────────────────────────────

function pageRange(current: number, total: number): (number | '...')[] {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 3) return [1, 2, 3, '...', total];
    if (current >= total - 2) return [1, '...', total - 2, total - 1, total];
    return [1, '...', current - 1, current, current + 1, '...', total];
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface BorrowHistoryTableProps {
    items:        BorrowRequest[];
    currentPage:  number;
    totalPages:   number;
    totalItems:   number;
    onPageChange: (page: number) => void;
    onViewDetail: (item: BorrowRequest) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const BorrowHistoryTable: React.FC<BorrowHistoryTableProps> = ({
    items, currentPage, totalPages, totalItems, onPageChange, onViewDetail,
}) => {
    // Helper function to map category to an icon
    const getIcon = (category?: string) => {
        if (!category) return Projector;
        const normalized = category.toLowerCase();
        if (normalized.includes('laptop') || normalized.includes('computer')) return Laptop;
        if (normalized.includes('cable')) return Cable;
        if (normalized.includes('network') || normalized.includes('router')) return Router;
        if (normalized.includes('audio') || normalized.includes('mic')) return Mic;
        if (normalized.includes('component') || normalized.includes('kit')) return Microchip;
        return Projector;
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    return (
        <div className="glass-card bg-white/60 dark:bg-slate-900/40 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-[0_10px_30px_-5px_rgba(30,43,88,0.1)] mb-[4rem] border border-white dark:border-white/10">
            <div className="overflow-x-auto hide-scrollbar">
                <table className="w-full border-collapse min-w-[1000px]">
                    <thead>
                        <tr className="thead-tint">
                            {['Request ID', 'Course / Class', 'Equipment', 'Borrow Date', 'Return Date', 'Status', 'Actions'].map((h, i) => (
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
                        ) : items.map((item: BorrowRequest) => {
                            const equipment = item.equipment_id && typeof item.equipment_id !== 'string' ? item.equipment_id : null;
                            const room = item.room_id && typeof item.room_id !== 'string' ? item.room_id : null;
                            const Icon = getIcon(equipment?.category);
                            
                            const isOverdue = item.status === 'approved' && new Date(item.return_date) < new Date();
                            const displayStatus = isOverdue ? 'overdue' : item.status;

                            return (
                                <tr
                                    key={item._id}
                                    className="transition-all duration-200 hover:bg-white/70 dark:hover:bg-white/5 group cursor-pointer"
                                    onClick={() => onViewDetail(item)}
                                >
                                    <td className="px-[2rem] py-[1.5rem]">
                                        <span className="text-[0.625rem] font-bold text-[#1E2B58] dark:text-slate-300">
                                            #{item._id.substring(item._id.length - 6).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-[2rem] py-[1.5rem]">
                                        <p className="font-bold text-[#1E2B58] dark:text-white text-[0.875rem] leading-none mb-[0.25rem]">
                                            {room ? room.name : 'Unknown Room'}
                                        </p>
                                        <p className="text-[0.625rem] text-slate-500 font-medium">
                                            {room ? room.type : ''}
                                        </p>
                                    </td>
                                    <td className="px-[2rem] py-[1.5rem]">
                                        <div className="flex items-center gap-[0.75rem]">
                                            <Icon className="w-[1.25rem] h-[1.25rem] text-slate-400 dark:text-slate-500" />
                                            <span className="font-bold text-[#1E2B58] dark:text-white text-[0.875rem]">
                                                {equipment ? equipment.name : 'Infrastructure'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-[2rem] py-[1.5rem]">
                                        <span className="text-[0.75rem] font-bold text-[#1E2B58] dark:text-slate-300">
                                            {formatDate(item.borrow_date)}
                                        </span>
                                    </td>
                                    <td className="px-[2rem] py-[1.5rem]">
                                        <span className={`text-[0.75rem] font-medium ${isOverdue ? 'text-red-500 font-bold flex items-center gap-1' : 'text-slate-600 dark:text-slate-400'}`}>
                                            {isOverdue && <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
                                            {item.status === 'returned' || item.status === 'handed_over' ? formatDate(item.updatedAt || item.return_date) : formatDate(item.return_date)}
                                        </span>
                                    </td>
                                    <td className="px-[2rem] py-[1.5rem] text-center">
                                        <span className="inline-block">
                                            <StatusBadge status={displayStatus} />
                                        </span>
                                    </td>
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
