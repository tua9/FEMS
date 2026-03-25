import React, { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { useDashboardStore } from '@/stores/useDashboardStore';
import { Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';

const UsageStats = () => {
 const { usageStats, fetchUsageStats, isLoading } = useDashboardStore();

 useEffect(() => {
 fetchUsageStats();
 }, [fetchUsageStats]);

 if (isLoading || !usageStats) {
 return (
 <div className="pt-32 pb-10 flex justify-center items-center min-h-[60vh]">
 <Loader2 className="w-10 h-10 animate-spin text-[#1E2B58]" />
 </div>
 );
 }

 const { barData, pieData, totalItems, peakSubject, availability } = usageStats;

 return (
 <div className="pt-6 sm:pt-8 pb-10 px-6 max-w-350 mx-auto animate-in fade-in duration-500">
 <PageHeader
 title="Resource Efficiency by Subject"
 subtitle="Analyze how resources are distributed across course tracks."
 />

 <div className="glass-card rounded-[40px] p-8 lg:p-12 mb-10 shadow-2xl relative overflow-hidden">
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
 <div className="lg:col-span-2 space-y-6">
 <div className="flex items-center justify-between mb-8">
 <h3 className="text-xl font-bold text-[#1E2B58] dark:text-white flex items-center gap-2">
 <span className="material-symbols-outlined text-accent-blue">bar_chart</span>
 Weekly Resource Allocation
 </h3>
 <div className="flex gap-4">
 <span className="flex items-center gap-2 text-xs font-bold text-slate-500">
 <span className="w-2.5 h-2.5 rounded-full bg-[#1E2B58]"></span> Current
 </span>
 <span className="flex items-center gap-2 text-xs font-bold text-slate-500">
 <span className="w-2.5 h-2.5 rounded-full bg-[#A5B4D4]"></span> Average
 </span>
 </div>
 </div>

 <div className="h-[300px] w-full">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={barData}>
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} dy={10} />
 <YAxis hide />
 <Tooltip
 cursor={{ fill: 'rgba(30, 43, 88, 0.05)' }}
 contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
 />
 <Bar dataKey="average" fill="#A5B4D4" radius={[4, 4, 0, 0]} barSize={12} />
 <Bar dataKey="current" fill="#1E2B58" radius={[4, 4, 0, 0]} barSize={20} />
 </BarChart>
 </ResponsiveContainer>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
 <div className="p-6 rounded-2xl bg-[#1E2B58]/5 dark:bg-white/5 border border-white/50">
 <p className="text-xs font-semibold text-slate-500 mb-2">Peak Demand Subject</p>
 <div className="flex items-center justify-between">
 <h4 className="text-xl font-bold text-[#1E2B58] dark:text-white">{peakSubject.name}</h4>
 <span className="bg-[#1E2B58] text-white text-[11px] px-2.5 py-1 rounded-full font-bold">{peakSubject.increase}</span>
 </div>
 </div>
 <div className="p-6 rounded-2xl bg-[#1E2B58]/5 dark:bg-white/5 border border-white/50">
 <p className="text-xs font-semibold text-slate-500 mb-2">Resource Availability</p>
 <div className="flex items-center justify-between">
 <h4 className="text-xl font-bold text-[#1E2B58] dark:text-white">{availability.status} ({availability.rate}%)</h4>
 <span className={`material-symbols-outlined text-[24px] ${availability.rate > 70 ? 'text-green-500' : 'text-amber-500'}`}>
 {availability.rate > 70 ? 'check_circle' : 'warning'}
 </span>
 </div>
 </div>
 </div>
 </div>

 <div className="flex flex-col border-l border-slate-200 dark:border-white/10 lg:pl-12">
 <h3 className="text-sm font-bold text-[#1E2B58] dark:text-white mb-8">Resource Type Distribution</h3>
 <div className="h-64 relative flex items-center justify-center">
 <ResponsiveContainer width="100%" height="100%">
 <PieChart>
 <Pie
 data={pieData}
 innerRadius={60}
 outerRadius={80}
 paddingAngle={5}
 dataKey="value"
 >
 {pieData.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={entry.color} />
 ))}
 </Pie>
 <Tooltip />
 </PieChart>
 </ResponsiveContainer>
 <div className="absolute flex flex-col items-center">
 <span className="text-3xl font-black text-[#1E2B58] dark:text-white">{totalItems > 1000 ? (totalItems/1000).toFixed(1) + 'k' : totalItems}</span>
 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total Items</span>
 </div>
 </div>
 <div className="space-y-4 mt-8">
 {pieData.map((item) => {
 const percentage = totalItems > 0 ? Math.round((item.value / totalItems) * 100) : 0;
 return (
 <div key={item.name} className="flex items-center justify-between text-xs">
 <div className="flex items-center gap-2">
 <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
 <span className="font-bold text-slate-600 dark:text-slate-300">{item.name}</span>
 </div>
 <span className="font-black text-[#1E2B58] dark:text-white">{percentage}%</span>
 </div>
 );
 })}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};

export default UsageStats;
