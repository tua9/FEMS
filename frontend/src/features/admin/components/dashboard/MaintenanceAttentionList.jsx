import React from 'react';

<<<<<<< HEAD
const STATUS_COLOR= {
  available: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  maintenance: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  broken: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  // backward compatibility (old data)
  good: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}
const STATUS_LABEL= {
  available: 'Available', maintenance: 'Maintenance', broken: 'Broken',
  // backward compatibility (old data)
  good: 'Available',
}

const MaintenanceAttentionList = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
          Maintenance attention needed
        </p>
        <p className="text-xs text-slate-400 text-center py-8">No data</p>
      </div>
    )
  }

  const maxScore = Math.max(...items.map((i) => i.borrowCount + i.reportCount * 3), 1)

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
        Maintenance attention needed
      </p>
      <div className="space-y-3">
        {items.map((item, idx) => {
          const score = item.borrowCount + item.reportCount * 3
          const pct = Math.round((score / maxScore) * 100)
          return (
            <div key={item._id ?? idx}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate">{item.name}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${STATUS_COLOR[item.status] ?? 'bg-slate-100 text-slate-600'}`}>
                    {STATUS_LABEL[item.status] ?? item.status}
                  </span>
                </div>
                <div className="flex gap-3 shrink-0 ml-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  <span title="Borrow count">📦 {item.borrowCount}</span>
                  <span title="Damage reports">🔧 {item.reportCount}</span>
                </div>
              </div>
              <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#1A2B56] dark:bg-blue-500 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
=======
const STATUS_COLOR = {
  available: 'text-emerald-500 bg-emerald-50 border-emerald-100',
  maintenance: 'text-amber-500 bg-amber-50 border-amber-100',
  broken: 'text-rose-500 bg-rose-50 border-rose-100',
  good: 'text-emerald-500 bg-emerald-50 border-emerald-100',
};

const MaintenanceAttentionList = ({ items, trendData = [] }) => {
  // Line Chart Logic - Expanded for 2/4 width
  const W = 600, H = 80;
  const pL = 10, pR = 10, pT = 10, pB = 10;
  const plotW = W - pL - pR;
  const plotH = H - pT - pB;
  const maxTrend = Math.max(...trendData.map(d => d.count), 5);
  const n = trendData.length;
  
  const x = (i) => pL + (i / (n - 1)) * plotW;
  const y = (val) => pT + plotH - (val / maxTrend) * plotH;
  
  const linePath = n > 1 
    ? trendData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(d.count)}`).join(' ')
    : '';

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h4 className="text-[13px] font-bold text-[#1A2B56] dark:text-blue-400 uppercase tracking-widest mb-1">System Reliability</h4>
        <p className="text-[10px] text-slate-500 font-medium tracking-wide">Infrastructure health trends and critical asset indicators</p>
      </div>

      {/* Expanded Sparkline */}
      {trendData.length > 0 && (
        <div className="mb-10 p-6 bg-slate-50/50 dark:bg-slate-800/20 rounded-3xl relative overflow-hidden group border border-slate-100 dark:border-slate-700/50">
            <div className="absolute top-3 right-6 flex items-center gap-2 opacity-50">
               <span className="material-symbols-outlined text-xs text-rose-500">trending_up</span>
               <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Failure Velocity</span>
>>>>>>> origin/logic-admin
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-16 overflow-visible">
              <defs>
                 <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                 </linearGradient>
              </defs>
              <path d={`${linePath} V ${H} H ${pL} Z`} fill="url(#lineFill)" />
              <path d={linePath} fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {trendData.map((d, i) => (
                <circle key={i} cx={x(i)} cy={y(d.count)} r="3" fill="white" stroke="#f43f5e" strokeWidth="2" />
              ))}
            </svg>
        </div>
      )}

      {/* 2-Column Priority Grid */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {!items || items.length === 0 ? (
           <div className="h-full flex items-center justify-center opacity-40">
              <p className="text-xs font-bold text-slate-400 italic">No maintenance required at this stage</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {items.slice(0, 4).map((item, idx) => (
                <div key={item._id ?? idx} className="group">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-[13px] font-black text-[#1A2B56] dark:text-slate-200 truncate">{item.name}</span>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md border ${STATUS_COLOR[item.status] || 'bg-slate-50 text-slate-400'}`}>
                        Action Required
                      </span>
                    </div>
                  </div>
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-amber-400 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, item.reportCount * 25)}%` }}
                    />
                  </div>
                </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceAttentionList;
