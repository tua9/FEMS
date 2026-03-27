import {
  CLOSE_BTN,
  MODAL_CARD,
  MODAL_OVERLAY,
} from "@/features/technician/components/common/modalStyles";
import { useRef } from "react";
import QRCode from "react-qr-code";

const QRCodeModal = ({ equipment, onClose }) => {
  const printRef = useRef(null);

  const qrValue = `${window.location.origin}/report-issue?eq=${equipment.code}&id=${equipment._id}`;

  const handlePrint = () => {
    const content = printRef.current;
    const win = window.open("", "_blank", "width=400,height=500");
    win.document.write(`
      <html><head><title>QR – ${equipment.name}</title></head>
      <body style="display:flex;flex-direction:column;align-items:center;padding:32px;font-family:sans-serif;">
        <h2 style="margin-bottom:8px">${equipment.name}</h2>
        <p style="color:#666;margin:0 0 16px">${equipment.code ?? ""}</p>
        ${content.innerHTML}
        <p style="margin-top:16px;color:#888;font-size:12px">Scan để báo hỏng thiết bị</p>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className={MODAL_OVERLAY} onClick={onClose}>
      <div
        className={`${MODAL_CARD} max-w-xs`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-base font-extrabold text-[#1A2B56] dark:text-white">
              Mã QR Thiết bị
            </h2>
            <p className="mt-0.5 max-w-[180px] truncate text-xs text-slate-400">
              {equipment.name}
            </p>
          </div>
          <button onClick={onClose} className={CLOSE_BTN}>
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="mx-6 border-t border-slate-100 dark:border-slate-700" />

        {/* QR Code */}
        <div className="flex flex-col items-center gap-4 px-6 py-6">
          <div ref={printRef} className="rounded-2xl bg-white p-4 shadow-inner">
            <QRCode value={qrValue} size={180} />
          </div>

          <div className="text-center">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              {equipment.code ?? equipment._id?.slice(-8).toUpperCase()}
            </p>
            <p className="mt-0.5 text-[10px] text-slate-400">
              Scan để báo cáo hư hỏng
            </p>
          </div>

          {/* URL preview */}
          <div className="w-full rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
            <p className="text-[9px] break-all text-slate-400">{qrValue}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-700">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Đóng
          </button>
          <button
            onClick={handlePrint}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#1A2B56] py-2.5 text-sm font-bold text-white transition hover:bg-[#151f40]"
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
