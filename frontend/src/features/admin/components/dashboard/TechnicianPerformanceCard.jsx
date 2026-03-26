import React from 'react';

const TechnicianPerformanceCard = ({ data }) => {
  if (!data) return null;

  const { technicians = [], weekStart } = data;

  const weekLabel = weekStart
    ? new Date(weekStart).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    : '';

  const overallCompleted = technicians.reduce((sum, t) => sum + t.completed, 0);
  const overallTotal = technicians.reduce((sum, t) => sum + t.total, 0);
  const overallPct = overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Technician Performance
        </p>
        {weekLabel && (
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
            Week of {weekLabel}
          </span>
        )}
      </div>

      {/* Overall */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative w-14 h-14 flex-shrink-0">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="22" fill="none" stroke="currentColor"
              className="text-slate-100 dark:text-slate-700" strokeWidth="6" />
            <circle cx="28" cy="28" r="22" fill="none"
              stroke={overallPct >= 80 ? '#22c55e' : overallPct >= 50 ? '#f59e0b' : '#ef4444'}
              strokeWidth="6"
              strokeDasharray={`${(overallPct / 100) * 138.2} 138.2`}
              strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-slate-700 dark:text-white">
            {overallPct}%
          </span>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-700 dark:text-white">
            {overallCompleted}/{overallTotal} tasks done
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">This week overall</p>
        </div>
      </div>

      {/* Per-technician rows */}
      {technicians.length === 0 ? (
        <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center py-4">
          No technicians assigned this week
        </p>
      ) : (
        <div className="space-y-3">
          {technicians.map((t, i) => {
            const name = t.technician?.displayName || t.technician?.username || 'Unknown';
            const initial = name.charAt(0).toUpperCase();
            const pct = t.percentage;
            const barColor = pct >= 80 ? 'bg-emerald-400' : pct >= 50 ? 'bg-amber-400' : 'bg-red-400';
            return (
              <div key={t.technician?._id || i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#1A2B56] text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[11px] font-semibold text-slate-700 dark:text-white truncate">{name}</p>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 ml-2 flex-shrink-0">
                      {t.completed}/{t.total}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <span className={`text-[10px] font-bold w-8 text-right flex-shrink-0 ${
                  pct >= 80 ? 'text-emerald-500' : pct >= 50 ? 'text-amber-500' : 'text-red-500'
                }`}>
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TechnicianPerformanceCard;
