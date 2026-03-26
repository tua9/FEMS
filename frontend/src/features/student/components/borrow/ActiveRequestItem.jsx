import React from 'react';
import { Laptop, LogOut, CheckCircle2, X } from 'lucide-react';
import BorrowBadge from './BorrowBadge';
import { fmtDateTime } from './borrowUtils';

const ActiveRequestItem = ({ req, onReturn, onConfirmReceived, onCancel }) => {
  const eqName = req.equipmentId?.name || 'Thiết bị';
  const eqImg = req.equipmentId?.img;

  return (
    <div className="dashboard-card rounded-3xl p-5 flex items-center gap-4 flex-wrap group">
      <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center shrink-0">
        {eqImg
          ? <img src={eqImg} alt="" className="w-full h-full object-cover" />
          : <Laptop className="w-4.5 h-4.5 text-slate-400" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-black text-[#1E2B58] dark:text-white text-sm truncate">{eqName}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
          Gửi lúc {fmtDateTime(req.createdAt)}
        </p>
        {req.note && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">"{req.note}"</p>
        )}
        {req.decisionNote && (
          <p className="text-xs text-red-400 dark:text-red-400/80 mt-0.5 italic">
            Phản hồi: "{req.decisionNote}"
          </p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <BorrowBadge status={req.status} req={req} />
        {req.status === 'handed_over' && (
          <button
            onClick={() => onReturn(req)}
            className="px-4 py-2 rounded-xl bg-[#1E2B58] dark:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#2A3B66] transition-all active:scale-95 shadow-md shadow-blue-900/20"
          >
            Yêu cầu trả thiết bị
          </button>
        )}
        {req.status === 'approved' && (
          <button
            onClick={() => onConfirmReceived(req)}
            className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-100 transition-all active:scale-95 border border-emerald-100 dark:border-emerald-900/30"
          >
            Xác nhận nhận
          </button>
        )}
        {req.status === 'pending' && (
          <button
            onClick={() => onCancel(req)}
            className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95 border border-red-100 dark:border-red-900/30"
          >
            Hủy
          </button>
        )}
      </div>
    </div>
  );
};

export default ActiveRequestItem;
