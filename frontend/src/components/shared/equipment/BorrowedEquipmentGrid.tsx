import React from "react";
import { ArrowRight, Laptop } from "lucide-react";
import type { Equipment } from "@/types/equipment";

interface BorrowedEquipmentGridProps {
  items: Equipment[];
  onViewHistory: () => void;
  onItemClick: (item: Equipment) => void;

  borrowedInfo?: { [equipmentId: string]: string }; // return date
  borrowStatus?: { [equipmentId: string]: string }; // status
}

const statusConfig: Record<
  string,
  { label: string; color: string }
> = {
  borrowed: {
    label: "Borrowed",
    color:
      "bg-[#FEF3C7] text-[#D97706] dark:bg-[#D97706]/20 dark:text-[#FBBF24]",
  },
  pending: {
    label: "Pending",
    color:
      "bg-[#DBEAFE] text-[#2563EB] dark:bg-[#2563EB]/20 dark:text-[#60A5FA]",
  },
  rejected: {
    label: "Rejected",
    color:
      "bg-[#FEE2E2] text-[#DC2626] dark:bg-[#DC2626]/20 dark:text-[#F87171]",
  },
  returned: {
    label: "Returned",
    color:
      "bg-[#D1FAE5] text-[#059669] dark:bg-[#059669]/20 dark:text-[#34D399]",
  },
};

export const BorrowedEquipmentGrid: React.FC<
  BorrowedEquipmentGridProps
> = ({
  items,
  onViewHistory,
  onItemClick,
  borrowedInfo = {},
  borrowStatus = {},
}) => {
  return (
    <section className="glass-card rounded-[3rem] p-[2.5rem] mb-[3rem]">
      <div className="flex justify-between items-center mb-[2rem]">
        <h3 className="text-[1.5rem] font-bold text-[#1E2B58] dark:text-white">
          Currently Borrowed
        </h3>

        <button
          onClick={onViewHistory}
          className="flex items-center gap-1.5 text-[0.6875rem] font-bold uppercase tracking-widest text-[#1E2B58] dark:text-white hover:opacity-60 transition-opacity"
        >
          View History
          <ArrowRight className="w-3 h-3" strokeWidth={3} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-[1.5rem]">
        {items.map((item) => {
          const Icon = Laptop;

          const returnDate = borrowedInfo[item._id];
          const status = borrowStatus[item._id] || "borrowed";
          const statusStyle = statusConfig[status];

          return (
            <button
              key={item._id}
              onClick={() => onItemClick(item)}
              className="text-left bg-white/30 dark:bg-slate-800/40 rounded-[2rem] p-[1.5rem] flex items-center gap-[1.25rem] border border-white/40 dark:border-slate-700/50 hover:bg-white/50 dark:hover:bg-slate-800/60 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              <div className="w-[4rem] h-[4rem] bg-white/50 dark:bg-slate-700/50 rounded-2xl flex items-center justify-center shrink-0">
                <Icon
                  className="w-[1.5rem] h-[1.5rem] text-[#1E2B58] dark:text-white"
                  strokeWidth={2}
                />
              </div>

              <div className="flex-1">
                <h5 className="font-bold text-[1rem] text-[#1E2B58] dark:text-white mb-[0.25rem]">
                  {item.name}
                </h5>

                {statusStyle && (
                  <span
                    className={`inline-block px-2 py-[2px] rounded-full text-[0.6rem] font-bold uppercase tracking-wide ${statusStyle.color}`}
                  >
                    {statusStyle.label}
                  </span>
                )}

                {returnDate && (
                  <p className="text-[0.625rem] opacity-60 uppercase font-bold text-[#1E2B58] dark:text-white mt-[2px]">
                    Due: {new Date(returnDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};