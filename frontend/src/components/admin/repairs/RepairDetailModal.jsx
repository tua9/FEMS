import React from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

const STATUS_LABELS = {
 pending: 'Pending',
 approved: 'Approved',
 processing: 'In progress',
 rejected: 'Rejected',
 fixed: 'Completed',
 cancelled: 'Cancelled',
};

const RepairDetailModal = ({ isOpen, onClose, equipment, reports }) => {
 const navigate = useNavigate();

 if (!isOpen || !equipment) return null;

 const equipReports = (reports || [])
 .filter((r) => {
 if (r.type !== 'equipment') return false;
 const rid = r.equipment_id?._id || r.equipment_id;
 return String(rid) === String(equipment._id);
 })
 .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

 const roomName = equipment.room_id?.name || 'N/A';

 return createPortal(
 <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm">
 <div className="absolute inset-0" onClick={onClose} role="presentation" />
 <div className="relative w-full max-w-lg dashboard-card rounded-4xl shadow-2xl shadow-[#1E2B58]/20 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
 <div className="px-8 pt-8 pb-4 border-b border-black/8 dark:border-white/10 flex justify-between items-start gap-4">
 <div>
 <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-1">Repair detail</p>
 <h3 className="text-xl font-black text-[#1A2B56] dark:text-white">{equipment.name}</h3>
 <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
 {equipment.model ? `${equipment.model} · ` : ''}
 Code {equipment.code || equipment._id.slice(-6).toUpperCase()}
 </p>
 </div>
 <button
 type="button"
 onClick={onClose}
 className="w-9 h-9 rounded-full flex items-center justify-center text-[#1E2B58]/50 hover:bg-[#1E2B58]/8 dark:text-white/50 dark:hover:bg-white/10"
 aria-label="Close"
 >
 <span className="material-symbols-outlined">close</span>
 </button>
 </div>

 <div className="px-8 py-6 overflow-y-auto space-y-6 text-sm">
 <div className="grid grid-cols-2 gap-3 text-xs">
 <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Location</p>
 <p className="font-semibold text-slate-800 dark:text-white">{roomName}</p>
 </div>
 <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Equipment status</p>
 <p className="font-semibold text-slate-800 dark:text-white">{equipment.status}</p>
 </div>
 </div>

 <div>
 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Repair history (fault reports)</h4>
 {equipReports.length === 0 ? (
 <p className="text-xs text-slate-500 dark:text-slate-400">No linked reports yet.</p>
 ) : (
 <ul className="space-y-3">
 {equipReports.map((r) => (
 <li
 key={r._id}
 className="p-3 rounded-2xl border border-slate-100 dark:border-slate-700 bg-white/50 dark:bg-slate-800/40"
 >
 <div className="flex justify-between items-center gap-2 mb-1">
 <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A2B56] dark:text-blue-300">
 {STATUS_LABELS[r.status] || r.status}
 </span>
 <span className="text-[10px] text-slate-400">
 {new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
 </span>
 </div>
 {r.description ? (
 <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">{r.description}</p>
 ) : null}
 <button
 type="button"
 onClick={() => {
 onClose();
 navigate('/admin/reports', { state: { reportId: r._id } });
 }}
 className="mt-2 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:underline"
 >
 Open in Reports
 </button>
 </li>
 ))}
 </ul>
 )}
 </div>
 </div>

 <div className="px-8 py-4 border-t border-black/8 dark:border-white/10 bg-black/3 dark:bg-white/3">
 <button
 type="button"
 onClick={onClose}
 className="w-full py-3 rounded-2xl bg-[#1A2B56] text-white font-bold text-xs uppercase tracking-wider"
 >
 Close
 </button>
 </div>
 </div>
 </div>,
 document.body
 );
};

export default RepairDetailModal;
