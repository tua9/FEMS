import React, { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { useBorrowRequestStore } from '../../../stores/useBorrowRequestStore';
export const BorrowEditForm = ({ item, onSuccess, onCancel }) => {
 const toLocalDatetime = (isoString) => {
 if (!isoString) return '';
 const d = new Date(isoString);
 const offset = d.getTimezoneOffset() * 60000;
 return (new Date(d.getTime() - offset)).toISOString().slice(0, 16);
 };

 const [borrowDate, setBorrowDate] = useState(toLocalDatetime(item.original.borrow_date));
 const [returnDate, setReturnDate] = useState(toLocalDatetime(item.original.return_date));
 const [purpose, setPurpose] = useState(item.original.note || '');
 
 const { editMyBorrowRequest } = useBorrowRequestStore();
 const [saving, setSaving] = useState(false);
 const [localError, setLocalError] = useState('');

 const handleSave = async () => {
 setSaving(true);
 setLocalError('');
 try {
 await editMyBorrowRequest(item.original._id, {
 borrow_date: new Date(borrowDate).toISOString(),
 return_date: new Date(returnDate).toISOString(),
 note: purpose
 });
 onSuccess();
 } catch (err) {
 setLocalError(err?.response?.data?.message || 'Update failed');
 } finally {
 setSaving(false);
 }
 };

 return (
 <div className="flex flex-col w-full h-full">
 <div className="space-y-4 mb-6 bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] p-5">
 <div className="text-sm">
 <label className="block text-[#1E2B58]/60 dark:text-white/50 font-medium mb-1">Borrow Date</label>
 <input type="datetime-local" value={borrowDate} onChange={e => setBorrowDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-[#1E2B58]/10 dark:border-white/10 bg-white/50 dark:bg-black/20" />
 </div>
 <div className="text-sm">
 <label className="block text-[#1E2B58]/60 dark:text-white/50 font-medium mb-1">Return Date</label>
 <input type="datetime-local" value={returnDate} onChange={e => setReturnDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-[#1E2B58]/10 dark:border-white/10 bg-white/50 dark:bg-black/20" />
 </div>
 <div className="text-sm">
 <label className="block text-[#1E2B58]/60 dark:text-white/50 font-medium mb-1">Purpose</label>
 <textarea value={purpose} onChange={e => setPurpose(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-[#1E2B58]/10 dark:border-white/10 bg-white/50 dark:bg-black/20 min-h-[80px]" />
 </div>
 {localError && <p className="text-red-500 text-xs font-bold">{localError}</p>}
 </div>

 <div className="flex gap-3">
 <button
 onClick={handleSave}
 disabled={saving}
 className="flex-1 py-3 rounded-[1.25rem] font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
 >
 {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
 </button>
 <button
 onClick={onCancel}
 className="flex-1 py-3 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 transition-all"
 >
 Cancel
 </button>
 </div>
 </div>
 );
};
