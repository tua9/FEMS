import React from 'react';

const COLORS= {
 user_error: '#ef4444',
 hardware: '#f59e0b',
 software: '#3b82f6',
 environment: '#8b5cf6',
 unknown: '#94a3b8',
}

const DamageCauseChart = ({ data }) => {
 const sorted = [...data].sort((a, b) => b.count - a.count)
 const maxCount = Math.max(...sorted.map((d) => d.count), 1)
 const total = sorted.reduce((s, d) => s + d.count, 0)

 return (
 <div>
 <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
 Phân loại nguyên nhân hư hỏng
 </p>
 {sorted.length === 0 ? (
 <p className="text-xs text-slate-400 text-center py-8">Chưa có dữ liệu nguyên nhân</p>
 ) : (
 <div className="space-y-3">
 {sorted.map((item) => {
 const pct = Math.round((item.count / maxCount) * 100)
 const share = total > 0 ? Math.round((item.count / total) * 100) : 0
 const color = COLORS[item.cause] ?? '#94a3b8'
 return (
 <div key={item.cause}>
 <div className="flex items-center justify-between mb-1">
 <div className="flex items-center gap-2">
 <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
 <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{item.label}</span>
 </div>
 <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
 <span className="font-bold text-slate-700 dark:text-slate-200">{item.count}</span>
 <span>({share}%)</span>
 </div>
 </div>
 <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
 <div
 className="h-full rounded-full transition-all"
 style={{ width: `${pct}%`, backgroundColor: color }}
 />
 </div>
 </div>
 )
 })}
 </div>
 )}
 </div>
 )
}

export default DamageCauseChart
