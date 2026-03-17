import React, { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/motion";
import { useNavigate } from "react-router-dom";
import { useEquipmentStore } from "@/stores/useEquipmentStore";
import { useBorrowRequestStore } from "@/stores/useBorrowRequestStore";

import { EquipmentGrid } from "@/components/shared/equipment/EquipmentGrid";
import { BorrowedEquipmentGrid } from "@/components/shared/equipment/BorrowedEquipmentGrid";
import { EquipmentCategories } from "@/components/shared/equipment/EquipmentCategories";
import { EquipmentFilter } from "@/components/shared/equipment/EquipmentFilter";
import BorrowModal from "@/components/student/equipment/BorrowModal";
import HistoryDetailModal, { type ModalItem } from "@/components/student/history/HistoryDetailModal";
import { toast } from "sonner";

const EquipmentPage: React.FC = () => {
  const navigate = useNavigate();

  const equipments = useEquipmentStore((state) => state.equipments);
  const fetchEquipments = useEquipmentStore((state) => state.fetchAll);

  const borrowRequests = useBorrowRequestStore((state) => state.borrowRequests);
  const fetchBorrowRequests = useBorrowRequestStore(
    (state) => state.fetchMyBorrowRequests
  );

  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("all-types");
  const [locationFilter, setLocationFilter] = useState("all-locations");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    fetchEquipments();
    fetchBorrowRequests();
  }, [fetchEquipments, fetchBorrowRequests]);

  // Map trạng thái borrow request (robust lowercase scoring)
  const borrowStatusMap = useMemo(() => {
    const map: Record<string, string> = {};

    // Process all requests, newer first (backend returns DESC)
    borrowRequests.forEach((r) => {
      const eqData = r.equipment_id;
      if (!eqData) return;
      
      const eqIdStr = typeof eqData === 'string' ? eqData : eqData._id?.toString();
      if (eqIdStr && !map[eqIdStr]) {
        map[eqIdStr] = (r.status || "").trim().toLowerCase();
      }
    });

    return map;
  }, [borrowRequests]);

  // Equipment available
  const filteredEquipment = useMemo(() => {
    return equipments
      .filter((item) => item.status === "good")
      .filter((item) => {
        if (
          searchText &&
          !item.name.toLowerCase().includes(searchText.toLowerCase())
        )
          return false;

        if (typeFilter !== "all-types" && item.category !== typeFilter)
          return false;

        const roomNameStr = item.room_id && typeof item.room_id !== 'string' ? item.room_id.name : undefined;
        if (
          locationFilter !== "all-locations" &&
          roomNameStr !== locationFilter
        )
          return false;

        if (activeCategory !== "all" && item.category !== activeCategory)
          return false;

        return true;
      });
  }, [equipments, searchText, typeFilter, locationFilter, activeCategory]);

  // Equipment đang borrow (Ultra-robust with fallback)
  const borrowedEquipment = useMemo(() => {
    const activeRequests = borrowRequests.filter((r) => {
      const s = (r.status || "").trim().toLowerCase();
      return ["approved", "handed_over"].includes(s);
    });

    const borrowedItems: any[] = [];
    const seenIds = new Set<string>();

    activeRequests.forEach((r) => {
      const eqData = r.equipment_id;
      if (!eqData) return;

      const id = typeof eqData === "string" ? eqData : eqData._id?.toString();
      if (!id || seenIds.has(id)) return;

      // Case 1: Tìm trong danh sách equipment chính
      const fullEquipment = equipments.find((e) => e._id.toString() === id);
      if (fullEquipment) {
        borrowedItems.push(fullEquipment);
      } else if (typeof eqData !== "string") {
        // Case 2: Fallback sử dụng data được populate từ chính request
        borrowedItems.push({
          ...eqData,
          _id: id,
          status: (eqData as any).status || "good",
          available: false,
        });
      }
      seenIds.add(id);
    });

    return borrowedItems;
  }, [equipments, borrowRequests]);

  // Pagination Logic (8 items per page = 2 rows x 4)
  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, typeFilter, locationFilter, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredEquipment.length / ITEMS_PER_PAGE));
  const currentEquipmentItems = filteredEquipment.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


  // Map equipment_id → BorrowRequest (for detail modal)
  const borrowRequestMap = useMemo(() => {
    const map: Record<string, any> = {};
    borrowRequests.forEach((r) => {
      const eqData = r.equipment_id;
      if (!eqData) return;
      const eqIdStr = typeof eqData === "string" ? eqData : eqData._id?.toString();
      if (eqIdStr && !map[eqIdStr]) {
        map[eqIdStr] = r;
      }
    });
    return map;
  }, [borrowRequests]);

  const [detailModal, setDetailModal] = useState<ModalItem | null>(null);
  const [borrowModalItem, setBorrowModalItem] = useState<any>(null);
  const { createMyBorrowRequest } = useBorrowRequestStore();

  const handleBorrowRequest = (item: any) => {
    setBorrowModalItem({
      title: item.name,
      sku: _idToSku(item._id),
      location: item.room_id && typeof item.room_id !== 'string' ? item.room_id.name : "Unknown Location",
      _id: item._id,
    });
  };

  const handleSubmitBorrow = async (borrowDate: string, returnDate: string, purpose: string) => {
    if (!borrowModalItem) return;

    try {
      await createMyBorrowRequest({
        equipment_id: borrowModalItem._id,
        type: 'equipment',
        borrow_date: borrowDate,
        return_date: returnDate,
        note: purpose,
      });
      // Refresh requests to update grid
      fetchBorrowRequests();
      setBorrowModalItem(null);
      toast.success("Borrow request submitted successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to submit borrow request.");
    }
  };

  const handleViewHistory = () => {
    navigate("/student/borrow-history");
  };

  const handleItemClick = (item: any) => {
    const borrowRequest = borrowRequestMap[item._id];
    if (borrowRequest) {
      setDetailModal({ type: 'borrow', item: borrowRequest });
    }
  };

  return (
    <PageShell topPadding="pt-32" className="pb-20 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-7xl">

        {/* Categories */}
        <EquipmentCategories
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Filter */}
        <EquipmentFilter
          searchText={searchText}
          onSearchChange={setSearchText}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          locationFilter={locationFilter}
          onLocationChange={setLocationFilter}
          onFilter={() => {}}
        />

        {/* Available Equipment */}
        <EquipmentGrid
          items={currentEquipmentItems}
          onBorrowRequest={handleBorrowRequest}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* Currently Borrowed */}
        {borrowedEquipment.length > 0 && (
          <BorrowedEquipmentGrid
            items={borrowedEquipment}
            onViewHistory={handleViewHistory}
            onItemClick={handleItemClick}
            borrowStatus={borrowStatusMap}
          />
        )}

      </div>
      
      {borrowModalItem && (
        <BorrowModal
          item={borrowModalItem}
          onClose={() => setBorrowModalItem(null)}
          onSubmit={handleSubmitBorrow}
        />
      )}
      {detailModal && (
        <HistoryDetailModal
          modal={detailModal}
          onClose={() => setDetailModal(null)}
        />
      )}
    </PageShell>
  );
};

function _idToSku(_id: string) {
  return _id.slice(-6).toUpperCase();
}

export default EquipmentPage;