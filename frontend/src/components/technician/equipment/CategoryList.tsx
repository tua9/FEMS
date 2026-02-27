import React from 'react';
import { AssetCategory, CATEGORY_META } from '@/data/technician/mockEquipment';

interface Props {
  activeCategory: AssetCategory;
  onSelect: (category: AssetCategory) => void;
}

const CategoryList: React.FC<Props> = ({ activeCategory, onSelect }) => (
  <div
    className="p-6 rounded-3xl border border-white/40 shadow-sm"
    style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(16px)' }}
  >
    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-6">
      Categories
    </h3>
    <nav className="space-y-2">
      {CATEGORY_META.map(({ label, icon, count }) => {
        const isActive = activeCategory === label;
        return (
          <button
            key={label}
            onClick={() => onSelect(label)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${
              isActive
                ? 'bg-white text-[#232F58] font-bold shadow-sm'
                : 'text-slate-600 hover:bg-white/40 font-semibold'
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="material-symbols-outlined text-xl">{icon}</span>
              {label}
            </span>
            <span
              className={`text-[10px] ${
                isActive ? 'bg-slate-100 px-2 py-0.5 rounded-full font-bold' : 'opacity-60'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </nav>
  </div>
);

export default CategoryList;
