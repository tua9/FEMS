import React from 'react';

const MonthlyBorrowTrendChart = ({ data }) => {
  const W = 500, H = 200;
  const pL = 40, pR = 20, pT = 20, pB = 40;
  const plotW = W - pL - pR;
  const plotH = H - pT - pB;

  const maxVal = Math.max(...data.flatMap((d) => [d.borrowed, d.returned]), 5);
  const n = data.length;

  const xPos = (i) => pL + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const yPos = (val) => pT + plotH - (val / maxVal) * plotH;

  // Simple cubic bezier curve generator
  const getPath = (key) => {
    if (n < 2) return "";
    let path = `M ${xPos(0)} ${yPos(data[0][key])}`;
    for (let i = 0; i < n - 1; i++) {
      const x1 = xPos(i), y1 = yPos(data[i][key]);
      const x2 = xPos(i + 1), y2 = yPos(data[i + 1][key]);
      const cx = (x1 + x2) / 2;
      path += ` C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
    }
    return path;
  };

  const borrowedPath = getPath('borrowed');
  const returnedPath = getPath('returned');

  const yTicks = [0, maxVal / 2, maxVal].map(v => Math.round(v));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h4 className="text-[13px] font-bold text-[#1A2B56] dark:text-blue-400 uppercase tracking-widest mb-1">Utilization Velocity</h4>
          <p className="text-[10px] text-slate-500 font-medium tracking-wide">Monthly checkout and check-in volume trend</p>
        </div>
        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#1A2B56]" />
            <span className="text-[#1A2B56]">Borrowed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-emerald-500">Returned</span>
          </div>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
        <defs>
          <linearGradient id="gradBorrowed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A2B56" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#1A2B56" stopOpacity="0.01" />
          </linearGradient>
          <linearGradient id="gradReturned" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line x1={pL} x2={W - pR} y1={yPos(tick)} y2={yPos(tick)} stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="4 4" className="dark:stroke-slate-700" />
            <text x={pL - 10} y={yPos(tick) + 3} textAnchor="end" fontSize="9" fontWeight="600" fill="#94a3b8">{tick}</text>
          </g>
        ))}

        {/* Area Fills */}
        {n > 1 && (
          <>
            <path d={`${borrowedPath} L ${xPos(n - 1)} ${H - pB} L ${xPos(0)} ${H - pB} Z`} fill="url(#gradBorrowed)" />
            <path d={`${returnedPath} L ${xPos(n - 1)} ${H - pB} L ${xPos(0)} ${H - pB} Z`} fill="url(#gradReturned)" />
          </>
        )}

        {/* Curves */}
        <path d={borrowedPath} fill="none" stroke="#1A2B56" strokeWidth="2.5" strokeLinecap="round" className="dark:stroke-blue-400" />
        <path d={returnedPath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />

        {/* Labels */}
        {data.map((d, i) => (
          <text key={i} x={xPos(i)} y={H - 10} textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b" className="dark:fill-slate-400 uppercase tracking-tighter">
            {d.label?.slice(0, 3)}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default MonthlyBorrowTrendChart;
