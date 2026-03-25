import React from 'react';

const MonthlyBorrowTrendChart = ({ data }) => {
 const W = 340, H = 150
 const pL = 32, pR = 12, pT = 12, pB = 32
 const plotW = W - pL - pR
 const plotH = H - pT - pB

 const maxVal = Math.max(...data.flatMap((d) => [d.borrowed, d.returned]), 1)
 const n = data.length

 const xPos = (i) => pL + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW)
 const yPos = (val) => pT + plotH - (val / maxVal) * plotH

 const polyPoints = (key) =>
 data.map((d, i) => `${xPos(i)},${yPos(d[key])}`).join(' ')

 const yTicks = [0, 0.5, 1].map((t) => Math.round(maxVal * t))

 return (
 <div>
 <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">
 Monthly check-out and check-in
 </p>
 <div className="flex gap-4 mb-3 text-xs font-semibold">
 <div className="flex items-center gap-1.5">
 <span className="w-6 h-0.5 bg-[#1A2B56] dark:bg-blue-400 inline-block rounded" />
 Check-out (borrowed)
 </div>
 <div className="flex items-center gap-1.5">
 <span className="w-6 h-0.5 bg-[#22c55e] inline-block rounded" />
 Check-in (returned)
 </div>
 </div>
 <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
 {/* Grid lines */}
 {yTicks.map((tick, i) => (
 <g key={i}>
 <line
 x1={pL} x2={W - pR}
 y1={yPos(tick)} y2={yPos(tick)}
 stroke="#e2e8f0" strokeWidth="0.5"
 className="dark:[stroke:#334155]"
 />
 <text x={pL - 4} y={yPos(tick) + 3} textAnchor="end" fontSize="7" fill="#94a3b8">{tick}</text>
 </g>
 ))}

 {/* Area fills */}
 <polyline
 points={`${xPos(0)},${pT + plotH} ${polyPoints('borrowed')} ${xPos(n - 1)},${pT + plotH}`}
 fill="#1A2B56" fillOpacity="0.08" stroke="none"
 />
 <polyline
 points={`${xPos(0)},${pT + plotH} ${polyPoints('returned')} ${xPos(n - 1)},${pT + plotH}`}
 fill="#22c55e" fillOpacity="0.08" stroke="none"
 />

 {/* Lines */}
 <polyline points={polyPoints('borrowed')} fill="none" stroke="#1A2B56" strokeWidth="1.8" strokeLinejoin="round" className="dark:[stroke:#60a5fa]" />
 <polyline points={polyPoints('returned')} fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinejoin="round" />

 {/* Dots + X labels */}
 {data.map((d, i) => (
 <g key={i}>
 <circle cx={xPos(i)} cy={yPos(d.borrowed)} r="2.5" fill="#1A2B56" className="dark:[fill:#60a5fa]" />
 <circle cx={xPos(i)} cy={yPos(d.returned)} r="2.5" fill="#22c55e" />
 <text x={xPos(i)} y={H - 6} textAnchor="middle" fontSize="7" fill="#94a3b8">{d.label}</text>
 </g>
 ))}
 </svg>
 </div>
 )
}

export default MonthlyBorrowTrendChart
