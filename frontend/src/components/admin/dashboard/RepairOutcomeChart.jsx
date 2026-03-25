import React from 'react';

const CIRCUMFERENCE = 251.2
const OUTCOME_CONFIG= {
 fixed_internally: { color: '#22c55e', icon: '✅' },
 external_warranty: { color: '#f59e0b', icon: '🔄' },
 beyond_repair: { color: '#ef4444', icon: '❌' },
}

const RepairOutcomeChart = ({ data }) => {
 const total = data.reduce((s, d) => s + d.count, 0)

 let rotation = -90
 const segments = data.map((item) => {
 const cfg = OUTCOME_CONFIG[item.outcome] ?? { color: '#94a3b8', icon: '?' }
 const len = total > 0 ? (item.count / total) * CIRCUMFERENCE : 0
 const rot = rotation
 rotation += (len / CIRCUMFERENCE) * 360
 return { ...item, ...cfg, len, offset: CIRCUMFERENCE - len, rot }
 })

 const fixedPct = total > 0
 ? Math.round(((data.find((d) => d.outcome === 'fixed_internally')?.count ?? 0) / total) * 100)
 : 0

 return (
 <div>
 <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
 Tỷ lệ sửa chữa thành công
 </p>
 {total === 0 ? (
 <p className="text-xs text-slate-400 text-center py-8">Chưa có sự cố nào được đóng</p>
 ) : (
 <>
 <div className="relative flex items-center justify-center py-2">
 <svg className="w-36 h-36" viewBox="0 0 100 100">
 {segments.map((seg) =>
 seg.len > 0 ? (
 <circle
 key={seg.outcome}
 cx="50" cy="50" r="40"
 fill="transparent"
 stroke={seg.color}
 strokeWidth="12"
 strokeDasharray={CIRCUMFERENCE}
 strokeDashoffset={seg.offset}
 style={{ transform: `rotate(${seg.rot}deg)`, transformOrigin: 'center' }}
 />
 ) : null
 )}
 </svg>
 <div className="absolute inset-0 flex flex-col items-center justify-center">
 <span className="text-2xl font-black text-[#1A2B56] dark:text-white">{fixedPct}%</span>
 <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Thành công</span>
 </div>
 </div>
 <div className="mt-4 space-y-2">
 {segments.map((seg) => (
 <div key={seg.outcome} className="flex items-center justify-between text-xs font-semibold dark:text-slate-300">
 <div className="flex items-center gap-2">
 <span>{seg.icon}</span>
 <span>{seg.label}</span>
 </div>
 <span>{seg.count} ({total > 0 ? Math.round((seg.count / total) * 100) : 0}%)</span>
 </div>
 ))}
 </div>
 </>
 )}
 </div>
 )
}

export default RepairOutcomeChart
