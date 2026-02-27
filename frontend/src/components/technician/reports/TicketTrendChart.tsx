import React from 'react';

const TicketTrendChart: React.FC = () => (
  <div className="lg:col-span-2 bg-white/60 glass-card p-8 rounded-3xl border border-white/50 shadow-sm">
    {/* Header */}
    <div className="flex justify-between items-center mb-8">
      <div>
        <h3 className="text-lg font-bold text-[#232F58]">Ticket Trends</h3>
        <p className="text-xs text-slate-500 font-medium">Daily ticket volume over the last 30 days</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-[10px] font-bold text-slate-500 uppercase">Reported</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-200" />
          <span className="text-[10px] font-bold text-slate-500 uppercase">Resolved</span>
        </div>
      </div>
    </div>

    {/* Chart area */}
    <div className="relative h-64 w-full flex items-end justify-between gap-1 px-2">
      {/* Y-axis guide lines */}
      <div className="absolute inset-0 pt-4 flex flex-col justify-between text-[10px] font-bold text-slate-300 pointer-events-none">
        {['100', '75', '50', '25', '0'].map((label) => (
          <div key={label} className="border-t border-slate-100 w-full pt-1">{label}</div>
        ))}
      </div>

      {/* SVG curves */}
      <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Filled area under reported line */}
        <path
          d="M0,150 Q100,120 200,160 T400,100 T600,140 T800,80 T1000,120 L1000,200 L0,200 Z"
          fill="url(#chartGradient)"
        />

        {/* Reported line (solid blue) */}
        <path
          d="M0,150 Q100,120 200,160 T400,100 T600,140 T800,80 T1000,120"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Resolved line (dashed light-blue) */}
        <path
          d="M0,170 Q100,140 200,180 T400,130 T600,160 T800,110 T1000,150"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="2"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
      </svg>
    </div>

    {/* X-axis labels */}
    <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
      <span>Oct 01</span>
      <span>Oct 10</span>
      <span>Oct 20</span>
      <span>Oct 30</span>
    </div>
  </div>
);

export default TicketTrendChart;
