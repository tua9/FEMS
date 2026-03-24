import React, { useState, useEffect, useMemo } from "react";
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
import { useBorrowRequestStore } from "@/stores/useBorrowRequestStore";
import { useRoomStore } from "@/stores/useRoomStore";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Equipment } from "@/types/equipment";
import type { BorrowRequest } from "@/types/borrowRequest";
import { sortEquipmentByAvailability, hasActiveBorrowRequest } from "@/utils/equipmentHelper";
import { DuplicateBorrowModal } from "@/components/shared/equipment/DuplicateBorrowModal";
import { HistoryDetailModal, type ModalItem } from "@/components/shared/history/HistoryDetailModal";
import { useHistoryMappings } from "@/hooks/useHistoryMappings";

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
  const { fetchAll: fetchRooms } = useRoomStore();
  const { createMyBorrowRequest, fetchMyBorrowRequests, borrowRequests, loading: borrowLoading } = useBorrowRequestStore();

  // ── Filter state ──────────────────────────────────────────────────────────
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("all-types");
  const [activeCategory, setActiveCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all-statuses");
  const [currentPage, setCurrentPage] = useState(1);

  // ── Borrow modal state ────────────────────────────────────────────────────
  const [borrowingItem, setBorrowingItem] = useState<Equipment | null>(null);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [activeRequestToView, setActiveRequestToView] = useState<BorrowRequest | null>(null);
  const [historyModalItem, setHistoryModalItem] = useState<ModalItem | null>(null);

  const { mappedBorrow } = useHistoryMappings(null, borrowRequests, []);

  const ITEMS_PER_PAGE = 8;

  // ── Initial Fetch ─────────────────────────────────────────────────────────
  useEffect(() => {
    fetchRooms();
    fetchMyBorrowRequests();
  }, [fetchRooms, fetchMyBorrowRequests]);

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

    if (statusFilter !== "all-statuses") {
      params.status = statusFilter;
    }

    fetchInventory(params);
  }, [currentPage, searchText, typeFilter, activeCategory, statusFilter, fetchInventory]);

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
  // Sorting is now handled by the custom helper before rendering
  const rawPagedItems = inventoryData?.items || [];
  const pagedItems = sortEquipmentByAvailability(rawPagedItems);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Borrow modal ──────────────────────────────────────────────────────────

  const openBorrowModal = (item: Equipment) => {
    const activeReq = hasActiveBorrowRequest(item._id, borrowRequests);
    if (activeReq) {
      setActiveRequestToView(activeReq);
      setDuplicateModalOpen(true);
      return;
    }
    setBorrowingItem(item);
  };

  const closeBorrowModal = () => {
    setBorrowingItem(null);
  };

  const handleViewPreviousRequest = () => {
    setDuplicateModalOpen(false);
    if (activeRequestToView) {
      const item = mappedBorrow.find(b => b.original._id === activeRequestToView._id);
      if (item) {
        setHistoryModalItem({ type: 'borrow', item, mode: 'view' });
      } else {
        toast.error("Không tìm thấy đơn mượn.");
      }
    }
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

  // ── Handled Over (Currently Borrowed) ──────────────────────────────────
  const borrowedItems = useMemo(() => {
    return mappedBorrow.filter((b: any) => b.status === "BORROWED" || b.status === "OVERDUE");
  }, [mappedBorrow]);

  const handleReturnBorrowed = async (borrowRequestId: string) => {
    try {
      await useBorrowRequestStore.getState().returnBorrowRequest(borrowRequestId);
      toast.success("Đã gửi yêu cầu hoàn trả thiết bị.");
      await fetchMyBorrowRequests();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Không thể thực hiện hoàn trả.");
    }
  };

  const handleViewHistoryItem = (item: any) => {
    setHistoryModalItem({ type: 'borrow', item, mode: 'view' });
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
          statusFilter={statusFilter}
          onStatusChange={(val) => {
            setStatusFilter(val);
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

        {/* Pagination - Moved above currently borrowed */}
        {renderPageButtons()}

        {/* Borrowed equipment */}
        {borrowedItems.length > 0 && (
          <BorrowedEquipmentGrid
            items={borrowedItems}
            user={user}
            onViewHistory={() => navigate(historyPath)}
            onReturn={handleReturnBorrowed}
            onView={handleViewHistoryItem}
          />
        )}
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

      {/* ── Duplicate Borrow Modal ─────────────────────────────────────── */}
      <DuplicateBorrowModal
        isOpen={duplicateModalOpen}
        onClose={() => setDuplicateModalOpen(false)}
        onViewPrevious={handleViewPreviousRequest}
      />

      {/* ── History Detail Modal ───────────────────────────────────────── */}
      {historyModalItem && (
        <HistoryDetailModal
          modal={historyModalItem}
          onClose={() => setHistoryModalItem(null)}
        />
      )}
    </div>
  );
};

export default EquipmentCatalog;
