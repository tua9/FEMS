import React from 'react';
import { BORROW_STATUS } from '@/constants';

const BorrowBadge = ({ status, req }) => {
  // Derive a more specific label for 'approved' depending on handoverInfo
  const approvedLabel = req?.handoverInfo?.submittedAt ? 'Chờ xác nhận nhận' : 'Đã được duyệt';
  const cfg = {
    [BORROW_STATUS.PENDING]:     { label: 'Đang chờ duyệt',     cls: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30' },
    [BORROW_STATUS.APPROVED]:    { label: approvedLabel,          cls: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30' },
    [BORROW_STATUS.HANDED_OVER]: { label: 'Đang sử dụng',        cls: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30' },
    [BORROW_STATUS.RETURNING]:   { label: 'Chờ xác nhận trả',   cls: 'bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-900/30' },
    [BORROW_STATUS.RETURNED]:    { label: 'Đã hoàn trả',         cls: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' },
    [BORROW_STATUS.REJECTED]:    { label: 'Bị từ chối',          cls: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' },
    [BORROW_STATUS.CANCELLED]:   { label: 'Đã huỷ',              cls: 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700' },
    [BORROW_STATUS.UNRETURNED]:  { label: 'Chưa trả thiết bị',  cls: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800 animate-pulse' },
  };
  const c = cfg[status] || { label: status, cls: 'bg-slate-100 text-slate-600 border-slate-200' };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${c.cls}`}>
      {c.label}
    </span>
  );
};

export default BorrowBadge;
