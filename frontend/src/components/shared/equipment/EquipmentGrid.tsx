import React, { useMemo } from "react";
import { ArrowRight, Laptop, Monitor, TabletSmartphone, Projector, Camera, Mic, HelpCircle } from "lucide-react";
import type { Equipment } from "@/types/equipment";

interface EquipmentGridProps {
  items: Equipment[];
  onBorrowRequest: (item: Equipment) => void;
  showOnlyAvailable?: boolean;
}

const statusConfig = {
  Available: {
    color: "bg-[#D1FAE5] text-[#059669] dark:bg-[#059669]/20 dark:text-[#34D399]",
    label: "Request Borrow",
    disabled: false,
  },
  "In Use": {
    color: "bg-[#FEF3C7] text-[#D97706] dark:bg-[#D97706]/20 dark:text-[#FBBF24]",
    label: "In Use",
    disabled: true,
  },
  Maintenance: {
    color: "bg-[#FEE2E2] text-[#DC2626] dark:bg-[#DC2626]/20 dark:text-[#F87171]",
    label: "Under Maintenance",
    disabled: true,
  },
};

const categoryIcons: Record<string, any> = {
  laptop: Laptop,
  tablet: TabletSmartphone,
  projector: Projector,
  monitor: Monitor,
  camera: Camera,
  audio: Mic,
};

const statusMap: Record<string, keyof typeof statusConfig> = {
  good: "Available",
  broken: "Maintenance",
  maintenance: "Maintenance",
};

export const EquipmentGrid: React.FC<EquipmentGridProps> = ({
  items,
  onBorrowRequest,
  showOnlyAvailable = true,
}) => {

  const filteredItems = useMemo(() => {
    if (!showOnlyAvailable) return items;

    return items.filter((item: Equipment) => item.status === "good");
  }, [items, showOnlyAvailable]);

  return (
    <section className="mb-[3rem]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[2rem]">
        {filteredItems.map((item) => {
          const mappedStatus = statusMap[item.status] || "Available";
          const cfg = statusConfig[mappedStatus];
          const itemCategory = (item.category || "").toLowerCase();
          const Icon = categoryIcons[itemCategory] || HelpCircle;

          return (
            <div key={item._id} className="flex flex-col gap-[1.5rem]">
              <div className="glass-card aspect-[4/3] rounded-[2rem] relative flex items-center justify-center p-[2rem] group overflow-hidden border border-white/30 dark:border-slate-700/50">
                <span
                  className={`absolute top-[1.5rem] right-[1.5rem] px-[0.75rem] py-[0.25rem] rounded-full text-[0.65rem] font-bold uppercase tracking-[0.05em] ${cfg.color}`}
                >
                  {mappedStatus}
                </span>

                <Icon
                  className={`w-[6rem] h-[6rem] text-[#1E2B58] dark:text-white opacity-20 transition-transform duration-300 ${!cfg.disabled ? "group-hover:scale-110" : ""
                    }`}
                  strokeWidth={1}
                />
              </div>

              <div className="px-[0.5rem]">
                <h4 className="font-bold text-[1.25rem] text-[#1E2B58] dark:text-white mb-[0.25rem]">
                  {item.name}
                </h4>

                <p className="text-[0.6875rem] font-bold uppercase tracking-widest opacity-60 text-[#1E2B58] dark:text-white">
                  {_idToSku(item._id)} • {(item.room_id as any)?.name || "No Room"}
                </p>
              </div>

              <button
                disabled={cfg.disabled}
                onClick={() => !cfg.disabled && onBorrowRequest(item)}
                className={`py-[1.25rem] rounded-[1.5rem] font-bold flex items-center justify-center gap-[0.5rem] transition-all duration-300 w-full text-[1rem] ${cfg.disabled
                  ? "bg-white/40 dark:bg-slate-800/40 text-[#1E2B58]/40 dark:text-white/40 cursor-not-allowed"
                  : "bg-[#1E2B58] text-white hover:shadow-xl hover:shadow-[#1E2B58]/30 hover:scale-[1.02] active:scale-95"
                  }`}
              >
                {cfg.label}
                {!cfg.disabled && (
                  <ArrowRight className="w-[1rem] h-[1rem]" strokeWidth={3} />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

function _idToSku(_id: string) {
  return _id.slice(-6).toUpperCase();
}