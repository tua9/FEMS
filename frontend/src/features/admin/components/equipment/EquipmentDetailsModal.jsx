import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getDerivedStatus, getDerivedEquipmentType } from '@/utils/equipmentUtils';

const EquipmentDetailsModal = ({ isOpen, equipment, onClose, onEdit, onReportDamage }) => {
 if (!isOpen || !equipment) return null;

 // Must compute virtual status/type before using them elsewhere
 const vStatus = getDerivedStatus(equipment);
 const vType = getDerivedEquipmentType(equipment);

 // derive ping dot classes and label
 const statusMeta = (() => {
 if (vStatus === 'Broken') {
 return {
 label: 'Broken',
 dot: { ping: 'bg-red-400', static: 'bg-red-500' },
 tag: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border-red-100 dark:border-red-900/30',
 }
 }
 if (vStatus === 'Maintenance') {
 return {
 label: 'Maintenance',
 dot: { ping: 'bg-amber-400', static: 'bg-amber-500' },
 tag: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-900/30',
 }
 }
 return {
 label: 'Available',
 dot: { ping: 'bg-emerald-400', static: 'bg-emerald-500' },
 tag: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30',
 }
 })()

 const qrData = typeof window !== 'undefined' && equipment?.code
 ? `${window.location.origin}/report-issue?eq=${encodeURIComponent(equipment.code)}&id=${encodeURIComponent(equipment._id)}`
 : ''

 // Remove borrow-tracking logic for Reserved / In Use (no longer supported)
 const [activeRequest] = useState(null);

 const formatDate = (dateString) => {
 if (!dateString) return 'Not Set';
 try {
 const date = new Date(dateString);
 return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' });
 } catch (e) {
 return dateString;
 }
 };

 return createPortal(
 <div className="fixed inset-0 z-100 flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm">
 <style dangerouslySetInnerHTML={{
 __html: `
 .no-scrollbar::-webkit-scrollbar { display: none; }
 .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
 ` }} />
 {/* Backdrop */}
 <div
 className="absolute inset-0"
 onClick={onClose}
 ></div>

 {/* Modal Content */}
 <div className="relative w-full max-w-2xl dashboard-card rounded-4xl shadow-2xl shadow-[#1E2B58]/20 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

 {/* Header Section */}
 <div className="px-8 pt-7 pb-6 border-b border-black/8 dark:border-white/10 bg-black/3 dark:bg-white/3">
 <div className="flex items-start justify-between gap-4">
 <div className="min-w-0">
 <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Equipment Details</p>
 <h3 className="mt-2 text-2xl font-extrabold text-[#1A2B56] dark:text-white truncate" title={equipment.name}>{equipment.name}</h3>
 <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">ID: {equipment._id}</p>
 </div>

 {/* Mini status tag (top-right) */}
 <div className="flex items-center gap-3 shrink-0">
 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusMeta.tag}`}> 
  {statusMeta.label}
 </span>
 <span className="relative flex h-2.5 w-2.5">
  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusMeta.dot.ping}`}></span>
  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${statusMeta.dot.static}`}></span>
 </span>
 <button
  onClick={onClose}
  className="w-9 h-9 rounded-full flex items-center justify-center text-[#1E2B58]/50 hover:text-[#1E2B58] hover:bg-[#1E2B58]/8 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
  aria-label="Close"
  type="button"
 >
 <span className="material-symbols-outlined">close</span>
 </button>
 </div>
 </div>
 </div>

 <div className="p-10 pt-0 overflow-y-auto no-scrollbar space-y-8 relative z-10 mt-6">
 {equipment.description ? (
 <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm">
 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Description</h4>
 <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
 {equipment.description}
 </p>
 </div>
 ) : null}
 {/* Image and Basic Info */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="relative group rounded-3xl overflow-hidden aspect-video border-2 border-white dark:border-slate-700 shadow-lg">
 <img
 src={equipment.img || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1026'}
 alt={equipment.name}
 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
 />
 <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-6">
 <p className="text-white font-black text-sm uppercase tracking-widest">Equipment Visual</p>
 </div>
 </div>

 <div className="flex flex-col gap-4">
 <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm grow flex flex-col justify-center">
 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Current Location</h4>
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center border-2 border-indigo-100 dark:border-indigo-900/30">
 <span className="material-symbols-outlined text-xl">location_on</span>
 </div>
 <div className="flex flex-col">
 <p className="font-black text-slate-800 dark:text-white leading-tight">{(equipment.roomId)?.name || 'N/A'}</p>
 <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">Asset Code: {equipment.code || "#" + equipment._id.slice(-6).toUpperCase()}</p>
 </div>
 </div>
 </div>
 <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm grow flex flex-col justify-center">
 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Registration Details</h4>
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center border-2 border-emerald-100 dark:border-emerald-900/30">
 <span className="material-symbols-outlined text-xl">calendar_today</span>
 </div>
 <p className="font-black text-slate-800 dark:text-white leading-tight">{formatDate(equipment.createdAt)}</p>
 </div>
 </div>
 </div>
 {(equipment.model || equipment.serialNumber) ? (
 <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
 {equipment.model ? (
 <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm">
 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Model</h4>
 <p className="font-bold text-slate-800 dark:text-white">{equipment.model}</p>
 </div>
 ) : null}
 {equipment.serialNumber ? (
 <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm">
 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Serial</h4>
 <p className="font-bold text-slate-800 dark:text-white">{equipment.serialNumber}</p>
 </div>
 ) : null}
 </div>
 ) : null}
 {(equipment.purchase_date || equipment.last_maintenance_date) ? (
 <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm">
 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Purchase date</h4>
 <p className="font-bold text-slate-800 dark:text-white">{formatDate(equipment.purchase_date)}</p>
 </div>
 <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm">
 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Last maintenance</h4>
 <p className="font-bold text-slate-800 dark:text-white">{formatDate(equipment.last_maintenance_date)}</p>
 </div>
 </div>
 ) : null}
 </div>

 {/* QR Code / Placeholder for more info */}
 <div className="p-8 rounded-4xl border-2 border-slate-200 dark:border-slate-700 border-dashed flex flex-col items-center justify-center text-center">
 <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase mb-3">Equipment QR</p>
 <div className="bg-white p-3 rounded-2xl shadow-inner mx-auto w-44 h-44 flex items-center justify-center border border-slate-100">
 <img
 src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrData || equipment.code || equipment._id)}`}
 alt="Equipment QR"
 className="w-full h-full opacity-95"
 />
 </div>
 <p className="mt-3 text-[10px] text-center text-slate-500 dark:text-slate-400 font-medium break-all px-2">
 {equipment.code ? `Code: ${equipment.code}` : `ID: ${equipment._id}`}
 </p>
 </div>
 </div>

 {/* Footer Section */}
 <div className="px-8 py-5 border-t border-black/8 dark:border-white/10 bg-black/3 dark:bg-white/3 flex flex-wrap items-center justify-between gap-4">
 <div className="flex gap-3">
 {onEdit && (
 <button
 onClick={() => onEdit(equipment)}
 className="px-6 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-[#1E2B58] dark:text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-700/80 flex items-center gap-2"
 >
 <span className="material-symbols-outlined text-lg">edit_square</span>
 Edit Asset
 </button>
 )}
 {onReportDamage && equipment.status !== 'broken' && (
 <button
 onClick={() => onReportDamage(equipment)}
 className="px-6 py-2.5 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border-2 border-red-100 dark:border-red-900/30 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm hover:shadow-red-500/10 hover:bg-red-100 flex items-center gap-2"
 >
 <span className="material-symbols-outlined text-lg">report</span>
 Report Damage
 </button>
 )}
 </div>
 <button
 onClick={onClose}
 className="px-6 py-3 bg-[#1A2B56] hover:bg-[#2A3B66] text-white rounded-xl font-black text-xs uppercase tracking-[0.15em] transition-all shadow-lg shadow-blue-900/20"
 >
 Dismiss View
 </button>
 </div>
 </div>
 </div>,
 document.body
 );
};

export default EquipmentDetailsModal;
