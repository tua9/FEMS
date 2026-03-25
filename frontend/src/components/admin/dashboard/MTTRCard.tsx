import React from 'react';

interface Props { mttrHours: number; fixedCount: number; damageReportRate: number }

const MTTRCard: React.FC<Props> = ({ mttrHours, fixedCount, damageReportRate }) => {
  const rating = mttrHours <= 24 ? { label: 'Tốt', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' }
    : mttrHours <= 72 ? { label: 'Trung bình', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' }
    : { label: 'Cần cải thiện', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' }

  return (
    <div className="space-y-5">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        KPI Sửa chữa
      </p>

      {/* MTTR */}
      <div className="flex flex-col items-center text-center py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">MTTR</span>
        <span className="text-4xl font-black text-[#1A2B56] dark:text-white leading-tight">
          {fixedCount === 0 ? '—' : mttrHours}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">giờ trung bình / sự cố</span>
        {fixedCount > 0 && (
          <span className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${rating.bg} ${rating.color}`}>
            {rating.label}
          </span>
        )}
      </div>

      {/* Sub stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Đã sửa thành công</span>
          <span className="font-bold text-slate-700 dark:text-slate-200">{fixedCount} sự cố</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Tỉ lệ báo hỏng thiết bị</span>
          <span className="font-bold text-slate-700 dark:text-slate-200">{damageReportRate}%</span>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1A2B56] dark:bg-blue-500 rounded-full transition-all"
            style={{ width: `${damageReportRate}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default MTTRCard
