import React, { useState, useRef, useEffect } from 'react';
import { DATE_RANGE_OPTIONS } from '@/mocks/technician/mockReports';
import ReportStatCards from '@/features/technician/components/reports/ReportStatCards';
import TicketTrendChart from '@/features/technician/components/reports/TicketTrendChart';
import TopPerformers from '@/features/technician/components/reports/TopPerformers';
import FacilityHealthTable from '@/features/technician/components/reports/FacilityHealthTable';
import { PageHeader } from '@/features/shared/components/PageHeader';

const PerformanceInsights = () => {
 const [dateRangeDays, setDateRangeDays] = useState(30);
 const [dropdownOpen, setDropdownOpen] = useState(false);
 const [exporting, setExporting] = useState(false);
 const dropdownRef = useRef(null);

 // Close dropdown on outside click
 useEffect(() => {
 const handler = (e) => {
 if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
 setDropdownOpen(false);
 }
 };
 document.addEventListener('mousedown', handler);
 return () => document.removeEventListener('mousedown', handler);
 }, []);

 const selectedLabel =
 DATE_RANGE_OPTIONS.find((o) => o.days === dateRangeDays)?.label ?? 'Last 30 Days';

 const handleExportPDF = () => {
 setExporting(true);
 // Small delay so the exporting state hides interactive UI before print dialog
 setTimeout(() => {
 window.print();
 setExporting(false);
 }, 150);
 };

 return (
 <>
 {/* ── Print styles injected once ── */}
 <style>{`
 @media print {
 body * { visibility: hidden !important; }
 #performance-insights-root,
 #performance-insights-root * { visibility: visible !important; }
 #performance-insights-root { position: absolute; inset: 0; padding: 24px; background: white; }
 .no-print { display: none !important; }
 .glass-card { background: white !important; border: 1px solid #e2e8f0 !important; box-shadow: none !important; }
 }
 `}</style>

 <div id="performance-insights-root" className="pt-6 sm:pt-8 pb-16 px-6 max-w-7xl mx-auto space-y-8">
 {/* ── Page header ── */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <PageHeader
 title="Performance Insights"
 subtitle="Operations reports and analytical overview"
 className="items-start text-left mb-0!"
 />

 {/* Controls */}
 <div className="flex items-center gap-3 no-print">
 {/* Date range dropdown */}
 <div className="relative" ref={dropdownRef}>
 <button
 onClick={() => setDropdownOpen((v) => !v)}
 className="px-5 py-3 dashboard-card rounded-2xl text-sm font-bold text-[#232F58] dark:text-white shadow-sm flex items-center gap-2 hover:shadow-md transition-shadow"
 >
 <span className="material-symbols-outlined text-lg text-slate-500">calendar_today</span>
 {selectedLabel}
 <span
 className={`material-symbols-outlined text-lg text-slate-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
 >
 expand_more
 </span>
 </button>

 {dropdownOpen && (
 <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 z-50 overflow-hidden">
 {DATE_RANGE_OPTIONS.map((opt) => (
 <button
 key={opt.days}
 onClick={() => {
 setDateRangeDays(opt.days);
 setDropdownOpen(false);
 }}
 className={`w-full text-left px-5 py-3 text-sm font-semibold transition-colors
 ${opt.days === dateRangeDays
 ? 'bg-[#232F58] text-white'
 : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
 }`}
 >
 {opt.label}
 </button>
 ))}
 </div>
 )}
 </div>

 {/* Export PDF */}
 <button
 onClick={handleExportPDF}
 disabled={exporting}
 className="px-5 py-3 bg-[#232F58] text-white rounded-2xl text-sm font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-60"
 >
 {exporting ? (
 <>
 <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
 Preparing…
 </>
 ) : (
 <>
 <span className="material-symbols-outlined text-lg">download</span>
 Export PDF
 </>
 )}
 </button>
 </div>

 {/* Print header — shown only during print */}
 <div className="hidden print:block text-right">
 <p className="text-xs text-slate-500">
 Report period: <strong>{selectedLabel}</strong> — Printed {new Date().toLocaleDateString()}
 </p>
 </div>
 </div>

 {/* ── KPI stat cards ── */}
 <ReportStatCards dateRangeDays={dateRangeDays} />

 {/* ── Ticket trends + Top performers ── */}
 <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <TicketTrendChart dateRangeDays={dateRangeDays} />
 <TopPerformers dateRangeDays={dateRangeDays} />
 </section>

 {/* ── Facility health table ── */}
 <FacilityHealthTable dateRangeDays={dateRangeDays} />
 </div>
 </>
 );
};

export default PerformanceInsights;
