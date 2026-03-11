import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  EquipmentFilter,
  EquipmentCategories,
  EquipmentGrid,
  BorrowedEquipmentGrid,
} from "@/components/shared/equipment";
import type {
  EquipmentItem,
  EquipmentType,
  LocationKey,
} from "@/components/shared/equipment";
import { BorrowModal } from "@/components/student/equipment";
import {
  STUDENT_ALL_EQUIPMENT as ALL_EQUIPMENT,
  ITEMS_PER_PAGE,
} from "@/data/student/mockStudentData";
import {
  CATEGORY_TO_TYPE,
  TYPE_TO_CATEGORY,
} from "@/data/student/mockStudentEquipment";
import { PageHeader } from "@/components/shared/PageHeader";

const EquipmentPage: React.FC = () => {
  const navigate = useNavigate();

  // ── Filter state ──────────────────────────────────────────────────────────
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState("all-types");
  const [locationFilter, setLocationFilter] = useState("all-locations");
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // ── Borrow modal state ────────────────────────────────────────────────────
  const [borrowingItem, setBorrowingItem] = useState<EquipmentItem | null>(null);

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

  const filteredEquipment = useMemo(() => {
    return ALL_EQUIPMENT.filter((item) => {
      const q = searchText.toLowerCase();
      if (
        q &&
        !item.title.toLowerCase().includes(q) &&
        !item.sku.toLowerCase().includes(q)
      )
        return false;
      if (
        typeFilter !== "all-types" &&
        item.type !== (typeFilter as EquipmentType)
      )
        return false;
      if (
        locationFilter !== "all-locations" &&
        item.locationKey !== (locationFilter as LocationKey)
      )
        return false;
      return true;
    });
  }, [searchText, typeFilter, locationFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEquipment.length / ITEMS_PER_PAGE),
  );
  const safePage = Math.min(currentPage, totalPages);
  const pagedItems = filteredEquipment.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openBorrowModal = (item: EquipmentItem) => {
    setBorrowingItem(item);
  };

  const closeBorrowModal = () => setBorrowingItem(null);

  const handleSubmitBorrow = () => {
    navigate("/student/borrow-history");
  };

  return (
    <div className="student-layout transition-colors duration-300">
      <main className="mx-auto flex w-full max-w-[90vw] flex-1 flex-col px-4 pt-6 sm:pt-8 pb-10 sm:px-6 xl:max-w-7xl">
        <PageHeader
          title="Equipment Catalog"
          subtitle="Explore and reserve university resources with our enhanced Student Portal."
        />

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
          onFilter={() => setCurrentPage(1)}
        />

        <EquipmentCategories
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        <EquipmentGrid
          items={pagedItems}
          totalCount={filteredEquipment.length}
          onBorrowRequest={openBorrowModal}
        />

        <BorrowedEquipmentGrid
          onViewHistory={() => navigate("/student/borrow-history")}
          onItemClick={() => navigate("/student/borrow-history")}
        />

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`h-10 w-10 rounded-full font-bold transition-all ${safePage === p ? "bg-[#1E2B58] text-white shadow-lg" : "text-[#1E2B58] hover:bg-white/40 dark:text-white dark:hover:bg-slate-800/40"}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </main>

      {borrowingItem && (
        <BorrowModal
          item={borrowingItem}
          onClose={closeBorrowModal}
          onSubmit={handleSubmitBorrow}
        />
      )}
    </div>
  );
};

export default EquipmentPage;
