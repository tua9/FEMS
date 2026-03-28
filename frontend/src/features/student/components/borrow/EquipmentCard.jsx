import React from 'react';
import { Laptop, Lock, Unlock, LogOut, CheckCircle2, X, Eye, Plus } from 'lucide-react';
import BorrowBadge from './BorrowBadge';
import AvailabilityLabel from './AvailabilityLabel';

const EquipmentCard = ({
  item,
  myReq,
  isSessionOngoing,
  onBorrow,
  onReturn,
  onConfirmReceived,
  onCancel,
  onViewDetail,
  hasActiveRequest
}) => {
  const eqId = String(item._id);
  const isDeviceLocked = item.status === 'broken' || item.status === 'maintenance';

  return (
    <div
      className="dashboard-card rounded-[2rem] p-6 flex flex-col gap-4 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#1E2B58]/5"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center shrink-0">
          {item.img
            ? <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
            : <Laptop className="w-5 h-5 text-slate-400" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-[#1E2B58] dark:text-white truncate text-sm">
            {item.name}
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
            {item.code || '#' + eqId.slice(-6).toUpperCase()}
          </p>
        </div>
      </div>

      {/* Category + availability row */}
      <div className="flex items-center justify-between gap-2">
        <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 truncate max-w-[50%]">
          {item.category || 'Thiết bị'}
        </span>
        {myReq
          ? <BorrowBadge status={myReq.status} req={myReq} />
          : <AvailabilityLabel equipmentStatus={item.status} isOccupiedByOther={item.isOccupiedByOther} />
        }
      </div>

      {/* Action area */}
      {isDeviceLocked ? (
        <button
          disabled
          className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-black text-xs uppercase tracking-widest cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Lock className="w-3.5 h-3.5" /> Không khả dụng
        </button>
      ) : myReq ? (
        <div className="flex flex-col gap-2">
          {myReq.status === 'handed_over' && (
            <button
              onClick={() => onReturn(myReq)}
              className="w-full py-2.5 rounded-2xl bg-[#1E2B58] dark:bg-blue-700 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#2A3B66] dark:hover:bg-blue-600 transition-all active:scale-95 shadow-md shadow-blue-900/20"
            >
              <LogOut className="w-3.5 h-3.5" /> Yêu cầu trả thiết bị
            </button>
          )}
          {myReq.status === 'returning' && (
            <div className="w-full py-2.5 rounded-2xl bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-violet-100 dark:border-violet-900/30">
              <CheckCircle2 className="w-3.5 h-3.5" /> Chờ giảng viên xác nhận
            </div>
          )}
          {myReq.status === 'approved' && (
            <button
              onClick={() => onConfirmReceived(myReq)}
              className="w-full py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all active:scale-95 border border-emerald-100 dark:border-emerald-900/30"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Xác nhận nhận hàng
            </button>
          )}
          {myReq.status === 'pending' && (
            <button
              onClick={() => onCancel(myReq)}
              className="w-full py-2.5 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all active:scale-95 border border-red-100 dark:border-red-900/30"
            >
              <X className="w-3.5 h-3.5" /> Hủy yêu cầu
            </button>
          )}
          <button
            onClick={() => onViewDetail(myReq)}
            className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-[#1E2B58]/40 dark:text-white/30 hover:text-[#1E2B58] dark:hover:text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3 h-3" /> Xem chi tiết yêu cầu
          </button>
        </div>
      ) : (
        <button
          onClick={() => {
            if (hasActiveRequest) {
              return; // Already handled in the page wrapper or just silently blocked
            }
            onBorrow(item);
          }}
          disabled={!isSessionOngoing || hasActiveRequest}
          className={`w-full py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${
            isSessionOngoing && !hasActiveRequest
              ? 'bg-[#1E2B58] dark:bg-blue-700 text-white hover:bg-[#2A3B66] dark:hover:bg-blue-600 shadow-md shadow-blue-900/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Plus className="w-3.5 h-3.5" /> Yêu cầu mượn
        </button>
      )}
    </div>
  );
};

export default EquipmentCard;
