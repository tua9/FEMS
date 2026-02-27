import React from 'react';
import ReportStatCards from '@/components/technician/reports/ReportStatCards';
import TicketTrendChart from '@/components/technician/reports/TicketTrendChart';
import TopPerformers from '@/components/technician/reports/TopPerformers';
import FacilityHealthTable from '@/components/technician/reports/FacilityHealthTable';

const PerformanceInsights: React.FC = () => (
  <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto space-y-8">
    {/* ── Page header ── */}
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="space-y-1">
        <h1 className="text-4xl font-extrabold text-[#232F58] tracking-tight">
          Performance Insights
        </h1>
        <p className="text-slate-600 font-medium">Operations reports and analytical overview</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Date range selector */}
        <button
          className="px-5 py-3 bg-white/80 glass-card border border-white/40 rounded-2xl text-sm font-bold text-[#232F58] shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg text-slate-500">calendar_today</span>
          Last 30 Days
          <span className="material-symbols-outlined text-lg text-slate-500">expand_more</span>
        </button>

        {/* Export PDF */}
        <button className="px-5 py-3 bg-[#232F58] text-white rounded-2xl text-sm font-bold shadow-lg hover:opacity-90 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">download</span>
          Export PDF
        </button>
      </div>
    </section>

    {/* ── KPI stat cards ── */}
    <ReportStatCards />

    {/* ── Ticket trends + Top performers (2/3 + 1/3 grid) ── */}
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <TicketTrendChart />
      <TopPerformers />
    </section>

    {/* ── Facility health table ── */}
    <FacilityHealthTable />
  </div>
);

export default PerformanceInsights;
