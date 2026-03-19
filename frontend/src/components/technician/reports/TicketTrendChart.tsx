import React from 'react';
import { getTrendPoints, type DateRangeDays } from '@/data/technician/mockReports';

interface Props { dateRangeDays: DateRangeDays }

/** Map an array of values to SVG path d-string across a 1000×200 viewBox */
function buildPath(values: number[], maxVal: number): string {
  const n = values.length;
  if (n === 0) return '';
  const pts = values.map((v, i) => ({
    x: (i / (n - 1)) * 1000,
    y: 200 - (v / maxVal) * 180,
  }));
  // smooth cubic bezier
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const cur = pts[i];
    const cpx = (prev.x + cur.x) / 2;
    d += ` C${cpx},${prev.y} ${cpx},${cur.y} ${cur.x},${cur.y}`;
  }
  return d;
}

const TicketTrendChart: React.FC<Props> = ({ dateRangeDays }) => {
  const points = getTrendPoints(dateRangeDays);
  const maxVal = Math.max(...points.map((p) => p.reported), 1) * 1.1;
  const reportedPath = buildPath(points.map((p) => p.reported), maxVal);
  const resolvedPath = buildPath(points.map((p) => p.resolved), maxVal);
  const areaPath = `${reportedPath} L1000,200 L0,200 Z`;

  return (
    <div className="lg:col-span-2 dashboard-card p-8 rounded-3xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-lg font-bold text-[#232F58] dark:text-white">Ticket Trends</h3>
          <p className="text-xs text-slate-500 font-medium">
            {dateRangeDays === 7
              ? 'Daily ticket volume over the last 7 days'
              : dateRangeDays === 30
                ? 'Daily ticket volume over the last 30 days'
                : dateRangeDays === 90
                  ? 'Monthly ticket volume over the last 90 days'
                  : 'Quarterly ticket volume — all time'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Reported</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-200" />
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Resolved</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64 w-full">
        {/* Y-axis guide lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-t border-slate-100 dark:border-white/5 w-full" />
          ))}
        </div>

        <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#chartGradient)" />
          <path d={reportedPath} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
          <path d={resolvedPath} fill="none" stroke="#93c5fd" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />

          {/* Data dots */}
          {points.map((p, i) => {
            const x = (i / (points.length - 1)) * 1000;
            const yr = 200 - (p.reported / maxVal) * 180;
            const yres = 200 - (p.resolved / maxVal) * 180;
            return (
              <g key={i}>
                <circle cx={x} cy={yr} r="6" fill="#3b82f6" />
                <circle cx={x} cy={yres} r="5" fill="#93c5fd" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {points.map((p) => <span key={p.label}>{p.label}</span>)}
      </div>
    </div>
  );
};

export default TicketTrendChart;


