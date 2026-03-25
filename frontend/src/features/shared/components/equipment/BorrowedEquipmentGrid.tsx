import React from "react";
import { ArrowRight, Laptop, History, LogOut, Eye, Clock } from "lucide-react";
import { formatDistanceToNow, isAfter, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

interface BorrowedEquipmentGridProps {
  items: any[]; // Mapped borrow items
  user: any;
  onViewHistory: () => void;
  onReturn: (id: string) => void;
  onView: (item: any) => void;
}

export const BorrowedEquipmentGrid: React.FC<BorrowedEquipmentGridProps> = ({
  items,
  user,
  onViewHistory,
  onReturn,
  onView,
}) => {
  return (
    <section className="mb-12 relative">
      <div className="flex justify-between items-center mb-8 px-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-[#1E2B58] dark:bg-blue-600 rounded-full" />
          <h3 className="text-2xl font-black text-[#1E2B58] dark:text-white tracking-tight">
            Đang mượn
          </h3>
          <span className="flex items-center justify-center bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 text-[10px] font-black px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-400/20">
            {items.length} THIẾT BỊ
          </span>
        </div>

        <button
          onClick={onViewHistory}
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1E2B58]/40 dark:text-white/40 hover:text-[#1E2B58] dark:hover:text-white transition-all"
        >
          <History className="w-3.5 h-3.5" />
          Xem lịch sử
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
        {items.map((b) => {
          const returnDate = b.original.return_date;
          const isOverdue = !isAfter(parseISO(returnDate), new Date());
          const countdown = formatDistanceToNow(parseISO(returnDate), { addSuffix: true, locale: vi });
          
          return (
            <div
              key={b.original._id}
              className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl shadow-[#1E2B58]/5 dark:shadow-black/20 border border-slate-100 dark:border-white/5 transition-all hover:shadow-2xl hover:shadow-[#1E2B58]/10 hover:-translate-y-1 overflow-hidden"
            >
              {/* Card Decoration */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all" />
              
              {/* Header: User Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-[#1E2B58] dark:bg-slate-800 flex items-center justify-center text-white ring-4 ring-slate-50 dark:ring-white/5 shadow-lg overflow-hidden">
                    {user?.avatar ? (
                        <img src={user.avatar} alt={user.full_name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-xl font-black uppercase">{user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}</span>
                    )}
                </div>
                <div>
                  <h4 className="font-black text-[#1E2B58] dark:text-white truncate max-w-[150px]">
                    {user?.full_name || user?.username}
                  </h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    ID: {user?._id?.slice(-8).toUpperCase() || "STUDENT"}
                  </p>
                </div>
              </div>

              {/* Item Section */}
              <div className="relative mb-8 p-5 rounded-[1.75rem] bg-slate-50/80 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors overflow-hidden">
                  {b.original?.equipment_id?.img ? (
                    <img src={b.original.equipment_id.img} alt={b.equipmentName} className="w-full h-full object-cover" />
                  ) : (
                    <Laptop className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">ITEM</span>
                  <h5 className="font-bold text-[#1E2B58] dark:text-white truncate">
                    {b.equipmentName}
                  </h5>
                </div>
              </div>

              {/* Footer: Due Date & Actions */}
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">DUE DATE</span>
                    <p className={`text-lg font-black tracking-tight ${isOverdue ? 'text-red-500' : 'text-[#1E2B58] dark:text-blue-400'}`}>
                      {new Date(returnDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${isOverdue ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                    <Clock className="w-3 h-3" />
                    {countdown}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => onReturn(b.original._id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-[#1E2B58] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Trả thiết bị
                  </button>
                  <button
                    onClick={() => onView(b)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#1E2B58] dark:bg-blue-600 text-[10px] font-black uppercase tracking-widest text-white hover:bg-black dark:hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};