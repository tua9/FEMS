import React, { useState, useRef } from 'react';
import { getAssetStatusStyle } from '@/data/technician/mockEquipment';
import {
 MODAL_OVERLAY, MODAL_CARD, CLOSE_BTN,
 BTN_PRIMARY, BTN_SECONDARY,
 SECTION_LABEL, INPUT_CLASS, TEXTAREA_CLASS,
} from '@/components/technician/common/modalStyles';

const CATEGORIES= [
 'Computing', 'AV Display', 'Networking', 'Peripherals', 'Other',
];

const STATUSES= ['Operational', 'Maintenance', 'Faulty', 'Offline'];

const ICON_MAP = {
 Computing: 'laptop_mac',
 'AV Display':'monitor',
 Networking: 'router',
 Peripherals: 'print',
 Other: 'category',
};

const AssetEditModal = ({ asset, onClose, onSave }) => {
 const [form, setForm] = useState({ ...asset });
 const [imageError, setImageError] = useState('');
 const fileInputRef = useRef(null);

 const set = (key, value) =>
 setForm((prev) => ({ ...prev, [key]: value }));

 const handleImageChange = (e) => {
 const file = e.target.files?.[0];
 if (!file) return;
 if (!file.type.startsWith('image/')) { setImageError('Please upload a valid image file.'); return; }
 if (file.size > 5 * 1024 * 1024) { setImageError('Image size must be under 5MB.'); return; }
 const reader = new FileReader();
 reader.onload = (ev) => { set('imageUrl', ev.target?.result); setImageError(''); };
 reader.readAsDataURL(file);
 };

 const handleCategoryChange = (cat) => {
 setForm((prev) => ({ ...prev, category: cat, icon: ICON_MAP[cat] }));
 };

 const handleSubmit = (e) => {
 e.preventDefault();
 onSave(form);
 };

 return (
 <div className={MODAL_OVERLAY} onClick={onClose}>
 <div
 className={`${MODAL_CARD} max-w-lg`}
 style={{ maxHeight: '92vh' }}
 onClick={(e) => e.stopPropagation()}
 >
 {/* ── Header ── */}
 <div className="px-7 pt-7 pb-5 flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-xl bg-[#1A2B56] flex items-center justify-center shrink-0">
 <span className="material-symbols-outlined text-white text-xl">edit</span>
 </div>
 <div>
 <h2 className="text-base font-extrabold text-[#1A2B56]">Edit Asset</h2>
 <p className="text-xs text-slate-400 mt-0.5">Update device information</p>
 </div>
 </div>
 <button type="button" onClick={onClose} className={CLOSE_BTN}>
 <span className="material-symbols-outlined text-lg">close</span>
 </button>
 </div>

 <div className="mx-7 border-t border-slate-100" />

 {/* ── Scrollable form ── */}
 <form onSubmit={handleSubmit} className="px-7 py-6 overflow-y-auto flex-1 space-y-5" id="asset-edit-form">

 {/* Name + Serial */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div className="space-y-1.5">
 <label className={SECTION_LABEL}>Device Name</label>
 <input
 type="text"
 value={form.name}
 onChange={(e) => set('name', e.target.value)}
 required
 placeholder="e.g. MacBook Pro M2"
 className={INPUT_CLASS}
 />
 </div>
 <div className="space-y-1.5">
 <label className={SECTION_LABEL}>Serial Number</label>
 <input
 type="text"
 value={form.serial}
 onChange={(e) => set('serial', e.target.value)}
 required
 placeholder="e.g. FPT-LAP-082"
 className={INPUT_CLASS}
 />
 </div>
 </div>

 {/* Category */}
 <div className="space-y-2">
 <label className={SECTION_LABEL}>Category</label>
 <div className="grid grid-cols-2 gap-2">
 {CATEGORIES.map((c, i) => (
 <button
 key={c}
 type="button"
 onClick={() => handleCategoryChange(c)}
 className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
 i === CATEGORIES.length - 1 && CATEGORIES.length % 2 !== 0 ? 'col-span-2' : ''
 } ${
 form.category === c
 ? 'border-[#1A2B56] bg-[#1A2B56] text-white shadow-sm'
 : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white hover:border-slate-300'
 }`}
 >
 <span className="material-symbols-outlined text-sm">{ICON_MAP[c]}</span>
 {c}
 </button>
 ))}
 </div>
 </div>

 {/* Status */}
 <div className="space-y-2">
 <label className={SECTION_LABEL}>Status</label>
 <div className="grid grid-cols-2 gap-2">
 {STATUSES.map((s) => {
 const style = getAssetStatusStyle(s);
 const active = form.status === s;
 return (
 <button
 key={s}
 type="button"
 onClick={() => set('status', s)}
 className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
 active
 ? `${style.bg} ${style.border} ${style.color}`
 : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white hover:border-slate-300'
 }`}
 >
 <span className={`w-2 h-2 rounded-full ${style.dot}`} />
 {s}
 </button>
 );
 })}
 </div>
 </div>

 {/* Location */}
 <div className="space-y-1.5">
 <label className={SECTION_LABEL}>Location</label>
 <div className="relative">
 <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-base pointer-events-none">location_on</span>
 <input
 type="text"
 value={form.location ?? ''}
 onChange={(e) => set('location', e.target.value)}
 placeholder="e.g. Room 201 – FPT Tower A"
 className={`${INPUT_CLASS} pl-10`}
 />
 </div>
 </div>

 {/* Purchase Date + Condition */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div className="space-y-1.5">
 <label className={SECTION_LABEL}>Purchase Date</label>
 <div className="relative">
 <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-base pointer-events-none">calendar_month</span>
 <input
 type="date"
 value={form.purchaseDate ?? ''}
 onChange={(e) => set('purchaseDate', e.target.value)}
 className={`${INPUT_CLASS} pl-10`}
 />
 </div>
 </div>
 <div className="space-y-1.5">
 <label className={`${SECTION_LABEL} flex justify-between`}>
 <span>Condition</span>
 <span className="text-slate-600 normal-case font-semibold">{form.condition ?? 80}%</span>
 </label>
 <input
 type="range"
 min={0} max={100}
 value={form.condition ?? 80}
 onChange={(e) => set('condition', Number(e.target.value))}
 className="w-full h-2 rounded-full accent-[#1A2B56] mt-3 cursor-pointer"
 />
 </div>
 </div>

 {/* Device Image */}
 <div className="space-y-1.5">
 <label className={SECTION_LABEL}>Device Image</label>
 <input
 ref={fileInputRef}
 type="file"
 accept="image/*"
 onChange={handleImageChange}
 className="hidden"
 />
 {imageError && (
 <p className="text-xs text-rose-500 font-medium">{imageError}</p>
 )}
 {form.imageUrl ? (
 <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-50" style={{ height: 160 }}>
 <img src={form.imageUrl} alt={form.name} className="w-full h-full object-cover" />
 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
 <button
 type="button"
 onClick={() => fileInputRef.current?.click()}
 className="px-3 py-1.5 rounded-lg bg-white text-[#1A2B56] text-xs font-bold flex items-center gap-1.5 shadow"
 >
 <span className="material-symbols-outlined text-sm">edit</span>
 Change
 </button>
 <button
 type="button"
 onClick={() => { set('imageUrl', undefined); setImageError(''); }}
 className="px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
 >
 <span className="material-symbols-outlined text-sm">delete</span>
 Remove
 </button>
 </div>
 </div>
 ) : (
 <button
 type="button"
 onClick={() => fileInputRef.current?.click()}
 className="w-full flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-[#1A2B56]/30 transition-all py-8"
 >
 <div className="w-10 h-10 rounded-xl bg-[#1A2B56]/8 flex items-center justify-center">
 <span className="material-symbols-outlined text-[#1A2B56]/60 text-2xl">add_photo_alternate</span>
 </div>
 <div className="text-center">
 <p className="text-xs font-bold text-slate-600">Click to upload image</p>
 <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP · Max 5MB</p>
 </div>
 </button>
 )}
 </div>

 {/* Notes */}
 <div className="space-y-1.5">
 <label className={SECTION_LABEL}>Notes</label>
 <textarea
 value={form.notes ?? ''}
 onChange={(e) => set('notes', e.target.value)}
 placeholder="Add any relevant notes about this asset..."
 rows={3}
 className={TEXTAREA_CLASS}
 />
 </div>
 </form>

 {/* ── Footer ── */}
 <div className="px-7 py-5 border-t border-slate-100 flex gap-3">
 <button type="button" onClick={onClose} className={BTN_SECONDARY}>
 Cancel
 </button>
 <button type="submit" form="asset-edit-form" onClick={handleSubmit} className={BTN_PRIMARY}>
 <span className="material-symbols-outlined text-base">save</span>
 Save Changes
 </button>
 </div>
 </div>
 </div>
 );
};

export default AssetEditModal;
