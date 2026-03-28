import { technicianApi } from '@/services/technicianApi';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StatsOverview = () => {
 const navigate = useNavigate();
 const [stats, setStats] = useState(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 technicianApi.getStats()
 .then(setStats)
 .catch(console.error)
 .finally(() => setLoading(false));
 }, []);

 const pendingCount = stats?.pending ?? 0;
 const approvedCount = stats?.approved ?? 0;
 const inProgressCount = stats?.inProgress ?? 0;
 const completedCount = stats?.completed ?? 0;

 const statCards = [
 {
 label: 'Pending Approval',
 value: pendingCount,
 icon: 'pending_actions',
 dot: 'bg-blue-400',
 glow: 'shadow-[0_0_8px_rgba(96,165,250,0.6)]',
 status: 'pending',
 },
 {
 label: 'Approved to Fix',
 value: approvedCount,
 icon: 'task_alt',
 dot: 'bg-emerald-400',
 glow: 'shadow-[0_0_8px_rgba(52,211,153,0.6)]',
 status: 'approved',
 },
 {
 label: 'In Progress',
 value: inProgressCount,
 icon: 'sync',
 dot: 'bg-amber-400',
 glow: 'shadow-[0_0_8px_rgba(251,191,36,0.6)]',
 status: 'processing',
 },
 {
 label: 'Completed',
 value: completedCount,
 icon: 'check_circle',
 dot: 'bg-rose-400',
 glow: 'shadow-[0_0_8px_rgba(248,113,113,0.6)]',
 status: 'fixed',
 },
 ];

 return (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
 {statCards.map((stat) => (
 <button
 type="button"
 key={stat.label}
 onClick={() => navigate(`/technician/tasks?status=${encodeURIComponent(stat.status)}`)}
 className="dashboard-card p-7 rounded-3xl relative group text-left hover:scale-[1.01] active:scale-[0.99] transition-transform"
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
 <p className="text-5xl font-bold text-[#1A2B56] dark:text-white tracking-tighter">
 {String(stat.value).padStart(2, '0')}
 </p>
 )}

 {/* Label */}
 <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-2">
 {stat.label}
 </p>
 </button>
 ))}
 </div>
 );
};

export default StatsOverview;
