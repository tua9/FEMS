import { BORROW_STATUS } from "@/constants";

const BorrowBadge = ({ status }) => {
  const cfg = {
    [BORROW_STATUS.PENDING]: {
      label: "Pending",
      cls: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30",
    },
    [BORROW_STATUS.APPROVED]: {
      label: "Approved",
      cls: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30",
    },
    [BORROW_STATUS.HANDED_OVER]: {
      label: "Borrowed",
      cls: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30",
    },
    [BORROW_STATUS.RETURNING]: {
      label: "Returning",
      cls: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30",
    },
    [BORROW_STATUS.RETURNED]: {
      label: "Returned",
      cls: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    },
    [BORROW_STATUS.REJECTED]: {
      label: "Rejected",
      cls: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30",
    },
    [BORROW_STATUS.CANCELLED]: {
      label: "Cancelled",
      cls: "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700",
    },
    [BORROW_STATUS.DISPUTE]: {
      label: "Tranh chấp",
      cls: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30",
    },
  };
  const c = cfg[status] || {
    label: status,
    cls: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span
      className={`rounded-full border px-3 py-1 text-[10px] font-black tracking-widest uppercase ${c.cls}`}
    >
      {c.label}
    </span>
  );
};

export default BorrowBadge;
