import React from 'react';
import { HandoverTab } from '@/data/technician/mockHandover';

interface Props {
  active: HandoverTab;
  onChange: (tab: HandoverTab) => void;
}

const TABS: HandoverTab[] = ['Requests', 'Handover', 'Collect', 'History'];

const HandoverTabBar: React.FC<Props> = ({ active, onChange }) => (
  <div className="flex justify-center mb-10">
    <div
      className="p-1.5 rounded-full flex gap-1 border border-white/40 shadow-xl"
      style={{ background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(24px)' }}
    >
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-10 py-2.5 rounded-full text-sm font-bold transition-all ${
            active === tab
              ? 'bg-white text-[#1A2B56] shadow-md'
              : 'text-slate-600 hover:bg-white/20'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  </div>
);

export default HandoverTabBar;
