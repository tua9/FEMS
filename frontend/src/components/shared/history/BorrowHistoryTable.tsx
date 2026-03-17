import { Ban, Cable, ChevronLeft, ChevronRight, Eye, Laptop, Mic, Microchip, Projector, Router } from 'lucide-react';
import React from 'react';
import { StatusBadge } from '@/components/shared/ui/StatusBadge';
import type { BorrowRequest } from '@/types/borrowRequest';
import { formatDisplayDate } from '@/utils/dateUtils';

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
}

// ─── Mock data ────────────────────────────────────────────────────────────────

export const ALL_BORROW_HISTORY: BorrowHistoryItem[] = [
    { id: '#REQ-2024-892', course: 'CS-405 Adv. AI', group: 'Group A', equipmentName: 'MacBook Pro 16" (x2)', icon: Laptop, period: 'Oct 24, 09:00–12:00', returnDate: 'Oct 24, 2023', status: 'RETURNED' },
    { id: '#REQ-2024-885', course: 'ENG-101 Basics', group: 'Lab 3', equipmentName: 'HDMI Cables (x5)', icon: Cable, period: 'Oct 22, 14:00–16:00', returnDate: '-', status: 'BORROWED' },
    { id: '#REQ-2024-870', course: 'CS-302 Networks', group: 'Lab 1', equipmentName: 'Cisco Router', icon: Router, period: 'Oct 20, 10:00–11:30', returnDate: '-', status: 'OVERDUE' },
    { id: '#REQ-2024-865', course: 'PHY-201 Quantum', group: 'Lecture Hall', equipmentName: 'Projector 4K', icon: Projector, period: 'Oct 18, 13:00–15:00', returnDate: 'Oct 18, 2023', status: 'RETURNED' },
    { id: '#REQ-2024-850', course: 'CS-405 Adv. AI', group: 'Group B', equipmentName: 'Raspberry Pi Kit', icon: Microchip, period: 'Oct 15, 09:00–17:00', returnDate: 'Oct 15, 2023', status: 'RETURNED' },
    { id: '#REQ-2024-842', course: 'MAT-101 Algebra', group: 'Room 204', equipmentName: 'Wireless Mic Set', icon: Mic, period: 'Oct 12, 08:30–10:30', returnDate: 'Oct 12, 2023', status: 'RETURNED' },
    { id: '#REQ-2024-835', course: 'CS-302 Networks', group: 'Group C', equipmentName: 'Network Switch', icon: Router, period: 'Oct 10, 09:00–11:00', returnDate: 'Oct 10, 2023', status: 'RETURNED' },
    { id: '#REQ-2024-821', course: 'PHY-201 Quantum', group: 'Lab 2', equipmentName: 'Oscilloscope', icon: Microchip, period: 'Oct 08, 13:00–16:00', returnDate: 'Oct 08, 2023', status: 'RETURNED' },
    { id: '#REQ-2024-810', course: 'ENG-101 Basics', group: 'Room 301', equipmentName: 'USB Webcam', icon: Laptop, period: 'Oct 05, 10:00–12:00', returnDate: 'Oct 05, 2023', status: 'RETURNED' },
];

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
    onViewDetail: (item: BorrowRequest) => void;
    onCancel?: (item: BorrowRequest) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const BorrowHistoryTable: React.FC<BorrowHistoryTableProps> = ({
    items, currentPage, totalPages, totalItems, onPageChange, onViewDetail, onCancel,
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


    return (
        <div className="dashboard-card rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden mb-[4rem]">
            <div className="overflow-x-auto hide-scrollbar">
                <table className="w-full border-collapse min-w-[1000px]">
                    <thead>
                        <tr className="thead-tint">
                            {['Asset ID', 'Class / Course', 'Equipment', 'Borrow Period', 'Purpose', 'Status', 'Actions'].map((h, i) => (
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
                                            {formatDisplayDate(item.borrow_date)}
                                        </span>
                                    </td>
                                    <td className="px-[2rem] py-[1.5rem]">
                                        <span className="text-[0.75rem] font-medium text-slate-600 dark:text-slate-400">
                                            {item.returnDate}
                                        </span>
                                    </td>
                                    <td className="px-[2rem] py-[1.5rem] text-center">
                                        <span className="inline-block">
                                            <StatusBadge status={displayStatus} />
                                        </span>
                                    </td>
                                    <td className="px-[2rem] py-[1.5rem] text-right">
                                        <div className="flex items-center justify-end gap-[0.25rem]">
                                            {item.status === 'pending' && onCancel && (
                                                <button
                                                    onClick={e => { e.stopPropagation(); onCancel(item); }}
                                                    className="p-[0.5rem] rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-all hover:scale-110 active:scale-90"
                                                    title="Cancel Request"
                                                >
                                                    <Ban className="w-[1rem] h-[1rem] text-red-400 dark:text-red-400" strokeWidth={2.5} />
                                                </button>
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
