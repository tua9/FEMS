import React from 'react';
import { createPortal } from 'react-dom';
import { X, HandMetal, Loader2, CheckCircle2 } from 'lucide-react';
import { fmtDateTime } from './borrowUtils';

const HandoverConfirmModal = ({ isOpen, onClose, request, onConfirm, submitting }) => {
  if (!isOpen || !request) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="dashboard-card rounded-4xl p-8 w-full max-w-md shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition"
        >
          <X className="w-4 h-4 text-[#1E2B58]/60 dark:text-white/60" />
        </button>

        <div className="flex flex-col items-center text-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
            <HandMetal className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-1">Xác nhận nhận thiết bị</p>
            <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">{request.equipmentId?.name || 'Thiết bị'}</h3>
          </div>
        </div>

        <div className="bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] p-5 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-3">Thông tin bàn giao từ giảng viên</p>
          
          <div className="space-y-4">
            {/* Checklist display */}
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: 'Ngoại hình', val: request.handoverInfo?.checklist?.appearance },
                { label: 'Chức năng', val: request.handoverInfo?.checklist?.functioning },
                { label: 'Phụ kiện', val: request.handoverInfo?.checklist?.accessories },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#1E2B58]/60 dark:text-white/50">{item.label}</span>
                  <span className={item.val ? 'text-emerald-500' : 'text-red-500'}>
                    {item.val ? '✓ Đạt' : '✗ Không đạt'}
                  </span>
                </div>
              ))}
            </div>

            {/* Images display */}
            {request.handoverInfo?.images?.length > 0 && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-2">Hình ảnh bàn giao</p>
                <div className="grid grid-cols-2 gap-2">
                  {request.handoverInfo.images.map((img, idx) => (
                    <div key={idx} className="aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-[#1E2B58]/5 dark:border-white/5 text-[10px] text-slate-400 font-medium">
              Giảng viên bàn giao lúc: {fmtDateTime(request.handoverInfo?.submittedAt)}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all"
          >
            Hủy
          </button>
          <button
            onClick={() => onConfirm(request)}
            disabled={submitting}
            className="flex-[2] py-3.5 rounded-[1.25rem] font-bold text-sm bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-60 active:scale-95"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Xác nhận đã nhận
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default HandoverConfirmModal;
