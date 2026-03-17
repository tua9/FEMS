import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  ArrowRight,
  CalendarDays,
  FileText,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

import { EquipmentFilter } from "../../components/lecturer/equipment/EquipmentFilter";
import { EquipmentCategories } from "../../components/lecturer/equipment/EquipmentCategories";
import { EquipmentGrid } from "../../components/lecturer/equipment/EquipmentGrid";
import { BorrowedEquipmentGrid } from "../../components/lecturer/equipment/BorrowedEquipmentGrid";
import { useEquipmentStore } from "@/stores/useEquipmentStore";
import { useBuildingStore } from "@/stores/useBuildingStore";
import { useBorrowRequestStore } from "@/stores/useBorrowRequestStore";
import { useRoomStore } from "@/stores/useRoomStore";
import type { Equipment } from "@/types/equipment";

// Category id → EquipmentType (or 'all')
// Must match the `category` values stored in MongoDB
const CATEGORY_TO_TYPE: Record<string, string> = {
  all:     "all-types",
  laptop:  "laptop",
  iot_kit: "iot_kit",
  tablet:  "tablet",
  pc_lab:  "pc_lab",
  camera:  "camera",
  audio:   "audio",
};

const TYPE_TO_CATEGORY: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_TO_TYPE).map(([k, v]) => [v, k]),
);

// Categories that are fixed to a specific room (auto-assigned)
const FIXED_ROOM_CATEGORY: Record<string, string> = {
  pc_lab:  "Computer Lab",
  iot_kit: "Lab211",
};

// ─── Component ────────────────────────────────────────────────────────────────

export const EquipmentCatalog: React.FC = () => {
  const navigate = useNavigate();
  const { inventoryData, fetchInventory, loading: equipmentLoading } = useEquipmentStore();
  const { buildings, fetchAll: fetchBuildings } = useBuildingStore();
  const { rooms, fetchAll: fetchRooms } = useRoomStore();
  const { createMyBorrowRequest, fetchMyBorrowRequests, loading: borrowLoading } = useBorrowRequestStore();

  // ── Filter state ──────────────────────────────────────────────────────────
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("all-types");
  const [locationFilter, setLocationFilter] = useState("all-locations");
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // ── Borrow modal state ────────────────────────────────────────────────────
  const [borrowingItem, setBorrowingItem] = useState<Equipment | null>(null);
  const [returnDate, setReturnDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [formError, setFormError] = useState("");

  const ITEMS_PER_PAGE = 12;

  // ── Initial Fetch ─────────────────────────────────────────────────────────
  useEffect(() => {
    fetchBuildings();
    fetchRooms();
  }, [fetchBuildings, fetchRooms]);

  useEffect(() => {
    const params: any = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: searchText,
    };

    if (typeFilter !== "all-types") {
      params.category = typeFilter;
    } else if (activeCategory !== "all") {
      params.category = activeCategory;
    }

    if (locationFilter !== "all-locations") {
      // Find building ID by name (case insensitive slug)
      const slug = locationFilter.toLowerCase();
      const building = buildings.find(b => b.name.toLowerCase().includes(slug));
      if (building) params.building_id = building._id;
    }

    fetchInventory(params);
  }, [currentPage, searchText, typeFilter, activeCategory, locationFilter, fetchInventory, buildings]);

  // ── Sync category ↔ type dropdown ─────────────────────────────────────────
  const handleTypeChange = (val: string) => {
    setTypeFilter(val);
    setActiveCategory(TYPE_TO_CATEGORY[val] ?? "all");
    setCurrentPage(1);
  };

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setTypeFilter(CATEGORY_TO_TYPE[id] ?? "all-types");
    setCurrentPage(1);
  };

  const handleFilter = () => {
    setCurrentPage(1);
  };

  // ── Pagination ────────────────────────────────────────────────────────────
  const totalPages = inventoryData?.pagination.totalPages || 1;
  const safePage = Math.min(currentPage, totalPages);
  const pagedItems = inventoryData?.items || [];

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Borrow modal ──────────────────────────────────────────────────────────
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().split("T")[0];

  const openBorrowModal = (item: Equipment) => {
    setBorrowingItem(item);
    setReturnDate(tomorrow);
    setPurpose("");
    setFormError("");

    // Auto-assign room for fixed-location equipment
    const fixedRoomName = FIXED_ROOM_CATEGORY[item.category];
    if (fixedRoomName) {
      // Equipment already has room_id populated — use it directly
      const roomIdFromItem = (item.room_id as any)?._id || (item.room_id as any);
      if (roomIdFromItem) {
        setSelectedRoomId(String(roomIdFromItem));
      } else {
        // Fallback: find by name from rooms store
        const found = rooms.find(r => r.name === fixedRoomName);
        setSelectedRoomId(found?._id || "");
      }
    } else {
      setSelectedRoomId("");
    }
  };

  const closeBorrowModal = () => {
    setBorrowingItem(null);
    setFormError("");
  };

  const handleSubmitBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnDate) {
      setFormError("Please select a return date.");
      return;
    }
    if (!purpose.trim()) {
      setFormError("Please enter the purpose of borrowing.");
      return;
    }

    try {
      const now = new Date();
      // Set borrow date to tomorrow at 8:00 AM for consistency
      const tomorrowDate = new Date(now);
      tomorrowDate.setDate(now.getDate() + 1);
      tomorrowDate.setHours(8, 0, 0, 0);

      // For fixed-location categories (pc_lab, iot_kit), send room_id
      // For all other categories, DO NOT send room_id (leave as null)
      const isFixed = !!FIXED_ROOM_CATEGORY[borrowingItem?.category || ""];

      await createMyBorrowRequest({
        equipment_id: borrowingItem!._id,
        ...(isFixed && selectedRoomId ? { room_id: selectedRoomId } : {}),
        type: "equipment",
        borrow_date: tomorrowDate.toISOString(),
        return_date: new Date(returnDate).toISOString(),
        note: purpose.trim(),
      });

      toast.success(`Request submitted successfully!`, {
        description: `Your request for "${borrowingItem!.name}" is pending review.`,
      });

      // Component is responsible for refreshing data after creation (not the store)
      await fetchMyBorrowRequests();

      closeBorrowModal();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Failed to submit request. Please try again.");
    }
  };

  // ── Render page buttons ───────────────────────────────────────────────────
  const renderPageButtons = () => {
    if (totalPages <= 1) return null;

    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("...");
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++)
        pages.push(i);
      if (safePage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return (
      <nav className="mb-[2rem] flex flex-wrap items-center justify-center gap-[0.5rem] md:mb-[4rem] md:gap-[0.75rem]">
        <button
          onClick={() => handlePageChange(safePage - 1)}
          disabled={safePage === 1}
          className="flex h-[2.75rem] w-[2.75rem] items-center justify-center rounded-full transition hover:bg-white/40 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-slate-800/40"
        >
          <span className="material-symbols-outlined text-[1.125rem]">chevron_left</span>
        </button>

        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={`ellipsis-${idx}`} className="flex h-[2.75rem] w-[2.75rem] items-center justify-center text-[1rem] text-[#1E2B58] opacity-40 dark:text-white">...</span>
          ) : (
            <button
              key={p}
              onClick={() => handlePageChange(p as number)}
              className={`flex h-[2.75rem] w-[2.75rem] items-center justify-center rounded-full text-[1rem] font-bold transition-all hover:scale-105 active:scale-95 ${safePage === p
                ? "bg-[#1E2B58] text-white shadow-lg shadow-[#1E2B58]/20"
                : "text-[#1E2B58] hover:bg-white/40 dark:text-white dark:hover:bg-slate-800/40"
                }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => handlePageChange(safePage + 1)}
          disabled={safePage === totalPages}
          className="flex h-[2.75rem] w-[2.75rem] items-center justify-center rounded-full transition hover:bg-white/40 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-slate-800/40"
        >
          <span className="material-symbols-outlined text-[1.125rem]">chevron_right</span>
        </button>
      </nav>
    );
  };

  return (
    <div className="w-full">
      <main className="mx-auto flex w-full max-w-[90vw] flex-1 flex-col px-4 pt-32 pb-10 sm:px-6 md:pt-36 xl:max-w-7xl">
        {/* Header */}
        <section className="mb-[2.5rem] md:mb-[3.5rem]">
          <h2 className="mb-[0.75rem] text-[2.25rem] leading-tight font-extrabold text-[#1E2B58] sm:text-[2.75rem] md:text-[3.5rem] dark:text-white">
            Equipment Catalog
          </h2>
          <p className="max-w-2xl text-[1rem] font-medium text-[#1E2B58]/60 sm:text-[1.125rem] dark:text-white/60">
            Explore and reserve university resources with our enhanced Lecturer Portal.
          </p>
        </section>

        {/* Filter bar */}
        <EquipmentFilter
          searchText={searchText}
          onSearchChange={(val) => {
            setSearchText(val);
            setCurrentPage(1);
          }}
          typeFilter={typeFilter}
          onTypeChange={handleTypeChange}
          locationFilter={locationFilter}
          onLocationChange={(val) => {
            setLocationFilter(val);
            setCurrentPage(1);
          }}
          onFilter={handleFilter}
        />

        {/* Category chips */}
        <EquipmentCategories
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Loading indicator integration */}
        {equipmentLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#1E2B58] opacity-20" />
          </div>
        ) : (
          /* Equipment grid */
          <EquipmentGrid
            items={pagedItems}
            onBorrowRequest={openBorrowModal}
            showOnlyAvailable={false}
          />
        )}

        {/* Borrowed equipment */}
        <BorrowedEquipmentGrid
          items={[]} // This would eventually come from a store too
          onViewHistory={() => navigate("/lecturer/history")}
          onItemClick={() => navigate("/lecturer/history")}
        />

        {/* Pagination */}
        {renderPageButtons()}
      </main>

      {/* ── Borrow Request Modal ───────────────────────────────────────── */}
      {borrowingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeBorrowModal();
          }}
        >
          <div className="glass-card animate-in fade-in zoom-in-95 relative w-full max-w-md rounded-[2rem] p-8 shadow-2xl shadow-[#1E2B58]/20 duration-200">
            {/* Close button */}
            <button
              onClick={closeBorrowModal}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full text-[#1E2B58]/60 transition hover:bg-[#1E2B58]/10 dark:text-white/60 dark:hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal header */}
            <div className="mb-6">
              <p className="mb-1 text-[0.625rem] font-black tracking-widest text-[#1E2B58]/50 uppercase dark:text-white/40">
                Borrow Request
              </p>
              <h3 className="text-2xl leading-tight font-black text-[#1E2B58] dark:text-white">
                {borrowingItem.name}
              </h3>
              <p className="mt-1 text-xs font-bold tracking-widest text-[#1E2B58]/50 uppercase dark:text-white/40">
                {borrowingItem._id.slice(-6).toUpperCase()} • {(borrowingItem.room_id as any)?.name || "N/A"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitBorrow} className="flex flex-col gap-5">
              {/* Return date */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-xs font-black tracking-widest text-[#1E2B58]/70 uppercase dark:text-white/60">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Return Date
                </label>
                <input
                  type="date"
                  required
                  min={tomorrow}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full rounded-[1rem] border border-white/40 bg-white/40 px-4 py-3 text-sm font-bold text-[#1E2B58] transition-all outline-none focus:ring-2 focus:ring-[#1E2B58]/30 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-white"
                />
              </div>

              {/* Room Section: only show for fixed-room categories (pc_lab / iot_kit) */}
              {FIXED_ROOM_CATEGORY[borrowingItem?.category || ""] && (
                <div className="flex items-center gap-3 rounded-[1rem] border border-emerald-400/30 bg-emerald-50/60 dark:bg-emerald-900/20 px-4 py-3">
                  <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[1.25rem]">location_on</span>
                  <div>
                    <p className="text-[0.625rem] font-black uppercase tracking-widest text-emerald-700/60 dark:text-emerald-400/60">Fixed Location</p>
                    <p className="text-sm font-black text-emerald-700 dark:text-emerald-300">
                      {FIXED_ROOM_CATEGORY[borrowingItem?.category || ""]}
                    </p>
                  </div>
                </div>
              )}

              {/* Purpose */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-xs font-black tracking-widest text-[#1E2B58]/70 uppercase dark:text-white/60">
                  <FileText className="h-3.5 w-3.5" />
                  Purpose of Borrowing
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Teaching demo for CS101 lecture..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full resize-none rounded-[1rem] border border-white/40 bg-white/40 px-4 py-3 text-sm font-medium text-[#1E2B58] transition-all outline-none placeholder:text-[#1E2B58]/30 focus:ring-2 focus:ring-[#1E2B58]/30 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-white/30"
                />
              </div>

              {/* Error */}
              {formError && (
                <p className="rounded-xl bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-500 dark:text-red-400">
                  {formError}
                </p>
              )}

              {/* Actions */}
              <div className="mt-1 flex gap-3">
                <button
                  type="button"
                  onClick={closeBorrowModal}
                  className="flex-1 rounded-[1.25rem] border border-[#1E2B58]/20 py-3.5 text-sm font-bold text-[#1E2B58]/70 transition-all hover:bg-[#1E2B58]/5 dark:border-white/20 dark:text-white/70 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={borrowLoading}
                  className="flex flex-[2] items-center justify-center gap-2 rounded-[1.25rem] bg-[#1E2B58] py-3.5 text-sm font-bold text-white transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#1E2B58]/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {borrowLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Submit Request
                      <ArrowRight className="h-4 w-4" strokeWidth={3} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
