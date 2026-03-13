import React, { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/motion";
import { useNavigate } from "react-router-dom";
import { useEquipmentStore } from "@/stores/useEquipmentStore";
import { useBorrowRequestStore } from "@/stores/useBorrowRequestStore";

<<<<<<< HEAD
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
=======
import { EquipmentGrid } from "@/components/shared/equipment/EquipmentGrid";
import { BorrowedEquipmentGrid } from "@/components/shared/equipment/BorrowedEquipmentGrid";
import { EquipmentCategories } from "@/components/shared/equipment/EquipmentCategories";
import { EquipmentFilter } from "@/components/shared/equipment/EquipmentFilter";
>>>>>>> 827992c66364d33a73b13d8a6f021304265cc9e1

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

  // Map trạng thái borrow request
  const borrowStatusMap = useMemo(() => {
    const map: Record<string, string> = {};

    borrowRequests.forEach((r) => {
      if (r.equipment_id?._id) {
        map[r.equipment_id._id] = r.status;
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

        if (
          locationFilter !== "all-locations" &&
          item.room_id?.name !== locationFilter
        )
          return false;

        if (activeCategory !== "all" && item.category !== activeCategory)
          return false;

        return true;
      });
  }, [equipments, searchText, typeFilter, locationFilter, activeCategory]);

  // Equipment đang borrow
  const borrowedEquipment = useMemo(() => {
    const borrowedIds = borrowRequests
      .map((r) => r.equipment_id?._id)
      .filter(Boolean) as string[];

    return equipments.filter((e) => borrowedIds.includes(e._id));
  }, [equipments, borrowRequests]);

  const handleBorrowRequest = (item: any) => {
    navigate(`/borrow/${item._id}`);
  };

  const handleViewHistory = () => {
    navigate("/borrow/history");
  };

  const handleItemClick = (item: any) => {
    navigate(`/equipment/${item._id}`);
  };

  return (
<<<<<<< HEAD
    <div className="w-full">
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
=======
    <PageShell topPadding="pt-32" className="pb-20 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-7xl">
>>>>>>> 827992c66364d33a73b13d8a6f021304265cc9e1

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
          items={filteredEquipment}
          onBorrowRequest={handleBorrowRequest}
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
    </PageShell>
  );
};

export default EquipmentPage;