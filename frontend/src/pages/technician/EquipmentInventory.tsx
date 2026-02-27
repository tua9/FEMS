import React, { useState } from 'react';
import {
  CATEGORY_META,
  AssetCategory,
  getAssetsByCategory,
} from '@/data/technician/mockEquipment';
import EquipmentSidebar from '@/components/technician/equipment/EquipmentSidebar';
import AssetGrid from '@/components/technician/equipment/AssetGrid';
import AssetPagination from '@/components/technician/equipment/AssetPagination';

const ITEMS_PER_PAGE = 6;
const STORAGE_PERCENTAGE = 92;

const EquipmentInventory: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<AssetCategory>('All Assets');
  const [currentPage, setCurrentPage] = useState(1);

  const allForCategory = getAssetsByCategory(activeCategory);
  const totalPages = Math.max(1, Math.ceil(allForCategory.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = allForCategory.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  // Use the count from CATEGORY_META so "All Assets" shows 128 even with mock data
  const totalCount =
    CATEGORY_META.find((c) => c.label === activeCategory)?.count ??
    allForCategory.length;

  const handleCategorySelect = (cat: AssetCategory) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <EquipmentSidebar
          activeCategory={activeCategory}
          storagePercentage={STORAGE_PERCENTAGE}
          onCategorySelect={handleCategorySelect}
        />

        {/* Main content */}
        <div className="flex-1 space-y-8">
          {/* Page header */}
          <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold text-[#232F58] tracking-tight">
                Asset Inventory
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                Manage and monitor technical equipment fleet
              </p>
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#232F58] text-white rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all whitespace-nowrap">
              <span className="material-symbols-outlined text-xl">add</span>
              Add New Device
            </button>
          </section>

          {/* Asset grid */}
          <AssetGrid assets={paged} />

          {/* Pagination */}
          <AssetPagination
            currentPage={safePage}
            totalPages={totalPages}
            visibleCount={paged.length}
            totalCount={totalCount}
            onPageChange={setCurrentPage}
          />
        </div>

      </div>
    </div>
  );
};

export default EquipmentInventory;
