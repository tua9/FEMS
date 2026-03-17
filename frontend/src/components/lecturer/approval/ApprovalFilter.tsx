import React from 'react';
import { Search, ListFilter, Download, X } from 'lucide-react';

export type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';
export type TypeFilter   = 'all' | 'laptop' | 'projector' | 'tablet' | 'camera' | 'audio' | 'other';

interface ApprovalFilterProps {
    searchText: string;
    onSearchChange: (val: string) => void;

    showPanel: boolean;
    onTogglePanel: () => void;

    statusFilter: StatusFilter;
    onStatusFilterChange: (val: StatusFilter) => void;

    typeFilter: TypeFilter;
    onTypeFilterChange: (val: TypeFilter) => void;

    onExportLog: () => void;

    resultCount: number;
    totalPending: number;
}

const STATUS_OPTS: { value: StatusFilter; label: string }[] = [
    { value: 'all',      label: 'All Requests' },
    { value: 'pending',  label: 'Pending'      },
    { value: 'approved', label: 'Approved'     },
    { value: 'rejected', label: 'Rejected'     },
];

const TYPE_OPTS: { value: TypeFilter; label: string }[] = [
    { value: 'all',       label: 'All Types'  },
    { value: 'laptop',    label: 'Laptop'     },
    { value: 'projector', label: 'Projector'  },
    { value: 'camera',    label: 'Camera'     },
    { value: 'tablet',    label: 'Tablet'     },
    { value: 'audio',     label: 'Audio'      },
    { value: 'other',     label: 'Other'      },
];

export const ApprovalFilter: React.FC<ApprovalFilterProps> = ({
    searchText, onSearchChange,
    showPanel, onTogglePanel,
    statusFilter, onStatusFilterChange,
    typeFilter, onTypeFilterChange,
    onExportLog,
    resultCount, totalPending,
}) => {
    const isFiltered = statusFilter !== 'all' || typeFilter !== 'all' || searchText !== '';

    return (
        <div className="mb-[2rem] md:mb-[3rem]">
            {/* Search bar row */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center dashboard-card rounded-3xl md:rounded-full pl-6 md:pl-8 pr-2 py-2 gap-4">
                {/* Search */}
                <div className="flex-1 flex items-center gap-[0.75rem] py-[0.5rem] md:py-0">
                    <Search className="w-[1.25rem] h-[1.25rem] text-[#1E2B58]/40 dark:text-white/40 shrink-0" />
                    <input
                        className="bg-transparent border-none focus:ring-0 w-full placeholder:text-[#1E2B58]/40 dark:placeholder:text-white/40 font-medium text-[#1E2B58] dark:text-white outline-none text-[0.875rem] md:text-[0.9375rem]"
                        placeholder="Search by student name, ID or asset..."
                        type="text"
                        value={searchText}
                        onChange={e => onSearchChange(e.target.value)}
                    />
                    {searchText && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="text-[#1E2B58]/40 dark:text-white/40 hover:text-[#1E2B58] dark:hover:text-white transition-colors shrink-0 text-lg leading-none pr-2"
                        >
                            ×
                        </button>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[0.5rem]">
                    <button
                        onClick={onTogglePanel}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-[0.5rem] rounded-full h-[3rem] px-[1.5rem] text-[0.875rem] font-bold transition-all ${
                            showPanel
                                ? 'bg-[#1E2B58] text-white shadow-md'
                                : 'bg-white dark:bg-slate-700/50 text-[#1E2B58] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm'
                        }`}
                    >
                        {showPanel ? <X className="w-[1.125rem] h-[1.125rem]" strokeWidth={2.5} /> : <ListFilter className="w-[1.125rem] h-[1.125rem]" strokeWidth={2.5} />}
                        Filters
                        {isFiltered && !showPanel && (
                            <span className="w-2 h-2 rounded-full bg-orange-500 ml-0.5" />
                        )}
                    </button>

                    <button
                        onClick={onExportLog}
                        className="flex items-center justify-center gap-2 bg-[#1E2B58] text-white px-[2rem] h-[3rem] rounded-full font-bold text-[0.875rem] transition hover:scale-105 active:scale-95 shadow-md shadow-[#1E2B58]/20 w-full sm:w-auto"
                    >
                        <Download className="w-4 h-4" strokeWidth={2.5} />
                        Export Log
                    </button>
                </div>
            </div>

            {/* Filter panel */}
            {showPanel && (
                <div className="mt-3 dashboard-card rounded-3xl p-5 md:p-6 flex flex-col gap-5 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Status filter */}
                    <div className="flex flex-col gap-2.5">
                        <p className="text-[0.625rem] font-black uppercase tracking-[0.2em] text-[#1E2B58]/50 dark:text-white/40">
                            Status
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {STATUS_OPTS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => onStatusFilterChange(opt.value)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
                                        statusFilter === opt.value
                                            ? 'bg-[#1E2B58] text-white shadow-md shadow-[#1E2B58]/20'
                                            : 'bg-white/50 dark:bg-slate-800/50 text-[#1E2B58] dark:text-white border border-[#1E2B58]/10 dark:border-white/10 hover:bg-white/80 dark:hover:bg-slate-700/50'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Equipment type filter */}
                    <div className="flex flex-col gap-2.5">
                        <p className="text-[0.625rem] font-black uppercase tracking-[0.2em] text-[#1E2B58]/50 dark:text-white/40">
                            Equipment Type
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {TYPE_OPTS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => onTypeFilterChange(opt.value)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
                                        typeFilter === opt.value
                                            ? 'bg-[#1E2B58] text-white shadow-md shadow-[#1E2B58]/20'
                                            : 'bg-white/50 dark:bg-slate-800/50 text-[#1E2B58] dark:text-white border border-[#1E2B58]/10 dark:border-white/10 hover:bg-white/80 dark:hover:bg-slate-700/50'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Result count */}
                    <p className="text-xs font-semibold text-[#1E2B58]/50 dark:text-white/40">
                        Showing <span className="font-black text-[#1E2B58] dark:text-white">{resultCount}</span> of {totalPending} pending requests
                    </p>
                </div>
            )}
        </div>
    );
};
