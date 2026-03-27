import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
const EquipmentQRCodeModal = ({ isOpen, onClose, equipment }) => {
 if (!isOpen || !equipment) return null;

  const printRef = useRef(null);
  const reportUrl =
  typeof window !== 'undefined' && equipment.code
  ? `${window.location.origin}/report-issue?eq=${encodeURIComponent(equipment.code)}&id=${encodeURIComponent(equipment._id)}`
  : '';

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const win = window.open("", "_blank", "width=400,height=500");
    win.document.write(`
      <html><head><title>QR – ${equipment.name}</title></head>
      <body style="display:flex;flex-direction:column;align-items:center;padding:32px;font-family:sans-serif;color:#1A2B56;">
        <div style="background:#f8fafc;padding:16px;border-radius:16px;margin-bottom:20px;">
          <img src="${equipment.img || ""}" style="width:64px;height:64px;object-cover;border-radius:12px;" />
        </div>
        <h2 style="margin:0 0 4px 0">${equipment.name}</h2>
        <p style="color:#64748b;margin:0 0 24px 0;font-size:14px;font-weight:600;">ID: ${equipment._id}</p>
        <div style="padding:16px;background:white;border:1px solid #e2e8f0;border-radius:20px;box-shadow:inset 0 2px 4px rgba(0,0,0,0.05);">
          ${content.innerHTML}
        </div>
        <p style="margin-top:24px;color:#94a3b8;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.1em;">Scan to report equipment issue</p>
      </body></html>
    `);
    win.document.close();
    // Wait for image in content if any? QR is usually SVG/IMG
    setTimeout(() => {
      win.print();
    }, 500);
  };

  const handleSave = () => {
    if (!printRef.current) return;
    const img = printRef.current.querySelector('img');
    if (!img) return;
    const link = document.createElement('a');
    link.href = img.src;
    link.download = `QR_${equipment.code || equipment._id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  <div ref={printRef} className="bg-white p-4 rounded-2xl shadow-inner mx-auto w-48 h-48 flex items-center justify-center border border-slate-100">
  <img
  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(reportUrl || equipment.code || '')}`}
  alt="QR Code"
  className="w-full h-full opacity-90"
  />
  </div>
  {reportUrl ? (
  <div className="mt-4 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
    <p className="text-[9px] text-center text-slate-400 dark:text-slate-500 font-medium break-all leading-relaxed">
      {reportUrl}
    </p>
  </div>
  ) : null}
  <p className="mt-3 text-[10px] text-center text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest opacity-60">
    Scan to report issue
  </p>

 <div className="mt-6 flex gap-3">
  <button 
    onClick={handleSave}
    className="flex-1 py-3 rounded-[1.25rem] border border-[#1E2B58]/15 dark:border-white/15 text-[#1E2B58]/70 dark:text-white/70 font-bold text-sm hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2"
  >
  <span className="material-symbols-outlined text-lg">download</span>
  Save
  </button>
  <button 
    onClick={handlePrint}
    className="flex-1 py-3 rounded-[1.25rem] bg-[#1E2B58] hover:bg-[#151f40] hover:scale-[1.02] active:scale-95 text-white font-bold text-sm shadow-lg shadow-[#1E2B58]/20 transition-all flex items-center justify-center gap-2"
  >
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
