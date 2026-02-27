import React, { useState } from 'react';

const TicketPipeline: React.FC = () => {
  const [_period, _setPeriod] = useState('Last 7 days');

  const pipelines = [
    { label: 'New Reports', value: 42, pct: 100, color: 'bg-[#1A2B56]' },
    { label: 'Assigned', value: 31, pct: 75, color: 'bg-blue-400' },
    { label: 'Resolved', value: 19, pct: 45, color: 'bg-blue-200' },
  ];

  return (
    <div className="glass-card p-8 rounded-3xl shadow-sm h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-sm font-bold text-[#1A2B56] dark:text-white uppercase tracking-widest">
          Ticket Pipeline
        </h3>
        <button className="text-[10px] font-bold text-slate-400 hover:text-[#1A2B56] flex items-center gap-1 transition-colors uppercase tracking-wider">
          Last 7 Days
          <span className="material-symbols-outlined text-xs">expand_more</span>
        </button>
      </div>

      {/* Bars */}
      <div className="space-y-6">
        {pipelines.map((item) => (
          <div key={item.label} className="flex items-center gap-4">
            <div className="w-24 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              {item.label}
            </div>
            <div className="flex-1 h-8 bg-white/30 dark:bg-white/10 rounded-full relative overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full ${item.color} rounded-full transition-all duration-700`}
                style={{ width: `${item.pct}%` }}
              ></div>
            </div>
            <div className="w-8 text-[10px] font-bold text-[#1A2B56] dark:text-white shrink-0">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketPipeline;
