import React from 'react';
import { createPortal } from 'react-dom';
import { X, LogOut, Loader2, CheckCircle2 } from 'lucide-react';
import { getStudentName, getEquipmentName } from './borrowUtils';

const ReturnConfirmModal = ({ isOpen, onClose, request, onConfirm, submitting }) => {
  if (!isOpen || !request) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="dashboard-card rounded-4xl p-8 w-full max-w-md shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition">
          <X className="w-4 h-4 text-[#1E2B58]/60 dark:text-white/60" />
        </button>

        <div className="flex flex-col items-center text-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <LogOut className="w-7 h-7 text-slate-500 dark:text-slate-300" />
          </div>
          <div>
            <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-1">Xác nhận hoàn trả</p>
            <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">{getEquipmentName(request)}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Trả bởi {getStudentName(request)}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 mb-5 text-center">
          <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
            Kiểm tra thiết bị & minh chứng bên dưới trước khi xác nhận.
          </p>
        </div>

        {/* Evidence from student */}
        <div className="mb-6 space-y-4">
          {request.returnRequest?.notes && (
            <div className="bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] p-4 text-sm font-medium text-[#1E2B58]/80 dark:text-white/70">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-1.5">Ghi chú của sinh viên</p>
              {request.returnRequest.notes}
            </div>
          )}

          {request.returnRequest?.images?.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-2 px-1">Ảnh minh chứng hoàn trả</p>
              <div className="grid grid-cols-2 gap-2">
                {request.returnRequest.images.map((url, i) => (
                  <div key={i} className="aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <img src={url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3.5 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all">
            Hủy
          </button>
          <button onClick={onConfirm} disabled={submitting}
            className="flex-[2] py-3.5 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] text-white hover:bg-[#2A3B66] transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-60 active:scale-95">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Xác nhận đã nhận lại
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ReturnConfirmModal;
