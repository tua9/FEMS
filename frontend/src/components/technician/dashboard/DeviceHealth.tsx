import React from 'react';

const DeviceHealth: React.FC = () => {
  return (
    <div className="glass-card p-8 rounded-3xl shadow-sm flex flex-col h-full">
      <h3 className="text-sm font-bold text-[#1A2B56] dark:text-white uppercase tracking-widest mb-10">
        Device Health
      </h3>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Donut Chart — exact from HTML */}
        <div className="relative w-44 h-44 mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background */}
            <circle
              className="text-white/30"
              cx="50" cy="50" fill="transparent" r="40"
              stroke="currentColor" strokeWidth="10"
            />
            {/* 80% Healthy — primary */}
            <circle
              className="text-[#1A2B56]"
              cx="50" cy="50" fill="transparent" r="40"
              stroke="currentColor"
              strokeDasharray="251.2"
              strokeDashoffset="50.2"
              strokeLinecap="round"
              strokeWidth="10"
            />
            {/* 15% Maintenance — blue-accent */}
            <circle
              className="text-blue-400"
              cx="50" cy="50" fill="transparent" r="40"
              stroke="currentColor"
              strokeDasharray="251.2"
              strokeDashoffset="213.5"
              strokeLinecap="round"
              strokeWidth="10"
            />
            {/* 5% Faulty — blue-light */}
            <circle
              className="text-blue-200"
              cx="50" cy="50" fill="transparent" r="40"
              stroke="currentColor"
              strokeDasharray="251.2"
              strokeDashoffset="238.6"
              strokeLinecap="round"
              strokeWidth="10"
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-[#1A2B56] dark:text-white leading-none">
              1,248
            </span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
              Assets
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full max-w-xs mx-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1A2B56]"></span>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">80% Healthy</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">15% Maint.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-200"></span>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">5% Faulty</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceHealth;
