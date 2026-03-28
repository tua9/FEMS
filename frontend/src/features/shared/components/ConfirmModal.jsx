import React from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  onClose,
  title = 'Xác nhận',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  onConfirm,
  submitting = false,
  type = 'warning' // 'warning', 'danger', 'info'
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    warning: {
      icon: <AlertTriangle className="w-7 h-7" />,
      colors: 'bg-amber-500 text-white hover:bg-amber-600',
      iconBg: 'bg-amber-100 dark:bg-amber-900/40 text-amber-500',
      shadow: 'shadow-amber-500/20'
    },
    danger: {
      icon: <AlertTriangle className="w-7 h-7" />,
      colors: 'bg-red-500 text-white hover:bg-red-600',
      iconBg: 'bg-red-100 dark:bg-red-900/40 text-red-500',
      shadow: 'shadow-red-500/20'
    },
    info: {
      icon: <CheckCircle2 className="w-7 h-7" />,
      colors: 'bg-[#1E2B58] dark:bg-blue-600 text-white hover:bg-[#2A3B66] dark:hover:bg-blue-700',
      iconBg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-500',
      shadow: 'shadow-blue-900/20'
    }
  };

  const currentType = typeConfig[type] || typeConfig.warning;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="dashboard-card rounded-4xl p-8 w-full max-w-sm shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        </button>

        <div className="flex flex-col items-center text-center gap-4 mb-6">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${currentType.iconBg}`}>
            {currentType.icon}
          </div>
          <div>
            <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">{title}</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
              {message}
            </p>
          </div>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 py-3.5 rounded-[1.25rem] font-bold text-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[1.25rem] font-bold text-sm transition-all shadow-lg active:scale-95 disabled:opacity-60 ${currentType.colors} ${currentType.shadow}`}
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {!submitting && confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;
