import React from 'react';
import { createPortal } from 'react-dom';
const EquipmentQRCodeModal = ({ isOpen, onClose, equipment }) => {
 if (!isOpen || !equipment) return null;

 const reportUrl =
 typeof window !== 'undefined' && equipment.code
 ? `${window.location.origin}/report-issue?eq=${encodeURIComponent(equipment.code)}&id=${encodeURIComponent(equipment._id)}`
 : '';

 return createPortal(
 <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm">
 <div className="absolute inset-0" onClick={onClose}></div>

 <div className="relative w-full max-w-sm dashboard-card rounded-4xl shadow-2xl shadow-[#1E2B58]/20 p-8 animate-in fade-in zoom-in-95 duration-200">
 <button
 onClick={onClose}
 className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#1E2B58]/50 hover:text-[#1E2B58] hover:bg-[#1E2B58]/8 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
 >
 <span className="material-symbols-outlined">close</span>
 </button>

 <div className="text-center mb-6">
 <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-3">QR Code</p>
 <div className="w-16 h-16 mx-auto bg-white/40 dark:bg-slate-800/40 rounded-2xl p-1.5 shadow-sm mb-4">
 <img src={equipment.img || undefined} alt={equipment.name} className="w-full h-full object-cover rounded-xl" />
 </div>
 <h3 className="text-xl font-extrabold text-[#1A2B56] dark:text-white">{equipment.name}</h3>
 <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">ID: {equipment._id}</p>
 </div>

 <div className="bg-white p-4 rounded-2xl shadow-inner mx-auto w-48 h-48 flex items-center justify-center border border-slate-100">
 <img
 src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(reportUrl || equipment.code || '')}`}
 alt="QR Code"
 className="w-full h-full opacity-90"
 />
 </div>
 {reportUrl ? (
 <p className="mt-3 text-[10px] text-center text-slate-500 dark:text-slate-400 font-medium break-all px-2">
 Opens fault report with this equipment prefilled
 </p>
 ) : null}

 <div className="mt-6 flex gap-3">
 <button className="flex-1 py-3 rounded-[1.25rem] border border-[#1E2B58]/15 dark:border-white/15 text-[#1E2B58]/70 dark:text-white/70 font-bold text-sm hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2">
 <span className="material-symbols-outlined text-lg">download</span>
 Save
 </button>
 <button className="flex-1 py-3 rounded-[1.25rem] bg-[#1E2B58] hover:bg-[#151f40] hover:scale-[1.02] active:scale-95 text-white font-bold text-sm shadow-lg shadow-[#1E2B58]/20 transition-all flex items-center justify-center gap-2">
 <span className="material-symbols-outlined text-lg">print</span>
 Print
 </button>
 </div>
 </div>
 </div>,
 document.body
 );
};

export default EquipmentQRCodeModal;
