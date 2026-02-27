import React from 'react';
import { Asset, getAssetStatusStyle } from '@/data/technician/mockEquipment';

interface Props {
  asset: Asset;
}

const AssetCard: React.FC<Props> = ({ asset }) => {
  const st = getAssetStatusStyle(asset.status);

  return (
    <div
      className="p-6 rounded-3xl border border-white/50 shadow-sm hover:shadow-md transition-all group relative cursor-pointer"
      style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(16px)' }}
    >
      {/* Icon box */}
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-4 group-hover:bg-[#232F58] group-hover:text-white transition-colors duration-200">
        <span className="material-symbols-outlined">{asset.icon}</span>
      </div>

      {/* Name & serial */}
      <h3 className="font-bold text-slate-900 mb-1">{asset.name}</h3>
      <p className="text-xs text-slate-500 font-medium mb-8">SN: {asset.serial}</p>

      {/* Status badge — bottom right */}
      <div className="absolute bottom-6 right-6 flex items-center gap-1.5">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${st.color}`}>
          {st.label}
        </span>
        <span className={`w-2 h-2 rounded-full ${st.dot}`}></span>
      </div>
    </div>
  );
};

export default AssetCard;
