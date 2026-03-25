import React, { useRef } from 'react';
import QRCode from 'react-qr-code';
import { MODAL_OVERLAY, MODAL_CARD, CLOSE_BTN } from '@/components/technician/common/modalStyles';

const QRCodeModal = ({ equipment, onClose }) => {
  const printRef = useRef(null);

  const qrValue = `${window.location.origin}/report-issue?eq=${equipment.code}&id=${equipment._id}`;

  const handlePrint = () => {
    const content = printRef.current;
    const win = window.open('', '_blank', 'width=400,height=500');
    win.document.write(`
      <html><head><title>QR – ${equipment.name}</title></head>
      <body style="display:flex;flex-direction:column;align-items:center;padding:32px;font-family:sans-serif;">
        <h2 style="margin-bottom:8px">${equipment.name}</h2>
        <p style="color:#666;margin:0 0 16px">${equipment.code ?? ''}</p>
        ${content.innerHTML}
        <p style="margin-top:16px;color:#888;font-size:12px">Scan để báo hỏng thiết bị</p>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className={MODAL_OVERLAY} onClick={onClose}>
      <div className={`${MODAL_CARD} max-w-xs`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-[#1A2B56] dark:text-white">Mã QR Thiết bị</h2>
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[180px]">{equipment.name}</p>
          </div>
          <button onClick={onClose} className={CLOSE_BTN}>
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="mx-6 border-t border-slate-100 dark:border-slate-700" />

        {/* QR Code */}
        <div className="flex flex-col items-center gap-4 px-6 py-6">
          <div ref={printRef} className="p-4 bg-white rounded-2xl shadow-inner">
            <QRCode value={qrValue} size={180} />
          </div>

          <div className="text-center">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{equipment.code ?? equipment._id?.slice(-8).toUpperCase()}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Scan để báo cáo hư hỏng</p>
          </div>

          {/* URL preview */}
          <div className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <p className="text-[9px] text-slate-400 break-all">{qrValue}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            Đóng
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 rounded-xl bg-[#1A2B56] text-white text-sm font-bold flex items-center justify-center gap-1.5 hover:bg-[#151f40] transition"
          >
            <span className="material-symbols-outlined text-base">print</span>
            In QR
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
