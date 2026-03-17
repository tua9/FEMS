import { Armchair, ChevronLeft, ChevronRight, Computer, Droplets, Eye, Lightbulb, Wind, Zap } from 'lucide-react';
import React from 'react';
import { StatusBadge } from '@/components/shared/ui/StatusBadge';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ReportSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ReportStatus   = 'RESOLVED' | 'IN PROGRESS' | 'PENDING';

export interface ReportHistoryItem {
    id:          string;
    date:        string;
    category:    string;
    icon:        React.ElementType;
    location:    string;
    block:       string;
    severity:    ReportSeverity;
    status:      ReportStatus;
    description?: string;
    img?:        string;
}

// ─── Mock data (exported for use in parent) ───────────────────────────────────

export const ALL_REPORT_HISTORY: ReportHistoryItem[] = [
    { id: '#REP-2024-102', date: 'Oct 25, 2023', category: 'Electrical', icon: Zap,      location: 'Room 405',      block: 'Block A',      severity: 'CRITICAL', status: 'RESOLVED'    },
    { id: '#REP-2024-098', date: 'Oct 24, 2023', category: 'IT Device',  icon: Computer, location: 'Lab 3',         block: 'West Wing',    severity: 'HIGH',     status: 'IN PROGRESS' },
    { id: '#REP-2024-095', date: 'Oct 22, 2023', category: 'HVAC',       icon: Wind,     location: 'Hall 2',        block: 'Main Complex', severity: 'MEDIUM',   status: 'PENDING'     },
    { id: '#REP-2024-089', date: 'Oct 20, 2023', category: 'Furniture',  icon: Armchair, location: 'Room 102',      block: 'Block B',      severity: 'LOW',      status: 'RESOLVED'    },
    { id: '#REP-2024-082', date: 'Oct 18, 2023', category: 'IT Device',  icon: Computer, location: 'Lab 1',         block: 'Block A',      severity: 'HIGH',     status: 'RESOLVED'    },
    { id: '#REP-2024-075', date: 'Oct 15, 2023', category: 'Lighting',   icon: Lightbulb,location: 'Faculty Office', block: 'Level 4',     severity: 'LOW',      status: 'RESOLVED'    },
    { id: '#REP-2024-068', date: 'Oct 12, 2023', category: 'Electrical', icon: Zap,      location: 'Server Room',   block: 'Block B2',     severity: 'CRITICAL', status: 'RESOLVED'    },
    { id: '#REP-2024-061', date: 'Oct 10, 2023', category: 'IT Device',  icon: Computer, location: 'Lab 5',         block: 'East Wing',    severity: 'HIGH',     status: 'RESOLVED'    },
    { id: '#REP-2024-055', date: 'Oct 07, 2023', category: 'Plumbing',   icon: Droplets, location: 'Restroom B1',   block: 'Block C',      severity: 'MEDIUM',   status: 'RESOLVED'    },
];

// ─── Severity style helper ────────────────────────────────────────────────────

const SEVERITY_CLASSES: Record<ReportSeverity, string> = {
    CRITICAL: 'text-red-600 bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-400',
    HIGH:     'text-orange-600 bg-orange-100 border-orange-200 dark:bg-orange-900/30 dark:border-orange-800/50 dark:text-orange-400',
    MEDIUM:   'text-yellow-600 bg-yellow-100 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800/50 dark:text-yellow-400',
    LOW:      'text-blue-600 bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800/50 dark:text-blue-400',
};

// ─── Pagination range ─────────────────────────────────────────────────────────

function pageRange(current: number, total: number): (number | '...')[] {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 3) return [1, 2, 3, '...', total];
    if (current >= total - 2) return [1, '...', total - 2, total - 1, total];
    return [1, '...', current - 1, current, current + 1, '...', total];
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ReportHistoryTableProps {
    items:         ReportHistoryItem[];
    currentPage:   number;
    totalPages:    number;
    totalItems:    number;
    onPageChange:  (page: number) => void;
    onViewDetail:  (item: ReportHistoryItem) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ReportHistoryTable: React.FC<ReportHistoryTableProps> = ({
    items, currentPage, totalPages, totalItems, onPageChange, onViewDetail,
}) => {
    const showing = items.length;

    return (
        <div className="glass-card bg-white/60 dark:bg-slate-900/40 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-[0_10px_30px_-5px_rgba(30,43,88,0.1)] mb-[4rem] border border-white dark:border-white/10">
            <div className="overflow-x-auto hide-scrollbar">
                <table className="w-full border-collapse min-w-[1000px]">
                    <thead>
                        <tr className="thead-tint">
                            {['Report ID', 'Date Reported', 'Category', 'Location', 'Severity', 'Status', 'Actions'].map((h, i) => (
                                <th key={h} className={`px-[2rem] py-[1.5rem] text-[0.625rem] font-black uppercase tracking-[0.2em] text-[#1E2B58]/50 dark:text-slate-400 ${i === 4 || i === 5 ? 'text-center' : i === 6 ? 'text-right' : 'text-left'}`}>
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
                        ) : items.map(item => {
                            const Icon = item.icon;
                            return (
                                <tr
                                    key={item.id}
                                    className="transition-all duration-200 hover:bg-white/70 dark:hover:bg-white/5 group cursor-pointer"
                                    onClick={() => onViewDetail(item)}
                                >
                                    <td className="px-[2rem] py-[1.5rem]">
                                        <span className="text-[0.625rem] font-bold text-[#1E2B58] dark:text-slate-300">{item.id}</span>
                                    </td>
                                    <td className="px-[2rem] py-[1.5rem]">
                                        <span className="text-[0.875rem] font-bold text-[#1E2B58] dark:text-white">{item.date}</span>
                                    </td>
                                    <td className="px-[2rem] py-[1.5rem]">
                                        <div className="flex items-center gap-[0.75rem]">
                                            <Icon className="w-[1.25rem] h-[1.25rem] text-slate-400 dark:text-slate-500" strokeWidth={2} />
                                            <span className="font-bold text-[#1E2B58] dark:text-white text-[0.875rem]">{item.category}</span>
                                        </div>
                                    </td>
                                    <td className="px-[2rem] py-[1.5rem]">
                                        <p className="font-bold text-[#1E2B58] dark:text-white text-[0.875rem] leading-none mb-[0.25rem]">{item.location}</p>
                                        <p className="text-[0.625rem] text-slate-500 font-medium">{item.block}</p>
                                    </td>
                                    <td className="px-[2rem] py-[1.5rem] text-center">
                                        <span className={`inline-block min-w-[5.5rem] text-center text-[0.625rem] font-bold px-[0.75rem] py-[0.25rem] rounded-[0.5rem] border uppercase tracking-wider leading-none ${SEVERITY_CLASSES[item.severity]}`}>
                                            {item.severity}
                                        </span>
                                    </td>
                                    <td className="px-[2rem] py-[1.5rem] text-center">
                                        <span className="inline-block">
                                            <StatusBadge status={item.status} />
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
                    Showing {showing} of {totalItems} record{totalItems !== 1 ? 's' : ''}
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
                                <span key={`dots-${i}`} className="text-[0.875rem] text-slate-400 mx-[0.25rem]">…</span>
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
