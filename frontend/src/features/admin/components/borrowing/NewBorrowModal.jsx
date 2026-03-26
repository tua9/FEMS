import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { useUserStore } from '@/stores/useUserStore';
import { useEquipmentStore } from '@/stores/useEquipmentStore';
import { borrowRequestService } from '@/services/borrowRequestService';

const normalize = (s) => (s || '').toLowerCase().trim();

const rankByQuery = (items, query, getHaystack) => {
 const q = normalize(query);
 if (!q) return items;

 const ranked= items
 .map((item) => {
 const hay = normalize(getHaystack(item));
 if (!hay) return { item, score: 0 };
 if (hay === q) return { item, score: 1000 };
 if (hay.startsWith(q)) return { item, score: 800 };
 const idx = hay.indexOf(q);
 if (idx >= 0) return { item, score: 500 - Math.min(idx, 400) };
 return { item, score: 0 };
 })
 .filter((r) => r.score > 0)
 .sort((a, b) => b.score - a.score);

 return ranked.map((r) => r.item);
};

const NewBorrowModal = ({ isOpen, onClose }) => {
 const { users, fetchAllUsers, loading: usersLoading } = useUserStore();
 const { equipments, fetchAll, loading: equipmentsLoading } = useEquipmentStore();

 const [userQuery, setUserQuery] = useState('');
 const [equipmentQuery, setEquipmentQuery] = useState('');
 const [selectedUser, setSelectedUser] = useState(null);
 const [selectedEquipment, setSelectedEquipment] = useState(null);

 const [borrowDate, setBorrowDate] = useState('');
 const [returnDate, setReturnDate] = useState('');
 const [note, setNote] = useState('');

 const [submitting, setSubmitting] = useState(false);

 const userInputRef = useRef(null);
 const equipmentInputRef = useRef(null);

 // Init modal state when opened
 useEffect(() => {
 if (!isOpen) return;

 const now = new Date();
 const pad = (n) => String(n).padStart(2, '0');
 const local = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

 setBorrowDate(local);
 setReturnDate('');
 setNote('');

 setUserQuery('');
 setEquipmentQuery('');
 setSelectedUser(null);
 setSelectedEquipment(null);

 // Fetch data for typeahead
 fetchAllUsers();
 fetchAll();

 // Focus first input
 setTimeout(() => userInputRef.current?.focus(), 0);
 }, [isOpen, fetchAllUsers, fetchAll]);

 const availableEquipments = useMemo(() => {
 return (equipments || []).filter((e) => e.available && e.status !== 'broken' && e.status !== 'maintenance');
 }, [equipments]);

 const filteredUsers = useMemo(() => {
 const base = users || [];
 const ranked = rankByQuery(base, userQuery, (u) => `${u.displayName} ${u.email} ${u.username} ${u._id}`);
 return ranked.slice(0, 8);
 }, [users, userQuery]);

 const filteredEquipments = useMemo(() => {
 const base = availableEquipments;
 const ranked = rankByQuery(base, equipmentQuery, (e) => `${e.name} ${e.category} ${e._id} ${e.code || ''}`);
 return ranked.slice(0, 8);
 }, [availableEquipments, equipmentQuery]);

 const topUser = filteredUsers[0] || null;
 const topEquipment = filteredEquipments[0] || null;

 const canSubmit = !!selectedUser && !!selectedEquipment && !!borrowDate && !!returnDate && !submitting;

 const closeAndReset = () => {
 onClose();
 };

 const handlePickUser = (u) => {
 setSelectedUser(u);
 setUserQuery(`${u.displayName} (${u.email})`);
 };

 const handlePickEquipment = (e) => {
 setSelectedEquipment(e);
 setEquipmentQuery(`${e.name} · ${e._id}`);
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 if (!selectedUser || !selectedEquipment) {
 toast.error('Please select both a user and an equipment.');
 return;
 }
 if (!borrowDate || !returnDate) {
 toast.error('Please choose start and return date/time.');
 return;
 }
 if (new Date(returnDate) <= new Date(borrowDate)) {
 toast.error('Return date must be after start date.');
 return;
 }

 try {
 setSubmitting(true);
 await borrowRequestService.directAllocateEquipment({
 borrowerId: selectedUser._id,
 equipmentId: selectedEquipment._id,
 borrowDate: new Date(borrowDate).toISOString(),
 expectedReturnDate: new Date(returnDate).toISOString(),
 note: note?.trim() || undefined,
 });
 toast.success('Direct allocation created');
 closeAndReset();
 } catch (err) {
 toast.error(err?.response?.data?.message || 'Failed to create direct allocation');
 } finally {
 setSubmitting(false);
 }
 };

 if (!isOpen) return null;

 return createPortal(
 <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm">
 <div className="absolute inset-0" onClick={closeAndReset}></div>

 <div className="relative w-full max-w-2xl dashboard-card rounded-4xl shadow-2xl shadow-[#1E2B58]/20 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

 {/* Header */}
 <div className="flex items-center justify-between px-8 py-6 border-b border-black/8 dark:border-white/10">
 <div>
 <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-0.5">Direct Allocation</p>
 <h3 className="text-xl font-extrabold text-[#1E2B58] dark:text-white">Create Direct Allocation</h3>
 <p className="text-xs text-slate-400 font-medium mt-0.5">Manually assign equipment to user without request.</p>
 </div>
 <button
 onClick={closeAndReset}
 className="w-8 h-8 rounded-full flex items-center justify-center text-[#1E2B58]/50 hover:text-[#1E2B58] hover:bg-[#1E2B58]/8 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
 >
 <span className="material-symbols-outlined">close</span>
 </button>
 </div>

 {/* Body */}
 <div className="p-6 overflow-y-auto custom-scrollbar">
 <form className="space-y-6" onSubmit={handleSubmit}>
 {/* Assignment Target */}
 <div className="space-y-4">
 <h4 className="text-sm font-extrabold text-[#1A2B56] dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">User Details</h4>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Search User <span className="text-red-500">*</span></label>
 <div className="relative">
 <span className="material-symbols-outlined absolute left-4 top-3 text-slate-400">search</span>
 <input
 type="text"
 ref={userInputRef}
 className="w-full pl-12 pr-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 text-sm focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500 outline-none transition-all dark:text-white"
 placeholder="Name, Email or ID"
 value={userQuery}
 onChange={(ev) => { setUserQuery(ev.target.value); setSelectedUser(null); }}
 onKeyDown={(ev) => {
 if (ev.key === 'Enter' && topUser) {
 ev.preventDefault();
 handlePickUser(topUser);
 }
 }}
 />

 {/* Suggestions */}
 {(userQuery.trim() && !selectedUser) && (
 <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 shadow-xl overflow-hidden">
 {(usersLoading ? (
 <div className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-300">Loading users...</div>
 ) : filteredUsers.length === 0 ? (
 <div className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-300">No matching users</div>
 ) : (
 filteredUsers.map((u, idx) => (
 <button
 type="button"
 key={u._id}
 onClick={() => handlePickUser(u)}
 className={`w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition flex items-center justify-between gap-3 ${idx === 0 ? 'bg-slate-50/70 dark:bg-slate-800/40' : ''}`}
 >
 <div className="min-w-0">
 <p className="text-sm font-black text-slate-800 dark:text-white truncate">{u.displayName}</p>
 <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">{u.email} • {u.username}</p>
 </div>
 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{u.role}</span>
 </button>
 ))))}
 </div>
 )}
 </div>
 </div>
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">User Role</label>
 <input
 type="text"
 disabled
 className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-500 outline-none"
 placeholder="Auto-filled"
 value={selectedUser?.role || ''}
 />
 </div>
 </div>
 </div>

 {/* Equipment Details */}
 <div className="space-y-4">
 <h4 className="text-sm font-extrabold text-[#1A2B56] dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Equipment Details</h4>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Search Equipment <span className="text-red-500">*</span></label>
 <div className="relative">
 <span className="material-symbols-outlined absolute left-4 top-3 text-slate-400">devices</span>
 <input
 type="text"
 ref={equipmentInputRef}
 className="w-full pl-12 pr-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 text-sm focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500 outline-none transition-all dark:text-white"
 placeholder="Scan barcode or type ID"
 value={equipmentQuery}
 onChange={(ev) => { setEquipmentQuery(ev.target.value); setSelectedEquipment(null); }}
 onKeyDown={(ev) => {
 if (ev.key === 'Enter' && topEquipment) {
 ev.preventDefault();
 handlePickEquipment(topEquipment);
 }
 }}
 />

 {(equipmentQuery.trim() && !selectedEquipment) && (
 <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 shadow-xl overflow-hidden">
 {(equipmentsLoading ? (
 <div className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-300">Loading equipments...</div>
 ) : filteredEquipments.length === 0 ? (
 <div className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-slate-300">No matching available equipments</div>
 ) : (
 filteredEquipments.map((eq, idx) => (
 <button
 type="button"
 key={eq._id}
 onClick={() => handlePickEquipment(eq)}
 className={`w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition flex items-center justify-between gap-3 ${idx === 0 ? 'bg-slate-50/70 dark:bg-slate-800/40' : ''}`}
 >
 <div className="min-w-0">
 <p className="text-sm font-black text-slate-800 dark:text-white truncate">{eq.name}</p>
 <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">{eq.category} • {eq._id}</p>
 </div>
 <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">available</span>
 </button>
 ))))}
 </div>
 )}
 </div>
 </div>
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Current Status</label>
 <input
 type="text"
 disabled
 className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-500 outline-none"
 placeholder="Auto-filled"
 value={selectedEquipment ? (selectedEquipment.available ? 'Available' : 'In Use') : ''}
 />
 </div>
 </div>
 </div>

 {/* Schedule */}
 <div className="space-y-4">
 <h4 className="text-sm font-extrabold text-[#1A2B56] dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Schedule & Terms</h4>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Start Date <span className="text-red-500">*</span></label>
 <input
 type="datetime-local"
 className="w-full bg-white/30 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500 outline-none transition-all dark:text-white backdrop-blur-sm"
 value={borrowDate}
 onChange={(ev) => setBorrowDate(ev.target.value)}
 />
 </div>
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Expected Return Date <span className="text-red-500">*</span></label>
 <input
 type="datetime-local"
 className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500 outline-none transition-all dark:text-white"
 value={returnDate}
 onChange={(ev) => setReturnDate(ev.target.value)}
 />
 </div>
 </div>

 <div className="space-y-1.5">
 <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Notes / Purpose</label>
 <textarea
 className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500 outline-none transition-all dark:text-white min-h-[80px] resize-y"
 placeholder="Purpose of allocation..."
 value={note}
 onChange={(ev) => setNote(ev.target.value)}
 ></textarea>
 </div>
 </div>

 {/* Submit button within form for Enter key support */}
 <button type="submit" className="hidden" aria-hidden="true" />
 </form>
 </div>

 {/* Footer */}
 <div className="px-8 py-5 border-t border-black/8 dark:border-white/10 flex items-center justify-end gap-3 bg-black/3 dark:bg-white/3">
 <button
 onClick={closeAndReset}
 className="px-6 py-3 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/15 dark:border-white/15 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all"
 >
 Cancel
 </button>
 <button
 type="submit"
 disabled={!canSubmit}
 className={`px-8 py-3 rounded-[1.25rem] font-bold text-sm shadow-lg shadow-[#1E2B58]/20 transition-all flex items-center gap-2 ${canSubmit ? 'bg-[#1E2B58] hover:bg-[#151f40] hover:scale-[1.02] active:scale-95 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'}`}
 formNoValidate
 >
 <span className="material-symbols-outlined text-sm">check_circle</span>
 {submitting ? 'Allocating...' : 'Allocate Equipment'}
 </button>
 </div>
 </div>
 </div>,
 document.body
 );
};

export default NewBorrowModal;
