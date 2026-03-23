import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { technicianApi } from '@/services/api/technicianApi';

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

// (Filtering is now computed server-side via from/to range params)

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

  const buttonRef  = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Portal position — computed from button bounding rect
  const [dropPos, setDropPos] = useState<{ top: number; right: number }>({ top: 0, right: 0 });

  const computePos = () => {
    if (!buttonRef.current) return;
    const r = buttonRef.current.getBoundingClientRect();
    setDropPos({ top: r.bottom + 8, right: window.innerWidth - r.right });
  };

  const handleToggle = () => {
    if (!dropdownOpen) computePos();
    setDropdownOpen((o) => !o);
  };

  // Re-calculate on resize/scroll
  useEffect(() => {
    if (!dropdownOpen) return;
    window.addEventListener('resize', computePos);
    window.addEventListener('scroll', computePos, true);
    return () => {
      window.removeEventListener('resize', computePos);
      window.removeEventListener('scroll', computePos, true);
    };
  }, [dropdownOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        buttonRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      ) return;
      setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  // Derive API date range (from/to) from the current filter selection.
  const range = useMemo(() => {
    const end = new Date();

    // Helpers (UTC boundaries)
    const startOfUtcDay = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
    const endOfUtcDay = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));

    // Day (treat input as local date string YYYY-MM-DD, convert to UTC day boundaries)
    if (mode === 'day') {
      const [y, m, day] = customDay.split('-').map(Number);
      const start = new Date(Date.UTC(y, m - 1, day, 0, 0, 0, 0));
      const to = new Date(Date.UTC(y, m - 1, day, 23, 59, 59, 999));
      return { from: start.toISOString(), to: to.toISOString() };
    }

    // Month (UTC month boundaries)
    if (mode === 'month') {
      const start = new Date(Date.UTC(customMonthYear, customMonth - 1, 1, 0, 0, 0, 0));
      const to = new Date(Date.UTC(customMonthYear, customMonth, 0, 23, 59, 59, 999));
      return { from: start.toISOString(), to: to.toISOString() };
    }

    // Year (UTC year boundaries)
    if (mode === 'year') {
      const start = new Date(Date.UTC(customYear, 0, 1, 0, 0, 0, 0));
      const to = new Date(Date.UTC(customYear, 11, 31, 23, 59, 59, 999));
      return { from: start.toISOString(), to: to.toISOString() };
    }

    // Presets
    // This Month
    if (activePreset.days === 0) {
      const start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1, 0, 0, 0, 0));
      return { from: start.toISOString(), to: end.toISOString() };
    }

    // This Year
    if (activePreset.days === -1) {
      const start = new Date(Date.UTC(end.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
      return { from: start.toISOString(), to: end.toISOString() };
    }

    // Last N days (inclusive): from start-of-day (UTC) N-1 days ago to end-of-today (UTC)
    const to = endOfUtcDay(end);
    const start = startOfUtcDay(new Date(to));
    start.setUTCDate(start.getUTCDate() - Math.max(0, activePreset.days - 1));

    return { from: start.toISOString(), to: to.toISOString() };
  }, [mode, customDay, customMonth, customMonthYear, customYear, activePreset]);

  const [pipeline, setPipeline] = useState<{ newReports: number; assigned: number; resolved: number } | null>(null);

  useEffect(() => {
    let mounted = true;
    technicianApi
      .getTicketPipeline(range)
      .then((data) => {
        if (mounted) setPipeline(data);
      })
      .catch(console.error);
    return () => {
      mounted = false;
    };
  }, [range.from, range.to]);

  const newReports = pipeline?.newReports ?? 0;
  const assigned   = pipeline?.assigned ?? 0;
  const resolved   = pipeline?.resolved ?? 0;
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
    <div className="dashboard-card p-8 rounded-3xl h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-sm font-bold text-[#1A2B56] dark:text-white uppercase tracking-widest">
          Ticket Pipeline
        </h3>

        {/* Filter dropdown trigger */}
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={handleToggle}
            className="text-[10px] font-bold text-slate-400 hover:text-[#1A2B56] dark:hover:text-white flex items-center gap-1 transition-colors uppercase tracking-wider"
          >
            {buttonLabel}
            <span className={`material-symbols-outlined text-xs transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>

          {/* ── Portal dropdown — rendered to document.body to escape
                  all stacking contexts (will-change-transform from AnimatedPage/AnimatedSection)
                  which would otherwise make backdrop-filter invisible.       ── */}
          {createPortal(
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: 'fixed',
                    top: dropPos.top,
                    right: dropPos.right,
                    zIndex: 9999,
                    width: '16rem',
                  }}
                >
                  {/* Glass surface — overflow-hidden is safe here because
                      backdrop-filter is on this element itself, not a parent */}
                  <div
                    className="overflow-hidden rounded-2xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(220,232,255,0.72) 100%)',
                      backdropFilter: 'blur(40px) saturate(220%)',
                      WebkitBackdropFilter: 'blur(40px) saturate(220%)',
                      border: '1.5px solid rgba(255,255,255,0.92)',
                      boxShadow: [
                        'inset 0 1.5px 0 rgba(255,255,255,0.98)',
                        'inset 1.5px 0 0 rgba(255,255,255,0.65)',
                        '0 8px 40px -8px rgba(26,43,86,0.26)',
                        '0 24px 64px -16px rgba(99,130,220,0.28)',
                        '0 2px 8px rgba(26,43,86,0.12)',
                      ].join(', '),
                    }}
                  >
              {/* Tabs: Preset / Day / Month / Year */}
              <div className="flex border-b border-black/8 dark:border-white/10">
                {(['preset','day','month','year'] as FilterMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2.5 text-[10px] font-extrabold uppercase tracking-wider transition-colors ${
                      mode === m
                        ? 'text-[#1A2B56] border-b-2 border-[#1A2B56]'
                        : 'text-slate-400 hover:text-[#1A2B56]'
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
                            ? 'bg-[#1A2B56] text-white shadow-md shadow-[#1A2B56]/20'
                            : 'text-slate-700 hover:bg-[#1A2B56]/10 hover:text-[#1A2B56] hover:font-bold'
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
                      className="w-full px-3 py-2 rounded-xl border border-white/60 bg-white/60 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1A2B56]/25 backdrop-blur-sm"
                    />
                    <button
                      onClick={() => setDropdownOpen(false)}
                      className="w-full py-2 bg-[#1A2B56] text-white rounded-xl text-xs font-bold hover:bg-[#0f1e3d] transition-all shadow-md shadow-[#1A2B56]/20"
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
                        className="w-7 h-7 rounded-lg bg-white/60 flex items-center justify-center hover:bg-[#1A2B56]/10 hover:text-[#1A2B56] transition-all text-slate-600"
                      >
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                      </button>
                      <span className="text-sm font-extrabold text-slate-700">{customMonthYear}</span>
                      <button
                        onClick={() => setCustomMonthYear((y) => Math.min(y + 1, now.getFullYear()))}
                        className="w-7 h-7 rounded-lg bg-white/60 flex items-center justify-center hover:bg-[#1A2B56]/10 hover:text-[#1A2B56] transition-all text-slate-600"
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
                                ? 'bg-[#1A2B56] text-white shadow-md shadow-[#1A2B56]/20'
                                : isFuture
                                  ? 'text-slate-300 cursor-not-allowed'
                                  : 'text-slate-600 hover:bg-[#1A2B56]/10 hover:text-[#1A2B56] hover:font-bold'
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
                              ? 'bg-[#1A2B56] text-white shadow-md shadow-[#1A2B56]/20'
                              : 'text-slate-600 hover:bg-[#1A2B56]/10 hover:text-[#1A2B56] hover:font-bold'
                          }`}
                        >
                          {yr}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
                  </div>{/* ── end glass surface div ── */}
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
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
