import React from 'react';

const STATUS_COLOR= {
  available: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  maintenance: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  broken: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  // backward compatibility (old data)
  good: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}
const STATUS_LABEL= {
  available: 'Sẵn sàng', maintenance: 'Bảo trì', broken: 'Hỏng',
  // backward compatibility (old data)
  good: 'Sẵn sàng',
}

const MaintenanceAttentionList = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
          Cần quan tâm bảo trì
        </p>
        <p className="text-xs text-slate-400 text-center py-8">Không có dữ liệu</p>
      </div>
    )
  }

  const maxScore = Math.max(...items.map((i) => i.borrowCount + i.reportCount * 3), 1)

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
        Cần quan tâm bảo trì
      </p>
      <div className="space-y-3">
        {items.map((item, idx) => {
          const score = item.borrowCount + item.reportCount * 3
          const pct = Math.round((score / maxScore) * 100)
          return (
            <div key={item._id ?? idx}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate">{item.name}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${STATUS_COLOR[item.status] ?? 'bg-slate-100 text-slate-600'}`}>
                    {STATUS_LABEL[item.status] ?? item.status}
                  </span>
                </div>
                <div className="flex gap-3 shrink-0 ml-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  <span title="Lượt mượn">📦 {item.borrowCount}</span>
                  <span title="Lượt báo hỏng">🔧 {item.reportCount}</span>
                </div>
              </div>
              <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#1A2B56] dark:bg-blue-500 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MaintenanceAttentionList
