import React from 'react';

const DamageTrendChart = ({ data }) => {
 const maxVal = Math.max(...data.map((d) => d.count), 1)
 const n = data.length

 // Calculate month-over-month trend
 const last = data[n - 1]?.count ?? 0
 const prev = data[n - 2]?.count ?? 0
 const trend = prev === 0 ? 0 : Math.round(((last - prev) / prev) * 100)
 const trendUp = trend > 0

 return (
 <div>
 <div className="flex items-start justify-between mb-4">
 <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
 Xu hướng hư hỏng theo tháng
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

export default DamageTrendChart
