import { Calendar, ChevronDown, Download, Filter, ListFilter, Search, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const DATE_OPTIONS = ['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'Last Year', 'All Time'];

interface HistoryFilterBarProps {
    searchPlaceholder: string;
    searchTerm: string;
    onSearchChange: (v: string) => void;
    dateFilter: string;
    onDateFilterChange: (v: string) => void;
    filterLabel: string;
    filterOptions: string[];          // e.g. ['All','Critical','High','Medium','Low']
    statusFilter: string;
    onStatusFilterChange: (v: string) => void;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
    onExportCsv: () => void;
}

export const HistoryFilterBar: React.FC<HistoryFilterBarProps> = ({
    searchPlaceholder,
    searchTerm,
    onSearchChange,
    dateFilter,
    onDateFilterChange,
    filterLabel,
    filterOptions,
    statusFilter,
    onStatusFilterChange,
    hasActiveFilters,
    onClearFilters,
    onExportCsv,
}) => {
    const [dateOpen,   setDateOpen]   = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [applied,    setApplied]    = useState(false);

    const dateRef   = useRef<HTMLDivElement>(null);
    const statusRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dateRef.current   && !dateRef.current.contains(e.target as Node))   setDateOpen(false);
            if (statusRef.current && !statusRef.current.contains(e.target as Node)) setStatusOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleApply = () => {
        setDateOpen(false);
        setStatusOpen(false);
        setApplied(true);
        setTimeout(() => setApplied(false), 1200);
    };

    return (
        <div className="relative z-20 flex flex-col xl:flex-row items-stretch xl:items-center dashboard-card rounded-[1.5rem] xl:rounded-full pl-[1.5rem] xl:pl-[2rem] pr-[0.5rem] py-[0.5rem] gap-[1rem] mb-[2rem]">

            {/* Search */}
            <div className="flex-1 flex items-center gap-[0.75rem] py-[0.5rem] xl:py-0 border-b xl:border-b-0 border-slate-200 dark:border-slate-700">
                <Search className="w-[1.25rem] h-[1.25rem] text-slate-400 shrink-0" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={e => onSearchChange(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="bg-transparent border-none focus:ring-0 w-full placeholder:text-slate-400 font-medium text-[#1E2B58] dark:text-white outline-none text-[0.875rem] md:text-[0.9375rem]"
                />
                {searchTerm && (
                    <button onClick={() => onSearchChange('')} className="shrink-0 hover:opacity-70 transition">
                        <X className="w-4 h-4 text-slate-400" />
                    </button>
                )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[1rem] sm:gap-[1.5rem] xl:pl-[1.5rem] border-l-0 xl:border-l border-slate-200 dark:border-slate-700">

                {/* ── Date dropdown ──────────────────────────────────────── */}
                <div ref={dateRef} className="relative flex-1 sm:flex-none">
                    <button
                        type="button"
                        onClick={() => { setDateOpen(p => !p); setStatusOpen(false); }}
                        className="flex items-center justify-between w-full sm:w-auto gap-[0.75rem] py-[0.5rem] text-[0.875rem] font-bold text-[#1E2B58] dark:text-white transition-opacity hover:opacity-70"
                    >
                        <div className="flex items-center gap-[0.5rem]">
                            <Calendar className="w-[1rem] h-[1rem] text-slate-400" />
                            <span>{dateFilter}</span>
                        </div>
                        <ChevronDown className={`w-[1rem] h-[1rem] text-slate-400 transition-transform duration-200 ${dateOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {dateOpen && (
                        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-slate-800 border border-[#1E2B58]/10 dark:border-white/10 rounded-[1rem] shadow-xl shadow-[#1E2B58]/10 z-40 overflow-hidden min-w-[10rem]">
                            {DATE_OPTIONS.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => { onDateFilterChange(opt); setDateOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-[0.8125rem] font-bold transition-colors ${
                                        dateFilter === opt
                                            ? 'bg-[#1E2B58] text-white'
                                            : 'text-[#1E2B58] dark:text-white hover:bg-[#1E2B58]/5 dark:hover:bg-white/5'
                                    }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Status/Severity dropdown ───────────────────────────── */}
                <div ref={statusRef} className="relative flex-1 sm:flex-none">
                    <button
                        type="button"
                        onClick={() => { setStatusOpen(p => !p); setDateOpen(false); }}
                        className="flex items-center justify-between w-full sm:w-auto gap-[0.75rem] py-[0.5rem] text-[0.875rem] font-bold text-[#1E2B58] dark:text-white transition-opacity hover:opacity-70 border-l-0 sm:border-l border-slate-200 dark:border-slate-700 sm:pl-[1.5rem]"
                    >
                        <div className="flex items-center gap-[0.5rem]">
                            <ListFilter className="w-[1rem] h-[1rem] text-slate-400" />
                            <span>{filterLabel}: {statusFilter}</span>
                        </div>
                        <ChevronDown className={`w-[1rem] h-[1rem] text-slate-400 transition-transform duration-200 ${statusOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {statusOpen && (
                        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-slate-800 border border-[#1E2B58]/10 dark:border-white/10 rounded-[1rem] shadow-xl shadow-[#1E2B58]/10 z-40 overflow-hidden min-w-[9rem]">
                            {filterOptions.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => { onStatusFilterChange(opt); setStatusOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-[0.8125rem] font-bold transition-colors ${
                                        statusFilter === opt
                                            ? 'bg-[#1E2B58] text-white'
                                            : 'text-[#1E2B58] dark:text-white hover:bg-[#1E2B58]/5 dark:hover:bg-white/5'
                                    }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Action buttons ──────────────────────────────────────── */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* Export CSV */}
                    <button
                        onClick={onExportCsv}
                        title="Export to CSV"
                        className="h-[3rem] px-3 rounded-full border border-[#1E2B58]/15 dark:border-white/15 text-[#1E2B58]/70 dark:text-white/60 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                    >
                        <Download className="w-4 h-4" />
                    </button>

                    {/* Clear filters */}
                    {hasActiveFilters && (
                        <button
                            onClick={onClearFilters}
                            title="Clear all filters"
                            className="h-[3rem] px-3 rounded-full border border-red-300 dark:border-red-800/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}

                    {/* Apply */}
                    <button
                        onClick={handleApply}
                        className={`h-[3rem] px-[1.75rem] rounded-full font-bold text-[0.875rem] transition-all hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-[0.5rem] shrink-0 ${
                            applied
                                ? 'bg-emerald-500 text-white shadow-emerald-400/30'
                                : 'bg-[#1E2B58] text-white shadow-[#1E2B58]/20'
                        }`}
                    >
                        {applied ? (
                            <>✓ Applied</>
                        ) : (
                            <><Filter className="w-[1rem] h-[1rem]" fill="currentColor" /> Apply</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
