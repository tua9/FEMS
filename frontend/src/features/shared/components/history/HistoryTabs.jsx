import React from 'react';

export const HistoryTabs = ({ activeTab, onTabChange, hideApproval, hideBorrow }) => {
 return (
 <div className="flex justify-center mb-[2.5rem]">
 <div className="bg-white/40 dark:bg-slate-800/40 border border-white/60 dark:border-white/10 rounded-full p-[0.375rem] flex items-center shadow-sm backdrop-blur-md overflow-x-auto hide-scrollbar max-w-full">
 <button
 onClick={() => onTabChange('report')}
 className={`px-[1.5rem] md:px-[2rem] py-[0.75rem] md:py-[1rem] rounded-full text-[0.875rem] font-bold whitespace-nowrap transition-all ${activeTab === 'report' ? 'bg-white dark:bg-slate-700 text-[#1E2B58] dark:text-white shadow-[0_4px_12px_rgba(30,43,88,0.05)]' : 'text-slate-500 hover:text-[#1E2B58] dark:hover:text-white'}`}
 >
 Report History
 </button>
 {!hideBorrow && (
 <button
 onClick={() => onTabChange('borrow')}
 className={`px-[1.5rem] md:px-[2rem] py-[0.75rem] md:py-[1rem] rounded-full text-[0.875rem] font-bold whitespace-nowrap transition-all ${activeTab === 'borrow' ? 'bg-white dark:bg-slate-700 text-[#1E2B58] dark:text-white shadow-[0_4px_12px_rgba(30,43,88,0.05)]' : 'text-slate-500 hover:text-[#1E2B58] dark:hover:text-white'}`}
 >
 Borrow History
 </button>
 )}
 {!hideApproval && (
 <button
 onClick={() => onTabChange('approval')}
 className={`px-[1.5rem] md:px-[2rem] py-[0.75rem] md:py-[1rem] rounded-full text-[0.875rem] font-bold whitespace-nowrap transition-all ${activeTab === 'approval' ? 'bg-white dark:bg-slate-700 text-[#1E2B58] dark:text-white shadow-[0_4px_12px_rgba(30,43,88,0.05)]' : 'text-slate-500 hover:text-[#1E2B58] dark:hover:text-white'}`}
 >
 Approval History
 </button>
 )}
 </div>
 </div>
 );
};
