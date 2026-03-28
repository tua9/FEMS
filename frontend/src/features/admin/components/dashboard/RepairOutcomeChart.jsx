import React from 'react';

const CIRCUMFERENCE = 251.2;
const OUTCOME_CONFIG = {
  fixed_internally: { color: '#10b981', icon: 'check_circle', label: 'Fixed Internally', desc: 'Resolved by internal technical team' },
  external_warranty: { color: '#3b82f6', icon: 'verified', label: 'External Warranty', desc: 'Sent to manufacturer for repair' },
  beyond_repair: { color: '#f43f5e', icon: 'cancel', label: 'Beyond Repair', desc: 'Decommissioned from inventory' },
};

const RepairOutcomeChart = ({ data }) => {
  const total = data.reduce((s, d) => s + d.count, 0);

  let rotation = -90;
  const segments = data.map((item) => {
    const cfg = OUTCOME_CONFIG[item.outcome] ?? { color: '#94a3b8', icon: 'help', label: item.label, desc: 'Other resolution' };
    const len = total > 0 ? (item.count / total) * CIRCUMFERENCE : 0;
    const rot = rotation;
    rotation += (len / CIRCUMFERENCE) * 360;
    return { ...item, ...cfg, len, offset: CIRCUMFERENCE - len, rot };
  });

  const fixedPct = total > 0
    ? Math.round(((data.find((d) => d.outcome === 'fixed_internally')?.count ?? 0) / total) * 100)
    : 0;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h4 className="text-[13px] font-bold text-[#1A2B56] dark:text-blue-400 uppercase tracking-widest mb-1">Repair Quality Analytics</h4>
        <p className="text-[10px] text-slate-500 font-medium tracking-wide">Strategic breakdown of equipment resolution outcomes</p>
      </div>

      {total === 0 ? (
        <div className="flex-1 flex items-center justify-center opacity-40">
           <p className="text-xs font-bold text-slate-400 italic">No resolved cases documented</p>
        </div>
      ) : (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-12 items-center">
            {/* Chart Side */}
            <div className="lg:col-span-1 relative flex items-center justify-center">
              <svg className="w-56 h-56" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="14" className="dark:stroke-slate-800" />
                {segments.map((seg) =>
                  seg.len > 0 ? (
                    <circle
                      key={seg.outcome}
                      cx="50" cy="50" r="40"
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="14"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={seg.offset}
                      strokeLinecap="round"
                      style={{ transform: `rotate(${seg.rot}deg)`, transformOrigin: 'center', transition: 'all 1s ease-in-out' }}
                    />
                  ) : null
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-[#1A2B56] dark:text-white tracking-tighter">{fixedPct}%</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Efficiency</span>
              </div>
            </div>
            
            {/* Legend Side */}
            <div className="lg:col-span-3 space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {segments.map((seg) => (
                    <div key={seg.outcome} className="flex items-center justify-between p-5 bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm" style={{ backgroundColor: `${seg.color}15`, color: seg.color }}>
                           <span className="material-symbols-outlined text-2xl">{seg.icon}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-[#1A2B56] dark:text-slate-200">{seg.label}</span>
                          <span className="text-[11px] font-medium text-slate-400 leading-tight">{seg.desc}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                         <span className="text-lg font-black text-[#1A2B56] dark:text-white">{seg.count}</span>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{total > 0 ? Math.round((seg.count / total) * 100) : 0}%</span>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default RepairOutcomeChart;
