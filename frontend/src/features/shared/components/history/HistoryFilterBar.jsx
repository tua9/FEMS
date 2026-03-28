import { Calendar, ChevronDown, Download, Filter, ListFilter, Search, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const DATE_OPTIONS = ['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'Last Year', 'All Time'];

export const HistoryFilterBar = ({
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
  const [dateOpen, setDateOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [applied, setApplied] = useState(false);

  const dateRef = useRef(null);
  const statusRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dateRef.current && !dateRef.current.contains(e.target)) setDateOpen(false);
      if (statusRef.current && !statusRef.current.contains(e.target)) setStatusOpen(false);
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
    <div className="relative z-20 dashboard-card rounded-[1.5rem] xl:rounded-full mb-[2rem] overflow-visible">

      {/* ── Search row ── */}
      <div className="flex items-center gap-3 px-5 xl:px-8 py-3 xl:py-0 xl:h-[4rem] border-b xl:border-b-0 border-slate-100 dark:border-slate-700/60">
        <Search className="w-5 h-5 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="bg-transparent border-none focus:ring-0 w-full placeholder:text-slate-400 font-medium text-[#1E2B58] dark:text-white outline-none text-[0.875rem]"
        />
        {searchTerm && (
          <button onClick={() => onSearchChange('')} className="shrink-0 hover:opacity-70 transition">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      {/* ── Filter controls row ── */}
      <div className="flex flex-wrap items-center gap-x-0 gap-y-0 px-5 xl:px-8 py-3 xl:py-0 xl:h-[3.5rem] xl:border-t border-slate-100 dark:border-slate-700/60">

        {/* Date dropdown */}
        <div ref={dateRef} className="relative flex-1 min-w-[140px]">
          <button
            type="button"
            onClick={() => { setDateOpen(p => !p); setStatusOpen(false); }}
            className="flex items-center gap-2 w-full py-2 text-[0.875rem] font-bold text-[#1E2B58] dark:text-white transition-opacity hover:opacity-70"
          >
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{dateFilter}</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 ml-auto transition-transform duration-200 ${dateOpen ? 'rotate-180' : ''}`} />
          </button>
          {dateOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-[#1E2B58]/10 dark:border-white/10 rounded-[1rem] shadow-xl shadow-[#1E2B58]/10 z-40 overflow-hidden min-w-[10rem]">
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

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-3 hidden sm:block" />

        {/* Status/Severity dropdown */}
        <div ref={statusRef} className="relative flex-1 min-w-[140px]">
          <button
            type="button"
            onClick={() => { setStatusOpen(p => !p); setDateOpen(false); }}
            className="flex items-center gap-2 w-full py-2 text-[0.875rem] font-bold text-[#1E2B58] dark:text-white transition-opacity hover:opacity-70"
          >
            <ListFilter className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{filterLabel}: {statusFilter}</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 ml-auto transition-transform duration-200 ${statusOpen ? 'rotate-180' : ''}`} />
          </button>
          {statusOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-[#1E2B58]/10 dark:border-white/10 rounded-[1rem] shadow-xl shadow-[#1E2B58]/10 z-40 overflow-hidden min-w-[9rem]">
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

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0 ml-auto pl-3">
          <button
            onClick={onExportCsv}
            title="Export to CSV"
            className="h-10 px-3 rounded-full border border-[#1E2B58]/15 dark:border-white/15 text-[#1E2B58]/70 dark:text-white/60 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            <Download className="w-4 h-4" />
          </button>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              title="Clear all filters"
              className="h-10 px-3 rounded-full border border-red-300 dark:border-red-800/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleApply}
            className={`h-10 px-5 rounded-full font-bold text-[0.875rem] transition-all hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2 shrink-0 ${
              applied
                ? 'bg-emerald-500 text-white shadow-emerald-400/30'
                : 'bg-[#1E2B58] text-white shadow-[#1E2B58]/20'
            }`}
          >
            {applied ? (
              <>✓ Applied</>
            ) : (
              <><Filter className="w-4 h-4" fill="currentColor" /> Apply</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
