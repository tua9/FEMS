import React from 'react';

interface Props {
  /** 0–100 */
  percentage: number;
}

const StorageStatus: React.FC<Props> = ({ percentage }) => (
  <div className="bg-[#232F58] p-6 rounded-3xl shadow-lg relative overflow-hidden group">
    <div className="relative z-10">
      <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">
        Storage Status
      </p>
      <p className="text-white text-xl font-bold mb-4">{percentage}% Capacity</p>
      <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-white rounded-full" style={{ width: `${percentage}%` }} />
      </div>
    </div>

    {/* Decorative icon */}
    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
      <span className="material-symbols-outlined text-[80px] text-white">inventory_2</span>
    </div>
  </div>
);

export default StorageStatus;
