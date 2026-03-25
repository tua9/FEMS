import React from 'react';
import AssetCard, { type Asset } from './AssetCard';

interface Props {
  assets: Asset[];
  onAssetClick?: (asset: Asset) => void;
}

const AssetGrid: React.FC<Props> = ({ assets, onAssetClick }) => {
  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <span className="material-symbols-outlined text-5xl mb-3">inventory_2</span>
        <p className="font-semibold">No assets found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} onClick={onAssetClick} />
      ))}
    </div>
  );
};

export default AssetGrid;

