import React, { useState } from 'react';
import { MOCK_FULFILLMENTS } from '@/mocks/technician/mockHandover';
import HandoverDetailModal from './HandoverDetailModal';
import ConfirmHandoverModal from './ConfirmHandoverModal';

// ── Convert FulfillmentRequest → HandoverDetailRecord ─────────────────────────
function toDetailRecord(req) {
 const initials = req.recipient.name
 .split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
 return {
 id: `REQ-${req.id}`,
 title: `REQ-${req.id}`,
 badge: { label: 'Ready for Pickup', className: 'bg-blue-100 text-blue-700' },
 person: {
 name: req.recipient.name,
 sub: `${req.recipient.department} · ${req.recipient.designation}`,
 initials,
 avatarBg: 'bg-[#1A2B56]/10',
 avatarColor: 'text-[#1A2B56]',
 },
 meta: [
 { label: 'Request ID', value: req.id, icon: 'tag' },
 { label: 'Pickup Time', value: req.time, icon: 'schedule' },
 { label: 'Items', value: `${req.itemCount} approved item${req.itemCount > 1 ? 's' : ''}`, icon: 'inventory_2' },
 { label: 'Designation', value: req.recipient.designation, icon: 'badge' },
 ],
 items: req.items.map((it) => ({ icon: it.icon, name: it.name, serial: it.serial })),
 };
}

// ── Left list item ────────────────────────────────────────────────────────────
const FulfillmentListItem = ({ req, isSelected, onClick }) => (
 <div
 onClick={onClick}
 className={`p-4 rounded-2xl cursor-pointer transition-all ${isSelected
 ? 'bg-white/15 border-2 border-blue-400 shadow-sm dark:border-blue-400'
 : 'bg-white/5 border border-white/10 hover:border-white/20'
 }`}
 >
 <div className="flex justify-between items-start mb-2">
 <span
 className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${isSelected
 ? 'bg-blue-100 text-blue-600'
 : 'bg-slate-100 text-slate-500'
 }`}
 >
 {req.id}
 </span>
 <span className="text-[10px] text-slate-400 font-bold">{req.time}</span>
 </div>
 <h4 className="text-sm font-bold text-white">{req.borrowerName}</h4>
 <p className="text-xs text-slate-400 mb-3">{req.borrowerRole}</p>
 <div className="flex items-center gap-2">
 <span className="material-symbols-outlined text-slate-400 text-sm">inventory_2</span>
 <span className="text-xs font-semibold text-slate-400">{req.itemCount} Items Approved</span>
 </div>
 </div>
);

// ── Right detail panel ────────────────────────────────────────────────────────
const FulfillmentDetail = ({ req, isDone, onDetails, onConfirmHandover }) => (
 <div
 className="dashboard-card rounded-3xl overflow-hidden"
 >
 {/* Header */}
 <div className="p-8 border-b border-white/10 bg-white/5">
 <div className="flex justify-between items-center">
 <div className="flex items-center gap-4">
 <div className="w-14 h-14 rounded-2xl bg-[#1A2B56] flex items-center justify-center text-white shadow-lg">
 <span className="material-symbols-outlined text-3xl">handshake</span>
 </div>
 <div>
 <h2 className="text-xl font-extrabold text-white">Handover Fulfillment</h2>
 <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
 Reference: {req.id}
 </p>
 </div>
 </div>
 <div className="text-right">
 <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Status</p>
 {isDone ? (
 <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
 <span className="w-2 h-2 rounded-full bg-emerald-500" />
 Completed
 </span>
 ) : (
 <span className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-sm">
 <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
 Ready for Distribution
 </span>
 )}
 <button
 onClick={onDetails}
 className="mt-2 flex items-center gap-1.5 ml-auto px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-[#1A2B56] hover:text-white text-xs font-bold transition-all"
 >
 <span className="material-symbols-outlined text-[15px]">info</span>
 View Details
 </button>
 </div>
 </div>
 </div>

 {/* Body */}
 <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
 {/* Left column */}
 <div className="space-y-6">
 {/* Recipient info */}
 <div>
 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">
 Recipient Information
 </label>
 <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
 <div className="flex items-center gap-4 mb-4">
 <div className="w-12 h-12 rounded-full bg-[#1A2B56]/10 flex items-center justify-center text-[#1A2B56] font-extrabold text-sm border-2 border-white">
 {req.recipient.name
 .split(' ')
 .slice(0, 2)
 .map((w) => w[0])
 .join('')
 .toUpperCase()}
 </div>
 <div>
 <h4 className="font-bold text-white">{req.recipient.name}</h4>
 <p className="text-xs text-slate-400">ID: {req.recipient.userId}</p>
 </div>
 </div>
 <div className="space-y-2">
 <div className="flex justify-between text-xs">
 <span className="text-slate-400">Department</span>
 <span className="font-bold text-slate-200">{req.recipient.department}</span>
 </div>
 <div className="flex justify-between text-xs">
 <span className="text-slate-400">Designation</span>
 <span className="font-bold text-slate-200">{req.recipient.designation}</span>
 </div>
 </div>
 </div>
 </div>

 {/* Equipment items */}
 <div>
 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">
 Equipment Items
 </label>
 <div className="space-y-3">
 {req.items.map((item) => (
 <div
 key={item.serial}
 className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between group"
 >
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
 <span className="material-symbols-outlined text-slate-500 text-xl">{item.icon}</span>
 </div>
 <div>
 <p className="text-sm font-bold text-white">{item.name}</p>
 <p className="text-[10px] text-slate-400">SN: {item.serial}</p>
 </div>
 </div>
 <button className="bg-white/10 hover:bg-[#1A2B56] hover:text-white text-slate-300 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all">
 INSPECT
 </button>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Right column — signatures */}
 <div className="space-y-6">
 {/* Technician signature */}
 <div>
 <div className="flex justify-between items-center mb-3">
 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
 Technician Signature
 </label>
 <button className="text-[10px] font-bold text-[#1A2B56] hover:underline">Clear Pad</button>
 </div>
 <div
 className="h-40 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden"
 style={{
 backgroundImage: 'radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)',
 backgroundSize: '20px 20px',
 }}
 >
 <span className="material-symbols-outlined absolute text-slate-200 text-6xl select-none">draw</span>
 <p className="text-[10px] text-slate-300 font-medium relative z-10">Marcus Thorne</p>
 </div>
 </div>

 {/* Recipient signature */}
 <div>
 <div className="flex justify-between items-center mb-3">
 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
 Recipient Signature
 </label>
 <button className="text-[10px] font-bold text-[#1A2B56] hover:underline">Clear Pad</button>
 </div>
 <div
 className="h-40 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden"
 style={{
 backgroundImage: 'radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)',
 backgroundSize: '20px 20px',
 }}
 >
 <p className="text-[10px] text-slate-300 font-medium italic">Waiting for recipient to sign...</p>
 </div>
 </div>

 {/* Confirm button */}
 <div className="pt-4">
 {isDone ? (
 <div className="w-full py-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center gap-3 text-emerald-600 font-extrabold text-sm">
 <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
 Handover Completed
 </div>
 ) : (
 <button
 onClick={onConfirmHandover}
 className="w-full bg-[#1A2B56] hover:bg-slate-900 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-extrabold text-sm shadow-2xl shadow-[#1A2B56]/30 transition-all active:scale-95 group"
 >
 Confirm Physical Handover
 <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
 verified_user
 </span>
 </button>
 )}
 </div>
 </div>
 </div>
 </div>
);

// ── Tab component ─────────────────────────────────────────────────────────────
const HandoverTab = () => {
 const [selectedId, setSelectedId] = useState(MOCK_FULFILLMENTS[0].id);
 const [modalRecord, setModalRecord] = useState(null);
 const [confirmReq, setConfirmReq] = useState(null);
 const [doneIds, setDoneIds] = useState(new Set());

 const selected = MOCK_FULFILLMENTS.find((r) => r.id === selectedId) ?? MOCK_FULFILLMENTS[0];

 const handleConfirmed = (id) => {
 setDoneIds((prev) => new Set([...prev, id]));
 };

 return (
 <>
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
 {/* Left list */}
 <div
 className="dashboard-card rounded-3xl overflow-hidden flex flex-col h-[700px] lg:col-span-4"
 >
 <div className="p-6 border-b border-white/10">
 <h3 className="text-lg font-bold text-white flex items-center gap-2">
 <span className="material-symbols-outlined text-blue-400">pending_actions</span>
 Approved for Pickup
 </h3>
 <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">
 Select a request to fulfill
 </p>
 </div>
 <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
 {MOCK_FULFILLMENTS.map((req) => (
 <FulfillmentListItem
 key={req.id}
 req={req}
 isSelected={req.id === selectedId}
 onClick={() => setSelectedId(req.id)}
 />
 ))}
 </div>
 </div>

 {/* Right detail */}
 <div className="lg:col-span-8">
 <FulfillmentDetail
 req={selected}
 isDone={doneIds.has(selected.id)}
 onDetails={() => setModalRecord(toDetailRecord(selected))}
 onConfirmHandover={() => setConfirmReq(selected)}
 />
 </div>
 </div>

 {/* Detail modal */}
 {modalRecord && (
 <HandoverDetailModal
 record={modalRecord}
 onClose={() => setModalRecord(null)}
 />
 )}

 {/* Confirm physical handover modal */}
 {confirmReq && (
 <ConfirmHandoverModal
 req={confirmReq}
 onClose={() => setConfirmReq(null)}
 onConfirm={(id) => { handleConfirmed(id); setConfirmReq(null); }}
 />
 )}
 </>
 );
};

export default HandoverTab;
