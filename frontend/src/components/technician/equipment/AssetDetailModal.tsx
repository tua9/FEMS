import React from 'react';
import { Asset, getAssetStatusStyle } from '@/data/technician/mockEquipment';
import {
  MODAL_OVERLAY, MODAL_CARD, CLOSE_BTN,
  BTN_PRIMARY, BTN_SECONDARY, SECTION_LABEL, INFO_CARD, CHIP,
} from '@/components/technician/common/modalStyles';

interface Props {
  asset: Asset;
  onClose: () => void;
  onEdit: (asset: Asset) => void;
}

const AssetDetailModal: React.FC<Props> = ({ asset, onClose, onEdit }) => {
  const st        = getAssetStatusStyle(asset.status);
  const condition = asset.condition ?? 80;

  const conditionColor =
    condition >= 80 ? 'bg-emerald-500' :
    condition >= 50 ? 'bg-amber-500'   : 'bg-rose-500';

  const conditionLabel =
    condition >= 80 ? 'Good' :
    condition >= 50 ? 'Fair' : 'Poor';

  return (
    <div className={MODAL_OVERLAY} onClick={onClose}>
      <div
        className={`${MODAL_CARD} max-w-lg`}
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="px-7 pt-7 pb-5 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#1A2B56] text-3xl">{asset.icon}</span>
              </div>
              <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${st.dot}`} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#1A2B56] leading-tight">{asset.name}</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5 uppercase tracking-wider">{asset.category}</p>
            </div>
          </div>
          <button onClick={onClose} className={CLOSE_BTN}>
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* ── Status chip ── */}
        <div className="px-7 pb-5 flex items-center gap-2">
          <span className={`${CHIP} ${st.bg} ${st.color} border ${st.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
            {st.label}
          </span>
        </div>

        <div className="mx-7 border-t border-slate-100" />

        {/* ── Scrollable body ── */}
        <div className="px-7 py-6 overflow-y-auto flex-1 space-y-5">

          {/* Device image */}
          {asset.imageUrl && (
            <div className="w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-50" style={{ height: 200 }}>
              <img
                src={asset.imageUrl}
                alt={asset.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className={INFO_CARD}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Asset ID</p>
              <p className="text-sm font-bold text-slate-800">{asset.id}</p>
            </div>
            <div className={INFO_CARD}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Serial Number</p>
              <p className="text-sm font-bold text-slate-800">{asset.serial}</p>
            </div>

            {asset.location && (
              <div className={`col-span-2 ${INFO_CARD} flex items-start gap-3`}>
                <span className="material-symbols-outlined text-slate-400 text-base mt-0.5">location_on</span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
                  <p className="text-sm font-semibold text-slate-800">{asset.location}</p>
                </div>
              </div>
            )}

            {asset.purchaseDate && (
              <div className={`${INFO_CARD} flex items-start gap-3`}>
                <span className="material-symbols-outlined text-slate-400 text-base mt-0.5">calendar_month</span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Purchased</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {new Date(asset.purchaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            )}

            <div className={`${INFO_CARD} flex items-start gap-3`}>
              <span className="material-symbols-outlined text-slate-400 text-base mt-0.5">category</span>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Category</p>
                <p className="text-sm font-semibold text-slate-800">{asset.category}</p>
              </div>
            </div>
          </div>

          {/* Condition bar */}
          <div>
            <p className={`${SECTION_LABEL} mb-2`}>Device Condition</p>
            <div className={INFO_CARD}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">{conditionLabel}</span>
                <span className="text-sm font-bold text-slate-800">{condition}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${conditionColor}`}
                  style={{ width: `${condition}%` }}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          {asset.notes && (
            <div className="space-y-2">
              <p className={SECTION_LABEL}>Notes</p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-500 text-base mt-0.5">sticky_note_2</span>
                <p className="text-sm text-slate-700 leading-relaxed">{asset.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-7 py-5 border-t border-slate-100 flex gap-3">
          <button onClick={onClose} className={BTN_SECONDARY}>
            Close
          </button>
          <button onClick={() => onEdit(asset)} className={BTN_PRIMARY}>
            <span className="material-symbols-outlined text-base">edit</span>
            Edit Asset
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetDetailModal;

