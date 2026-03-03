import React, { useEffect, useState } from 'react';
import { technicianApi } from '@/services/api/technicianApi';
import { TaskStats } from '@/types/technician.types';

const StatsOverview: React.FC = () => {
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    technicianApi.getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: 'Pending Approval',
      value: stats?.pending ?? 8,
      icon: 'pending_actions',
      dot: 'bg-blue-400',
      glow: 'shadow-[0_0_8px_rgba(96,165,250,0.6)]',
    },
    {
      label: 'Approved to Fix',
      value: stats?.inProgress ?? 12,
      icon: 'task_alt',
      dot: 'bg-emerald-400',
      glow: 'shadow-[0_0_8px_rgba(52,211,153,0.6)]',
    },
    {
      label: 'In Progress',
      value: stats?.total ?? 5,
      icon: 'sync',
      dot: 'bg-amber-400',
      glow: 'shadow-[0_0_8px_rgba(251,191,36,0.6)]',
    },
    {
      label: 'Overdue Tickets',
      value: stats?.urgent ?? 3,
      icon: 'error_outline',
      dot: 'bg-rose-400',
      glow: 'shadow-[0_0_8px_rgba(248,113,113,0.6)]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="bg-card p-7 rounded-3xl shadow-sm relative group"
        >
          {/* Top row: icon + dot */}
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-slate-400 text-2xl">
              {stat.icon}
            </span>
            <div className={`w-2 h-2 rounded-full ${stat.dot} ${stat.glow}`}></div>
          </div>

          {/* Value */}
          {loading ? (
            <div className="h-14 w-20 bg-white/30 rounded-xl animate-pulse mb-2"></div>
          ) : (
            <p className="text-5xl font-extrabold text-[#1A2B56] dark:text-white tracking-tighter">
              {String(stat.value).padStart(2, '0')}
            </p>
          )}

          {/* Label */}
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-2">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;