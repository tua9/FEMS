import React from 'react';
import { CATEGORY_META } from '@/mocks/technician/mockEquipment';

const CategoryList = ({ activeCategory, onSelect }) => (
 <div className="dashboard-card p-6 rounded-3xl">
 <h3 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">
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
 ? 'bg-white dark:bg-slate-700 text-[#232F58] dark:text-white font-bold shadow-sm'
 : 'text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/10 font-semibold'
 }`}
 >
 <span className="flex items-center gap-3">
 <span className="material-symbols-outlined text-xl">{icon}</span>
 {label}
 </span>
 <span
 className={`text-[10px] ${
 isActive ? 'bg-slate-100 dark:bg-slate-600 px-2 py-0.5 rounded-full font-bold' : 'opacity-60'
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
