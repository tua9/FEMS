import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MOCK_TICKETS } from '@/data/technician/mockTickets';

// ─── Filter options ──────────────────────────────────────────────────────────
type FilterMode = 'preset' | 'day' | 'month' | 'year';

interface Preset {
  label: string;
  days: number;
}

const PRESETS: Preset[] = [
  { label: 'Last 7 Days',  days: 7   },
  { label: 'Last 30 Days', days: 30  },
  { label: 'Last 90 Days', days: 90  },
  { label: 'This Month',   days: 0   },   // days=0 → special logic
  { label: 'This Year',    days: -1  },   // days=-1 → special logic
];

// ─── Date helpers ────────────────────────────────────────────────────────────
const today = () => new Date();

function filterByPreset(days: number): (iso: string) => boolean {
  const now = today();
  if (days === 0) {
    // This Month
    return (iso) => {
      const d = new Date(iso);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    };
  }
  if (days === -1) {
    // This Year
    return (iso) => new Date(iso).getFullYear() === now.getFullYear();
  }
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);
  return (iso) => new Date(iso) >= cutoff;
}

function filterByDay(dateStr: string): (iso: string) => boolean {
  return (iso) => iso.slice(0, 10) === dateStr;
}

function filterByMonth(year: number, month: number): (iso: string) => boolean {
  return (iso) => {
    const d = new Date(iso);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  };
}

function filterByYear(year: number): (iso: string) => boolean {
  return (iso) => new Date(iso).getFullYear() === year;
}

// ─── Component ───────────────────────────────────────────────────────────────
const TicketPipeline: React.FC = () => {
  const [dropdownOpen, setDropdownOpen]   = useState(false);
  const [activePreset, setActivePreset]   = useState<Preset>(PRESETS[0]);
  const [mode, setMode]                   = useState<FilterMode>('preset');

  // custom inputs
  const now = today();
  const [customDay,   setCustomDay]   = useState(now.toISOString().slice(0, 10));
  const [customMonth, setCustomMonth] = useState(now.getMonth() + 1);
  const [customYear,  setCustomYear]  = useState(now.getFullYear());
  const [customMonthYear, setCustomMonthYear] = useState(now.getFullYear());

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Build the predicate based on current mode
  const predicate = useMemo(() => {
    if (mode === 'day')   return filterByDay(customDay);
    if (mode === 'month') return filterByMonth(customMonthYear, customMonth);
    if (mode === 'year')  return filterByYear(customYear);
    return filterByPreset(activePreset.days);
  }, [mode, activePreset, customDay, customMonth, customMonthYear, customYear]);

  // Compute pipeline counts
  const filtered = useMemo(
    () => MOCK_TICKETS.filter((t) => predicate(t.createdAt)),
    [predicate],
  );

  const newReports = filtered.length;
  const assigned   = filtered.filter((t) => t.status !== 'Pending').length;
  const resolved   = filtered.filter((t) => t.status === 'Completed').length;
  const maxVal     = Math.max(newReports, 1);

  const pipelines = [
    { label: 'New Reports', value: newReports, pct: 100,                            color: 'bg-[#1A2B56] dark:bg-[#3a5298]' },
    { label: 'Assigned',    value: assigned,   pct: Math.round((assigned / maxVal) * 100),   color: 'bg-blue-400' },
    { label: 'Resolved',    value: resolved,   pct: Math.round((resolved / maxVal) * 100),   color: 'bg-blue-200 dark:bg-blue-300' },
  ];

  // Current filter label for the button
  const buttonLabel = (() => {
    if (mode === 'day')   return customDay;
    if (mode === 'month') return `${String(customMonth).padStart(2,'0')}/${customMonthYear}`;
    if (mode === 'year')  return String(customYear);
    return activePreset.label;
  })();

  const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const YEAR_RANGE  = Array.from({ length: 6 }, (_, i) => now.getFullYear() - 5 + i);

  return (
    <div className="glass-card p-8 rounded-3xl shadow-sm h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-sm font-bold text-[#1A2B56] dark:text-white uppercase tracking-widest">
          Ticket Pipeline
        </h3>

        {/* Filter dropdown trigger */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="text-[10px] font-bold text-slate-400 hover:text-[#1A2B56] dark:hover:text-white flex items-center gap-1 transition-colors uppercase tracking-wider"
          >
            {buttonLabel}
            <span className={`material-symbols-outlined text-xs transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>

          {/* Dropdown panel */}
          {dropdownOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-64 rounded-2xl z-50 overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.72)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.55)',
                boxShadow: '0 4px 24px rgba(26, 43, 86, 0.10), 0 1.5px 6px rgba(26, 43, 86, 0.07), inset 0 1px 0 rgba(255,255,255,0.80)',
              }}
            >
              {/* Tabs: Preset / Day / Month / Year */}
              <div className="flex border-b border-white/40 dark:border-white/10">
                {(['preset','day','month','year'] as FilterMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2.5 text-[10px] font-extrabold uppercase tracking-wider transition-colors ${
                      mode === m
                        ? 'text-[#1A2B56] dark:text-blue-200 border-b-2 border-[#1A2B56] dark:border-blue-300'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {m === 'preset' ? 'Quick' : m}
                  </button>
                ))}
              </div>

              <div className="p-3">
                {/* ── Preset tab ── */}
                {mode === 'preset' && (
                  <div className="space-y-0.5">
                    {PRESETS.map((p) => (
                      <button
                        key={p.label}
                        onClick={() => { setActivePreset(p); setDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          activePreset.label === p.label
                            ? 'bg-[#1A2B56]/90 text-white shadow-sm'
                            : 'text-slate-700 hover:bg-white/60'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* ── Day tab ── */}
                {mode === 'day' && (
                  <div className="space-y-3 p-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pick a date</p>
                    <input
                      type="date"
                      value={customDay}
                      max={now.toISOString().slice(0, 10)}
                      onChange={(e) => setCustomDay(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-white/50 bg-white/50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1A2B56]/20 backdrop-blur-sm"
                    />
                    <button
                      onClick={() => setDropdownOpen(false)}
                      className="w-full py-2 bg-[#1A2B56]/90 text-white rounded-xl text-xs font-bold hover:bg-[#1A2B56] transition-all shadow-sm"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {/* ── Month tab ── */}
                {mode === 'month' && (
                  <div className="space-y-3 p-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pick a month</p>
                    {/* Year selector */}
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => setCustomMonthYear((y) => y - 1)}
                        className="w-7 h-7 rounded-lg bg-white/50 flex items-center justify-center hover:bg-white/80 transition-all text-slate-600"
                      >
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                      </button>
                      <span className="text-sm font-extrabold text-slate-700">{customMonthYear}</span>
                      <button
                        onClick={() => setCustomMonthYear((y) => Math.min(y + 1, now.getFullYear()))}
                        className="w-7 h-7 rounded-lg bg-white/50 flex items-center justify-center hover:bg-white/80 transition-all text-slate-600"
                      >
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </button>
                    </div>
                    {/* Month grid */}
                    <div className="grid grid-cols-4 gap-1">
                      {MONTH_NAMES.map((name, idx) => {
                        const m = idx + 1;
                        const isFuture = customMonthYear === now.getFullYear() && m > now.getMonth() + 1;
                        const isSelected = customMonth === m;
                        return (
                          <button
                            key={name}
                            disabled={isFuture}
                            onClick={() => { setCustomMonth(m); setDropdownOpen(false); }}
                            className={`py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                              isSelected
                                ? 'bg-[#1A2B56]/90 text-white shadow-sm'
                                : isFuture
                                  ? 'text-slate-300 cursor-not-allowed'
                                  : 'text-slate-600 hover:bg-white/60'
                            }`}
                          >
                            {name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── Year tab ── */}
                {mode === 'year' && (
                  <div className="space-y-2 p-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pick a year</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {YEAR_RANGE.map((yr) => (
                        <button
                          key={yr}
                          onClick={() => { setCustomYear(yr); setDropdownOpen(false); }}
                          className={`py-2 rounded-xl text-xs font-bold transition-all ${
                            customYear === yr
                              ? 'bg-[#1A2B56]/90 text-white shadow-sm'
                              : 'text-slate-600 hover:bg-white/60'
                          }`}
                        >
                          {yr}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bars */}
      <div className="space-y-6">
        {pipelines.map((item) => (
          <div key={item.label} className="flex items-center gap-4">
            <div className="w-24 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              {item.label}
            </div>
            <div className="flex-1 h-8 bg-white/30 dark:bg-white/10 rounded-full relative overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full ${item.color} rounded-full transition-all duration-700`}
                style={{ width: `${item.pct}%` }}
              />
            </div>
            <div className="w-8 text-[10px] font-bold text-[#1A2B56] dark:text-white shrink-0 text-right">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Footer: count summary */}
      <p className="mt-8 text-[10px] text-slate-400 font-semibold text-right uppercase tracking-wider">
        {newReports} ticket{newReports !== 1 ? 's' : ''} in period
      </p>
    </div>
  );
};

export default TicketPipeline;
