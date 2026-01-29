
import React, { useState } from 'react';

type Tab = 'report' | 'borrow' | 'approval';

const History: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('borrow');

  return (
    <div className="pt-32 pb-10 px-6 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <header className="mb-10 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-[#1E2B58] dark:text-white tracking-tight">
          My History
        </h2>
        <p className="mt-3 text-[#1E2B58] dark:text-[#E0EAFC] opacity-70 font-medium max-w-2xl mx-auto">
          Track your recent activities and approvals across the portal
        </p>
      </header>

      <div className="flex justify-center mb-10">
        <div className="extreme-glass rounded-full p-1.5 inline-flex gap-1">
          {(['report', 'borrow', 'approval'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'bg-white dark:bg-white/15 text-[#1E2B58] dark:text-white shadow-md'
                  : 'text-[#1E2B58]/40 dark:text-white/40'
              } px-8 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all capitalize`}
            >
              {tab} History
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card !rounded-[24px] p-2 mb-8 flex flex-wrap gap-2 items-center">
        <div className="flex-grow-[2] min-w-[200px] relative">
          <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-[#1E2B58]/40">search</span>
          <input
            className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-[#1E2B58] dark:text-white px-4 py-2.5 pl-12 placeholder-[#1E2B58]/40"
            placeholder="Search by ID, class, or equipment..."
            type="text"
          />
        </div>
        <div className="h-6 w-px bg-[#1E2B58]/10 hidden md:block"></div>
        <div className="flex-grow min-w-[160px]">
          <select className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-[#1E2B58] dark:text-white px-4 py-2.5 cursor-pointer appearance-none">
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
          </select>
        </div>
        <button className="navy-gradient-btn px-6 py-2.5 rounded-xl font-bold text-sm ml-auto">
          Apply Filters
        </button>
      </div>

      <div className="glass-card p-0 overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1E2B58]/5 dark:bg-white/5 border-b border-[#1E2B58]/10 dark:border-white/10">
                <th className="py-5 px-6 text-[10px] font-extrabold text-[#1E2B58]/60 dark:text-white/60 uppercase tracking-[0.1em]">Request ID</th>
                <th className="py-5 px-6 text-[10px] font-extrabold text-[#1E2B58]/60 dark:text-white/60 uppercase tracking-[0.1em]">Item / Subject</th>
                <th className="py-5 px-6 text-[10px] font-extrabold text-[#1E2B58]/60 dark:text-white/60 uppercase tracking-[0.1em]">Period / Date</th>
                <th className="py-5 px-6 text-[10px] font-extrabold text-[#1E2B58]/60 dark:text-white/60 uppercase tracking-[0.1em]">Status</th>
                <th className="py-5 px-6 text-[10px] font-extrabold text-[#1E2B58]/60 dark:text-white/60 uppercase tracking-[0.1em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-semibold text-[#1E2B58] dark:text-white divide-y divide-slate-100 dark:divide-white/5">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-white/30 dark:hover:bg-white/5 transition-all">
                  <td className="py-5 px-6 font-mono text-xs opacity-80">#REQ-2024-{892 - i}</td>
                  <td className="py-5 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold">MacBook Pro 16" (x{i})</span>
                      <span className="text-[10px] opacity-60">CS-405 Adv. AI</span>
                    </div>
                  </td>
                  <td className="py-5 px-6 text-xs">Oct {24 - i}, 09:00 - 12:00</td>
                  <td className="py-5 px-6">
                    <span className="inline-flex items-center justify-center w-24 h-7 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-100 text-green-700 border border-green-200">
                      Returned
                    </span>
                  </td>
                  <td className="py-5 px-6 text-right">
                    <button className="w-8 h-8 rounded-full hover:bg-white/50 transition-colors ml-auto flex items-center justify-center">
                      <span className="material-symbols-rounded text-lg">visibility</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
