
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const DATA = [
  { name: 'CS101', current: 85, average: 60 },
  { name: 'AI202', current: 55, average: 40 },
  { name: 'SWE301', current: 95, average: 70 },
  { name: 'NET401', current: 45, average: 30 },
  { name: 'DS502', current: 65, average: 50 },
];

const PIE_DATA = [
  { name: 'Computing Devices', value: 55, color: '#1E2B58' },
  { name: 'AV Equipment', value: 30, color: '#38bdf8' },
  { name: 'Other Assets', value: 15, color: '#cbd5e1' },
];

const UsageStats: React.FC = () => {
  return (
    <div className="pt-32 pb-10 px-6 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <header className="mb-10">
        <h2 className="text-4xl font-extrabold text-[#1E2B58] dark:text-white mb-2 tracking-tight">Resource Efficiency by Subject</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Analyze how resources are distributed across course tracks.</p>
      </header>

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
                <BarChart data={DATA}>
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
                  <h4 className="text-xl font-bold text-[#1E2B58] dark:text-white">Software Engineering</h4>
                  <span className="bg-[#1E2B58] text-white text-[11px] px-2.5 py-1 rounded-full font-bold">+12%</span>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-[#1E2B58]/5 dark:bg-white/5 border border-white/50">
                <p className="text-xs font-semibold text-slate-500 mb-2">Resource Availability</p>
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-bold text-[#1E2B58] dark:text-white">Optimal (84%)</h4>
                  <span className="material-symbols-outlined text-green-500 text-[24px]">check_circle</span>
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
                    data={PIE_DATA}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {PIE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-[#1E2B58] dark:text-white">1.2k</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total Items</span>
              </div>
            </div>
            <div className="space-y-4 mt-8">
              {PIE_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="font-bold text-slate-600 dark:text-slate-300">{item.name}</span>
                  </div>
                  <span className="font-black text-[#1E2B58] dark:text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageStats;
