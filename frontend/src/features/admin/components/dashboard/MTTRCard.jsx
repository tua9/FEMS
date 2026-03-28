import React from 'react';

<<<<<<< HEAD

const MTTRCard = ({ mttrHours, fixedCount, damageReportRate }) => {
  const rating = mttrHours <= 24 ? { label: 'Good', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' }
    : mttrHours <= 72 ? { label: 'Average', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' }
    : { label: 'Needs improvement', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' }

  return (
    <div className="space-y-5">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        Repair KPIs
      </p>

      {/* MTTR */}
      <div className="flex flex-col items-center text-center py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">MTTR</span>
        <span className="text-4xl font-black text-[#1A2B56] dark:text-white leading-tight">
          {fixedCount === 0 ? '—' : mttrHours}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Average hours per incident</span>
        {fixedCount > 0 && (
          <span className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${rating.bg} ${rating.color}`}>
=======
const MTTRCard = ({ mttrHours, fixedCount, damageReportRate }) => {
  const rating = mttrHours <= 24 ? { label: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-50' }
    : mttrHours <= 72 ? { label: 'Average', color: 'text-amber-600', bg: 'bg-amber-50' }
    : { label: 'Needs Attention', color: 'text-red-600', bg: 'bg-red-50' };

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <h4 className="text-[13px] font-bold text-[#1A2B56] dark:text-blue-400 uppercase tracking-widest mb-1">Repair Efficiency</h4>
        <p className="text-[10px] text-slate-500 font-medium tracking-wide mb-8">System-wide response and resolution time</p>
      </div>

      <div className="flex flex-col items-center justify-center py-6 px-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-700/50 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className="material-symbols-outlined text-4xl text-[#1A2B56] dark:text-white">build_circle</span>
        </div>
        
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">MTTR</span>
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-black text-[#1A2B56] dark:text-white tracking-tighter">
            {fixedCount === 0 ? '—' : mttrHours}
          </span>
          <span className="text-sm font-bold text-slate-400">HRS</span>
        </div>
        <p className="text-[10px] font-semibold text-slate-500 mt-2 capitalize">Average resolution time</p>
        
        {fixedCount > 0 && (
          <span className={`mt-4 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${rating.bg} ${rating.color} border border-current/10`}>
>>>>>>> origin/logic-admin
            {rating.label}
          </span>
        )}
      </div>

<<<<<<< HEAD
      {/* Sub stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Successfully repaired</span>
          <span className="font-bold text-slate-700 dark:text-slate-200">{fixedCount} {fixedCount === 1 ? 'incident' : 'incidents'}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Equipment damage report share</span>
          <span className="font-bold text-slate-700 dark:text-slate-200">{damageReportRate}%</span>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1A2B56] dark:bg-blue-500 rounded-full transition-all"
=======
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Success Rate</span>
            <span className="text-xs font-bold text-[#1A2B56] dark:text-slate-200">{fixedCount} Issues Resolved</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Damage Rate</span>
            <span className="text-xs font-bold text-[#1A2B56] dark:text-slate-200">{damageReportRate}%</span>
          </div>
        </div>
        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1A2B56] dark:bg-blue-500 rounded-full transition-all duration-1000"
>>>>>>> origin/logic-admin
            style={{ width: `${damageReportRate}%` }}
          />
        </div>
      </div>
    </div>
<<<<<<< HEAD
  )
}

export default MTTRCard
=======
  );
};

export default MTTRCard;
>>>>>>> origin/logic-admin
