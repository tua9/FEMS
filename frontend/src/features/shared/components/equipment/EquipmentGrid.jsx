import React, { useMemo } from "react";
import { ArrowRight, Laptop, Monitor, TabletSmartphone, Projector, Camera, Mic, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";



const statusConfig = {
  Available: {
    color: "bg-[#D1FAE5] text-[#059669] dark:bg-[#059669]/20 dark:text-[#34D399]",
    label: "Request Borrow",
    disabled: false,
  },
  Maintenance: {
    color: "bg-[#FEF3C7] text-[#D97706] dark:bg-[#D97706]/20 dark:text-[#FBBF24]",
    label: "Under Maintenance",
    disabled: true,
  },
  Broken: {
    color: "bg-[#FEE2E2] text-[#DC2626] dark:bg-[#DC2626]/20 dark:text-[#F87171] opacity-80",
    label: "Broken / Damaged",
    disabled: true,
  },
};

const categoryIcons = {
  laptop: Laptop,
  tablet: TabletSmartphone,
  projector: Projector,
  monitor: Monitor,
  camera: Camera,
  audio: Mic,
};

const statusMap = {
  available: "Available",
  maintenance: "Maintenance",
  broken: "Broken",
  // backward compatibility (old data)
  good: "Available",
};

export const EquipmentGrid = ({
  items,
  onBorrowRequest,
  showOnlyAvailable = true,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
}) => {

  const filteredItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    if (!showOnlyAvailable) return items;

    return items.filter((item) => item.status === "available" || item.status === "good");
  }, [items, showOnlyAvailable]);

  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredItems.map((item) => {
          const mappedStatus = statusMap[item.status] || "Available";
          const cfg = statusConfig[mappedStatus] ?? statusConfig.Available;
          const itemCategory = (item.category || "").toLowerCase();
          const Icon = categoryIcons[itemCategory] || HelpCircle;

          return (
            <div key={item._id} className="flex flex-col gap-6">
              <div className="glass-card aspect-4/3 rounded-4xl relative flex items-center justify-center p-8 group overflow-hidden border border-white/30 dark:border-slate-700/50">
                <span
                  className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-[0.05em] z-10 ${cfg.color}`}
                >
                  {mappedStatus}
                </span>

                {item.img ? (
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${!cfg.disabled ? "group-hover:scale-110" : ""}`}
                  />
                ) : (
                  <Icon
                    className={`w-24 h-24 text-[#1E2B58] dark:text-white opacity-20 transition-transform duration-300 ${!cfg.disabled ? "group-hover:scale-110" : ""
                       }`}
                    strokeWidth={1}
                  />
                )}
              </div>

              <div className="px-2">
                <h4 className="font-bold text-xl text-[#1E2B58] dark:text-white mb-1 truncate" title={item.name}>
                  {item.name}
                </h4>

                <p className="text-[0.6875rem] font-bold uppercase tracking-widest opacity-60 text-[#1E2B58] dark:text-white">
                  {item.code || _idToSku(item._id)} • {(item.roomId || item.room_id) && typeof (item.roomId || item.room_id) !== 'string' ? (item.roomId || item.room_id).name : "Phòng kho"}
                </p>
              </div>

              <button
                disabled={cfg.disabled}
                onClick={() => !cfg.disabled && onBorrowRequest(item)}
                className={`py-5 rounded-3xl font-bold flex items-center justify-center gap-2 transition-all duration-300 w-full text-base ${cfg.disabled
                   ? "bg-white/40 dark:bg-slate-800/40 text-[#1E2B58]/40 dark:text-white/40 cursor-not-allowed"
                   : "bg-[#1E2B58] text-white hover:shadow-xl hover:shadow-[#1E2B58]/30 hover:scale-[1.02] active:scale-95"
                   }`}
              >
                {cfg.label}
                {!cfg.disabled && (
                  <ArrowRight className="w-4 h-4" strokeWidth={3} />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-full border border-[#1E2B58]/10 dark:border-white/10 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#1E2B58] dark:text-slate-400" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                currentPage === p
                  ? "bg-[#1E2B58] text-white shadow-sm shadow-[#1E2B58]/20"
                  : "border border-[#1E2B58]/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-[#1E2B58] dark:text-slate-300"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-full border border-[#1E2B58]/10 dark:border-white/10 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-[#1E2B58] dark:text-slate-400" />
          </button>
        </div>
      )}
    </section>
  );
};

function _idToSku(_id) {
  return _id.slice(-6).toUpperCase();
}