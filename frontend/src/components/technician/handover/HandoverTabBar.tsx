import React from 'react';
import { HandoverTab } from '@/data/technician/mockHandover';

interface Props {
  active: HandoverTab;
  onChange: (tab: HandoverTab) => void;
}

const TABS: HandoverTab[] = ['Requests', 'Handover', 'Collect', 'History'];

const HandoverTabBar: React.FC<Props> = ({ active, onChange }) => (
  <div className="flex justify-center mb-10">
    <div className="p-1.5 rounded-full flex gap-1 border border-white/40 dark:border-white/15 shadow-xl bg-white/40 dark:bg-slate-800/70 backdrop-blur-xl">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-10 py-2.5 rounded-full text-sm font-bold transition-all ${
            active === tab
              ? 'bg-white text-[#1A2B56] shadow-md dark:bg-[#1A2B56] dark:text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-white/10'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  </div>
);

export default HandoverTabBar;
