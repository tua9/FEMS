import React from 'react';

const TechnicianPerformanceCard = ({ data }) => {
  if (!data) return (
    <div className="h-full flex flex-col">
      <h4 className="text-[13px] font-bold text-[#1A2B56] dark:text-blue-400 uppercase tracking-widest mb-1">Squad Velocity</h4>
      <div className="flex-1 flex items-center justify-center opacity-40">
           <p className="text-[10px] font-bold text-slate-400 italic text-center">No active team data</p>
      </div>
    </div>
  );

  const { technicians = [] } = data;
  const overallCompleted = technicians.reduce((sum, t) => sum + t.completed, 0);
  const overallTotal = technicians.reduce((sum, t) => sum + t.total, 0);
  const overallPct = overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0;
  const sortedTechnicians = [...technicians].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
          <h4 className="text-[13px] font-bold text-[#1A2B56] dark:text-blue-400 uppercase tracking-widest mb-1">Squad Yield</h4>
          <p className="text-[10px] text-slate-500 font-medium tracking-wide">Weekly throughput</p>
      </div>

      {/* Compact Gauge */}
      <div className="mb-8 p-5 bg-[#1A2B56] rounded-3xl shadow-xl shadow-[#1A2B56]/10 flex flex-col items-center text-center">
            <div className="relative w-16 h-16 mb-2">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
                    <circle cx="28" cy="28" r="24" fill="none"
                    stroke="#10b981"
                    strokeWidth="5"
                    strokeDasharray={`${(overallPct / 100) * 150.8} 150.8`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-lg font-black text-white">
                    {overallPct}%
                </div>
            </div>
            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none">Global</p>
      </div>

      {/* Streamlined List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-4">
        {sortedTechnicians.slice(0, 4).map((t, i) => {
            const name = t.technician?.displayName || t.technician?.username || 'Tech';
            const pct = t.percentage;
            const barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-blue-500' : 'bg-rose-500';
            
            return (
              <div key={t.technician?._id || i} className="group">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-[#1A2B56] dark:text-slate-200 truncate pr-2">{name}</span>
                    <span className={`text-[10px] font-black ${pct >= 80 ? 'text-emerald-500' : pct >= 50 ? 'text-blue-500' : 'text-rose-500'}`}>{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default TechnicianPerformanceCard;
