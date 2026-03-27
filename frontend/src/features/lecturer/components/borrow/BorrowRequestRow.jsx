import React from 'react';
import { Laptop, Eye } from 'lucide-react';
import BorrowAvatar from './BorrowAvatar';
import { 
  fmtDateTime, 
  getStudentName, 
  getEquipmentName 
} from './borrowUtils';

const BorrowRequestRow = ({ req, actions, onViewDetail }) => {
  const studentName = getStudentName(req);
  const eqName = getEquipmentName(req);
  
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-4 py-4 px-5 border-b border-[#1E2B58]/5 dark:border-white/5 last:border-0"
    >
      {/* Student */}
      <div className="flex items-center gap-3 sm:w-48 shrink-0">
        <BorrowAvatar name={studentName} avatarUrl={req.borrowerId?.avatarUrl} />
        <div className="min-w-0">
          <p className="font-black text-[#1E2B58] dark:text-white text-sm truncate">{studentName}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {String(req.borrowerId?._id || 'ID').slice(-8).toUpperCase()}
          </p>
        </div>
      </div>

      {/* Equipment */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
          {req.equipmentId?.img
            ? <img src={req.equipmentId.img} alt="" className="w-full h-full object-cover" />
            : <Laptop className="w-4 h-4 text-slate-400" />
          }
        </div>
        <div className="min-w-0">
          <p className="font-bold text-[#1E2B58] dark:text-white text-sm truncate">{eqName}</p>
          {req.note && (
            <p className="text-[10px] text-slate-400 truncate">"{req.note}"</p>
          )}
        </div>
      </div>

      {/* Time */}
      <div className="shrink-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submitted</p>
        <p className="text-xs font-bold text-[#1E2B58]/70 dark:text-white/60">{fmtDateTime(req.createdAt)}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {actions}
        <button
          onClick={() => onViewDetail(req)}
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-[#1E2B58] dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default React.memo(BorrowRequestRow);
