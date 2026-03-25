import React from 'react';

const SEGMENTS = [
 { key: 'available', label: 'Available', color: '#22c55e' },
 { key: 'borrowed', label: 'Borrowed', color: '#1A2B56' },
 { key: 'under_maintenance', label: 'Under Maintenance', color: '#f59e0b' },
 { key: 'pending_disposal', label: 'Pending Disposal', color: '#ef4444' },
]
const CIRCUMFERENCE = 251.2

const EquipmentStatusPieChart = ({ data }) => {
 const total = data.reduce((s, d) => s + d.count, 0)

 let rotation = -90
 const segments = SEGMENTS.map((seg) => {
 const count = data.find((d) => d.status === seg.key)?.count ?? 0
 const len = total > 0 ? (count / total) * CIRCUMFERENCE : 0
 const rot = rotation
 rotation += (len / CIRCUMFERENCE) * 360
 return { ...seg, count, len, offset: CIRCUMFERENCE - len, rot }
 })

 const available = data.find((d) => d.status === 'available')?.count ?? 0
 const availablePct = total > 0 ? Math.round((available / total) * 100) : 0

 return (
 <div>
 <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
 Equipment status
 </p>
 <div className="relative flex items-center justify-center py-4 min-h-[200px]">
 <svg className="w-44 h-44" viewBox="0 0 100 100">
 {segments.map((seg) =>
 seg.len > 0 ? (
 <circle
 key={seg.key}
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
 <span className="text-2xl font-black text-[#1A2B56] dark:text-white">{availablePct}%</span>
 <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Available</span>
 </div>
 </div>
 <div className="mt-4 space-y-2">
 {segments.map((seg) => (
 <div key={seg.key} className="flex items-center justify-between text-xs font-semibold dark:text-slate-300">
 <div className="flex items-center gap-2">
 <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
 {seg.label}
 </div>
 <span>{seg.count}</span>
 </div>
 ))}
 <div className="flex items-center justify-between text-xs font-bold text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-700">
 <span>Total</span>
 <span>{total}</span>
 </div>
 </div>
 </div>
 )
}

export default EquipmentStatusPieChart
