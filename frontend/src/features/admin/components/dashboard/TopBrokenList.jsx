import React from 'react';

const TopBrokenList = ({ items }) => {
  const maxCount = Math.max(...(items?.map((i) => i.count) ?? []), 5);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h4 className="text-[13px] font-bold text-[#1A2B56] dark:text-blue-400 uppercase tracking-widest mb-1">Inventory at Risk</h4>
        <p className="text-[10px] text-slate-500 font-medium tracking-wide">High-frequency failure models requiring review</p>
      </div>

      {!items || items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center opacity-40">
           <p className="text-xs font-bold text-slate-400 italic text-center leading-relaxed">System reliability: Nominal<br/>No recurring issues detected</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {items.slice(0, 6).map((item, idx) => {
            const pct = Math.round((item.count / maxCount) * 100);
            return (
              <div key={item._id ?? idx} className="flex items-center gap-5 group">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-black text-sm transition-all shadow-sm ${
                    idx === 0 ? 'bg-rose-500 text-white shadow-rose-200' : 
                    idx === 1 ? 'bg-rose-400 text-white shadow-rose-100' :
                    'bg-slate-100 text-slate-400 dark:bg-slate-800'
                }`}>
                    {idx + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="min-w-0">
                      <span className="text-[13px] font-black text-[#1A2B56] dark:text-white truncate block">{item.name}</span>
                      <span className="text-[9px] font-bold uppercase text-rose-400/80 tracking-widest">Failure Load</span>
                    </div>
                    <div className="flex flex-col items-end shrink-0 pl-4">
                      <span className="text-sm font-black text-rose-500">{item.count}</span>
                    </div>
                  </div>
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-rose-300 rounded-full transition-all duration-1000"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TopBrokenList;
