import React from 'react';

const TopBrokenList = ({ items }) => {
 const maxCount = Math.max(...(items?.map((i) => i.count) ?? []), 1)

 return (
 <div>
 <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
 Most frequently failing equipment
 </p>
 {!items || items.length === 0 ? (
 <p className="text-xs text-slate-400 text-center py-8">No data yet</p>
 ) : (
 <div className="space-y-3">
 {items.map((item, idx) => {
 const pct = Math.round((item.count / maxCount) * 100)
 const medals = ['🥇', '🥈', '🥉']
 const rowKey = item._id != null ? String(item._id) : `${item.name}-${idx}`
 return (
 <div key={rowKey} className="flex items-center gap-3">
 <span className="text-base w-6 flex-shrink-0">{medals[idx] ?? `${idx + 1}.`}</span>
 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between mb-1">
 <div className="min-w-0">
 <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate block">{item.name}</span>
 {item.model ? (
 <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">{item.model}</span>
 ) : null}
 </div>
 <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-2 flex-shrink-0">
 {item.count} reports
 </span>
 </div>
 <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
 <div
 className="h-full rounded-full bg-red-400 dark:bg-red-500 transition-all"
 style={{ width: `${pct}%` }}
 />
 </div>
 </div>
 </div>
 )
 })}
 </div>
 )}
 </div>
 )
}

export default TopBrokenList
