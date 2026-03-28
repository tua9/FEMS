import React from 'react';

const DamageTrendChart = ({ data }) => {
  const W = 300, H = 150;
  const pL = 20, pR = 20, pT = 20, pB = 30;
  const plotW = W - pL - pR;
  const plotH = H - pT - pB;

  const maxVal = Math.max(...data.map((d) => d.count), 5);
  const n = data.length;

<<<<<<< HEAD
 return (
 <div>
 <div className="flex items-start justify-between mb-4">
 <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
 Monthly damage trend
 </p>
 {prev > 0 && (
 <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trendUp ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
 {trendUp ? '▲' : '▼'} {Math.abs(trend)}%
 </span>
 )}
 </div>
 <div className="flex items-end gap-1.5 h-28">
 {data.map((d, i) => {
 const heightPct = maxVal > 0 ? (d.count / maxVal) * 100 : 0
 const isLast = i === n - 1
 return (
 <div key={i} className="flex-1 flex flex-col items-center gap-1">
 <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">{d.count > 0 ? d.count : ''}</span>
 <div className="w-full flex items-end" style={{ height: '80px' }}>
 <div
 className={`w-full rounded-t transition-all ${isLast && trendUp ? 'bg-red-400 dark:bg-red-500' : 'bg-[#1A2B56] dark:bg-blue-500'}`}
 style={{ height: `${Math.max(heightPct, d.count > 0 ? 4 : 0)}%` }}
 />
 </div>
 <span className="text-[8px] text-slate-400 text-center leading-tight">{d.label}</span>
 </div>
 )
 })}
 </div>
 </div>
 )
}
=======
  const xPos = (i) => pL + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const yPos = (val) => pT + plotH - (val / maxVal) * plotH;
>>>>>>> origin/logic-admin

  const getPath = () => {
    if (n < 2) return "";
    let path = `M ${xPos(0)} ${yPos(data[0].count)}`;
    for (let i = 0; i < n - 1; i++) {
        const x1 = xPos(i), y1 = yPos(data[i].count);
        const x2 = xPos(i+1), y2 = yPos(data[i+1].count);
        const cx = (x1 + x2) / 2;
        path += ` C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
    }
    return path;
  };

  const path = getPath();
  const last = data[n - 1]?.count ?? 0;
  const prev = data[n - 2]?.count ?? 0;
  const trend = prev === 0 ? 0 : Math.round(((last - prev) / prev) * 100);
  const isUp = trend > 0;

  return (
    <div className="w-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h4 className="text-[13px] font-bold text-[#1A2B56] dark:text-blue-400 uppercase tracking-widest mb-1">Reliability Index</h4>
          <p className="text-[10px] text-slate-500 font-medium tracking-wide">Monthly failure frequency trend</p>
        </div>
        {prev > 0 && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${isUp ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
            <span className="material-symbols-outlined text-xs">{isUp ? 'trending_up' : 'trending_down'}</span>
            <span className="text-[10px] font-black">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
         <defs>
          <linearGradient id="gradDamage" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Fill */}
        {n > 1 && (
            <path d={`${path} L ${xPos(n-1)} ${H-pB} L ${xPos(0)} ${H-pB} Z`} fill="url(#gradDamage)" />
        )}

        {/* Line */}
        <path d={path} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Points */}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={xPos(i)} cy={yPos(d.count)} r="3" fill="white" stroke="#f43f5e" strokeWidth="1.5" />
            <text x={xPos(i)} y={H - 5} textAnchor="middle" fontSize="8" fontWeight="700" fill="#94a3b8" className="uppercase tracking-tighter">
                {d.label?.slice(0, 3)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default DamageTrendChart;
