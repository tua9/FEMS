import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { EquipmentFilter } from "@/components/shared/equipment/EquipmentFilter";
import { EquipmentCategories } from "@/components/shared/equipment/EquipmentCategories";
import { EquipmentGrid } from "@/components/shared/equipment/EquipmentGrid";
import { BorrowedEquipmentGrid } from "@/components/shared/equipment/BorrowedEquipmentGrid";
import BorrowModal from "@/components/shared/equipment/BorrowModal";
import { useEquipmentStore } from "@/stores/useEquipmentStore";
import { useBuildingStore } from "@/stores/useBuildingStore";
import { useBorrowRequestStore } from "@/stores/useBorrowRequestStore";
import { useRoomStore } from "@/stores/useRoomStore";
import { useAuthStore } from "@/stores/useAuthStore";
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

// ─── Component ────────────────────────────────────────────────────────────────

export const EquipmentCatalog: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const role = user?.role || 'student';
  const historyPath = `/${role}/history`;

  const { inventoryData, fetchInventory, loading: equipmentLoading } = useEquipmentStore();
  const { buildings, fetchAll: fetchBuildings } = useBuildingStore();
  const { fetchAll: fetchRooms } = useRoomStore();
  const { createMyBorrowRequest, fetchMyBorrowRequests, loading: borrowLoading } = useBorrowRequestStore();

  // ── Filter state ──────────────────────────────────────────────────────────
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("all-types");
  const [locationFilter, setLocationFilter] = useState("all-locations");
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // ── Borrow modal state ────────────────────────────────────────────────────
  const [borrowingItem, setBorrowingItem] = useState<Equipment | null>(null);

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

  const openBorrowModal = (item: Equipment) => {
    setBorrowingItem(item);
  };

  const closeBorrowModal = () => {
    setBorrowingItem(null);
  };

  const handleSubmitBorrow = async (borrowDate: string, returnDate: string, purpose: string) => {
    try {
      const roomIdFromItem = (borrowingItem?.room_id as any)?._id || (borrowingItem?.room_id as any);
      const roomId = roomIdFromItem ? String(roomIdFromItem) : "";

      await createMyBorrowRequest({
        equipment_id: borrowingItem!._id,
        ...(roomId ? { room_id: roomId } : {}),
        type: "equipment",
        borrow_date: new Date(borrowDate).toISOString(),
        return_date: new Date(returnDate).toISOString(),
        note: purpose.trim(),
      });

      toast.success(`Request submitted successfully!`, {
        description: `Your request for "${borrowingItem!.name}" is pending review.`,
      });

      await fetchMyBorrowRequests();
      closeBorrowModal();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to submit request.");
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
      <main className="mx-auto flex w-full max-w-[90vw] flex-1 flex-col px-4 pt-6 sm:pt-24 pb-10 sm:px-6 xl:max-w-7xl">
        {/* Header */}
        <PageHeader
          title="Equipment Catalog"
          subtitle="Explore and reserve university resources with our enhanced Portal."
        />

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
          onViewHistory={() => navigate(historyPath)}
          onItemClick={() => navigate(historyPath)}
        />

        {/* Pagination */}
        {renderPageButtons()}
      </main>

      {/* ── Borrow Request Modal ───────────────────────────────────────── */}
      {borrowingItem && (
        <BorrowModal
          item={borrowingItem}
          onClose={closeBorrowModal}
          onSubmit={handleSubmitBorrow}
          isLoading={borrowLoading}
        />
      )}
    </div>
  );
};

export default EquipmentCatalog;
