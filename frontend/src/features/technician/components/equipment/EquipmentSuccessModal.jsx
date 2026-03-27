import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import QRCode from 'react-qr-code';

/**
 * Success modal shown after a new equipment is created.
 * Displays the equipment name, code, and a scannable QR code.
 *
 * QR value: `{origin}/report-issue?eq={code}&id={_id}`
 * Scanning this URL opens the ReportIssuePage with the equipment pre-filled.
 */
const EquipmentSuccessModal = ({ equipment, onClose }) => {
  const qrRef = useRef(null);

  const qrValue = `${window.location.origin}/report-issue?eq=${equipment.code ?? ''}&id=${equipment._id}`;

  // ── Download QR as PNG ──────────────────────────────────────────────────────
  const handleDownloadQR = () => {
    const svgEl = qrRef.current?.querySelector('svg');
    if (!svgEl) return;

    const size = 300;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob    = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url     = URL.createObjectURL(blob);

    const canvas  = document.createElement('canvas');
    canvas.width  = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);

      const link    = document.createElement('a');
      link.download = `qr-${equipment.code ?? equipment._id}.png`;
      link.href     = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = url;
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-[2rem] overflow-hidden"
        style={{ background: '#F6F7FB', boxShadow: '0 30px 80px rgba(26,43,86,0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="px-7 pt-7 pb-5 bg-white rounded-t-[2rem] relative text-center">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>

          {/* Success icon */}
          <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <span className="material-symbols-outlined text-white text-xl">check</span>
            </div>
          </div>

          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
            Registration Complete
          </p>
          <h2 className="text-xl font-black text-[#1A2B56] leading-tight">
            Equipment Registered Successfully
          </h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            <span className="font-bold text-[#1A2B56]">{equipment.name}</span>
            {equipment.code && (
              <> &nbsp;·&nbsp; <span className="font-mono font-bold text-blue-600">{equipment.code}</span></>
            )}
          </p>
        </div>

        {/* ── QR Section ─────────────────────────────────────────────────── */}
        <div className="px-7 py-6 flex flex-col items-center gap-4">
          {/* QR container */}
          <div
            ref={qrRef}
            className="p-5 bg-white rounded-[1.5rem] shadow-md border border-slate-100"
          >
            <QRCode value={qrValue} size={180} />
          </div>

          {/* Description */}
          <div className="text-center space-y-1 px-2">
            <p className="text-xs font-bold text-slate-600">Scan to report equipment issues</p>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              When scanned, the report form will open with this equipment pre-filled.
              Share this QR with lab users.
            </p>
          </div>

          {/* URL preview */}
          <div className="w-full px-3 py-2 bg-white/70 rounded-xl border border-slate-100">
            <p className="text-[9px] text-slate-400 break-all text-center font-mono">{qrValue}</p>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div className="px-7 pb-7 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-100 transition"
          >
            Close
          </button>
          <button
            onClick={handleDownloadQR}
            className="flex-1 py-3 rounded-2xl bg-[#1A2B56] text-white text-sm font-bold hover:bg-[#14213d] transition shadow-lg shadow-[#1A2B56]/20 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">download</span>
            Download QR
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EquipmentSuccessModal;
