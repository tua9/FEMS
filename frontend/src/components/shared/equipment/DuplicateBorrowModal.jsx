import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

export const DuplicateBorrowModal = ({ isOpen, onClose, onViewPrevious }) => {
 if (!isOpen) return null;

 return (
 <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
 <div className="w-full max-w-md rounded-[2rem] bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
 <div className="p-6">
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-500">
 <AlertTriangle size={24} />
 </div>
 <h3 className="text-xl font-bold text-slate-800 dark:text-white">Đơn mượn trùng lặp</h3>
 </div>
 <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
 <X size={20} />
 </button>
 </div>
 <p className="text-slate-600 dark:text-slate-300 font-medium mb-8 leading-relaxed">
 Bạn đang có một đơn mượn đang trong quá trình phê duyệt đối với thiết bị này. Bạn không thể tạo thêm đơn mượn mới.
 </p>
 <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
 <button
 onClick={onClose}
 className="px-5 py-2.5 text-sm font-bold tracking-wide rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
 >
 Bỏ qua
 </button>
 <button
 onClick={onViewPrevious}
 className="px-5 py-2.5 text-sm font-bold tracking-wide rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
 >
 Xem đơn trước đó
 </button>
 </div>
 </div>
 </div>
 </div>
 );
};

export default DuplicateBorrowModal;
