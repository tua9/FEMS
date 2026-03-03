import React from 'react';
import { Asset } from '@/data/technician/mockEquipment';
import { MODAL_OVERLAY } from '@/components/technician/common/modalStyles';

interface Props {
  asset: Asset;
  onClose: () => void;
  onView: (asset: Asset) => void;
}

const AddEquipmentSuccessModal: React.FC<Props> = ({ asset, onClose, onView }) => (
  <div
    className={MODAL_OVERLAY}
    onClick={onClose}
  >
    <div
      className="relative bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-5 w-full max-w-sm mx-4"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>

      {/* Checkmark */}
      <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
          <span className="material-symbols-outlined text-white text-3xl">check</span>
        </div>
      </div>

      {/* Text */}
      <div className="text-center space-y-1.5">
        <h3 className="text-xl font-extrabold text-[#1A2B56]">Device Added Successfully!</h3>
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-700">{asset.name}</span> has been registered to the inventory.
        </p>
      </div>

      {/* Asset summary pill */}
      <div className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-[#1A2B56]/8 flex items-center justify-center flex-shrink-0">
          {asset.imageUrl ? (
            <img src={asset.imageUrl} alt={asset.name} className="w-10 h-10 rounded-xl object-cover" />
          ) : (
            <span className="material-symbols-outlined text-[#1A2B56] text-xl">{asset.icon}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-extrabold text-[#1A2B56] truncate">{asset.name}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">
            {asset.serial} · {asset.category}
          </p>
        </div>
        <span className="ml-auto shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-600">
          {asset.status}
        </span>
      </div>

      {/* Actions */}
      <div className="w-full flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
        >
          Close
        </button>
        <button
          onClick={() => onView(asset)}
          className="flex-1 py-3 rounded-2xl bg-[#1A2B56] text-white text-sm font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-base">visibility</span>
          View Device
        </button>
      </div>
    </div>
  </div>
);

export default AddEquipmentSuccessModal;
