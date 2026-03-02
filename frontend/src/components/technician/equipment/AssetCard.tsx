import React from 'react';
import { Asset, getAssetStatusStyle } from '@/data/technician/mockEquipment';

interface Props {
  asset: Asset;
  onClick?: (asset: Asset) => void;
}

const AssetCard: React.FC<Props> = ({ asset, onClick }) => {
  const st = getAssetStatusStyle(asset.status);

  return (
    <div
      onClick={() => onClick?.(asset)}
      className="rounded-3xl border border-white/50 shadow-sm hover:shadow-md transition-all group relative cursor-pointer overflow-hidden flex flex-col"
      style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(16px)' }}
    >
      {/* Image / Icon area */}
      {asset.imageUrl ? (
        <div className="w-full h-40 overflow-hidden bg-slate-100 flex-shrink-0">
          <img
            src={asset.imageUrl}
            alt={asset.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full h-40 bg-slate-50 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-600 flex items-center justify-center text-slate-400 shadow-sm group-hover:bg-[#232F58] group-hover:text-white transition-colors duration-200">
            <span className="material-symbols-outlined text-3xl">{asset.icon}</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-5 pb-10 flex-1">
        {/* Name & serial */}
        <h3 className="font-bold text-slate-900 dark:text-white mb-1 truncate">{asset.name}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">SN: {asset.serial}</p>
      </div>

      {/* Status badge — bottom right */}
      <div className="absolute bottom-4 right-5 flex items-center gap-1.5">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${st.color}`}>
          {st.label}
        </span>
        <span className={`w-2 h-2 rounded-full ${st.dot}`}></span>
      </div>
    </div>
  );
};

export default AssetCard;
